<template>
  <h1>hi there...</h1>
  <v-btn @click="sendMessage"> JOPA</v-btn>
  <div v-for="message,id in messages" :key="id">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTraderStore } from '@/store/app'

async function  sendMessage() {
  console.debug('pizda')
  await traderStore.sendMessage('test', 'testdata');
}

const traderStore = useTraderStore();
const {messages} = storeToRefs(traderStore);
onMounted(async () => {
  await traderStore.initializeTrader();
  // Now the trader UUID is either fetched or created and stored
});
</script>