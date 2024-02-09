<template>
  <v-card height="100%" elevation="3">
    <v-card-title class="cardtitle">Additional market info</v-card-title>
    <v-card-text style="height: 300px; overflow-y: auto" ref="messageContainer">
      <v-list lines="two">
        <v-list-item v-for="i, index in infoToShow" :key="i.var_name">
          {{ i.display_name }}
          <v-tooltip      location="bottom" :text="i.explanation" max-width="300">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props">mdi-help-circle-outline</v-icon>
            </template>
          </v-tooltip>
          <template v-slot:append  >
            <v-badge width=50 color="error" :content="randomContents[index]" inline></v-badge>

          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
const { gameParams, extraParams } = storeToRefs(useTraderStore());
const treatment = gameParams.value.extra_info_treatment;

const infoToShow = computed(() => {
  return extraParams.value.filter((param) => param.treatment === treatment);
});
const randomContents = ref([]);

// Initialize randomContents with a random value for each item in infoToShow
infoToShow.value.forEach(() => {
  randomContents.value.push((Math.random() * 1000).toFixed(2));
});

onMounted(() => {
  setInterval(() => {
    randomContents.value.forEach((content, index) => {
      randomContents.value[index] = (Math.random() * 1000).toFixed(2);
    });
  }, 1000);
});

</script>
<style scoped>
.cardtitle {
  font-size: 20px;
  font-weight: bold;
  background: darkcyan;
  color: white;
}
</style>
<style scoped>
.v-list-item__append {
  display: flex;
  align-items: end!important;
}
.rounded-icon {
  border-radius: 50%; /* Makes the background completely round */
  padding: 0px; /* Adjust padding to your preference */
  background-color: #e0e0e0; /* Light grey background, adjust as needed */
  color: black; /* Icon color */
  display: inline-flex; /* Centers the icon within the padding */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}
</style>
