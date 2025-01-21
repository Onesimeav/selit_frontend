<script setup lang="ts">

import { nextTick, onMounted, ref } from 'vue'
  import type { Product } from '@/models/product'
import { useRoute, useRouter } from 'vue-router'
  import { useDashboardProductStore } from '@/stores/dashboard/product'
import {
  Carousel,
  type CarouselInterface,
  type CarouselItem,
  type CarouselOptions,
  initFlowbite,
  type InstanceOptions,
  Modal,
  type ModalInterface
} from 'flowbite'
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import type { Specification } from '@/models/specification'

  const product = ref<Product>();
  const router = useRoute();
  const route = useRouter();
  const productStore= useDashboardProductStore();
  const mediaToBeDeleted = ref<number>();
  const specificationToBeDeleted = ref<number>();
  const deleteMediaModal = ref<ModalInterface>();
  const deleteSpecificationModal = ref<ModalInterface>();
  const startCarousel = ref(false);
  const specificationContainers = ref<{id:number,name:string,value:string}[]>();
  const updatedProduct = ref<Product>();
  const productSpecification = ref([]);
  const productMedia = ref<{images:File[],videos:File[]}>();

  const getProductDetails =  async ()=>{
    product.value= await productStore.getProductDetails(Number(router.params.id));
    updatedProduct.value=JSON.parse(JSON.stringify(product.value));
  }

  const showMediaModal= (mediaId:number)=>{
    mediaToBeDeleted.value=mediaId
   if (deleteMediaModal.value){
     deleteMediaModal.value.show()
   }else {
     console.log("Echec de l'opération");
   }
  }

  const showSpecificationModal = (specificationId:number)=>{
    specificationToBeDeleted.value=specificationId;
    if (deleteSpecificationModal.value){
      deleteSpecificationModal.value.show();
    }else{
      console.log("Echec de l'opération");
    }
  }

  const createModal =()=>{
    const mediaModal = document.getElementById('popup-modal-media-delete');
    const specificationModal = document.getElementById('popup-modal-spec-delete');
    if (mediaModal && specificationModal){
      deleteMediaModal.value= new Modal(mediaModal,{onHide:()=>{mediaToBeDeleted.value=undefined}});
      deleteSpecificationModal.value=new  Modal(specificationModal,{onHide:()=>{specificationToBeDeleted.value=undefined}})
    }else{
      console.log("Echec de l'opération");
    }
  }

  const deleteProductMedia= async ()=>{
    if (mediaToBeDeleted.value){
      if (await productStore.deleteProductMedia(Number(router.params.id),[mediaToBeDeleted.value])){
       if (product.value && updatedProduct.value){
         product.value.medias= (await productStore.getProductDetails(Number(router.params.id))).medias;
         updatedProduct.value.medias=product.value.medias;
       }else{
         console.log('Une erreur est survenue, rechargez la page');
       }
        if (deleteMediaModal.value) deleteMediaModal.value.hide();
        console.log('Media supprimée')
      }else {
        console.log("Echec de l'opération");
      }
    }else {
      console.log("Echec de l'opération");
    }

  }

  const deleteProductSpecification = async ()=>{
    if(specificationToBeDeleted.value){
      if (await productStore.deleteProductSpecification(Number(router.params.id), [specificationToBeDeleted.value])){
        if (product.value && updatedProduct.value){
          product.value.specifications=(await  productStore.getProductDetails(Number(router.params.id))).specifications;
          updatedProduct.value.specifications=product.value.specifications;
        }else{
          console.log('Une erreur est survenue, rechargez la page');
        }
        if (deleteSpecificationModal.value) deleteSpecificationModal.value.hide();
        console.log('Caractéristique supprimée');
      }else{
        console.log("Echec de l'opération")
      }
    }else{
      console.log("Echec de l'opération")
    }
  }

  const handleMediaChange = ()=>{
    startCarousel.value = true;
    arrangeFiles();
    nextTick(()=>{
      previewMedias()
    })
  }

  const arrangeFiles = ()=>{
  const fileInput = document.getElementById('medias') as HTMLInputElement;
  if (fileInput){
    const files = fileInput.files;
    const images = [];
    const videos = [];
    if (files){
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.split('/')[0]==='image'){
          images.push(files[i])
        }else {
          videos.push(files[i])
        }
      }
      productMedia.value={images:images,videos:videos}
    }else{
      console.log('Une erreur est survenue');
    }
  }else {
    console.log('Une erreur est survenue');
  }
}

  const previewMedias = () =>  {
  const fileInput = document.getElementById('medias') as HTMLInputElement;
  if (fileInput) {
    const files = fileInput.files;
    const carouselWrapper = document.getElementById('carousel-wrapper');
    const carouselIndicators = document.getElementById('carousel-indicators');

    if (carouselIndicators && carouselWrapper && files) {
      carouselWrapper.innerHTML = '';
      carouselIndicators.innerHTML = '';
      const slides: HTMLElement[] = [];
      const fileReadPromises: Promise<void>[] = [];
      const items: CarouselItem[] = [];
      const indicators: { position: number, el: HTMLElement }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split('/')[0];
        const reader = new FileReader();
        const fileReadPromise = new Promise<void>((resolve) => {
          reader.onload = function (e) {
            const slideIndex = Math.floor(i / 3); // 3 files per slide
            if (!slides[slideIndex]) {
              const newSlide = document.createElement('div');
              newSlide.className = 'hidden duration-700 ease-in-out';
              newSlide.setAttribute('data-carousel-item', '');
              slides.push(newSlide);

              // Create carousel item object for Flowbite
              items.push({ position: slideIndex, el: newSlide });

              // Create and add indicator
              const indicator = document.createElement('button');
              indicator.type = 'button';
              indicator.className = 'w-3 h-3 rounded-full';
              indicator.setAttribute('aria-current', slideIndex === 0 ? 'true' : 'false');
              indicator.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
              indicator.setAttribute('data-carousel-slide-to', String(slideIndex));
              indicators.push({ position: slideIndex, el: indicator });
              carouselIndicators.appendChild(indicator);
            }
            const itemContainer = document.createElement('div');
            itemContainer.className = 'inline-block w-1/3';

            if (fileType === 'image') {
              const img = document.createElement('img');
              if (e.target) {
                img.src = e.target.result as string;
              }
              img.className = 'w-40 h-40 rounded-lg m-1';
              itemContainer.appendChild(img);
            } else if (fileType === 'video') {
              const video = document.createElement('video');
              if (e.target) {
                video.src = e.target.result as string;
              }
              video.controls = false;
              video.className = 'w-40 h-40 rounded-lg m-1 object-cover';
              itemContainer.appendChild(video);
            }
            slides[slideIndex].appendChild(itemContainer);
            resolve();
          };
          reader.readAsDataURL(file);
        });
        fileReadPromises.push(fileReadPromise);
      }

      Promise.all(fileReadPromises).then(() => {
        slides.forEach((slide) => {
          carouselWrapper.appendChild(slide);
        });

        // Reinitialize the carousel after adding the slides
        const carouselElement = document.querySelector('#default-carousel') as HTMLElement;
        if (carouselElement) {
          const options: CarouselOptions = {
            defaultPosition: 0,
            interval: 3000,
            indicators: {
              activeClasses: 'bg-white dark:bg-gray-800',
              inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
              items: indicators,
            },
          };
          const instanceOptions: InstanceOptions = {
            id: 'default-carousel',
            override: true,
          };
          const carousel: CarouselInterface = new Carousel(carouselElement, items, options, instanceOptions);

          // Bind the next and previous buttons
          document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => carousel.prev());
          document.querySelector('[data-carousel-next]')?.addEventListener('click', () => carousel.next());
        }
      });
    } else {
      console.log('Une erreur est survenue');
      startCarousel.value = false;
    }
  } else {
    console.log('Une erreur est survenue lors de téléversement');
    startCarousel.value = false;
  }
};

  const createSpecificationInput =()=>{
    if (specificationContainers.value==undefined){
      specificationContainers.value=[{id:1,name:"",value:""}]
    }else{
      specificationContainers.value.push({id:specificationContainers.value.length+1,name:"",value:""})
    }

  }

  const removeSpecificationInput =(container:{id:number,name:string,value:string})=>{
    if (specificationContainers.value){
      delete productSpecification.value[container.name];
      specificationContainers.value=specificationContainers.value.filter(pContainer=>pContainer.id!=container.id);
    }
  }

  const setSpecification = (specification:{name:string,value:string})=>{
    productSpecification.value[specification.name]=specification.value;
  }

  const updateSpecification = (specification:{id:number,name:string,value:string})=>{
    if (updatedProduct.value){
      for (let i = 0; i < updatedProduct.value.specifications.length; i++) {
        if (updatedProduct.value.specifications[i].id==specification.id){
          updatedProduct.value.specifications[i]=specification;
        }
      }
    }
    console.log(product.value?.specifications)
  }

  const updatedValueCheck= ()=>{
    if (updatedProduct.value){
      return updatedProduct.value.name!=="" && updatedProduct.value.price!==0 && updatedProduct.value.description!=="" && (updatedProduct.value.specifications.length>=1 || Object.keys(productSpecification.value).length>=1) && (updatedProduct.value.medias.length>=1 || (productMedia.value && (productMedia.value.videos.length>=1 || productMedia.value.images.length>=1)));
    }else{
      return false
    }
  }

  const testMode = async ()=>{
    console.log(updatedValueCheck());
    console.log(productSpecification.value);
    console.log('Test passed');
  }

  const updateProduct = async ()=>{
    if (updatedValueCheck()){
      if (productSpecification.value && Object.keys(productSpecification.value).length>=1){
        if (await productStore.addProductSpecification(Number(router.params.id),productSpecification.value)){}else {
          return console.log("Echec de l'opération");
        }
      }
      if (productMedia.value  ){
        if (await productStore.addProductMedia(Number(router.params.id),productMedia.value.images,productMedia.value.videos)){}else{
          return console.log("Echec de l'opération");
        }
      }
      if(updatedProduct.value && product.value){
        const specifications:Specification[]=[];
        for (let i = 0; i < product.value.specifications.length; i++) {
          for (let j = 0; j < updatedProduct.value.specifications.length; j++) {
            if (product.value.specifications[i].id==updatedProduct.value.specifications[j].id){
              console.log(product.value.specifications[j].value)
              if (product.value.specifications[i].name!==updatedProduct.value.specifications[j].name || product.value.specifications[i].value!==updatedProduct.value.specifications[j].value){
                specifications.push(updatedProduct.value.specifications[j])
              }
            }
          }
        }
        if (specifications.length>0){
          if (await productStore.updateProductSpecification(Number(router.params.id),specifications)){}else {
            return console.log("Echec de l'opération");
          }
        }

        if (await productStore.updateProduct(Number(router.params.id),updatedProduct.value.name,updatedProduct.value.description,updatedProduct.value.price)){
          await route.push('/product');
        }else {
          return console.log("Echec de l'opération");
        }

      }
    }
  }

