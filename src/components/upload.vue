<template>
  <q-btn icon="upload" color="dark" size="sm" v-on:click="openFile"  round></q-btn>
  <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {useCounterStore} from '../stores/store'
export default {
  components:{
  },
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
      imageList:[]
    }
  },
  methods:{
    pushList(){
      const result = this.store.imageListGlobal.find(object => object.id === this.currentImageData.id)
        if(!result){
          this.store.imageListGlobal.push(this.currentImageData)
        }
        console.log(this.store.imageListGlobal)
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
    currentImageData:{
      handler(newValue,oldValue){
        if(newValue.image){
          //this.$emit('imageList',this.imageList)
          this.$emit('currentImageData',this.currentImageData)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>
