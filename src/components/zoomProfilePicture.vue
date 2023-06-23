<template>
  <q-dialog
    v-model="this.store.selectedUserZoomActive" v-if="this.store.selectedUserZoomActive">
    <q-card class="bg-dark" style="width: 700px; max-width: 80vw;">
      <q-img v-if="this.selectedUserLocal.image" :src="this.selectedUserLocal.image" style="width:100%;height:100%;">
        <div class="absolute-top-right bg-transparent">
          <q-btn icon="remove" color="grey-8" size="sm" round v-on:click="this.selectedUserLocal = {};this.store.selectedUserZoomActive = false"></q-btn>
        </div>
      </q-img>
    </q-card>
  </q-dialog>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedUser'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedUserLocal:{}
    }
  },
  watch:{
    selectedUser:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedUserLocal = newValue
          console.log('selectedUserLocal',this.selectedUserLocal)
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
