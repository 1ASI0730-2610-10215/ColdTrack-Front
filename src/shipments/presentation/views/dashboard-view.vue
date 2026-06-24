<script setup>
/**
 * @summary Shows the shipment monitoring dashboard.
 * @author FreshGuard
 */
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useShipmentsStore } from '../../application/shipments.store.js';
import { useAlertsStore } from '../../../alerts/application/alerts.store.js';
import { useAnalyticsStore } from '../../../analytics/application/analytics.store.js';
import { useSensorsStore } from '../../../sensors/application/sensors.store.js';
import { downloadBlob } from '../../../shared/infrastructure/files/blob-download.js';

const searchTerm = ref('');
const detailDialogVisible = ref(false);
const selectedShipment = ref(null);
const telemetry = ref([]);
const selectedStatus = ref(null);
const statusRemarks = ref('');
const isLoadingDetails = ref(false);
const isUpdatingStatus = ref(false);
const isExporting = ref(false);
const shipmentStore = useShipmentsStore();
const alertStore = useAlertsStore();
const analyticsStore = useAnalyticsStore();
const sensorStore = useSensorsStore();
const toast = useToast();
const periodStart = `${new Date().getFullYear()}-01-01T00:00:00.000Z`;
const periodEnd = `${new Date().getFullYear()}-12-31T23:59:59.999Z`;

const filteredShipments = computed(() => shipmentStore.activeShipments.value.filter((shipment) =>
  `${shipment.shipmentCode} ${shipment.destination} ${shipment.driver}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));
const visibleAlerts = computed(() => alertStore.activeAlerts.value.slice(0, 2));
const assignedSensor = computed(() => sensorStore.sensors.value.find((sensor) => sensor.shipmentId === selectedShipment.value?.id) ?? null);
const relatedAlerts = computed(() => alertStore.alerts.value.filter((alert) => alert.shipmentId === selectedShipment.value?.id));
const latestTelemetry = computed(() => [...telemetry.value].sort((left, right) => new Date(right.recordedAt) - new Date(left.recordedAt))[0] ?? null);
const availableStatusOptions = computed(() => {
  if (selectedShipment.value?.status === 'registered') return ['InTransit', 'Cancelled'];
  if (selectedShipment.value?.status === 'in-transit') return ['Completed', 'Cancelled'];
  return [];
});

function shipmentLabel(shipmentId) {
  return shipmentStore.shipments.value.find((shipment) => shipment.id === shipmentId)?.shipmentCode ?? `#${shipmentId}`;
}

/**
 * Formats a nullable shipment metric.
 *
 * @param {number|null} value Metric value.
 * @param {string} suffix Metric suffix.
 * @returns {string} Formatted metric.
 */
function formatMetric(value, suffix) {
  return value === null || value === undefined ? '-' : `${value}${suffix}`;
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-';
}

function statusTranslationKey(status) {
  return status === 'InTransit' ? 'inTransit' : status.toLowerCase();
}

/**
 * Loads all information required by the shipment detail dialog.
 *
 * @param {object} shipment Selected table shipment.
 * @returns {Promise<void>} Resolves when the dialog data is ready.
 */
async function openDetails(shipment) {
  detailDialogVisible.value = true;
  isLoadingDetails.value = true;
  selectedStatus.value = null;
  statusRemarks.value = '';
  telemetry.value = [];
  try {
    const [detail, readings] = await Promise.all([
      shipmentStore.getById(shipment.id),
      sensorStore.getTelemetry(shipment.id),
      sensorStore.load(),
      alertStore.load()
    ]);
    selectedShipment.value = detail;
    telemetry.value = readings;
  } catch (error) {
    detailDialogVisible.value = false;
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Shipment details could not be loaded', life: 3000 });
  } finally {
    isLoadingDetails.value = false;
  }
}

/**
 * Applies the selected lifecycle transition.
 *
 * @returns {Promise<void>} Resolves after dashboard data is refreshed.
 */
async function updateShipmentStatus() {
  if (!selectedShipment.value || !selectedStatus.value) return;
  isUpdatingStatus.value = true;
  try {
    await shipmentStore.updateStatus(selectedShipment.value.id, selectedStatus.value, statusRemarks.value.trim() || null);
    await analyticsStore.loadDashboard();
    detailDialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Shipment status updated', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Shipment status could not be updated', life: 3000 });
  } finally {
    isUpdatingStatus.value = false;
  }
}

