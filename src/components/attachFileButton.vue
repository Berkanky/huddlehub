<template>
  <q-btn icon="attach_file" color="grey-7" flat v-on:click="openFile"  round></q-btn>
  <q-file ref="fileInput" v-model="this.image" style="display: none;" @update:model-value="selectNewFile"/>
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
      image:null,
      randomId:null,
      currentImageData:{},
      imageList:[],
    }
  },
  methods:{
    pushList(){
      const result = this.store.selectedImagesForChats.find(object => object.id === this.currentImageData.id)
        if(!result){
          this.store.selectedImagesForChats.push(this.currentImageData)
        }
        console.log(this.store.selectedImagesForChats)
    },
    openFile(){
      this.$refs.fileInput.$el.click()
    },
    async selectNewFile(){
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.store.imageForBack = reader.result;
        this.currentImageData = {
          id: uuidv4(),
          image: this.store.imageForBack
        };
        console.log(this.currentImageData)
        this.pushList()
      });
      if (this.image) {
        reader.readAsDataURL(this.image);
      }
    }
  },
  watch:{
    'store.addNewPhotoActive':{
      handler(newValue,oldValue){
        if(newValue){
          this.openFile()
        }
      },
      immediate:true,
      deep:true
    },
    currentImageData:{
      handler(newValue,oldValue){
        if(newValue.image){
          //this.$emit('imageList',this.imageList)
         // this.$emit('currentImageData',this.currentImageData)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>
