<template>
  <div
    style="margin:0 auto;"
    :style="{'width':this.store.avatarActive ? '35%' : '100%'}"
  >
    <q-card class="bg-dark text-white" v-if="!checkDontShowListLength()">
      <q-card-section horizontal>
        <q-card-section class="col text-center">
          <div class="text-caption text-weight-bold text-capitalize">
            Kara Listede Kimse Yok ! <q-icon name="info" size="15px" class="q-ml-xs"></q-icon>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card
    v-if="checkDontShowListLength()"
    v-for="data in this.store.dontShowListAll" :key="data.id"
    class="bg-dark text-white">
      <q-card-section horizontal>
        <q-card-section class="col-3">
          <q-avatar>
            <img :src="findUserImage(data)" alt="" v-if="checkImage(data)" style="object-fit:cover;">
            <q-btn icon="person" round color="dark" v-if="!checkImage(data)"></q-btn>
          </q-avatar>
        </q-card-section>
        <q-card-section class="col-6">
          <div class="text-caption text-weight-bold text-capitalize">
            {{ findUserName(data) }}
          </div>
          <div class="text-caption text-weight-bold text-grey-4">
            {{ data.date }}
          </div>
        </q-card-section>
        <q-card-section class="col-3 text-left">
          <q-btn icon="undo" flat color="white" v-on:Click="removeFromDarkList(data)"></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { getDatabase, ref, set, update, remove, onValue } from "firebase/database";
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

    }
  },
  methods:{
    checkDontShowListLength(){
      if(this.store.dontShowListAll.length){
        return true
      }else{
        return false
      }
    },
    removeFromDarkList(data){
      const db = getDatabase()
      remove(ref(db,`dontShowList/${this.store.user.id}/${data.id}`))
      this.store.dontShowListAll = this.store.dontShowListAll.filter(object => object.id !== data.id)
    },
    findUserName(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.name){
          const name  = result.name
          return name
        }else{
          const email = result.email
          return email
        }
      }
    },
    checkImage(data){
      const result = this.store.usersList.find(object=> object.id === data.id)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findUserImage(data){
      const result = this.store.usersList.find(object=> object.id === data.id)
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
    'store.user':{
      handler(newValue,oldValue){
        if(newValue.id){
          this.store.getDontShowList()
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
