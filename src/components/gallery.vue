<template>
  <q-card class="" :style="{'height':this.$q.screen.height + 'px'}" >
    <q-card-section class="row">
      <q-card class="col-4" v-for="data in this.imagesListLocal" bordered :key="data.messageId">
        <q-img
        loading="lazy"
        spinner-color="white"
        :src="data.image" style="height:100px;object-fit:cover;" v-on:click="zoomImage(data)"></q-img>
      </q-card>
    </q-card-section>
    <q-dialog
      :full-height="this.fullScreenActive ? true : false "
      :maximized="this.fullScreenActive ? true : false"
      v-model="this.isActive" v-if="this.isActive" persistent>
      <q-card style="height:400px;width:100%;">
        <q-img :src="this.selectedImage.image" style="width:100%;height:100%;">
          <div class="absolute-top-left">
            <div class="text-overline">Gönderen : {{ findSender() }}</div>
          </div>
          <div class="absolute-top-left bg-transparent">
            <q-btn
              :icon="this.fullScreenActive ? 'fullscreen_exit' : 'fullscreen'" round size="sm"
              :color="!this.fullScreenActive ? 'dark' : 'red'" v-on:click="makeFullScreen"></q-btn>
          </div>
          <div class="absolute-top-right bg-transparent">
            <q-btn icon="remove" color="white" text-color="dark" size="sm" round v-on:click="this.selectedImage = {};this.isActive = false"></q-btn>
          </div>
        </q-img>
      </q-card>
    </q-dialog>
  </q-card>

</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  props:['imagesList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      imagesListLocal:[],
      number:0,
      isActive:false,
      fullScreenActive:false,
      selectedImage:{}
    }
  },
  methods:{
    makeFullScreen(){
      this.fullScreenActive =! this.fullScreenActive
    },
    findSender(){
      const result = this.store.usersList.find(object => object.id === this.selectedImage.senderId)
      if(result){
        if(result.id === this.store.user.id){
          const senderName = 'Ben'
          return senderName
        }else{
          const senderName = result.name ? result.name : ''
          const email = result.email
          const fullName = senderName + ' ' + email
          return fullName
        }
      }
    },
    zoomImage(data){
      this.selectedImage = data
      this.isActive = true
    },
    backButton(){
      this.imagesListLocal = []
      this.store.galleryActive = false
    }
  },
  created(){

  },
  watch:{
    imagesList:{
      handler(newValue,oldValue){
        if(newValue){
          this.imagesListLocal = newValue
          console.log('galleryimagesListLocal',this.imagesListLocal)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>

</style>
