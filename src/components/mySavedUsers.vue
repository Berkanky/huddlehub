<template>
  <div class="bg-dark text-white"
    style="margin:0 auto;"
    :style="{'width':this.store.avatarActive ? '40%' : '100%'}"
  >
    <q-card class="bg-dark text-white" v-if="!checkListLength()">
      <q-card-section horizontal>
        <q-card-section class="col-9">
          <div class="text-caption text-weight-bold text-capitalize text-white q-pa-sm">
            bir kullanıcı bulunamadı !
          </div>
        </q-card-section>
        <q-card-section class="col-3">
          <q-btn icon="arrow_right_alt" flat color="white" v-on:Click="goHomePage"></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-slide-item
      class="bg-dark"
      v-if="checkListLength()"
      @left="onLeft(data)" v-for="data in this.myFavListLocal" :key="data.id" left-color="red">
      <template v-slot:left>
        <q-icon name="delete_forever"/>
      </template>
      <q-card class="bg-dark text-white" flat>
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-avatar>
              <img :src="findUserImage(data)" alt="" v-if="checkImage(data)" style="object-fit:cover;">
              <q-btn icon="person" color="dark" round v-if="!checkImage(data)"></q-btn>
            </q-avatar>
          </q-card-section>
          <q-card-section  class="col-6">
            <div class="text-overline text-weight-bold text-capitalize">
              {{ data.name ? data.name : data.email }}
            </div>
            <div class="text-caption">
              <q-icon name="work" size="15px"></q-icon>
              {{ data.info ? data.info : '' }}
            </div>
          </q-card-section>
          <q-card-section class="col-3">
            <q-btn icon="login" flat color="white" v-on:click="moreInfo(data)"></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-slide-item>
  </div>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
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
      myFavListLocal:[]
    }
  },
  methods:{
    goHomePage(){
      this.$router.push({path:'/'})
    },
    checkListLength(){
      if(this.myFavListLocal.length){
        return true
      }else{
        return false
      }
    },
    moreInfo(data){
      console.log(data)
      this.store.filterUserActive = true
      this.store.filteredList = this.store.secondUserList.filter(object => object.id === data.id)
      this.$router.push({path:'/'})
    },
    onLeft(data){
      const userData = data
      this.removeSavedUser(userData)
    },
    swipeUser(evt){
      console.log(evt)
    },
    removeSavedUser(userData){
      console.log(userData)
      const db = getDatabase()
      remove(ref(db,`myFavs/${this.store.user.id}/${userData.id}`))
      this.store.myFavList = this.store.myFavList.filter(object => object.id !== userData.id)
    },
    checkImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
      }else{
        return  false
      }
    },
    findUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    }
  },
  created(){
    this.store.getUsers()
  },
  watch:{
    'store.myFavList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.myFavListLocal = newValue
          console.log('myFavListLocal',this.myFavListLocal)
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMyFavList()
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
