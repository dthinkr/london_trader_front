<script setup>
import { reactive, watchEffect } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { Chart as HighchartsChart } from "highcharts-vue";

const { bidData, askData } = storeToRefs(useTraderStore());

const chartOptions = reactive({
  title: { text: "Current Order Book" },
  xAxis:{
    labels: {
      format: "{value:.2f}", // Rounds to two decimal places for xAxis labels
    },
  },
  yAxis: {
    labels: {
      format: "{value:.2f}", // Rounds to two decimal places for yAxis labels
    },
    title: { text: "Volume (n. of shares)" },
    min: 0,
  },
  chart: {
    type: "column",
  },
  series: [
    {
      name: "Bids",
      color: "blue",
      data: [],
    },
    {
      name: "Asks",
      color: "red",
      data: [],
    },
  ],
  plotOptions: {
    column: {
      tooltip: {
        headerFormat: "{point.key:.2f}<br>",
        pointFormat: "{series.name}: <b>{point.y:.2f}</b>",
      },
      pointPadding: 0.01,
      borderColor: "#000000",
      borderWidth: 1,
      grouping: false,
      groupPadding: 0,
    },
  },
});

watchEffect(() => {
  chartOptions.series[0].data = bidData.value;
  chartOptions.series[1].data = askData.value;
});
</script>

<template>
  <div style="width: 100%">
    <highcharts-chart
      :constructor-type="'chart'"
      :options="chartOptions"
      style="height: 300px"
    ></highcharts-chart>
  </div>
</template>
