<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
import { useStatsStore } from '@/stores/dashboard/stats'
import type { Stats } from '@/models/stats'
import ApexCharts from 'apexcharts'

  const props =  defineProps<{
    shopId: number,
    period : string,
  }>();
  const statsStore = useStatsStore();

  const orderEvolution = ref<Stats[]>();
  const chart = ref<ApexCharts>();

  const getOrderEvolution = async ()=>{
    orderEvolution.value = await  statsStore.getTotalOrderEvolution(props.shopId, props.period);
  }


const options = ref({
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "area",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0,
      shade: "#1C64F2",
      gradientToColors: ["#1C64F2"],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 6,
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: 0
    },
  },
  series: [
    {
      name: "New users",
      data: [0, 0, 0, 0, 0, 0],
      color: "#1A56DB",
    },
  ],
  xaxis: {
    show: true,
    categories: ['01', '02', '03', '04', '05', '06', '07'],
    labels: {
      show: true,
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
      }
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
})

const initChart = () => {
  if (orderEvolution.value) {
    const dataSeries: number[] = [];
    orderEvolution.value.forEach(stat => {
      dataSeries.push(stat.y);
    });
    const categories: string[] = [];
    orderEvolution.value.forEach(stat => {
      categories.push(String(stat.x));
    });
    options.value.xaxis.categories = categories;
    options.value.series= [{
      name: "Commandes",
      data: dataSeries,
      color: "#1A56DB",
    }];
    if (chart.value)  chart.value?.destroy();
    if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
      chart.value = new ApexCharts(document.getElementById("area-chart"), options.value);
      chart.value.render();
    }
  }
}


onMounted(async ()=>{
  await getOrderEvolution();
  initChart();
})

watch(()=>[props.shopId,props.period],async () => {
    await getOrderEvolution();
    initChart();
  });
</script>

<template>
  <p class="font-poppins font-bold text-heading-2 m-4">Evolution des commandes</p>
  <div class="bg-white rounded-lg shadow-lg mx-5 md:p-6">
    <div id="area-chart"></div>
  </div>
</template>

<style scoped>

</style>
