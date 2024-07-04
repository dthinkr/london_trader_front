<template>
  <div class="card-content">
    <h2 class="text-h3 font-weight-bold mb-6 primary--text">Welcome to this study!</h2>
    <p class="text-h5 mb-4">
      In this study, we investigate decision-making in financial markets. The following are the instructions for this study. Please follow them carefully.
    </p>
    <v-alert
      color="success"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-cash"
      class="mb-4 text-h5"
    >
      You can earn considerable money depending on your decisions, which we will transfer to your bank account the next working day.
    </v-alert>
    <p class="text-h5 mb-4">
      You will participate in markets where you can earn money by trading with other participants on our trading platform. Each market will last <span class="font-weight-bold">{{ duration }} minutes</span> and you will participate in <span class="font-weight-bold">{{ numMarkets }} markets</span>.
    </p>
    <v-divider class="my-4"></v-divider>
    <p class="text-h5 mb-4">
      After each market:
    </p>
    <ul class="mb-4 text-h5">
      <li>All your remaining shares and money are converted to pounds sterling</li>
      <li>You earn this amount from that market</li>
      <li>A new market starts</li>
      <li>You cannot use your earnings from the previous market to trade in the following markets</li>
    </ul>
    <v-alert
      color="info"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-information"
      class="mt-4 text-h5"
    >
      In the following pages, you will learn more about the trading platform and how to trade.
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";

const traderStore = useTraderStore();
const { gameParams } = storeToRefs(traderStore);

const duration = computed(() => gameParams.value.duration || '#');
const numMarkets = computed(() => gameParams.value.num_rounds || '#');
</script>