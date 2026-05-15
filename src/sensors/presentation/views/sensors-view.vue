<script setup>
/**
 * @summary Shows sensor inventory and sensor registration.
 * @author Codex Assistant
 */
import { computed, onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useSensorsStore } from '../../application/sensors.store.js';

const toast = useToast();
const sensorStore = useSensorsStore();
const searchTerm = ref('');
const dialogVisible = ref(false);
const form = reactive({ sensorCode: '' });

const filteredSensors = computed(() => sensorStore.sensors.value.filter((sensor) =>
  `${sensor.sensorCode} ${sensor.shipmentCode ?? ''}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));

/**
 * Registers a sensor in the fake API.
 *
 * @returns {Promise<void>} Resolves when the sensor is stored.
 */
async function submitSensor() {
  await sensorStore.create({ sensorCode: form.sensorCode.toUpperCase(), lastReading: null, temperature: null, humidity: null });
  form.sensorCode = '';
  dialogVisible.value = false;
  toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Sensor created', life: 2500 });
}

onMounted(sensorStore.load);
</script>

<template>
  <section class="page-section" aria-labelledby="sensors-title">
    <div class="page-header">
      <div>
        <h1 id="sensors-title">{{ $t('sensors.title') }}</h1>
        <p>{{ $t('sensors.subtitle') }}</p>
      </div>
      <pv-button :label="$t('sensors.registerSensor')" icon="pi pi-plus" @click="dialogVisible = true" />
    </div>

    <div class="metric-grid" aria-label="Sensor metrics">
      <pv-card class="metric-card"><template #content><i class="pi pi-thermometer metric-icon blue" /><span>{{ $t('common.total') }}</span><strong>{{ sensorStore.sensors.length }}</strong><p>{{ $t('sensors.registeredSensors') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-link metric-icon blue" /><span>{{ $t('common.active') }}</span><strong>{{ sensorStore.assignedSensors.length }}</strong><p>{{ $t('sensors.assignedSensors') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-check-circle metric-icon green" /><span>{{ $t('common.available') }}</span><strong>{{ sensorStore.availableSensors.length }}</strong><p>{{ $t('sensors.freeSensors') }}</p></template></pv-card>
    </div>

    <article class="panel" aria-label="Sensors table">
      <div class="panel-toolbar">
        <h2>{{ $t('sensors.list') }}</h2>
        <pv-icon-field>
          <pv-input-icon class="pi pi-search" />
          <pv-input-text v-model="searchTerm" :placeholder="$t('sensors.searchPlaceholder')" aria-label="Search sensors" />
        </pv-icon-field>
      </div>
      <pv-data-table :value="filteredSensors" responsive-layout="scroll">
        <pv-column field="sensorCode" :header="$t('sensors.sensorId')" />
        <pv-column :header="$t('shipments.status')"><template #body="{ data }"><pv-tag :value="$t(`common.${data.status === 'assigned' ? 'assigned' : 'available'}`)" :severity="data.status === 'assigned' ? 'info' : 'success'" /></template></pv-column>
        <pv-column :header="$t('sensors.assignedShipment')"><template #body="{ data }">{{ data.shipmentCode ?? '-' }}</template></pv-column>
        <pv-column :header="$t('sensors.lastReading')"><template #body="{ data }">{{ data.lastReading ?? '-' }}</template></pv-column>
        <pv-column :header="$t('shipments.temperature')"><template #body="{ data }">{{ data.temperature ?? '-' }}</template></pv-column>
        <pv-column :header="$t('shipments.humidity')"><template #body="{ data }">{{ data.humidity ?? '-' }}</template></pv-column>
        <pv-column :header="$t('common.actions')"><template #body="{ data }"><a href="#" :aria-label="`Sensor ${data.sensorCode} action`">{{ data.status === 'assigned' ? $t('sensors.inUse') : $t('sensors.link') }}</a></template></pv-column>
      </pv-data-table>
    </article>

    <pv-dialog v-model:visible="dialogVisible" modal :header="$t('sensors.registerSensor')" :style="{ width: '28rem' }">
      <form class="dialog-form" aria-label="Register sensor form" @submit.prevent="submitSensor">
        <label>{{ $t('sensors.sensorId') }}<pv-input-text v-model="form.sensorCode" required :placeholder="$t('sensors.newSensorId')" aria-label="Sensor code" /></label>
        <pv-button type="submit" :label="$t('common.register')" icon="pi pi-plus" />
      </form>
    </pv-dialog>
  </section>
</template>
