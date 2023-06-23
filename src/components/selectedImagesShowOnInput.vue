<template>
  <q-card class="bg-grey-2" flat>
    <q-card-section class="row">
      <q-card
        v-if="this.imagesList.length"
        bordered
        v-for="data in this.filterForLoop()" :key="data.id"
        style="height:100px;border-radius:7px;" class="col-4">
        <q-img
          :src="data.image"
          style="height:100px;object-fit:cover;"
        >
          <div class="absolute-top-right bg-transparent">
            <q-btn icon="remove" color="dark" round size="sm" v-on:click="removeImage(data)"></q-btn>
          </div>
        </q-img>
      </q-card>
      <q-card class="bg-dark col-4">
        <q-btn class="full-width full-height" flat color="green" icon="collections_bookmark" v-on:Click="showAllSelectedImages"></q-btn>
      </q-card>
    </q-card-section>
    <q-dialog
      dark :maximized="this.store.avatarActive ? false : true"
      v-if="this.showListActive" v-model="this.showListActive" persistent
    >
      <q-card class="bg-dark" :style="{'width':this.store.avatarActive ? '500px' : '100%'}">
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="this.showListActive = false"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="this.store.imageObject.message"
            dark color="white" label="Mesaj Başlığı Veya Mesaj Giriniz">
            <template v-slot:prepend>
              <q-icon name="chat"></q-icon>
            </template>
            <template v-slot:append v-if="this.store.imageObject.message">
              <q-btn icon="remove" color="dark" size="sm" v-on:click="this.store.imageObject.message = ''"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="row">
          <q-card style="height:150px;" bordered dark class="col-6 col-md-6 col-sm-6" v-for="data in this.imagesList" :key="data.id">
            <q-img style="object-fit:cover;height:150px;" :src="data.image">
              <div class="absolute-top-right bg-transparent">
                <q-btn icon="remove" color="dark" round size="sm" v-on:click="removeImage(data)"></q-btn>
              </div>
            </q-img>
          </q-card>
          <q-card style="height:150px;" class="bg-dark col-12 col-md-6 col-sm-6" flat>
            <q-btn icon="add" flat color="white" class="full-width  full-height" v-on:click="addMorePhoto"></q-btn>
          </q-card>
        </q-card-section>
        <q-card-section class="row">
          <q-card class="col-6" dark v-for="data in this.options" :key="data.id" style="height:150px;">
            <q-btn
              :icon="data.icon" :color="data.color" flat
              class="full-width full-height" v-on:click="selectOption(data)"></q-btn>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      imagesList:[],
      showListActive:false,
      options:[
        {id:1,label:'Confirm',icon:'send',color:'green'},
        {id:2,label:'Cancel',icon:'remove',color:'red'}
      ]
    }
  },
  methods:{
    addMorePhoto(){
      this.store.addNewPhotoActive =! this.store.addNewPhotoActive
      console.log(this.store.addNewPhotoActive)
    },
    selectOption(data){
      if(data.id === 1){
        const confirmCheck = true
        this.$emit('sendSelectedImages',confirmCheck)
        this.showListActive = false
      }else{
        this.store.selectedImagesForChats = []
        this.showListActive = false
      }
    },
    showAllSelectedImages(){
      this.showListActive = true
    },
    checkLengthImagesList(){
      if(this.imagesList.length === 3){
        return true
      }else{
        return false
      }
    },
    filterForLoop(){
      const list = this.imagesList.slice(0,2)
      return list
    },
    removeImage(data){
      this.store.selectedImagesForChats = this.store.selectedImagesForChats.filter(object => object.id !== data.id)
    }
  },
  created(){

  },
  watch:{
    'store.selectedImagesForChats':{
      handler(newValue,oldValue){
        if(newValue){
          this.imagesList = newValue
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
