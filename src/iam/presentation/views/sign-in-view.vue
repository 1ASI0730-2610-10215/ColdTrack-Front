<script setup>
/**
 * @summary Presents the sign-in screen.
 * @author Codex Assistant
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import logoUrl from '../../../assets/logo-coldtrack.png';
import { useAuthenticationStore } from '../../application/authentication.store.js';
import { UsersApiService } from '../../infrastructure/users-api.service.js';

const router = useRouter();
const toast = useToast();
const authStore = useAuthenticationStore();
const usersApi = new UsersApiService();
const form = reactive({ email: 'test@test.com', password: 'password' });
const isSubmitting = ref(false);
const canSubmit = computed(() => form.email.trim().length > 0 && form.password.trim().length > 0);

/**
 * Validates credentials against the fake API and starts a session.
 *
 * @returns {Promise<void>} Resolves after route change.
 */
async function signIn() {
  if (!canSubmit.value) return;
  isSubmitting.value = true;
  try {
    const response = await usersApi.getByCredentials(form.email.trim(), form.password);
    const user = response.data[0];
    if (!user) {
      toast.add({ severity: 'error', summary: 'ColdTrack', detail: 'Invalid email or password', life: 3000 });
      return;
    }
    authStore.signIn({ id: user.id, fullName: user.fullName, email: user.email, role: user.role });
    await router.push('/dashboard');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="auth-page" aria-labelledby="sign-in-title">
    <img class="auth-logo" :src="logoUrl" alt="ColdTrack logo" />
    <h1>{{ $t('auth.welcome') }}</h1>
    <p>{{ $t('auth.system') }}</p>
    <form class="auth-card" aria-label="Sign in form" @submit.prevent="signIn">
      <h2 id="sign-in-title">{{ $t('auth.signInTitle') }}</h2>
      <label>{{ $t('auth.email') }}<pv-input-text v-model="form.email" type="email" required placeholder="tu@email.com" aria-label="Email" /></label>
      <label>{{ $t('auth.password') }}<pv-password v-model="form.password" toggle-mask :feedback="false" required placeholder="********" aria-label="Password" /></label>
      <a href="#" class="inline-link">{{ $t('auth.forgotPassword') }}</a>
      <pv-button type="submit" :label="$t('auth.signInTitle')" :loading="isSubmitting" :disabled="!canSubmit" />
      <p>{{ $t('auth.noAccount') }} <router-link to="/sign-up">{{ $t('auth.register') }}</router-link></p>
      <div class="demo-box"><strong>{{ $t('auth.demo') }}:</strong> test@test.com / password</div>
    </form>
  </section>
</template>
