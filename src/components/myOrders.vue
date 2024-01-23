<template>
   <h3>Your orders</h3>
  <div id="tablewrapper">
    <v-data-table
      id="my-orders-table"
      items-per-page="-1"
      ref="dataTable"
      :headers="headers"
      :items="myOrders"
      class="elevation-1 table-fixed-height"
      :fixed-header="true"
      sticky
    >
      <template #item.timestamp="{ item }">
        {{ formatTimestamp(item.timestamp) }}
      </template>
      <template #bottom="{ item }">
        
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, watchEffect, nextTick, watch } from "vue";
import { useGoTo } from "vuetify";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const dataTable = ref(null);
const { myOrders } = storeToRefs(useTraderStore());

const goTo = useGoTo();

const headers = [
  { title: "Timestamp", key: "timestamp" },
  { title: "Type", key: "type" },
  { title: "Price", key: "price" },
  { title: "Status", key: "status" },
];

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

watch(
  myOrders,
  () => {
    if (dataTable.value) {
      nextTick(() => {
        // Scroll to the last item in the table
        const lastItem = dataTable.value.$el.querySelector(
          "tbody > tr:last-child"
        );
        console.debug("lastItem", lastItem);
        if (lastItem) {
          goTo(lastItem, {
            duration: 300,
            easing: "easeInOutCubic",
            container: '#tablewrapper'
          });
        }
      });
    }
  },
  { deep: false }
);
</script>

<style>
#tablewrapper {
  height: 300px;
  overflow-y: auto;
}
</style>