/*
    TODO:Mass delete medias or specifications
      Hide carrousel for  less than three medias
      Stack media on add
  */
  onMounted(()=>{
    initFlowbite();
    createModal();
    getProductDetails();
  })

</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Modifier le produit</p>
      </div>
    </div>

    <div v-if="product && updatedProduct" class="sm:w-full">
      <form class="w-full" @submit.prevent="updateProduct">
        <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Détails du produit</p>
        <div class="mb-5">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
          <input type="text" v-model="updatedProduct.name" id="name" class="w-full lg:w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div class=" justify-around items-center  grid grid-cols-8 mb-5">
          <label for="price" class=" col-span-2 lg:col-span-1 justify-end block text-sm font-medium text-gray-900 dark:text-white">Prix</label>
          <input type="number" id="price" v-model="updatedProduct.price" @input="console.log(updatedProduct.specifications.length>=1)" min="0" class=" col-span-4 lg:col-span-2 w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="20000"  required />
          <p class="col-span-1 lg:col-span-2 font-poppins font-semibold text-appGray text-heading-3 mx-4">XOF</p>
        </div>
        <div class="mb-5">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea id="description" rows="4" v-model="updatedProduct.description" class="block p-2.5 w-full lg:w-3/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>

        <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Medias</p>
        <div v-if="updatedProduct.medias.length>0" class="flex flex-wrap lg:w-4/5 w-full">
          <div v-for="(media,index) in updatedProduct.medias" :key="index" class="relative">
            <div class="absolute top-2 end-2 z-20">
              <button @click="showMediaModal(media.id)" type="button" class="rounded-full p-1 bg-white shadow-lg shadow-gray-800 border-none">
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
              </button>
            </div>
            <img v-if="media.type=='image'" class="border-none rounded-lg w-40 h-40 m-1" :src="media.url" alt="product image">
            <video v-if="media.type=='video'" :src="media.url" class="border-none rounded-lg w-40 h-40 m-1 object-cover" autoplay loop muted/>
          </div>
        </div>

        <div class="flex items-center justify-center w-full lg:w-3/5 my-5">
          <label for="medias" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Cliquer pour téléverser</span> ou glisser déposer</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF, MP4, or AVI (MAX. 800x400px)</p>
            </div>
            <input id="medias" type="file" class="hidden" accept="image/*,video/*" multiple @change="handleMediaChange" :required="updatedProduct.medias.length<1" />
          </label>
        </div>
        <div v-if="startCarousel" id="default-carousel" class="relative overflow-hidden w-full lg:w-[32rem] h-20 lg:h-44 mb-5" data-carousel="slide">
          <!-- Carousel wrapper -->
          <div id="carousel-wrapper" class="relative rounded-lg">
            <!-- Carousel items will be dynamically added here -->
          </div>
          <!-- Slider indicators will be dynamically added here -->
          <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse" id="carousel-indicators"></div>
          <!-- Slider controls -->
          <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-appGray dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
          </button>
          <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-appGray dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
          </button>
        </div>

        <div class="flex items-center mb-3">
          <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Caractéristiques</p>
          <button type="button" @click="createSpecificationInput" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
            <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
            </svg>
            Ajouter
          </button>
        </div>

        <div id="specification-container" class="mb-5 w-full justify-center lg:w-1/3">
          <!-- Old specifications -->
          <div v-for="specification in updatedProduct.specifications" :key="specification.id" class="flex items-center mb-2">
            <label :for="'specification-'+ specification.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" :id="'specification-'+ specification.id" v-model="specification.name"  class=" mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nom" required />
            <label :for="'specification-value-'+specification.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" @input="updateSpecification(specification)" v-model="specification.value" :id="'specification-value-' + specification.id" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Valeur" required />
            <button @click="showSpecificationModal(specification.id)" type="button">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
          <!-- New specifications -->
          <div v-for="container in specificationContainers" :key="container.id" :id="'specification-container-'+ container.id" class="flex items-center mb-2">
            <label :for="'specification-'+ container.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" v-model="container.name" :id="'specification-'+ container.id" class=" mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nom" required />
            <label :for="'specification-value-'+container.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" v-model="container.value" @input="setSpecification(container)" :id="'specification-value-' + container.id" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Valeur" required />
            <button type="button" @click="removeSpecificationInput(container)">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" :disabled="!updatedValueCheck()" :class="updatedValueCheck()?'bg-appBlue':'bg-blue-400'" class=" w-auto bg-appBlue border-none font-poppins font-medium text-heading-3 text-white rounded-lg px-8 py-2 m-8 ">Sauvegarder</button>
      </form>
    </div>
    <!-- Delete media modal-->
    <div id="popup-modal-media-delete" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div v-if="deleteMediaModal" class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button" @click="deleteMediaModal.hide()" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez-vous vraiment supprimer ce media ?</h3>
            <button @click="deleteProductMedia" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
              Supprimer
            </button>
            <button @click="deleteMediaModal.hide()" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Annuler</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete specification modal-->
    <div id="popup-modal-spec-delete" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div v-if="deleteSpecificationModal" class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button" @click="deleteSpecificationModal.hide()" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez-vous vraiment supprimer cette caratéristique?</h3>
            <button @click="deleteProductSpecification" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
              Supprimer
            </button>
            <button @click="deleteSpecificationModal.hide()" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
