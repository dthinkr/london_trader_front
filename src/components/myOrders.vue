<template>
    <v-card     height="100%"
      elevation="3" >
  <v-card-title class="cardtitle-blue">My Orders</v-card-title>
  <v-select
    v-model="selectedType"
    :items="['all', 'active',  'executed', 'cancelled',]"
    label="Filter by Type"
    @change="filterOrders"
  ></v-select>
  <div id="tablewrapper">
    <v-data-table
      id="my-orders-table"
      items-per-page="-1"
      ref="dataTable"
      :headers="headers"
      :items="filteredOrders"
      class="elevation-1 table-fixed-height"
      :fixed-header="true"
      sticky
    >
      <template #top="{ itemsPerPage, page, start, stop }">
       
      </template>

      <template #item.timestamp="{ item }">
        {{ formatTimestamp(item.timestamp) }}
      </template>
      <template #bottom="{ item }"> </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          size="small"
          @click="item.status === 'active' && cancelItem(item)"
          :style="
            item.status !== 'active'
              ? 'color: grey; cursor: default;'
              : 'cursor: pointer;'
          "
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
  </v-card> 
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useGoTo } from "vuetify";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const dataTable = ref(null);
const { myOrders } = storeToRefs(useTraderStore());
const { sendMessage } = useTraderStore();
const goTo = useGoTo();
const selectedType = ref('active');

const headers = [
  { title: "Timestamp", key: "timestamp" },
  { title: "Type", key: "type" },
  { title: "Price", key: "price" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const filteredOrders = computed(() => {
 
  if (selectedType.value!== 'all') {
    
    return myOrders.value.filter(order => order.status === selectedType.value);
  }
  return myOrders.value;
});


const selectedItem = ref(null);
 
const cancelItem = (item) => {
  sendMessage("cancel", { uuid: item.uuid });
  closeCancel();
};

 
const closeCancel = () => {
  selectedItem.value = null;
  dialogCancel.value = false;
};

watch(
  myOrders,
  () => {
    myOrders.value.sort((a, b) => b.timestamp - a.timestamp);
  },
  { immediate: true, deep: true }
);

</script>

<style>
#tablewrapper {
  height: 300px;
  overflow-y: auto;
}
#my-orders-table {
}
#my-orders-table .v-data-table__wrapper {
  overflow-y: auto;
  height: calc(
    100% - 60px
  ); /* Adjust the 60px to the height of your table header */
}
#my-orders-table .v-data-table__wrapper > table {
  height: 300px;
  overflow-y: auto;
}
.cardtitle-blue {
  background-color: #1976d2;
  color: white;
}
</style>