/**
 * Generates and downloads the annual cold-chain PDF report.
 *
 * @returns {Promise<void>} Resolves after the browser download starts.
 */
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

onMounted(async () => {
  await Promise.all([shipmentStore.load(), alertStore.load(), analyticsStore.loadDashboard()]);
});
</script>

<template>
  <section class="page-section" aria-labelledby="dashboard-title">
    <div class="page-header">
      <div>
        <h1 id="dashboard-title">{{ $t('dashboard.title') }}</h1>
        <p>{{ $t('dashboard.subtitle') }}</p>
      </div>
      <div class="page-actions">
        <pv-button :label="$t('common.export')" icon="pi pi-download" severity="secondary" outlined :loading="isExporting" @click="exportReport" />
        <router-link to="/shipments/new">
          <pv-button :label="$t('dashboard.newShipment')" icon="pi pi-plus" />
        </router-link>
      </div>
    </div>

    <article class="panel alert-panel" aria-label="Active alerts summary">
      <div class="panel-title-row">
        <h2><i class="pi pi-bell" />{{ $t('dashboard.activeAlerts') }}</h2>
        <router-link to="/alerts">{{ $t('dashboard.seeAll') }}</router-link>
      </div>
      <div v-for="alert in visibleAlerts" :key="alert.id" :class="['alert-strip', alert.severity]">
        <i class="pi pi-exclamation-triangle" />
        <div><strong>{{ alert.message }}</strong><span>{{ $t('alerts.shipment') }}: {{ shipmentLabel(alert.shipmentId) }}</span></div>
      </div>
      <p v-if="!visibleAlerts.length" class="empty-state">{{ $t('alerts.noAlerts') }}</p>
    </article>

    <div class="metric-grid" aria-label="Shipment metrics">
      <pv-card class="metric-card"><template #content><i class="pi pi-box metric-icon blue" /><span>{{ $t('common.total') }}</span><strong>{{ analyticsStore.metrics.value.totalShipments }}</strong><p>{{ $t('dashboard.registeredShipments') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-truck metric-icon blue" /><span>{{ $t('common.active') }}</span><strong>{{ analyticsStore.metrics.value.activeShipments }}</strong><p>{{ $t('dashboard.onRoute') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-check-circle metric-icon green" /><span>{{ $t('common.completed') }}</span><strong>{{ analyticsStore.metrics.value.completedShipments }}</strong><p>{{ $t('dashboard.delivered') }}</p></template></pv-card>
    </div>

    <article class="panel" aria-label="Active shipments table">
      <div class="panel-toolbar">
        <h2>{{ $t('dashboard.activeShipments') }}</h2>
        <pv-icon-field>
          <pv-input-icon class="pi pi-search" />
          <pv-input-text v-model="searchTerm" :placeholder="$t('dashboard.searchPlaceholder')" aria-label="Search shipments" />
        </pv-icon-field>
      </div>
      <pv-data-table :value="filteredShipments" responsive-layout="scroll">
        <pv-column field="shipmentCode" :header="$t('shipments.id')" />
        <pv-column field="destination" :header="$t('shipments.destination')" />
        <pv-column :header="$t('shipments.status')">
          <template #body="{ data }"><pv-tag :value="$t(`common.${data.status === 'in-transit' ? 'inTransit' : data.status}`)" :severity="data.status === 'registered' ? 'warn' : 'info'" /></template>
        </pv-column>
        <pv-column field="driver" :header="$t('shipments.driver')" />
        <pv-column :header="$t('shipments.temperature')"><template #body="{ data }">{{ formatMetric(data.temperature, '°C') }}</template></pv-column>
        <pv-column :header="$t('shipments.humidity')"><template #body="{ data }">{{ formatMetric(data.humidity, '%') }}</template></pv-column>
        <pv-column :header="$t('shipments.estimatedArrival')"><template #body="{ data }">{{ formatDate(data.estimatedArrival) }}</template></pv-column>
        <pv-column :header="$t('common.actions')"><template #body="{ data }"><pv-button :label="$t('common.viewDetails')" text size="small" :aria-label="$t('shipments.viewDetailsFor', { code: data.shipmentCode })" @click="openDetails(data)" /></template></pv-column>
      </pv-data-table>
    </article>

    <pv-dialog
      v-model:visible="detailDialogVisible"
      modal
      :header="$t('shipments.detailsTitle')"
      :style="{ width: '48rem' }"
      :breakpoints="{ '760px': 'calc(100vw - 2rem)' }"
      :aria-label="$t('shipments.detailsTitle')"
    >
      <div v-if="isLoadingDetails" class="detail-loading" role="status">{{ $t('shipments.loadingDetails') }}</div>
      <div v-else-if="selectedShipment" class="shipment-detail">
        <strong class="detail-code">{{ selectedShipment.shipmentCode }}</strong>
        <div class="detail-grid">
          <div><span>{{ $t('shipments.destination') }}</span><strong>{{ selectedShipment.destination }}</strong></div>
          <div><span>{{ $t('shipments.status') }}</span><strong>{{ $t(`common.${selectedShipment.status === 'in-transit' ? 'inTransit' : selectedShipment.status}`) }}</strong></div>
          <div><span>{{ $t('shipments.driver') }}</span><strong>{{ selectedShipment.driver }}</strong></div>
          <div><span>{{ $t('shipments.cargo') }}</span><strong>{{ selectedShipment.cargoDescription }}</strong></div>
          <div><span>{{ $t('shipments.departureDate') }}</span><strong>{{ formatDate(selectedShipment.departureDate) }}</strong></div>
          <div><span>{{ $t('shipments.estimatedArrival') }}</span><strong>{{ formatDate(selectedShipment.estimatedArrival) }}</strong></div>
          <div><span>{{ $t('shipments.temperature') }}</span><strong>{{ formatMetric(latestTelemetry?.temperature ?? assignedSensor?.temperature, '°C') }}</strong></div>
          <div><span>{{ $t('shipments.humidity') }}</span><strong>{{ formatMetric(latestTelemetry?.humidity ?? assignedSensor?.humidity, '%') }}</strong></div>
        </div>
        <section class="detail-block" aria-labelledby="assigned-sensor-title">
          <h3 id="assigned-sensor-title">{{ $t('shipments.assignedSensor') }}</h3>
          <p v-if="assignedSensor"><strong>{{ assignedSensor.sensorCode }}</strong> · {{ assignedSensor.modelName }} · {{ $t(`common.${assignedSensor.status}`) }}</p>
          <p v-else>{{ $t('shipments.noAssignedSensor') }}</p>
        </section>
        <section class="detail-block" aria-labelledby="related-alerts-title">
          <h3 id="related-alerts-title">{{ $t('shipments.relatedAlerts') }}</h3>
          <p v-for="alert in relatedAlerts" :key="alert.id"><strong>{{ alert.alertCode }}</strong> · {{ alert.message }}</p>
          <p v-if="!relatedAlerts.length">{{ $t('shipments.noRelatedAlerts') }}</p>
        </section>
        <form v-if="availableStatusOptions.length" class="status-form" aria-label="Update shipment status form" @submit.prevent="updateShipmentStatus">
          <label>{{ $t('shipments.newStatus') }}
            <pv-select v-model="selectedStatus" :options="availableStatusOptions" required aria-label="New shipment status">
              <template #value="{ value }">{{ value ? $t(`common.${statusTranslationKey(value)}`) : $t('shipments.selectStatus') }}</template>
              <template #option="{ option }">{{ $t(`common.${statusTranslationKey(option)}`) }}</template>
            </pv-select>
          </label>
          <label>{{ $t('shipments.statusRemarks') }}
            <pv-input-text v-model="statusRemarks" maxlength="300" :placeholder="$t('shipments.statusRemarksPlaceholder')" aria-label="Status change remarks" />
          </label>
          <div class="dialog-actions">
            <pv-button type="button" :label="$t('common.cancel')" severity="secondary" outlined @click="detailDialogVisible = false" />
            <pv-button type="submit" :label="$t('shipments.updateStatus')" :disabled="!selectedStatus" :loading="isUpdatingStatus" />
          </div>
        </form>
      </div>
    </pv-dialog>
  </section>
</template>
