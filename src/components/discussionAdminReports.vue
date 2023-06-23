<template>
  <div class="row">
    <q-card class="bg-dark text-white col-12 col-md-6 col-sm-6" bordered dark v-for="(data,key) in this.reportedMessages" :key="key">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="findUserImage(data)" v-if="this.checkImage(data)" style="object-fit:cover;">
            <q-btn icon="person" round color="dark" v-if="!this.checkImage(data)"></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-capitalize">{{findUserName(data)}}</q-item-label>
          <q-item-label caption class="text-grey-6 text-weight-bold">{{ data.fullDate }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section class="row">
        <div class="text-subtitle2">
          <q-icon name="chat"></q-icon>
          {{ data.message }}
        </div>
        <q-space></q-space>
        <q-btn icon="open_in_new" flat v-on:click="goSeeReports(data)">
          <q-badge color="red" floating>{{  getReportValue(data) }}</q-badge>
        </q-btn>
      </q-card-section>
      <q-card-actions>
      </q-card-actions>
    </q-card>
    <q-dialog
      persistent
      v-if="this.selectedMessageActive"
      v-model="this.selectedMessageActive" :maximized="this.store.avatarActive ? false : true"
    >
      <q-card class="bg-dark text-white" :style="{'width':this.store.avatarActive ? '450px' : '100%'}" dark bordered>
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="delete_forever" flat color="red" v-on:Click="deleteMessage()"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-card class="bg-dark text-white" v-for="data in this.reports" :key="data.reporterId">
            <q-card-section horizontal>
              <q-btn icon="person" color="dark" class="col-2"></q-btn>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  {{ data.reportMessage }}
                </div>
                <div class="text-caption text-weight-bold text-grey-6">
                  {{ data.reportDate ? data.reportDate : 'Tarih Bulunamadı !'}}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  props:['reportedChats'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      reportedMessages:[],
      selectedMessage:{},
      selectedMessageActive:false,
      reports:[],
    }
  },
  methods:{
    deleteFromReports(){
      console.log(this.selectedMessage)
      const db = getDatabase()
      remove(ref(db,`discussions/${this.store.selectedDisCurrent.id}/chats/${this.selectedMessage.id}/reports`))
      this.reports = []
    },
    deleteMessage(){
      console.log(this.selectedMessage)
      const data = this.store.usersList.find(object => object.id === this.selectedMessage.senderId)
      this.$q.dialog({
        dark:true,
        cancel:true,
        message:`${this.store.findUserName(data)} Adlı Kullanıcının Mesajını Siliyorsunuz, İşlem Geri Alınamaz !`,
        title:'Warning'
      }).onOk(() => {
        const db = getDatabase()
        update(ref(db,`discussions/${this.store.selectedDisCurrent.id}/chats/${this.selectedMessage.id}`),{
          message:`Bu Mesaj Admin Tarafından Silindi.`,
          adminEffect:true,
          removedDate:this.store.currentDateString()
        })
        this.reportedMessages = this.reportedMessages.filter(object => object.id !== this.selectedMessage.id)
        this.deleteFromReports()
      }).onCancel(() => {
        //
      })
    },
    getReportValue(data){
      if(data.reports){
        const length = Object.entries(data.reports).length
        return length
      }else{
        return 0
      }
    },
    goBack(){
      this.selectedMessage = {}
      this.selectedMessageActive = false
      this.reports = []
    },
    getAllReports(){
      if(this.selectedMessage.reports){
        const list = []
        for(const [key,value] of Object.entries(this.selectedMessage.reports)){
          const reportData = {
            reportMessage:`${value.reportMessage}`,
            reporterId:`${value.reporterId}`,
            reportDate:`${value.reportDate}`,
            date:`${value.date}`
          }
          list.push(reportData)
        }
        this.reports = list
        console.log('reports',this.reports)
      }else{
        this.reports = []
      }
    },
    goSeeReports(data){
      this.selectedMessage = data
      if(this.selectedMessage.id){
        this.getAllReports()
        this.selectedMessageActive = true
      }
    },
    findUserName(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        const name = result.name ? result.name : result.email
        return name
      }
    },
    checkImage(data){
      if(this.findUserImage(data) != '' || null){
        return true
      }else{
        return false
      }
    },
    findUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    }
  },
  created(){

  },
  watch:{
    reports:{
      handler(newValue,oldValue){
        if(!newValue.length){
          this.selectedMessageActive = false
        }
      },
      immediate:true,
      deep:true
    },
    reportedChats:{
      handler(newValue,oldValue){
        if(newValue){
          this.reportedMessages = newValue
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
