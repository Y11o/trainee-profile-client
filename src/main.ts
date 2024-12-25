import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './stores/store';
import 'v-calendar/style.css';

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .mount('#app');