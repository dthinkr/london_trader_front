<template>
  <v-app>
    <v-app-bar app fixed>
      <v-toolbar flat dense>
        <v-card class="mx-3">
          <v-card-text>
            <vue-countdown
              v-if="remainingTime"
              :time="remainingTime"
              v-slot="{ days, hours, minutes, seconds }"
            >
              Time Remaining:
              {{ minutes }} minutes, {{ seconds }} seconds.
            </vue-countdown>
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>

        <!-- Current price -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Current price: <span>{{ formatNumber(current_price) }}</span>
          </v-card-text>
        </v-card>
        <!-- Spread -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Spread: <span v-if="spread">{{ formatNumber(spread) }}</span>
          </v-card-text>
        </v-card>

        <!-- Shares -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Shares:
            <Transition enter-active-class="fade-in-highlight">
              <span :key="shares">{{ shares }}</span></Transition
            >
          </v-card-text>
        </v-card>

        <!-- Cash -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Cash:
            <Transition enter-active-class="fade-in-highlight">
              <span :key="cash">{{ cash }}</span>
            </Transition>
          </v-card-text>
        </v-card>

        <!-- Include other market fundamentals and inventory status here -->
      </v-toolbar>
    </v-app-bar>
    <commandTool />
    <v-main>
      <v-container>
        <v-row>
          <v-col lg="6" sm="12">
            <BidAskChart />
          </v-col>
          <v-col lg="6" sm="12">
            <HistoryChart />
          </v-col>
        </v-row>
        <v-row class="equal-height-columns">
          <v-col lg="6" sm="12" class="d-flex flex-column">
            <myOrdersTable />
          </v-col>
          <v-col lg="6" sm="12" class="d-flex flex-column">
            <sellingBlock />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-navigation-drawer
      app
      fixed
      location="right"
      permanent
      width="350"
      :border="false"
      :rail="false"
    >
      <div class="flex-container mr-3">
        <messageBlock class="flex-child my-3"></messageBlock>
        <staticInfoBlock class="flex-child my-3"></staticInfoBlock>
      </div>
    </v-navigation-drawer>
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
const { gameParams, spread, shares, cash, current_price, dayOver } =
  storeToRefs(useTraderStore());

const remainingTime = computed(() => {
  const currentTime = new Date().getTime();
  const endTime = new Date(gameParams.value.end_time).getTime();
  return endTime - currentTime;
});
onMounted(() => {
  initializeTrader(props.traderUuid);
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
</script>
<style scoped>
.equal-height-columns > .v-col {
  display: flex;
  flex: 1;
}
</style>
<style scoped>
.flex-container {
  height: 100%; /* Ensure the flex container fills the entire drawer */
  display: flex;
  flex-direction: column; /* Stack children vertically */
}

.flex-child {
  flex: 1; /* Each child will take up equal space */
  overflow: auto; /* Add scroll if content overflows */
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
