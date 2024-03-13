<template>
  <v-app>
    <!-- navbar -->
    <v-app-bar app fixed>
      <v-toolbar flat dense>
        <v-card class="mx-3">
          <v-card-text>
            <v-btn
          color="primary"
          :to="{ name: 'CreateTradingSession' }"
        >
          Return to Create Session
        </v-btn>
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <!-- Current price -->
         
       <!-- button to return back to create-session -->
       
        
      </v-toolbar>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <h1>
              Admin page for trading session
              {{ tradingSessionData.trading_session_uuid }}
            </h1>
            <!-- Removed the button for copying error message -->
            <div v-for="ht in tradingSessionData.human_traders" class="my-3">
              Trader <b>{{ ht }}</b
              >:
              <!-- v-text-field to display the link -->
              <v-text-field
                :value="`${getBaseURL()}/trader/${ht}`"
                readonly
                outlined
                append-inner-icon="mdi-content-copy"
                @click:append-inner="
                  copyToClipBoard(`${getBaseURL()}/trader/${ht}`)
                "
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

const props = defineProps({
  tradingSessionUUID: String,
});

const { tradingSessionData } = storeToRefs(useTraderStore());

onMounted(() => {
  useTraderStore().getTradingSessionData(props.tradingSessionUUID);
});

const copyToClipBoard = (textToCopy) => {
  navigator.clipboard.writeText(textToCopy);
};

const getBaseURL = () => {
  return `${window.location.protocol}//${window.location.host}`;
};
</script>
