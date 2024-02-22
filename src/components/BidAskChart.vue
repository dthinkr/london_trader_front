<script setup>
import { reactive, watchEffect, ref } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { Chart as HighchartsChart } from "highcharts-vue";
const { chartData} = storeToRefs(useTraderStore());
import { watch } from "vue";
const chartOptions = reactive({
  title: { text: "Current Order Book" },
  xAxis: {
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
    animation: false
  },
  credits: {
    enabled: false
  },
  series: chartData.value,
  plotOptions: {
    series: {
            animation: false
        },
    column: {
      animation: false,
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

watch(chartData, () => {
  chartOptions.series = chartData.value;
});


</script>

<template>
  <div style="width: 100%">
    
    <highcharts-chart

      :constructor-type="'chart'"
      :options="chartOptions"
      style="height: 300px"
      
      :deepCopyOnUpdate="true"
    ></highcharts-chart>
  </div>
</template>
