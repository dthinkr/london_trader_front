<template>
  <v-toolbar flat>
    <div class="buttons-group m-3">
      <v-btn-group elevation="3" divided>
        <v-btn
          color="green"
          @click="sendOrder('aggressiveBid')"
          :disabled="isAggressiveBidDisabled"
          >Aggressive Bid</v-btn
        >
        <v-btn
          color="lightgreen"
          @click="sendOrder('passiveBid')"
          :disabled="isPassiveBidDisabled"
          >Passive Bid</v-btn
        >
      </v-btn-group>

      <v-divider inset thickness="10" vertical></v-divider>

      <v-btn-group elevation="3" divided class="mx-3">
        <v-btn
          color="red"
          @click="sendOrder('aggressiveAsk')"
          :disabled="isAggressiveAskDisabled"
          >Aggressive Ask</v-btn
        >
        <v-btn
          color="lightred"
          @click="sendOrder('passiveAsk')"
          :disabled="isPassiveAskDisabled"
          >Passive Ask</v-btn
        >
      </v-btn-group>
    </div>
    <v-snackbar v-model="showSnackbar" :timeout="timeout">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-toolbar>
 
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

const store = useTraderStore();
const { gameParams, hasExceededMaxShortCash,  hasReachedMaxActiveOrders,hasExceededMaxShortShares, spread} = storeToRefs(store);
const { sendMessage } = useTraderStore();
// Active orders count
 
const showSnackbar = ref(false);
const snackbarText = ref('');
const timeout = ref(3000); // 3000ms = 3 seconds

// Button disabled conditions
// either spread is null or another condtion
const isAggressiveBidDisabled = computed(() => store.hasExceededMaxShortCash|| spread.value === null);
const isPassiveBidDisabled = computed(() => store.hasReachedMaxActiveOrders|| spread.value === null);
const isAggressiveAskDisabled = computed(() => store.hasExceededMaxShortShares|| spread.value === null);
const isPassiveAskDisabled = computed(() => store.hasReachedMaxActiveOrders|| spread.value === null); // Adjust logic as needed

function sendOrder(orderType) {
  sendMessage(orderType, {});
}

watch(hasReachedMaxActiveOrders, (newValue) => {
  if (newValue) {
    snackbarText.value = `You are allowed to have a maximum of ${gameParams.value.max_active_orders} active orders`;
    showSnackbar.value = true;
  }
});
watch(hasExceededMaxShortCash, (newValue) => {
  if (newValue) {
    snackbarText.value = `You are not allowed to short more than ${gameParams.value.max_short_cash} cash`;
    showSnackbar.value = true;
  }
});
watch(hasExceededMaxShortShares, (newValue) => {
  if (newValue) {
    snackbarText.value = `You are not allowed to short more than ${gameParams.value.max_short_shares} shares`;
    showSnackbar.value = true;
  }
});




</script>

<style>
/* Your custom styles here */
</style>
