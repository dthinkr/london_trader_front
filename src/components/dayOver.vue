<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Day Overview</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial cash</v-list-item-title>
                      <div>{{ traderInfo?.initial_cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Final cash</v-list-item-title>
                      <div>{{ traderInfo?.cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Change in cash:</v-list-item-title>
                      <div>{{ traderInfo?.delta_cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial shares</v-list-item-title>
                      <div>{{ traderInfo?.initial_shares }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        >Final amount of shares</v-list-item-title
                      >
                      <div>{{ traderInfo?.shares }}</div>
                    </v-list-item-content>
                  </v-list-item>
                
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  traderUuid: String,
});

// Reactive state to store trader information
const traderInfo = ref(null);

// Fetch trader information
async function fetchTraderInfo() {
  try {
    // lets do it with 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await axios.get(
      `http://localhost:8000/trader_info/${props.traderUuid}`
    );
    traderInfo.value = response.data.data; // Assuming the API response structure you provided
  } catch (error) {
    console.error("Failed to fetch trader info:", error);
    // Handle the error appropriately
  }
}

// Fetch trader information when component mounts
onMounted(fetchTraderInfo);
</script>
