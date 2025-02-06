<script setup lang="ts">

import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import ShopFilterComponent from '@/components/dashboard/ShopFilterComponent.vue'
import { useUserStore } from '@/stores/dashboard/user'
import { onMounted, ref, watch } from 'vue'
import type { Page } from '@/models/page'
import { initFlowbite } from 'flowbite'
import { useDashboardOrderStore } from '@/stores/dashboard/order'
import type { Order } from '@/models/order'
import OrderStatusFilter from '@/components/dashboard/OrderStatusFilter.vue'
import OrderTable from '@/components/dashboard/OrderTable.vue'

const orderStore = useDashboardOrderStore();
const userStore = useUserStore();
const orders = ref<Page<Order>>();
const page = ref(1);
const actualShop = ref<number>();
const searchWord = ref<string>();
const status = ref<string>();

const getOrders = async ()=>{
  while (userStore.loading){
    await new Promise(resolve => {setTimeout(resolve,100)})
  }
  await orderStore.getOrders(searchWord.value,actualShop.value,status.value,page.value>1?page.value:undefined);
}

const filterOrdersByShop = async (shopId?:number)=>{
  if (shopId){
    actualShop.value=shopId;
  }else{
    actualShop.value=undefined;
  }
  await getOrders()
}

const filterOrdersByStatus= async (value?:string)=>{
  if (value){
    status.value=value;
  }else{
    status.value = undefined
  }
  await getOrders()
}

const filterOrdersBySearchTerm = async (searchTerm?:string) =>{
  if (searchTerm){
    searchWord.value=searchTerm
  }else{
    searchWord.value=undefined
  }
  await getOrders()
}

const loadMore = async () => {
  page.value +=1;
  await getOrders();
};


onMounted(async ()=>{
  await getOrders();
  if (orderStore.orders){
    orders.value = orderStore.orders
  }
  initFlowbite();
});

watch(()=>orderStore.orders, (newOrders)=>{
  if (newOrders){
    orders.value = newOrders;
  }
})
/*
* TODO:Reverse order list, from the newest to the oldest
* */
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="flex justify-between w-full">
      <search-bar-component @search="searchTerm => filterOrdersBySearchTerm(searchTerm)" @reset-search-filter="filterOrdersBySearchTerm()"/>
      <div class="flex items-center justify-between px-8">
        <shop-filter-component @change-shop="shopId => filterOrdersByShop(shopId)" @reset-shop-filter="filterOrdersByShop()"/>
        <order-status-filter @change-status="status => filterOrdersByStatus(status)" @reset-status="filterOrdersByStatus()"/>
      </div>
    </div>
    <order-table v-if="orders && orders.data.length>0" :orders="orders"/>
    <div v-else class=" w-full justify-center items-center">
      <p class="font-poppins font-normal text-normal-text text-appGray">Aucune commande disponible</p>
    </div>
  </div>

</template>

<style scoped>

</style>
