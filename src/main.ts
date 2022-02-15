import { createApp } from 'vue';
import storeCreator from './store';
import App from './App.vue';

createApp(App).use(storeCreator()).mount('#app');
