<template>
  <q-dialog
    persistent
    :maximized="this.store.avatarActive ? false : true"
    v-if="this.store.showLikerActive" v-model="this.store.showLikerActive"
  >
    <q-card
      :style="{'width':this.store.widthOptions()}" style="margin:0 auto;"
      class="bg-dark text-white">
        <div class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </div>
        <q-card-section>
          <q-card class="bg-dark text-white" flat bordered v-for="data in this.likersListLocal" :key="data.id">
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img :src="this.store.findUserImage(data)" alt="" v-if="this.store.checkUserImage(data)" style="object-fit:cover;">
                  <q-btn v-if="!this.store.checkUserImage(data)" icon="person" color="dark" round></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-overline text-weight-bold">
                  {{ this.store.findUserName(data) }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ this.store.findUserInfo(data) }}
                </div>
              </q-card-section>
              <q-card-section class="col-3">
                <q-btn icon="more_vert" flat color="white" v-on:click="showDetailUser(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
      <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
  </q-dialog>
</template>

<script>
import selectedUserDetailDialog from './selectedUserDetailDialog.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    selectedUserDetailDialog
  },
  props:['likersList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      likersListLocal:[]
    }
  },
  methods:{
    showDetailUser(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        this.store.showUserDetail = result
      }else{
        this.store.showUserDetail = data
      }
      this.store.showUserDetailActive = true
    },
    goBack(){
      this.likersListLocal = []
      this.store.showLikerActive = false
    }
  },
  created(){

  },
  watch:{
    likersList:{
      handler(newValue,oldValue){
        if(newValue){
          this.likersListLocal = newValue
          console.log('likersListLocal',this.likersListLocal)
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
