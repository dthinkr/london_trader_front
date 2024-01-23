<template>
     <v-toolbar flat>
      <div class="buttons-group m-3">
        

        <v-btn-group elevation="3" divided>
          <v-btn color="green" @click="sendOrder('aggressiveBid')"
          :disabled="spread===null"
            >Aggressive Bid</v-btn
          >
          <v-btn color="lightgreen" @click="sendOrder('passiveBid')"
            >Passive Bid</v-btn
          >
        </v-btn-group>
        
        <v-divider inset thickness="10" vertical></v-divider>

        <v-btn-group elevation="3" divided class="mx-3">
          <v-btn color="red" @click="sendOrder('aggressiveAsk')" 
          :disabled="spread===null"
            >Aggressive Ask</v-btn
          >
          <v-btn color="lightred" @click="sendOrder('passiveAsk')"
            >Passive Ask</v-btn
          >
        </v-btn-group>

        
      </div>
    </v-toolbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
const {  sendMessage } = useTraderStore();
const {  spread } = storeToRefs(
  useTraderStore()
);

function sendOrder(orderType) {
  sendMessage(orderType, {});
}
</script>

<style>
/* Your custom styles here */
</style>
