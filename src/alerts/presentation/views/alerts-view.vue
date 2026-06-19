<script setup>
/**
 * @summary Shows system alerts with filters and alert metrics.
 * @author Codex Assistant
 */
import { computed, onMounted, ref } from 'vue';
import { useAlertsStore } from '../../application/alerts.store.js';
import { useShipmentsStore } from '../../../shipments/application/shipments.store.js';
import { useToast } from 'primevue/usetoast';
import { useAnalyticsStore } from '../../../analytics/application/analytics.store.js';
import { downloadBlob } from '../../../shared/infrastructure/files/blob-download.js';

const alertStore = useAlertsStore();
const shipmentStore = useShipmentsStore();
const toast = useToast();
const analyticsStore = useAnalyticsStore();
const searchTerm = ref('');
const severity = ref('all');
const status = ref('all');
const isExporting = ref(false);
const periodStart = `${new Date().getFullYear()}-01-01T00:00:00.000Z`;
const periodEnd = `${new Date().getFullYear()}-12-31T23:59:59.999Z`;
const severityOptions = ['all', 'critical', 'warning'];
const statusOptions = ['all', 'active', 'acknowledged', 'resolved'];

const filteredAlerts = computed(() => alertStore.alerts.value.filter((alert) => {
  const matchesSearch = `${alert.alertCode} ${alert.shipmentCode} ${alert.message}`.toLowerCase().includes(searchTerm.value.toLowerCase());
  const matchesSeverity = severity.value === 'all' || alert.severity === severity.value;
  const matchesStatus = status.value === 'all' || alert.status === status.value;
  return matchesSearch && matchesSeverity && matchesStatus;
}));

function shipmentLabel(shipmentId) {
  return shipmentStore.shipments.value.find((shipment) => shipment.id === shipmentId)?.shipmentCode ?? `#${shipmentId}`;
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-';
}

async function acknowledge(alertId) {
  try {
    await alertStore.acknowledge(alertId);
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Alert acknowledged', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Alert could not be acknowledged', life: 3000 });
  }
}

async function resolve(alertId) {
  try {
    await alertStore.resolve(alertId, 'Resolved from ColdTrack web application');
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Alert resolved', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Alert could not be resolved', life: 3000 });
  }
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

onMounted(() => Promise.all([alertStore.load(), shipmentStore.load()]));
</script>

<template>
  <section class="page-section" aria-labelledby="alerts-title">
    <div class="page-header">
      <div>
        <h1 id="alerts-title">{{ $t('alerts.title') }}</h1>
        <p>{{ $t('alerts.subtitle') }}</p>
      </div>
      <pv-button :label="$t('alerts.exportReport')" icon="pi pi-download" :loading="isExporting" @click="exportReport" />
    </div>

    <div class="metric-grid" aria-label="Alert metrics">
      <pv-card class="metric-card"><template #content><i class="pi pi-bell metric-icon red" /><span>{{ $t('common.total') }}</span><strong>{{ alertStore.alerts.value.length }}</strong><p>{{ $t('alerts.registeredAlerts') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-exclamation-triangle metric-icon red" /><span>{{ $t('common.active') }}</span><strong>{{ alertStore.activeAlerts.value.length }}</strong><p>{{ $t('alerts.needAttention') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-exclamation-circle metric-icon red" /><span>{{ $t('common.critical') }}</span><strong>{{ alertStore.criticalAlerts.value.length }}</strong><p>{{ $t('alerts.highPriority') }}</p></template></pv-card>
    </div>

    <article class="panel alert-list" aria-label="Alerts list">
      <div class="filter-row">
        <pv-icon-field>
          <pv-input-icon class="pi pi-search" />
          <pv-input-text v-model="searchTerm" :placeholder="$t('alerts.searchPlaceholder')" aria-label="Search alerts" />
        </pv-icon-field>
        <pv-select v-model="severity" :options="severityOptions" aria-label="Alert severity filter">
          <template #value="{ value }">{{ value === 'all' ? $t('alerts.allSeverities') : $t(`common.${value}`) }}</template>
          <template #option="{ option }">{{ option === 'all' ? $t('alerts.allSeverities') : $t(`common.${option}`) }}</template>
        </pv-select>
        <pv-select v-model="status" :options="statusOptions" aria-label="Alert status filter">
          <template #value="{ value }">{{ value === 'all' ? $t('alerts.allStatuses') : $t(`common.${value}`) }}</template>
          <template #option="{ option }">{{ option === 'all' ? $t('alerts.allStatuses') : $t(`common.${option}`) }}</template>
        </pv-select>
      </div>
      <div v-for="alert in filteredAlerts" :key="alert.id" class="alert-row">
        <i :class="['pi', alert.type === 'humidity' ? 'pi-tint' : 'pi-thermometer', alert.severity]" />
        <div>
          <div class="alert-heading">
            <strong>{{ alert.alertCode }}</strong>
            <pv-tag :value="$t(`common.${alert.severity}`)" :severity="alert.severity === 'critical' ? 'danger' : 'warn'" />
            <pv-tag :value="$t(`common.${alert.status}`)" :severity="alert.status === 'active' ? 'danger' : 'success'" />
          </div>
          <p>{{ alert.message }}</p>
          <small>{{ $t('alerts.shipment') }}: {{ shipmentLabel(alert.shipmentId) }} &nbsp; {{ $t('alerts.date') }}: {{ formatDate(alert.createdAt) }} &nbsp; {{ $t('alerts.value') }}: {{ alert.value }} ({{ alert.limit }})</small>
          <div class="alert-actions">
            <pv-button v-if="alert.status === 'active'" :label="$t('alerts.acknowledge')" text size="small" @click="acknowledge(alert.id)" />
            <pv-button v-if="alert.status !== 'resolved'" :label="$t('alerts.resolve')" text size="small" severity="success" @click="resolve(alert.id)" />
          </div>
        </div>
      </div>
      <p v-if="!filteredAlerts.length" class="empty-state">{{ $t('alerts.noAlerts') }}</p>
    </article>
  </section>
</template>
