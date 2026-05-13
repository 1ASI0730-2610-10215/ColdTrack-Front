<script setup>
/**
 * @summary Presents a form for registering new shipments.
 * @author Codex Assistant
 */
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useShipmentsStore } from '../../application/shipments.store.js';

const router = useRouter();
const toast = useToast();
const shipmentStore = useShipmentsStore();
const { drivers } = shipmentStore;
const form = reactive({
  destination: '',
  driver: '',
  cargoDescription: '',
  departureDate: '',
  estimatedArrival: ''
});

/**
 * Submits a new shipment to the fake API.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
async function submitShipment() {
  await shipmentStore.create({ ...form });
  toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Shipment created', life: 2500 });
  await router.push('/dashboard');
}

onMounted(shipmentStore.load);
</script>

<template>
  <section class="page-section compact-page" aria-labelledby="new-shipment-title">
    <div class="page-header">
      <div>
        <h1 id="new-shipment-title">{{ $t('shipments.newTitle') }}</h1>
        <p>{{ $t('shipments.newSubtitle') }}</p>
      </div>
    </div>

    <form class="form-panel" aria-label="New shipment form" @submit.prevent="submitShipment">
      <div class="form-grid">
        <label>{{ $t('shipments.destination') }}<pv-input-text v-model="form.destination" required :placeholder="$t('shipments.destinationPlaceholder')" aria-label="Destination" /></label>
        <label>{{ $t('shipments.assignedDriver') }}<pv-select v-model="form.driver" required :options="drivers" option-label="fullName" option-value="fullName" :placeholder="$t('shipments.driverPlaceholder')" aria-label="Assigned driver" /></label>
      </div>
      <label>{{ $t('shipments.cargoDescription') }}<pv-textarea v-model="form.cargoDescription" rows="5" required :placeholder="$t('shipments.cargoPlaceholder')" aria-label="Cargo description" /></label>
      <div class="form-grid">
        <label>{{ $t('shipments.departureDate') }}<pv-input-text v-model="form.departureDate" required :placeholder="$t('shipments.departureDatePlaceholder')" aria-label="Departure date" /></label>
        <label>{{ $t('shipments.estimatedArrival') }}<pv-input-text v-model="form.estimatedArrival" required :placeholder="$t('shipments.arrivalPlaceholder')" aria-label="Estimated arrival" /></label>
      </div>
      <p class="info-note"><strong>{{ $t('shipments.note').split(':')[0] }}:</strong>{{ $t('shipments.note').slice($t('shipments.note').indexOf(':') + 1) }}</p>
      <div class="form-actions">
        <pv-button type="submit" :label="$t('shipments.registerShipment')" />
        <pv-button type="button" :label="$t('common.cancel')" severity="secondary" outlined @click="router.push('/dashboard')" />
      </div>
    </form>
  </section>
</template>
