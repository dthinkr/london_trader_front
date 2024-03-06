<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <h1>Admin page for trading session {{ tradingSessionData.trading_session_uuid }}</h1>
            
            <div v-for="ht in tradingSessionData.human_traders" class="my-3">
              Trader <b>{{ ht }}</b
              >:
               
              <v-btn :href="`/trader/${ht}`" target="_blank">
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
import { onMounted } from "vue";
const props = defineProps({
  tradingSessionUUID: String,
});
const router = useRouter();
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

const { tradingSessionData } = storeToRefs(useTraderStore());
onMounted(() => {
  useTraderStore().getTradingSessionData(props.tradingSessionUUID);
});
</script>
<style scoped></style>
