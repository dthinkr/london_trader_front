<template>
  <v-app app>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="6">
          <v-form class="my-3">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                v-for="field in formFields"
                :key="field.name"
              >
                <v-text-field
                  :label="field.title"
                  v-model="formState[field.name]"
                  :type="field.type === 'number' ? 'number' : 'text'"
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
import {  onMounted, ref, computed } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
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
const formState = ref({});
const formFields = ref([]);

const { tradingSessionData } =
  storeToRefs(useTraderStore());

const initializeTrader = async () => {
  await traderStore.initializeTradingSystem(formState.value);
  
  // redirect to the admin page
  router.push({ name: "AdminPage", 
    params: { tradingSessionUUID: tradingSessionData.value.trading_session_uuid}

 });
};

const fetchData = async () => {
  try {
    const response = await axios.get(defaultsUrl);
    const data = response.data.data;
    for (const [key, value] of Object.entries(data)) {
      formState.value[key] = value.default;
      formFields.value.push({ name: key, ...value });
    }
    serverActive.value = true;
  } catch (error) {
    serverActive.value = false;
    console.error("Failed to fetch form defaults:", error);
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
