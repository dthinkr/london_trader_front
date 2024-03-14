<script setup>
import { reactive, watchEffect, ref } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { Chart as HighchartsChart } from "highcharts-vue";
const { chartData, midPoint} = storeToRefs(useTraderStore());
import { watch } from "vue";
import { chart } from "highcharts";
const chartOptions = reactive({
  title: { text: "Current Order Book" },
  xAxis: {
    labels: {
      format: "{value:.2f}", // Rounds to two decimal places for xAxis labels
    },
    plotBands: [{
      from: -Infinity, // Starting at the leftmost part of the chart
      to: 2000, // Change color up to the year 2000
      color: 'rgba(204, 204, 255, 0.5)', // Light blue background for the left side
    }, {
      from: 2000, // Starting from the year 2000
      to: Infinity, // Extending to the rightmost part of the chart
      color: 'rgba(255, 204, 204, 0.5)', // Light red background for the right side
    }]
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

watch(chartData, (newChartData) => {
  // Assuming newChartData is already updated with pointPlacement
  chartOptions.series = newChartData.map(series => ({
    ...series,
    pointPlacement: series.name === "Bids" ? -0.2 : 0.2,
  }));
}, { deep: true, immediate: true });
watchEffect(() => {
  chartOptions.xAxis.plotBands = [{
      from: -Infinity,
      to: midPoint, // Dynamically use the midPoint for the 'to' property
      color: 'rgba(204, 204, 255, 0.5)', // Example color for the left side
    }, {
      from: midPoint, // Dynamically use the midPoint for the 'from' property
      to: Infinity,
      color: 'rgba(255, 204, 204, 0.5)', // Example color for the right side
  }];
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
