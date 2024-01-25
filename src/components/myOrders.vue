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
      <template #top="{ itemsPerPage, page, start, stop }">
        <v-dialog v-model="dialogCancel" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to cancel this order?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeCancel"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="cancelItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template #item.timestamp="{ item }">
        {{ formatTimestamp(item.timestamp) }}
      </template>
      <template #bottom="{ item }"> </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          size="small"
          @click="item.status !== 'executed' && cancelItem(item)"
          :style="
            item.status === 'executed'
              ? 'color: grey; cursor: default;'
              : 'cursor: pointer;'
          "
        >
          mdi-delete
        </v-icon>
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
const {  sendMessage } = useTraderStore();
const goTo = useGoTo();

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
const selectedItem = ref(null);
const dialogCancel = ref(false);
const cancelItem = (item) => {
  console.debug("cancelItem", item.status);
  // Find the index of the item to delete
  //then show the dialog
  dialogCancel.value = true;
  selectedItem.value = item;
};

const cancelItemConfirm = () => {
  console.debug("cancelItemConfirm",selectedItem.value.uuid)
  //here we need to send a message to the server to delete the order
  sendMessage("cancel", {uuid:selectedItem.value.uuid});
  closeCancel();
};
const closeCancel = () => {
  selectedItem.value = null;
  dialogCancel.value = false;
};
 
watch(myOrders, () => {
  myOrders.value.sort((a, b) => b.timestamp - a.timestamp);
}, { immediate: true, deep: true });
// watch(
//   myOrders,
//   () => {
//     if (dataTable.value) {
//       nextTick(() => {
//         // Scroll to the last item in the table
//         const lastItem = dataTable.value.$el.querySelector(
//           "tbody > tr:last-child"
//         );
//         console.debug("lastItem", lastItem);
//         if (lastItem) {
//           goTo(lastItem, {
//             duration: 300,
//             easing: "easeInOutCubic",
//             container: "#my-orders-table .v-data-table__wrapper > table > tbody",
//           });
//         }
//       });
//     }
//   },
//   { deep: false }
// );


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
  height: calc(100% - 60px); /* Adjust the 60px to the height of your table header */
}
#my-orders-table .v-data-table__wrapper > table {
  height: 300px;
  overflow-y: auto;
}
</style>
