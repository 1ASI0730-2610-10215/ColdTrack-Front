<script setup>
/**
 * @summary Renders the application toolbar, routed content and footer.
 * @author Codex Assistant
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logoUrl from '../../../assets/logo-coldtrack.png';
import { useAuthenticationStore } from '../../../iam/application/authentication.store.js';
import languageSwitcher from './language-switcher.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthenticationStore();
const publicRoutes = ['sign-in', 'sign-up'];
const showNavigation = computed(() => !publicRoutes.includes(route.name));
const showApplicationChrome = computed(() => authStore.isAuthenticated.value);

/**
 * Clears the session and returns to the sign-in screen.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
async function signOut() {
  authStore.signOut();
  await router.push('/sign-in');
}
</script>

<template>
  <div class="app-shell">
    <pv-toast />
    <header v-if="showApplicationChrome" class="app-header" role="banner" aria-label="ColdTrack main header">
      <pv-toolbar class="app-toolbar">
        <template #start>
          <router-link class="brand-link" to="/dashboard" :aria-label="$t('app.goToDashboard')">
            <img class="brand-logo" :src="logoUrl" alt="ColdTrack logo" />
          </router-link>
          <nav v-if="showNavigation" class="main-nav" :aria-label="$t('app.primaryNavigation')">
            <router-link class="nav-link" to="/dashboard"><i class="pi pi-home" />{{ $t('nav.dashboard') }}</router-link>
            <router-link class="nav-link" to="/shipments/new"><i class="pi pi-plus" />{{ $t('nav.newShipment') }}</router-link>
            <router-link class="nav-link" to="/sensors"><i class="pi pi-thermometer" />{{ $t('nav.sensors') }}</router-link>
            <router-link class="nav-link nav-link-with-badge" to="/alerts">
              <i class="pi pi-bell" />{{ $t('nav.alerts') }}<span class="notification-badge" aria-label="1 active notification">1</span>
            </router-link>
            <router-link class="nav-link" to="/history"><i class="pi pi-history" />{{ $t('nav.history') }}</router-link>
          </nav>
        </template>
        <template #end>
          <div class="toolbar-actions">
            <language-switcher />
            <button v-if="showNavigation" class="logout-link logout-button" type="button" @click="signOut">
              <i class="pi pi-sign-out" />{{ $t('nav.signOut') }}
            </button>
          </div>
        </template>
      </pv-toolbar>
    </header>

    <main class="app-main" role="main" :aria-label="$t('app.mainContent')">
      <router-view />
    </main>

    <footer class="app-footer" role="contentinfo" aria-label="ColdTrack footer">
      <p>{{ $t('footer.copyright') }}</p>
      <p>{{ $t('footer.developedBy') }}</p>
    </footer>
  </div>
</template>
