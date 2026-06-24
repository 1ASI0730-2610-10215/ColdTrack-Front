<script setup>
/**
 * @summary Shows completed shipment history and historical metrics.
 * @author FreshGuard
 */
import { computed, onMounted, ref } from 'vue';
import { useAnalyticsStore } from '../../../analytics/application/analytics.store.js';
import { useToast } from 'primevue/usetoast';
import { downloadBlob } from '../../../shared/infrastructure/files/blob-download.js';

const analyticsStore = useAnalyticsStore();
const toast = useToast();
const searchTerm = ref('');
const isExporting = ref(false);
const periodStart = `${new Date().getFullYear()}-01-01T00:00:00.000Z`;
const periodEnd = `${new Date().getFullYear()}-12-31T23:59:59.999Z`;

const completedShipments = computed(() => analyticsStore.history.value.filter((shipment) =>
  `${shipment.shipmentCode} ${shipment.destination} ${shipment.driver} ${shipment.cargoDescription}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));

const averageTemperature = computed(() => {
  const values = completedShipments.value.map((shipment) => shipment.temperature).filter((value) => typeof value === 'number');
  return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : '0.0';
});

const generatedAlerts = computed(() => completedShipments.value.reduce((sum, shipment) => sum + shipment.alertsCount, 0));

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-';
}

async function exportReport() {
  isExporting.value = true;
  try {
    const { report, file } = await analyticsStore.generateReport(periodStart, periodEnd);
    downloadBlob(file, `${report.reportCode}.pdf`);
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Report generated', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Report could not be generated', life: 3000 });
  } finally {
    isExporting.value = false;
  }
}

onMounted(() => Promise.all([analyticsStore.loadHistory(periodStart, periodEnd), analyticsStore.loadReports()]));
</script>

<template>
  <section class="page-section" aria-labelledby="history-title">
    <div class="page-header">
      <div>
        <h1 id="history-title">{{ $t('history.title') }}</h1>
        <p>{{ $t('history.subtitle') }}</p>
      </div>
      <pv-button :label="$t('alerts.exportReport')" icon="pi pi-download" :loading="isExporting" @click="exportReport" />
    </div>

    <div class="metric-grid" aria-label="History metrics">
      <pv-card class="metric-card"><template #content><i class="pi pi-box metric-icon green" /><span>{{ $t('common.total') }}</span><strong>{{ completedShipments.length }}</strong><p>{{ $t('history.completedShipments') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-thermometer metric-icon blue" /><span>{{ $t('history.average') }}</span><strong>{{ averageTemperature }}°C</strong><p>{{ $t('history.averageTemperature') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-box metric-icon yellow" /><span>{{ $t('common.total') }}</span><strong>{{ generatedAlerts }}</strong><p>{{ $t('history.generatedAlerts') }}</p></template></pv-card>
    </div>

    <article class="panel" aria-label="Shipment history table">
      <div class="filter-row">
        <pv-icon-field>
          <pv-input-icon class="pi pi-search" />
          <pv-input-text v-model="searchTerm" :placeholder="$t('history.searchPlaceholder')" aria-label="Search history" />
        </pv-icon-field>
        <pv-select model-value="all" :options="['all']" aria-label="Month filter">
          <template #value>{{ $t('history.allMonths') }}</template>
          <template #option>{{ $t('history.allMonths') }}</template>
        </pv-select>
      </div>
      <pv-data-table :value="completedShipments" responsive-layout="scroll">
        <pv-column field="shipmentCode" :header="$t('shipments.id')" />
        <pv-column field="destination" :header="$t('shipments.destination')" />
        <pv-column field="driver" :header="$t('shipments.driver')" />
        <pv-column field="cargoDescription" :header="$t('shipments.cargo')" />
        <pv-column :header="$t('shipments.departureDate')"><template #body="{ data }">{{ formatDate(data.departureDate) }}</template></pv-column>
        <pv-column :header="$t('shipments.arrivalDate')"><template #body="{ data }">{{ formatDate(data.actualArrival) }}</template></pv-column>
        <pv-column :header="$t('history.averageTemperature')"><template #body="{ data }">{{ data.temperature ?? '-' }}{{ data.temperature === null ? '' : '°C' }}</template></pv-column>
        <pv-column :header="$t('history.averageHumidity')"><template #body="{ data }">{{ data.humidity ?? '-' }}{{ data.humidity === null ? '' : '%' }}</template></pv-column>
        <pv-column field="alertsCount" :header="$t('nav.alerts')" />
      </pv-data-table>
    </article>
  </section>
</template>
