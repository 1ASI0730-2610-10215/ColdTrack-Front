<script setup>
/**
 * @summary Presents a form for registering new shipments.
 * @author Codex Assistant
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useShipmentsStore } from '../../application/shipments.store.js';

const router = useRouter();
const toast = useToast();
const shipmentStore = useShipmentsStore();
const isSubmitting = ref(false);
const form = reactive({
  destination: '',
  driverId: 2,
  cargoDescription: '',
  departureDate: '',
  estimatedArrival: ''
});
const canSubmit = computed(() => form.destination.trim() && form.driverId > 0 && form.cargoDescription.trim()
  && form.departureDate && form.estimatedArrival);

/**
 * Submits a new shipment to the fake API.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
async function submitShipment() {
  if (!canSubmit.value) return;
  isSubmitting.value = true;
  try {
    await shipmentStore.create({
      destination: form.destination.trim(),
      driverId: Number(form.driverId),
      cargoDescription: form.cargoDescription.trim(),
      departureDate: new Date(form.departureDate).toISOString(),
      estimatedArrival: new Date(form.estimatedArrival).toISOString()
    });
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Shipment created', life: 2500 });
    await router.push('/dashboard');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Shipment could not be created', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
}
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
        <label>{{ $t('shipments.assignedDriver') }}<pv-input-text v-model.number="form.driverId" type="number" min="1" required :placeholder="$t('shipments.driverPlaceholder')" aria-label="Assigned driver identifier" /></label>
      </div>
      <label>{{ $t('shipments.cargoDescription') }}<pv-textarea v-model="form.cargoDescription" rows="5" required :placeholder="$t('shipments.cargoPlaceholder')" aria-label="Cargo description" /></label>
      <div class="form-grid">
        <label>{{ $t('shipments.departureDate') }}<pv-input-text v-model="form.departureDate" type="datetime-local" required :placeholder="$t('shipments.departureDatePlaceholder')" aria-label="Departure date" /></label>
        <label>{{ $t('shipments.estimatedArrival') }}<pv-input-text v-model="form.estimatedArrival" type="datetime-local" required :placeholder="$t('shipments.arrivalPlaceholder')" aria-label="Estimated arrival" /></label>
      </div>
      <p class="info-note"><strong>{{ $t('shipments.note').split(':')[0] }}:</strong>{{ $t('shipments.note').slice($t('shipments.note').indexOf(':') + 1) }}</p>
      <div class="form-actions">
        <pv-button type="submit" :label="$t('shipments.registerShipment')" :loading="isSubmitting" :disabled="!canSubmit" />
        <pv-button type="button" :label="$t('common.cancel')" severity="secondary" outlined @click="router.push('/dashboard')" />
      </div>
    </form>
  </section>
</template>
