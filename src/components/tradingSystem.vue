<template>
  <v-app>
    <v-app-bar app fixed>
      <v-toolbar flat dense>
        
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
    </v-app-bar>
    <commandTool />
    <v-main>
      <v-container>
        <v-row>
          <v-col lg="6" sm="12">
            <BidAskChart />
          </v-col>
          <v-col lg="6" sm="12">
            <HistoryChart v-if="false"/>
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
    <v-navigation-drawer app fixed location="right" permanent width="350" :border="false" :rail="false">
      <div class="flex-container mr-3">
         
        <messageBlock class="flex-child my-3"></messageBlock>
        <staticInfoBlock class="flex-child my-3"></staticInfoBlock>
         
      </div>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup>
import commandTool from "@/components/commandToolBar.vue";
import myOrdersTable from "@/components/myOrders.vue";
import BidAskChart from "@/components/BidAskChart.vue";
import HistoryChart from "@/components/HistoryChart.vue";
import sellingBlock from "./sellingBlock.vue";
import messageBlock from "./messageBlock.vue";
import staticInfoBlock from "./staticInfoBlock.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFormatNumber } from '@/composables/utils';

const { formatNumber } = useFormatNumber();
const router = useRouter();
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
const { initializeTrader, sendMessage } = useTraderStore();
const { messages, spread, shares, cash, current_price, myOrders, gameParams } =
  storeToRefs(useTraderStore());
const dayOver = () => {
  sendMessage("Day over");
  //redirect to CreateTrader (assuming "CreateTrader" is the name of the route)
  router.push({ name: "CreateTrader" });
};
const menuItems = [
  { title: "Link 1" },
  { title: "Link 2" },
  { title: "Link 3" },
  // Add more links or items here
];
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
</style>
