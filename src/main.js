/**
 * @summary Configures Vue, PrimeVue, routing and internationalization.
 * @author Codex Assistant
 */
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './style.css';
import App from './App.vue';
import i18n from './i18n.js';
import router from './router.js';

createApp(App)
  .use(router)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: Material, options: { darkModeSelector: false } }, ripple: true })
  .use(ToastService)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-column', Column)
  .component('pv-data-table', DataTable)
  .component('pv-dialog', Dialog)
  .component('pv-icon-field', IconField)
  .component('pv-input-icon', InputIcon)
  .component('pv-input-text', InputText)
  .component('pv-password', Password)
  .component('pv-select', Select)
  .component('pv-select-button', SelectButton)
  .component('pv-tag', Tag)
  .component('pv-textarea', Textarea)
  .component('pv-toast', Toast)
  .component('pv-toolbar', Toolbar)
  .directive('tooltip', Tooltip)
  .mount('#app');
