<template>
  <v-app>
    <v-main>
      <v-container>
        <h2>Spread: <span v-if="spread">{{ spread }}</span> </h2>
        <BidAskChart />
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTraderStore } from '@/store/app'
const {initializeTrader,sendMessage} = useTraderStore();
 

function sendOrder(orderType) {
  sendMessage(orderType, {});
}


const { messages, spread } = storeToRefs(useTraderStore());
onMounted(async () => {
  await initializeTrader();
  // Now the trader UUID is either fetched or created and stored
});
</script>