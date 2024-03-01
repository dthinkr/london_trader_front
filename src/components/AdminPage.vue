<template>
  <v-app>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <h1>adminka</h1>
          {{ tradingSessionData }}
          <div v-for="ht in tradingSessionData.human_traders">
            Trader <b>{{ht}}</b>:
            <v-btn :to="{ name: 'TradingSystem', params: { traderUuid: ht }}">
     Click to Go to Trading Session
  </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  tradingSessionUUID: String
});
const router = useRouter();
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

const {tradingSessionData } =
  storeToRefs(useTraderStore());
 
</script>
<style scoped> 
</style>
