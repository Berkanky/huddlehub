<template>
  <q-dialog v-if="this.store.addMorePhotoActive" v-model="this.store.addMorePhotoActive" persistent full-height>
    <q-card class="bg-dark text-white" style="width:100%;">
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-btn icon="collections_bookmark" flat color="white" :label="`Gösterilen Fotoğraf Sayısı - ( ${this.imageList.length} )`" no-caps></q-btn>
      <q-card-section class="row" style="width:100%;">
        <q-card class="col-6 bg-dark" bordered v-for="data in this.imageList" :key="data.id" style="height:150px;">
          <q-img style="height:150px;" :src="data.image">
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="remove" color="dark" size="sm" v-on:click="removeImage(data)"></q-btn>
            </div>
          </q-img>
        </q-card>
      </q-card-section>
      <q-card-section class="text-center">
        <upload/>
        <q-btn icon="check" flat color="green-4" v-on:Click="addImages" v-if="this.imageList.length"></q-btn>
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-white"><q-icon name="info" flat size="15px"></q-icon> Silmek İstediğiniz Fotografın Üstüne 1 kere Tıklayarak İşleminizi Gerçekleştirebilirsiniz </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set, update, remove } from "firebase/database";
import upload from './upload.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload,
  },
  props:['myImages'],
  setup(){
    const store = useCounterStore()
    return{
      store,
    }
  },
  data:function(){
    return{
      selectedImageLocal:{},
      imageList:[],
      myImagesLocal:[],
      lengthList:0
    }
  },
  methods:{
    removeImage(data){
      const result = this.myImagesLocal.find(object => object.id === data.id)
      if(result){
        const db = getDatabase()
        remove(ref(db,`users/${this.store.user.id}/images/${data.id}`))
      }
      this.store.imageListGlobal = this.store.imageListGlobal.filter(object => object.id !== data.id)
    },
    addImages(){
      if(this.lengthList<5){
        this.imageList.forEach(element => {
        const db = getDatabase()
        set(ref(db,`users/${this.store.user.id}/images/${element.id}`),{
          id:element.id,
          image:element.image
        })
        this.imageList = this.imageList.filter(object => object.id !== element.id)
      });
      }else{
        this.$q.notify({
          type:'negative',
          message:'Maksimum 5 Fotoğraf Yükleyebilirsiniz !',
          timeout:600,
          position:'left'
        })
      }
    },
    goBack(){
      this.imageList = []
      this.selectedImageLocal = {}
      this.store.imageForBack = ''
      this.store.addMorePhotoActive = false
    }
  },
  mounted(){
    this.$watch('myImages', (newValue, oldValue) => {
    if (newValue) {
      this.imageList = [] //15.03.2023 de eklendi
      this.myImagesLocal = newValue
      this.myImagesLocal.forEach(element => {
        const result = this.imageList.find(object => object.id === element.id)
        if (!result) {
          this.imageList.push(element)
        }
        this.lengthList = this.imageList.length
      })
    }
  }, { immediate: true, deep: true })
  },
  watch:{
    'store.imageListGlobal':{
      handler(newValue,oldValue){
        if(newValue){
          this.imageList = newValue
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
