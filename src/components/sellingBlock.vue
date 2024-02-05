<template>
  <div>
    <v-card elevation="3" subtitle="Click on red buttons to sell or buy immediately">
        
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <h3>Buy Orders</h3>
              <div
                v-for="(price, index) in buyPrices"
                :key="'buy-' + index"
                class="my-1"
              >
                <v-btn
                  @click="sendOrder('bid', price)"
                  outlined
                  :color="getButtonColor(price, 'buy')"
                  width="150"
                  >Buy at {{ price }}</v-btn
                >
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <h3>Sell Orders</h3>
              <div
                v-for="(price, index) in sellPrices"
                :key="'sell-' + index"
                class="my-1"
              >
                <v-btn
                  @click="sendOrder('ask', price)"
                  outlined
                  :color="getButtonColor(price, 'sell')"
                  width="150"
                  >Sell for {{ price }}</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const tradingStore = useTraderStore();
const { sendMessage } = tradingStore;
const { gameParams, bidData, askData } = storeToRefs(tradingStore);
const bestBid = computed(() => {
  if (bidData.value.length > 0) {
    return Math.max(...bidData.value.map((bid) => bid.x));
  }
  return null; // Or a default value
});
const step = computed(() => {
  return gameParams.value.step;
});

const bestAsk = computed(() => {
  if (askData.value.length > 0) {
    return Math.min(...askData.value.map((ask) => ask.x));
  }
  return null; // Or a default value
});

const buyPrices = computed(() => {
  let prices = [];
  for (let i = 0; i < 5; i++) {
    prices.push(bestAsk.value - step.value * i);
  }
  return prices;
});

const sellPrices = computed(() => {
  let prices = [];
  for (let i = 0; i < 5; i++) {
    prices.push(bestBid.value + step.value * i);
  }
  return prices;
});

function sendOrder(type, price) {
  sendMessage('add_order', { type, price, quantity: 1 });
}
function getButtonColor(price, orderType) {
  if (orderType === "buy") {
    return price === bestAsk.value ? "red" : "grey";
  } else if (orderType === "sell") {
    return price === bestBid.value ? "red" : "grey";
  }
}
</script>
