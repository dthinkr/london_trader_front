<template>
  <v-app app>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="6">
          <v-form class="my-3">
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  label="Additional information treatment"
                  v-model="formState.extra_info_treatment"
                  hint="If checked, the trader will receive additional information"
                  persistent-hint
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Maximum number of shares for shorting"
                  v-model="formState.max_short_shares"
                  hint="any negative number for no limit"
                  type="number"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Maximum amount of cash for shorting"
                  v-model="formState.max_short_cash"
                  type="number"
                  hint="any negative number for no limit"
                  prefix="$"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Initial amount of cash"
                  v-model="formState.initial_cash"
                  type="number"
                  prefix="$"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Initial amount of shares"
                  v-model="formState.initial_shares"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Duration of the trading day in minutes"
                  v-model="formState.trading_day_duration"
                  type="number"
                  hint="5 minutes for instance"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Maximum amount of active orders"
                  v-model="formState.max_active_orders"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Frequency of noise traders' updates in seconds"
                  v-model="formState.noise_trader_update_freq"
                  type="number"
                  hint="E.g., 60 for a minute"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Steps for new orders"
                  v-model="formState.step"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-btn
            color="primary"
            large
            @click="initializeTrader"
            :disabled="!serverActive"
            >{{ connectionServerMessage }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useTraderStore } from "@/store/app";
import { useRouter } from "vue-router";
import axios from "axios";
const httpUrl = import.meta.env.VITE_HTTP_URL;
const defaultsUrl = `${httpUrl}traders/defaults`;
const traderStore = useTraderStore();
const router = useRouter();
const serverActive = ref(false);
const connectionServerMessage = computed(() => {
  return serverActive.value
    ? "Connect to the server"
    : "Server is not available";
});
const formState = reactive({
  name: "",
  initial_balance: 0,
  active: false,
});

const initializeTrader = async () => {
  await traderStore.initializeTradingSystem(formState);
  // redirect to the admin page
  router.push({ name: "AdminPage" });
};

const fetchData = async () => {
  try {
    // Use axios to fetch data from the API
    const response = await axios.get(defaultsUrl);

    Object.assign(formState, response.data.data);
    serverActive.value = true;
  } catch (error) {
    serverActive.value = false;
    // Check if the error response is available and handle specific status codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Error fetching data:",
        error.response.status,
        error.response.data
      );
      if (error.response.status === 404) {
        console.error("Error 404: Not Found");
      } else if (error.response.status === 500) {
        console.error("Error 500: Internal Server Error");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
    }
  }
};

onMounted(fetchData);
</script>

<style scoped>
.fill-height {
  height: 100vh;
  /* Full viewport height */
}
</style>

<style scoped>
.fill-height {
  height: 100vh;
  /* Full viewport height */
}
</style>
