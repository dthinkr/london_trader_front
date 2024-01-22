<template>
  <v-app>
    <v-main>
      <v-container>
        <v-toolbar flat dense>
          <v-toolbar-title>
            <span>Market Fundamentals</span>
          </v-toolbar-title>
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
        <BidAskChart />
        <HistoryChart />
        <Trader />
      </v-container>
    </v-main>
    <div class="buttons-group">
      <v-btn color="primary" @click="sendOrder('aggressiveAsk')">Aggressive Ask</v-btn>
    <v-btn color="primary" @click="sendOrder('passiveAsk')">Passive Ask</v-btn>
    <v-btn color="primary" @click="sendOrder('aggressiveBid')">Aggressive Bid</v-btn>
    <v-btn color="primary" @click="sendOrder('passiveBid')">Passive Bid</v-btn>
    
    </div>
    <div v-for="message, id in messages" :key="id">
      {{ message }}
    </div>
  </v-app>
</template>

<script setup>
import BidAskChart from '@/components/BidAskChart.vue';
import HistoryChart from '@/components/HistoryChart.vue';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTraderStore } from '@/store/app'
const {initializeTrader,sendMessage} = useTraderStore();
const { messages, spread , shares, cash,current_price} = storeToRefs(useTraderStore());

function sendOrder(orderType) {
  sendMessage(orderType, {});
}



onMounted(async () => {
  await initializeTrader();
  // Now the trader UUID is either fetched or created and stored
});
</script>