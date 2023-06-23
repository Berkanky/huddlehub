<template>
  <q-card class="text-center" dark v-for="data in this.members" :key="data.id">
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar>
          <img
            style="object-fit:cover;"
            :src="this.store.findUserImage(data)" alt="" v-if="this.store.checkUserImage(data)">
          <q-btn icon="person" color="dark" round v-if="!this.store.checkUserImage(data)"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-6">
        <div class="text-caption text-weight-bold text-grey-6">
          {{this.store.findUserName(data)}}
        </div>
        <div class="text-caption text-weight-bold text-grey-6">
          {{ this.store.findUserInfo(data)}}
        </div>
      </q-card-section>
      <q-card-section class="col-3">
        <q-btn icon="more_vert" flat color="white" v-on:Click="selectUser(data)"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  props:['memberList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      members:[]
    }
  },
  methods:{
    selectUser(data){
      this.store.showUserDetail = data
      this.store.showUserDetailActive = true
    }
  },
  created(){

  },
  watch:{
    memberList:{
      handler(newValue,oldValue){
        if(newValue){
          this.members = newValue
          console.log('members',this.members)
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
