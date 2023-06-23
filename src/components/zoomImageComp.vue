<template>
  <q-dialog
    :full-width="this.checkFullScreenActive()"
    :maximized="this.checkFullScreenActive()"
    v-if="this.store.selectedZoomImageActive " v-model="this.store.selectedZoomImageActive" persistent>
    <q-card class="bg-dark text-white" style="width: 700px; max-width: 80vw;">
      <q-img
        :src="this.selectedZoomImageLocal.image" style="width:100%;height:100%;">
            <div class="absolute-top-left">
              <div class="text-subtitle2">Gönderen : {{ getSender() }}</div>
            </div>
            <div class="absolute-top-right bg-transparent">
              <q-btn size="sm" icon="remove" round color="dark"
                v-on:click="this.store.selectedZoomImageActive = false;this.selectedZoomImageLocal={}"></q-btn>
            </div>
            <div class="absolute-bottom-right bg-transparent">
              <q-btn
                :icon="this.checkFullScreenActive() ? 'fullscreen_exit' : 'fullscreen'" round :size="this.checkFullScreenActive() ? 'md' : 'sm'"
                :color="this.checkFullScreenActive() ? 'red' : 'primary'" v-on:click="fullScreenButton"></q-btn>
            </div>
          </q-img>
    </q-card>
  </q-dialog>
</template>

<script>
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedZoomImageLocal:{},
      fullScreenActive:false,
    }
  },
  methods:{
    checkFullScreenActive(){
      if(this.fullScreenActive){
        return true
      }else{
        return false
      }
    },
    fullScreenButton(){
      this.fullScreenActive =! this.fullScreenActive
    },
    getSender(){
      const result = this.store.usersList.find(object => object.id === this.selectedZoomImageLocal.senderId)
      if(result){
        if(result.id  === this.store.user.id){
          const name = 'Ben'
          return name
        }else{
          const name = result.name ? result.name : ''
          const email = result.email
          const fullName = name + ' ' + email
          return fullName
        }
      }
    }
  },
  watch:{
    'store.selectedZoomImage':{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedZoomImageLocal = newValue
          console.log('zoomımagecompselectedZoomImageLocal',this.selectedZoomImageLocal)
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
