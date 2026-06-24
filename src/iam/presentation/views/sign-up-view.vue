<script setup>
/**
 * @summary Presents the account creation screen backed by ColdTrack IAM.
 * @author FreshGuard
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import logoUrl from '../../../assets/logo-coldtrack.png';
import { UsersApiService } from '../../infrastructure/users-api.service.js';

const router = useRouter();
const toast = useToast();
const usersApi = new UsersApiService();
const roles = [
  { label: 'Logistics Admin', value: 'LogisticsAdmin' },
  { label: 'Driver', value: 'Driver' }
];
const form = reactive({ fullName: '', email: '', role: '', password: '', confirmPassword: '' });
const isSubmitting = ref(false);
const canSubmit = computed(() =>
  form.fullName.trim() &&
  form.email.trim() &&
  form.role &&
  form.password &&
  form.password === form.confirmPassword
);

/**
 * Creates an account in the ColdTrack backend.
 *
 * @returns {Promise<void>} Resolves after account creation.
 */
async function createAccount() {
  if (!canSubmit.value) {
    toast.add({ severity: 'warn', summary: 'ColdTrack', detail: 'Please complete the form and confirm the password', life: 3000 });
    return;
  }
  isSubmitting.value = true;
  try {
    await usersApi.signUp({ fullName: form.fullName.trim(), email: form.email.trim(), role: form.role, password: form.password });
    toast.add({ severity: 'success', summary: 'ColdTrack', detail: 'Account created', life: 2500 });
    await router.push('/sign-in');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'ColdTrack', detail: error.response?.data?.detail ?? 'Account could not be created', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="auth-page" aria-labelledby="sign-up-title">
    <img class="auth-logo" :src="logoUrl" alt="ColdTrack logo" />
    <h1 id="sign-up-title">{{ $t('auth.createAccount') }}</h1>
    <p>{{ $t('auth.join') }}</p>
    <form class="auth-card" aria-label="Create account form" @submit.prevent="createAccount">
      <label>{{ $t('auth.fullName') }}<pv-input-text v-model="form.fullName" required placeholder="Juan Perez" aria-label="Full name" /></label>
      <label>{{ $t('auth.email') }}<pv-input-text v-model="form.email" type="email" required placeholder="tu@email.com" aria-label="Email" /></label>
      <label>{{ $t('auth.role') }}<pv-select v-model="form.role" :options="roles" option-label="label" option-value="value" required :placeholder="$t('auth.selectRole')" aria-label="Role" /></label>
      <label>{{ $t('auth.password') }}<pv-password v-model="form.password" toggle-mask :feedback="false" required placeholder="********" aria-label="Password" /></label>
      <label>{{ $t('auth.confirmPassword') }}<pv-password v-model="form.confirmPassword" toggle-mask :feedback="false" required placeholder="********" aria-label="Confirm password" /></label>
      <pv-button type="submit" :label="$t('auth.createAccount')" :loading="isSubmitting" :disabled="!canSubmit" />
      <p>{{ $t('auth.alreadyAccount') }} <router-link to="/sign-in">{{ $t('auth.signInTitle') }}</router-link></p>
    </form>
  </section>
</template>
