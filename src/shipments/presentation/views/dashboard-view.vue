<script setup>
/**
 * @summary Shows the shipment monitoring dashboard.
 * @author Codex Assistant
 */
import { computed, onMounted, ref } from 'vue';
import { useShipmentsStore } from '../../application/shipments.store.js';
import { useAlertsStore } from '../../../alerts/application/alerts.store.js';
import { useAnalyticsStore } from '../../../analytics/application/analytics.store.js';

const searchTerm = ref('');
const shipmentStore = useShipmentsStore();
const alertStore = useAlertsStore();
const analyticsStore = useAnalyticsStore();

const filteredShipments = computed(() => shipmentStore.activeShipments.value.filter((shipment) =>
  `${shipment.shipmentCode} ${shipment.destination} ${shipment.driver}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));

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
        <pv-button :label="$t('common.export')" icon="pi pi-download" severity="secondary" outlined />
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
      <div class="alert-strip critical">
        <i class="pi pi-exclamation-triangle" />
        <div><strong>{{ $t('dashboard.temperatureOut') }}</strong><span>{{ $t('alerts.shipment') }}: ENV-001</span></div>
      </div>
      <div class="alert-strip warning">
        <i class="pi pi-exclamation-triangle" />
        <div><strong>{{ $t('dashboard.humidityHigh') }}</strong><span>{{ $t('alerts.shipment') }}: ENV-002</span></div>
      </div>
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
        <pv-column :header="$t('common.actions')"><template #body><a href="#" aria-label="View shipment details">{{ $t('common.viewDetails') }}</a></template></pv-column>
      </pv-data-table>
    </article>
  </section>
</template>
