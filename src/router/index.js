import { createRouter, createWebHistory } from 'vue-router';
import CreateTrader from '@/components/CreateTrader.vue';
import TradingSystem from '@/components/TradingSystem.vue';
import { useTraderStore } from '@/store/app'
import { storeToRefs } from 'pinia';

const routes = [
  {
    path: '/',
    redirect: '/create-trader' // Redirect from root to CreateTrader
  },
  {
    path: '/create-trader',
    name: 'CreateTrader',
    component: CreateTrader,
  },
  {
    path: '/trading-system',
    name: 'TradingSystem',
    component: TradingSystem,
  },
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



router.beforeEach((to, from, next) => {
   
  const traderStore = useTraderStore();
  console.debug('I am in router.beforeEach', traderStore.traderUuid)
  // Check if traderUuid is empty and the current route is not the CreateTrader route
  if (!traderStore.traderUuid && to.name !== 'CreateTrader') {
    next({ name: 'CreateTrader' }); // Redirect to CreateTrader
  } else {
    next(); // Proceed as normal
  }
});



export default router;
