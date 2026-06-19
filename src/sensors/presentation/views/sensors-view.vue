<script setup>
/**
 * @summary Shows sensor inventory and sensor registration.
 * @author Codex Assistant
 */
import { computed, onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useSensorsStore } from '../../application/sensors.store.js';
import { useShipmentsStore } from '../../../shipments/application/shipments.store.js';

const toast = useToast();
const sensorStore = useSensorsStore();
const shipmentStore = useShipmentsStore();
const searchTerm = ref('');
const dialogVisible = ref(false);
const assignmentDialogVisible = ref(false);
const telemetryDialogVisible = ref(false);
const selectedSensor = ref(null);
const selectedShipmentId = ref(null);
const form = reactive({ sensorCode: '', modelName: 'ColdTrack CT-100' });
const telemetryForm = reactive({ temperature: 5, humidity: 45, recordedAt: '' });

const filteredSensors = computed(() => sensorStore.sensors.value.filter((sensor) =>
  `${sensor.sensorCode} ${sensor.modelName} ${sensor.shipmentId ?? ''}`.toLowerCase().includes(searchTerm.value.toLowerCase())
));
const shipmentOptions = computed(() => shipmentStore.activeShipments.value.map((shipment) => ({
  label: `${shipment.shipmentCode} - ${shipment.destination}`,
  value: shipment.id
})));

function shipmentLabel(shipmentId) {
  return shipmentStore.shipments.value.find((shipment) => shipment.id === shipmentId)?.shipmentCode ?? '-';
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '-';
}

/**
 * Registers a sensor in the fake API.
 *
 * @returns {Promise<void>} Resolves when the sensor is stored.
 */
async function submitSensor() {
  try {
    await sensorStore.create({ sensorCode: form.sensorCode.toUpperCase(), modelName: form.modelName.trim() });
    form.sensorCode = '';
    dialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Sensor created', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Sensor could not be created', life: 3000 });
  }
}

function openAssignment(sensor) {
  selectedSensor.value = sensor;
  selectedShipmentId.value = shipmentOptions.value[0]?.value ?? null;
  assignmentDialogVisible.value = true;
}

async function assignSensor() {
  try {
    await sensorStore.assign(selectedSensor.value.id, selectedShipmentId.value);
    assignmentDialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Sensor assigned', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Sensor could not be assigned', life: 3000 });
  }
}

function openTelemetry(sensor) {
  selectedSensor.value = sensor;
  telemetryForm.temperature = sensor.temperature ?? 5;
  telemetryForm.humidity = sensor.humidity ?? 45;
  telemetryForm.recordedAt = '';
  telemetryDialogVisible.value = true;
}

async function submitTelemetry() {
  try {
    await sensorStore.recordTelemetry({
      sensorId: selectedSensor.value.id,
      temperature: Number(telemetryForm.temperature),
      humidity: Number(telemetryForm.humidity),
      recordedAt: telemetryForm.recordedAt ? new Date(telemetryForm.recordedAt).toISOString() : new Date().toISOString()
    });
    telemetryDialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Telemetry recorded', life: 2500 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Telemetry could not be recorded', life: 3000 });
  }
}

onMounted(() => Promise.all([sensorStore.load(), shipmentStore.load()]));
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
      <pv-card class="metric-card"><template #content><i class="pi pi-thermometer metric-icon blue" /><span>{{ $t('common.total') }}</span><strong>{{ sensorStore.sensors.value.length }}</strong><p>{{ $t('sensors.registeredSensors') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-link metric-icon blue" /><span>{{ $t('common.active') }}</span><strong>{{ sensorStore.assignedSensors.value.length }}</strong><p>{{ $t('sensors.assignedSensors') }}</p></template></pv-card>
      <pv-card class="metric-card"><template #content><i class="pi pi-check-circle metric-icon green" /><span>{{ $t('common.available') }}</span><strong>{{ sensorStore.availableSensors.value.length }}</strong><p>{{ $t('sensors.freeSensors') }}</p></template></pv-card>
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
        <pv-column field="modelName" :header="$t('sensors.modelName')" />
        <pv-column :header="$t('shipments.status')"><template #body="{ data }"><pv-tag :value="$t(`common.${data.status === 'assigned' ? 'assigned' : 'available'}`)" :severity="data.status === 'assigned' ? 'info' : 'success'" /></template></pv-column>
        <pv-column :header="$t('sensors.assignedShipment')"><template #body="{ data }">{{ shipmentLabel(data.shipmentId) }}</template></pv-column>
        <pv-column :header="$t('sensors.lastReading')"><template #body="{ data }">{{ formatDate(data.lastReading) }}</template></pv-column>
        <pv-column :header="$t('shipments.temperature')"><template #body="{ data }">{{ data.temperature ?? '-' }}</template></pv-column>
        <pv-column :header="$t('shipments.humidity')"><template #body="{ data }">{{ data.humidity ?? '-' }}</template></pv-column>
        <pv-column :header="$t('common.actions')"><template #body="{ data }"><pv-button v-if="data.status === 'available'" :label="$t('sensors.link')" text size="small" @click="openAssignment(data)" /><pv-button v-else :label="$t('sensors.recordTelemetry')" text size="small" @click="openTelemetry(data)" /></template></pv-column>
      </pv-data-table>
    </article>

    <pv-dialog v-model:visible="dialogVisible" modal :header="$t('sensors.registerSensor')" :style="{ width: '28rem' }">
      <form class="dialog-form" aria-label="Register sensor form" @submit.prevent="submitSensor">
        <label>{{ $t('sensors.sensorId') }}<pv-input-text v-model="form.sensorCode" required :placeholder="$t('sensors.newSensorId')" aria-label="Sensor code" /></label>
        <label>{{ $t('sensors.modelName') }}<pv-input-text v-model="form.modelName" required aria-label="Sensor model name" /></label>
        <pv-button type="submit" :label="$t('common.register')" icon="pi pi-plus" />
      </form>
    </pv-dialog>

    <pv-dialog v-model:visible="assignmentDialogVisible" modal :header="$t('sensors.assignSensor')" :style="{ width: '28rem' }">
      <form class="dialog-form" aria-label="Assign sensor form" @submit.prevent="assignSensor">
        <label>{{ $t('sensors.assignedShipment') }}<pv-select v-model="selectedShipmentId" :options="shipmentOptions" option-label="label" option-value="value" required :placeholder="$t('sensors.selectShipment')" aria-label="Shipment" /></label>
        <pv-button type="submit" :label="$t('sensors.assignSensor')" icon="pi pi-link" :disabled="!selectedShipmentId" />
      </form>
    </pv-dialog>

    <pv-dialog v-model:visible="telemetryDialogVisible" modal :header="$t('sensors.recordTelemetry')" :style="{ width: '28rem' }">
      <form class="dialog-form" aria-label="Record telemetry form" @submit.prevent="submitTelemetry">
        <label>{{ $t('shipments.temperature') }}<pv-input-text v-model.number="telemetryForm.temperature" type="number" step="0.1" required aria-label="Temperature" /></label>
        <label>{{ $t('shipments.humidity') }}<pv-input-text v-model.number="telemetryForm.humidity" type="number" min="0" max="100" step="0.1" required aria-label="Humidity" /></label>
        <label>{{ $t('sensors.recordedAt') }}<pv-input-text v-model="telemetryForm.recordedAt" type="datetime-local" aria-label="Recorded at" /></label>
        <pv-button type="submit" :label="$t('sensors.recordTelemetry')" icon="pi pi-save" />
      </form>
    </pv-dialog>
  </section>
</template>
