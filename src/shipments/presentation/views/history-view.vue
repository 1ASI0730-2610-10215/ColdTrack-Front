<script setup>
/**
 * @summary Shows completed shipment history and historical metrics.
 * @author Codex Assistant
 */
import { computed, onMounted, ref } from 'vue';
import { useShipmentsStore } from '../../application/shipments.store.js';

const shipmentStore = useShipmentsStore();
const searchTerm = ref('');

const completedShipments = computed(() => shipmentStore.completedShipments.value.filter((shipment) =>
  `${shipment.id} ${shipment.destination} ${shipment.driver} ${shipment.cargoDescription}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));

const averageTemperature = computed(() => {
  const values = completedShipments.value.map((shipment) => shipment.temperature).filter((value) => typeof value === 'number');
  return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : '0.0';
});

const generatedAlerts = computed(() => completedShipments.value.reduce((sum, shipment) => sum + shipment.alertsCount, 0));

onMounted(shipmentStore.load);
</script>

<template>
  <section class="page-section" aria-labelledby="history-title">
    <div class="page-header">
      <div>
        <h1 id="history-title">{{ $t('history.title') }}</h1>
        <p>{{ $t('history.subtitle') }}</p>
      </div>
      <pv-button :label="$t('alerts.exportReport')" icon="pi pi-download" />
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
        <pv-column field="id" :header="$t('shipments.id')" />
        <pv-column field="destination" :header="$t('shipments.destination')" />
        <pv-column field="driver" :header="$t('shipments.driver')" />
        <pv-column field="cargoDescription" :header="$t('shipments.cargo')" />
        <pv-column field="departureDate" :header="$t('shipments.departureDate')" />
        <pv-column field="actualArrival" :header="$t('shipments.arrivalDate')" />
        <pv-column :header="$t('history.averageTemperature')"><template #body="{ data }">{{ data.temperature }}°C</template></pv-column>
        <pv-column :header="$t('history.averageHumidity')"><template #body="{ data }">{{ data.humidity }}%</template></pv-column>
        <pv-column field="alertsCount" :header="$t('nav.alerts')" />
      </pv-data-table>
    </article>
  </section>
</template>
