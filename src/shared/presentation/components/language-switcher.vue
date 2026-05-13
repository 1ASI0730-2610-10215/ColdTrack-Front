<script setup>
/**
 * @summary Provides EN and ES locale selection.
 * @author Codex Assistant
 */
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const localeOptions = ['en', 'es'];
</script>

<template>
  <pv-select-button
    v-model="locale"
    :options="localeOptions"
    class="language-switcher"
    :aria-label="$t('app.languageSelector')"
  >
    <template #option="slotProps">
      <span>{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </pv-select-button>
</template>
