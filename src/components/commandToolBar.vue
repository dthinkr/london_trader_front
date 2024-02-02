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

const { gameParams, cash, shares, myOrders } = storeToRefs(useTraderStore());
const { sendMessage } = useTraderStore();
// Active orders count
const activeOrdersCount = computed(
  () => myOrders.value.filter((order) => order.status === "active").length
);
const showSnackbar = ref(false);
const snackbarText = ref('');
const timeout = ref(3000); // 3000ms = 3 seconds


// Determine if the user has exceeded the maximum number of short shares
const hasExceededMaxShortShares = computed(() => {
  // Check if there's a limit set for max_short_shares
  if (gameParams.value.max_short_shares < 0) {
    // No limit for short shares
    return false;
  }
  // Assuming negative shares indicate shorting
  return (
    shares.value < 0 &&
    Math.abs(shares.value) >= gameParams.value.max_short_shares
  );
});

const hasExceededMaxShortCash = computed(() => {
  // Check if there's a limit set for max_short_cash
  if (gameParams.value.max_short_cash < 0) {
    // No limit for short cash
    return false;
  }
  // Assuming cash can go negative due to shorting, adjust logic as needed
  return (
    cash.value < 0 && 
    Math.abs(cash.value) >= gameParams.value.max_short_cash
  );
});

// Determine if the user has reached the maximum number of active orders
const hasReachedMaxActiveOrders = computed(
  () => activeOrdersCount.value >= gameParams.value.max_active_orders
);

// Button disabled conditions
const isAggressiveBidDisabled = computed(() => hasExceededMaxShortCash.value);
const isPassiveBidDisabled = computed(() => hasReachedMaxActiveOrders.value);
const isAggressiveAskDisabled = computed(() => hasExceededMaxShortShares.value);
const isPassiveAskDisabled = computed(() => hasReachedMaxActiveOrders.value); // Adjust logic as needed

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
