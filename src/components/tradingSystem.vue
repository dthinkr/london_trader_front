<template>
  <v-app>
    <v-toolbar flat dense>
      <div class="mx-3">
      <vue-countdown
      @end="dayOver"
        :time="gameParams.trading_day_duration * 60* 1000"
        v-slot="{ days, hours, minutes, seconds }"
      >
        Time Remaining: 
        {{ minutes }} minutes, {{ seconds }} seconds.
      </vue-countdown>
    </div>
      <v-spacer></v-spacer>
      <!-- Current price -->
      <v-card class="mx-2" outlined>
        <v-card-text>
          Current price: <span>{{ current_price }}</span>
        </v-card-text>
      </v-card>
      <!-- Spread -->
      <v-card class="mx-2" outlined>
        <v-card-text>
          Spread: <span v-if="spread">{{ spread }}</span>
        </v-card-text>
      </v-card>

      <!-- Shares -->
      <v-card class="mx-2" outlined>
        <v-card-text>
          Shares: <span>{{ shares }}</span>
        </v-card-text>
      </v-card>

      <!-- Cash -->
      <v-card class="mx-2" outlined>
        <v-card-text>
          Cash: <span>{{ cash }}</span>
        </v-card-text>
      </v-card>

      <!-- Include other market fundamentals and inventory status here -->
    </v-toolbar>
    <commandTool />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="6">
            <BidAskChart />
          </v-col>
          <v-col cols="6">
            <HistoryChart />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <myOrdersTable />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import commandTool from "@/components/commandToolBar.vue";
import myOrdersTable from "@/components/myOrders.vue";
import BidAskChart from "@/components/BidAskChart.vue";
import HistoryChart from "@/components/HistoryChart.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
const { initializeTrader, sendMessage } = useTraderStore();
const { messages, spread, shares, cash, current_price, myOrders, gameParams} = storeToRefs(
  useTraderStore()
);
const dayOver = () => {
  sendMessage("Day over");
  //redirect to CreateTrader (assuming "CreateTrader" is the name of the route)
  router.push({ name: "CreateTrader" });
  
};
</script> 
