<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits<{
  (event:'user-position',address:string,position:{lat:number,lng:number}):void
}>()
const tileProvider = ref({
  url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  zoom:18,
  dragging:false,
});

const userLocation=ref({
  lng:2.390990942209199,
  lat:6.405471273796612
})
const position = ref(userLocation.value);
const address = ref<string>();

const getUserLocation = async () =>{
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      userLocation.value = {
        lng:position.coords.longitude,
        lat:position.coords.latitude,
      }
    })
  }
}

const getAddress = async ()=>{
  try {
    if(position.value.lat && position.value.lng){
      const result = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.value.lat}&lon=${position.value.lng}`
      );

      if (result.status===200){
        const body = await result.json();
        address.value=body.display_name;
        if (address.value) emit('user-position',address.value,position.value)
      }
    }
  }catch (e){
    console.error(e);
  }
}

const onMapClick = (value)=>{
  position.value = value.latlng;
}


onMounted(async ()=>{
  await getUserLocation();
  await getAddress();
})
watch(position,()=>{
  getAddress();
})
</script>

<template>
    <l-map ref="map" :use-global-leaflet="false"
           :zoom="tileProvider.zoom"
           :center="[userLocation.lat,userLocation.lng]"
           @click="onMapClick">
      <l-tile-layer :url="tileProvider.url"/>
      <l-marker
        visible
        draggable
        :lat-lng="position"
        @dragstart="tileProvider.dragging=true"
        @dragend="tileProvider.dragging=false"/>
    </l-map>
</template>

<style scoped>

</style>
