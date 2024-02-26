import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '../public/css/styles.scss';
import declension from './helpers/declension';
import VueMeta from 'vue-meta';
import mask from './helpers/mask';

Vue.config.productionTip = false;
Vue.use(declension);
Vue.use(mask);
Vue.use(VueMeta);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
