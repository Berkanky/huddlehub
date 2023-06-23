<template>
  <q-dialog
    v-model="this.store.discussionBlockedsActive" v-if="this.store.discussionBlockedsActive"
    :maximized="this.store.avatarActive ? false : true"
    dark
    persistent
    >
      <q-card
        :style="{'width':this.store.avatarActive ? '500px' : '100%'}"
        class="bg-dark text-white" >
          <q-card-section class="text-left">
            <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          </q-card-section>
          <q-card-section>
            <q-card class="bg-dark text-white" v-for="data in this.blockedListLocal" :key="data.id">
              <q-card-section class="row">
                <q-card-section class="col-3">
                  <q-avatar>
                    <img
                      style="object-fit:cover;"
                      :src="this.store.findUserImage(data)" alt="" v-if="this.store.checkUserImage(data)">
                    <q-btn icon="person" v-if="!this.store.checkUserImage(data)" round color="dark"></q-btn>
                  </q-avatar>
                </q-card-section>
                <q-card-section class="col-6">
                  <div class="text-overline text-weight-bold text-white">
                    {{ this.store.findUserName(data) }}
                  </div>
                  <div class="text-caption text-weight-bodl text-grey-6">
                    {{ this.store.findUserInfo(data) }}
                  </div>
                </q-card-section>
                <q-card-section class="col-3">
                  <q-btn
                    v-if="checkBlockedOrNot(data)"
                    icon="remove" color="red" flat v-on:click="removeUserFromBlocks(data)"></q-btn>
                </q-card-section>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  props:['blockedList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      blockedListLocal:[]
    }
  },
  methods:{
    checkBlockedOrNot(data){
      const result = this.blockedListLocal.some(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    removeUserFromBlocks(data){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`${this.store.findUserName(data)} Adlı Kullanıcının Engelini Kaldırmak İstediğinizden Emin misiniz ?`
      }).onOk(() => {
        const db = getDatabase()
        remove(ref(db,`discussions/${this.store.selectedDisCurrent.id}/blocks/${data.id}`))
        this.blockedListLocal = this.blockedListLocal.filter(object => object.id !== data.id)
      }).onCancel(()=>{
        //
      })
    },
    goBack(){
      this.store.discussionBlockedsActive = false
      this.blockedListLocal = []
    }
  },
  created(){

  },
  watch:{
    blockedList:{
      handler(newValue,oldValue){
        if(newValue){
          this.blockedListLocal = newValue
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
