<template>
  <v-app>
    <v-app-bar app elevation="1">
      <v-container class="py-0 fill-height">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-card class="mx-3 pa-3" elevation="0">
              <template v-if="isTradingStarted">
                <vue-countdown v-if="remainingTime" :time="remainingTime * 1000" v-slot="{ minutes, seconds }">
                  <v-chip color="primary" label>
                    Time Remaining: {{ minutes }}:{{ seconds.toString().padStart(2, '0') }}
                  </v-chip>
                </vue-countdown>
              </template>
              <template v-else>
                <v-chip color="secondary" label>Trading has not started yet</v-chip>
              </template>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-row no-gutters>
              <v-col v-for="(item, index) in [
                { label: 'VWAP', value: formatNumber(vwap) },
                { label: 'PnL', value: pnl },
                { label: 'Shares', value: `${initial_shares} ${formatDelta}` },
                { label: 'Cash', value: cash }
              ]" :key="index" cols="auto" class="mx-2">
                <v-card outlined class="pa-2">
                  <v-card-subtitle class="pa-0 text-caption">{{ item.label }}</v-card-subtitle>
                  <v-card-text class="pa-0 text-body-2 font-weight-bold">{{ item.value }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="6">
            <v-card height="400" class="mb-4">
              <v-card-title>Bid-Ask Chart</v-card-title>
              <BidAskChart />
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <v-card height="400" class="mb-4">
              <v-card-title>History Chart</v-card-title>
              <HistoryChart />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <myOrdersTable />
          </v-col>
          <v-col cols="12" lg="6">
            <sellingBlock />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-navigation-drawer app right width="350" permanent>
      <v-container fluid>
        <messageBlock class="mb-4" />
        <staticInfoBlock />
      </v-container>
    </v-navigation-drawer>

    <v-footer app v-if="goalMessage" :color="goalMessage.type" class="px-4">
      <v-row no-gutters align="center" justify="center">
        <strong>{{ goalMessage.text }}</strong>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
const props = defineProps({
  traderUuid: String,
});
import commandTool from "@/components/commandToolBar.vue";
import myOrdersTable from "@/components/myOrders.vue";
import BidAskChart from "@/components/BidAskChart.vue";
import HistoryChart from "@/components/HistoryChart.vue";
import sellingBlock from "./sellingBlock.vue";
import messageBlock from "./messageBlock.vue";
import staticInfoBlock from "./staticInfoBlock.vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useFormatNumber } from "@/composables/utils";

const { formatNumber } = useFormatNumber();
const router = useRouter();
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
import { watch } from "vue";
const { initializeTrader } = useTraderStore();
const { gameParams, goalMessage, shares, cash, sum_dinv, initial_shares, dayOver, pnl, vwap, remainingTime, isTradingStarted } =
  storeToRefs(useTraderStore());

// const remainingTime = computed(() => {
//   const currentTime = new Date().getTime();
//   const endTime = new Date(gameParams.value.end_time).getTime();
//   return endTime - currentTime;
// });
onMounted(() => {
  initializeTrader(props.traderUuid);
});
const formatDelta = computed(() => {

  if (sum_dinv == undefined) {
    return "";
  }
  return sum_dinv.value >= 0 ? "+" + sum_dinv.value : sum_dinv.value;
});

const finalizingDay = () => {
  //let's just refresh page
  // location.reload();
  router.push({ name: "DayOver", params: { traderUuid: props.traderUuid } });
};
watch(
  gameParams,
  () => {
    if (gameParams.value.active === false) {
      finalizingDay();
    }
  },
  { immediate: true, deep: true }
);

watch(
  dayOver,
  (newValue) => {
    if (newValue) {
      finalizingDay();
    }
  },
  { immediate: true }
);

watch(
  remainingTime,
  (newValue) => {
    if (newValue !== null && newValue <= 0) {
      finalizingDay();
    }
  }
);
</script>
<style scoped>
.equal-height-columns>.v-col {
  display: flex;
  flex: 1;
}
</style>
<style scoped>
.flex-container {
  height: 100%;
  /* Ensure the flex container fills the entire drawer */
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
}

.flex-child {
  flex: 1;
  /* Each child will take up equal space */
  overflow: auto;
  /* Add scroll if content overflows */
}

@keyframes fadeInHighlight {
  0% {
    background-color: yellow;
    opacity: 0;
  }

  50% {
    background-color: yellow;
    opacity: 0.5;
  }

  100% {
    background-color: transparent;
    opacity: 1;
  }
}

.fade-in-highlight {
  animation: fadeInHighlight 1s ease;
}
</style>
