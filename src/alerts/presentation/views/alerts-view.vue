<script setup>
/**
 * @summary Shows system alerts with filters and alert metrics.
 * @author Codex Assistant
 */
import { computed, onMounted, ref } from 'vue';
import { useAlertsStore } from '../../application/alerts.store.js';

const alertStore = useAlertsStore();
const searchTerm = ref('');
const severity = ref('all');
const status = ref('all');
const severityOptions = ['all', 'critical', 'warning'];
const statusOptions = ['all', 'active', 'resolved'];

const filteredAlerts = computed(() => alertStore.alerts.value.filter((alert) => {
  const matchesSearch = `${alert.alertCode} ${alert.shipmentCode} ${alert.message}`.toLowerCase().includes(searchTerm.value.toLowerCase());
  const matchesSeverity = severity.value === 'all' || alert.severity === severity.value;
  const matchesStatus = status.value === 'all' || alert.status === status.value;
  return matchesSearch && matchesSeverity && matchesStatus;
}));

onMounted(alertStore.load);
</script>

<template>
  <section class="page-section" aria-labelledby="alerts-title">
    <div class="page-header">
      <div>
        <h1 id="alerts-title">{{ $t('alerts.title') }}</h1>
        <p>{{ $t('alerts.subtitle') }}</p>
      </div>
      <pv-button :label="$t('alerts.exportReport')" icon="pi pi-download" />
    </div>

    <div class="metric-grid" aria-label="Alert metrics">
      <pv-card class="metric-card"><template #content><i class="pi pi-bell metric-icon red" /><span>{{ $t('common.total') }}</span><strong>{{ alertStore.alerts.length }}</strong><p>{{ $t('alerts.registeredAlerts') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-exclamation-triangle metric-icon red" /><span>{{ $t('common.active') }}</span><strong>{{ alertStore.activeAlerts.length }}</strong><p>{{ $t('alerts.needAttention') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-exclamation-circle metric-icon red" /><span>{{ $t('common.critical') }}</span><strong>{{ alertStore.criticalAlerts.length }}</strong><p>{{ $t('alerts.highPriority') }}</p></template></pv-card>
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
          <small>{{ $t('alerts.shipment') }}: {{ alert.shipmentCode }} &nbsp; {{ $t('alerts.date') }}: {{ alert.createdAt }} &nbsp; {{ $t('alerts.value') }}: {{ alert.value }} ({{ alert.limit }})</small>
        </div>
      </div>
    </article>
  </section>
</template>
