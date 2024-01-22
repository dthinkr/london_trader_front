<template>
    <v-app app>
        <v-container class="fill-height">
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-btn color="primary" large @click="initializeTrader">Connect to Trading System</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
  
<script setup>
import { useTraderStore } from '@/store/app';
import { useRouter } from 'vue-router';

const traderStore = useTraderStore();
const router = useRouter();

const initializeTrader = async () => {
    await traderStore.initializeTrader();
    if (traderStore.traderUuid) {
        // Navigate to the Trading System after initialization
        router.push('/trading-system');
    }
};
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
  