<script setup lang="ts">
  import { useDashboardShopStore } from '@/stores/dashboard/shop'
  import { useUserStore } from '@/stores/dashboard/user'
  import { onMounted, ref, watch } from 'vue'
  import type { User } from '@/models/user'
  import ShopFilterComponent from '@/components/dashboard/ShopFilterComponent.vue'
  import { useStatsStore } from '@/stores/dashboard/stats'
  import { initFlowbite } from 'flowbite'
  import PeriodFilter from '@/components/dashboard/PeriodFilter.vue'
  import OrderEvolutionChart from '@/components/dashboard/OrderEvolutionChart.vue'
  import RevenueEvolutionChart from '@/components/dashboard/RevenueEvolutionChart.vue'

  const dashboardShopStore = useDashboardShopStore();
  const userStore = useUserStore();
  const statsStore = useStatsStore();

  const user = ref<User>();
  const totalOrder = ref<number>();
  const arr = ref<number>()
  const actualShopId = ref<number>();
  const actualPeriod = ref<string>("Monthly");

  const getShops = async ()=>{
    while(userStore.loading){
      await new Promise(resolve => setTimeout(resolve,100));
    }
    await dashboardShopStore.getUserShops();
    if(userStore.currentUser){
      user.value = userStore.currentUser;
    }
  }

  const getTotalOrder = async ()=>{
    totalOrder.value = await statsStore.getUserTotalOrders(actualShopId.value);
  }

  const getAnnualRevenueRate = async ()=>{
    arr.value = await statsStore.getAnnualRevenueRate(actualShopId.value)
  }

  onMounted(async ()=>{
    initFlowbite();
    await getShops();
    await getTotalOrder();
    await getAnnualRevenueRate();
  });
  watch(()=>userStore.currentUser,(newUser)=>{
    if(newUser){
      user.value = newUser
    }
  });

  watch(()=>actualShopId.value,async ()=>{
    await getAnnualRevenueRate();
    await getTotalOrder()
  });
</script>

<template>
  <div v-if="user" class="p-4 mt-24 sm:ml-64">
    <p class="flex justify-end font-poppins font-semibold text-heading-2 my-6 mx-11 text-appGray">Solde: <span class="text-black">{{user.balance}} XOF</span></p>
    <div class="flex justify-end mr-15 ">
      <period-filter v-if="actualShopId" @change-period="period => actualPeriod=period"/>
      <shop-filter-component @change-shop="shopId => actualShopId=shopId " @reset-shop-filter="actualShopId=undefined"/>
    </div>
    <div class="flex">
      <div v-if="totalOrder" class=" border-none rounded-lg shadow-md w-2/12 p-4 mx-5">
        <p class="font-poppins font-normal text-normal-text mb-3">Commandes total</p>
        <p class="font-poppins font-semibold text-heading-1 mx-2 text-appBlue">{{totalOrder}}</p>
      </div>
      <div v-if="arr" class=" border-none rounded-lg shadow-md w-2/12 p-4 mx-5">
        <p class="font-poppins font-normal text-normal-text mb-3">Ventes total</p>
        <p class="font-poppins font-semibold text-heading-1 text-appBlue">{{arr}} XOF</p>
      </div>
    </div>
    <order-evolution-chart v-if="actualShopId" :period="actualPeriod" :shop-id="actualShopId" />
    <revenue-evolution-chart v-if="actualShopId" :period="actualPeriod" :shop-id="actualShopId" />
  </div>
</template>

<style scoped>

</style>
