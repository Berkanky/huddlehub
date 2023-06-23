<template>
  <div class="row">
    <div class="col col-md col-sm">
      <q-card class="bg-dark text-white text-center" :dark="this.store.avatarActive ? true : false" bordered>
        <q-card-section>
          <q-avatar size="150px">
            <img
              style="object-fit:cover;"
              :src="this.store.selectedMemberInAdmin.image" alt="" v-if="this.store.selectedMemberInAdmin.image">
            <q-btn icon="person" color="dark" round v-if="!this.store.selectedMemberInAdmin.image" size="xl"></q-btn>
          </q-avatar>
          <div class="text-subtitle2 q-ma-sm text-capitalize text-grey-6">
            <q-icon name="person" size="17px"></q-icon>
              {{ this.store.selectedMemberInAdmin.name ? this.store.selectedMemberInAdmin.name : 'Bilgi Yok' }},
              <q-icon name="work" size="17px"></q-icon>
              {{ this.store.selectedMemberInAdmin.info ? this.store.selectedMemberInAdmin.info : 'Bilgi Yok' }}
          </div>
        </q-card-section>
        <q-card-section horizontal>
          <q-card
            class="col-3 q-ml-xs"
            v-for="data in this.imageList" :key="data.id" v-if="this.imageList.length"
            style="height:80px;border-radius:7px;">
            <q-img :src="data.image" v-if="data.image" style="object-fit:cover;height:80px;"></q-img>
          </q-card>
          <q-card
            dark bordered
            class="col-4 q-ml-xs bg-dark"
            v-if="!this.imageList.length"
            style="height:100px;border-radius:7px;"
          >
            <q-btn icon="priority_high" flat color="white" class="full-width full-height"></q-btn>
          </q-card>
        </q-card-section>
        <q-card-section class="text-left">
          <div class="text-overline text-weight-bold text-grey-6" v-if="this.checkInGroupBlockListOrNot()">
            <q-icon name="info" size="17px"></q-icon>
              {{ this.getUserBlockedDate() }}
          </div>
        </q-card-section>
        <q-card-actions class="justify-around q-px-md">
            <q-btn flat round :color="this.checkInGroupBlockListOrNot() ? 'green' : 'red'" :icon="this.checkInGroupBlockListOrNot() ? 'undo' : 'block'" v-on:click="blockUser"/>
            <q-btn
              flat round
              color="green"
              :icon="this.chatShowActive ? 'list' : 'chat'"
              v-on:click="showUserComments"/>
          </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 col-md-5 col-sm-5 q-ml-xs q-mt-xs">
      <q-card-section class="text-right">
        <q-btn icon="search" flat color="white" v-on:click="searchUser" v-if="!this.searchedData.active"></q-btn>
        <q-btn icon="filter_list_off" flat color="white" v-on:click="resetSearchFilter" v-if="this.searchedData.active"></q-btn>
      </q-card-section>
      <q-scroll-area
        dark class="bg-dark text-white rounded-borders"
        style="width:100%;height:450px;position:relative;"
      >
      <q-card
        v-if="!this.chatShowActive"
        :dark="this.store.selectedMemberInAdmin.id === data.id ? true : false" :flat="this.store.avatarActive ? false : true"
        class="bg-dark text-white" v-for="data in this.membersList" :key="data.id" :bordered="this.store.avatarActive ? true : false">
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-avatar>
              <img :src="this.store.findUserImage(data)" alt="" v-if="this.store.checkUserImage(data)" style="object-fit:cover;">
              <q-btn icon="person" round color="dark" v-if="!this.store.checkUserImage(data)"></q-btn>
            </q-avatar>
          </q-card-section>
          <q-card-section class="col-6">
            <div class="text-overline text-weight-bold text-grey-6">
              {{ this.store.findUserName(data) }}
            </div>
            <div class="text-caption text-weight-bold text-grey-6">
              {{ this.store.findUserInfo(data) }}
            </div>
          </q-card-section>
          <q-card-section class="col-3">
            <q-btn icon="fa-solid fa-info" size="sm" v-on:click="selectUser(data)" flat color="white" :disable="checkMe(data) ? false : true"></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-card class="bg-dark text-white" v-if="this.chatShowActive" v-for="data in this.chatList" :key="data.id">
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-btn icon="chat" round color="dark"></q-btn>
          </q-card-section>
          <q-card-section class="col-6">
            <div class="text-caption text-weight-bold text-grey-6">
              {{ data.message }}
            </div>
            <div class="text-caption">
              {{ data.date }}
            </div>
          </q-card-section>
          <q-card-section class="">
            <q-btn icon="delete_forever" flat color="red" v-on:click="deleteUserMessage(data)"></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  props:['members'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      membersList:[],
      chatList: [],
      chatShowActive:false,
      imageList:[],
      searchedData:{},
    }
  },
  methods:{
    resetSearchFilter(){
      this.membersList = this.members
      this.searchedData.active = false
    },
    searchUser(){
      this.$q.dialog({
        dark:true,
        title: 'Find User',
        message: 'Find User For Crud Operations !',
        prompt: {
          model: this.searchedData.name,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true,
        maximized:this.store.avatarActive ? false : true
      }).onOk(data => {
        const result = this.membersList.filter(object =>
          (object.name.toLowerCase()).includes(data.toLowerCase()) || (object.email.toLowerCase()).includes(data.toLowerCase())
        )
        if(result.length){
          this.membersList = result
          this.searchedData.active = true
        }else{
          this.$q.notify({
            type:'negative',
            message:'Kullanıcı Bulunamadı !',
            timeout:700,
            position:'bottom'
          })
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    getSelectedUserAllImages(){
      const result = this.store.usersList.find(object => object.id === this.store.selectedMemberInAdmin.id)
      if(result){
        if(result.images){
          const list = []
          for(const [key,value] of Object.entries(result.images)){
            const imageData = {
              id:`${value.id}`,
              image:`${value.image}`
            }
            list.push(imageData)
          }
          this.imageList = list
          console.log('imageList',this.imageList)
        }else{
          this.imageList = []
          console.log('noImage')
        }
      }else{
        this.imageList = []
      }
    },
    deleteUserMessage(data){
      this.$q.dialog({
        dark:true,
        cancel:true,
        message:`${this.store.findUserName(data)} Adlı Kullanıcının Mesajını Siliyorsunuz, İşlem Geri Alınamaz !`,
        title:'Warning'
      }).onOk(() => {
        const db = getDatabase()
        update(ref(db,`discussions/${this.store.selectedDis.id}/chats/${data.id}`),{
          message:`Bu Mesaj Admin Tarafından Silindi.`,
          adminEffect:true,
          removedDate:this.store.currentDateString()
        })
      }).onCancel(() => {
        //
      })
    },
    showUserComments(){
      this.chatShowActive =! this.chatShowActive
      if(this.store.selectedDisCurrent.chats){
        let list = []
        for(const [key,value] of Object.entries(this.store.selectedDisCurrent.chats)){
          const chatData = {
            id:`${value.id}`,
            senderId:`${value.senderId}`,
            message:`${value.message}`,
            date:`${value.fullDate}`
          }
          list.push(chatData)
        }
        list = list.filter(object => object.senderId === this.store.selectedMemberInAdmin.id)
        this.chatList = list
        console.log('chats',this.chatList)
      }
    },
    getUserBlockedDate(){
      const result = this.store.blockListDiscussion.find(object => object.id === this.store.selectedMemberInAdmin.id)
      if(result){
        const message = result.blockedDate ? `${result.blockedDate} Tarihinde Bloke Edildi.` : 'Tarih Alınamadı !'
        return message
      }
    },
    checkBlockedOrNot(){
      const result = this.store.blockList.find(object => object.id === this.store.selectedMemberInAdmin.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkInGroupBlockListOrNot(){
      const result = this.store.blockListDiscussion.some(object => object.id === this.store.selectedMemberInAdmin.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    removeFromBlocksList(){
      const db = getDatabase()
      remove(ref(db,`discussions/${this.store.selectedDis.id}/blocks/${this.store.selectedMemberInAdmin.id}`))
    },
    removeUserMessagesIfBlocked(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`${this.store.selectedMemberInAdmin.name ? this.store.selectedMemberInAdmin.name : this.store.selectedMemberInAdmin.email} Adlı Kullanıcının Mesajlarınıda Silmek İster misiniz ?`
      }).onOk(()=>{
        let list = this.store.selectedDisChats.filter(object => object.senderId === this.store.selectedMemberInAdmin.id)
        if(list.length){
          console.log(list)
          list.forEach(element => {
            const db = getDatabase()
            remove(ref(db,`discussions/${this.store.selectedDisCurrent.id}/chats/${element.id}`))
            list = list.filter(object => object.id !== element.id)
          });
          this.$q.notify({
            type:'negative',
            message:`${this.store.selectedMemberInAdmin.name ? this.store.selectedMemberInAdmin.name : this.store.selectedMemberInAdmin.email} Adlı Kullanıcın Tüm Mesajları Silindi !`,
            icon:'info',
            timeout:700
          })
        }
      }).onCancel(()=>{
        //
      })
    },
    addToGroupBlockList(){
      console.log('ye',this.store.selectedDis.id)
      if(this.checkInGroupBlockListOrNot()){
        this.removeFromBlocksList()
      }else{
        const db = getDatabase()
        set(ref(db,`discussions/${this.store.selectedDis.id}/blocks/${this.store.selectedMemberInAdmin.id}`),{
          id:this.store.selectedMemberInAdmin.id,
          name:this.store.selectedMemberInAdmin.name ? this.store.selectedMemberInAdmin.name : this.store.selectedMemberInAdmin.email,
          blockedDate:this.store.currentDateString()
        })
        this.removeUserMessagesIfBlocked()
      }
    },
    blockUser(){
/*       console.log(this.store.selectedDis)
      if(!this.checkBlockedOrNot()){
        const db = getDatabase()
        set(ref(db,`myBlocks/${this.store.user.id}/${this.store.selectedMemberInAdmin.id}`),{
          id:this.store.selectedMemberInAdmin.id,
          name:this.store.selectedMemberInAdmin.name ? this.store.selectedMemberInAdmin.name : this.store.selectedMemberInAdmin.email,
          blockedDate:this.store.currentDateString()
        })
      }else{
        const db = getDatabase()
        remove(ref(db,`myBlocks/${this.store.user.id}/${this.store.selectedMemberInAdmin.id}`)) // öz blok listem
      } */
      this.addToGroupBlockList()
    },
    checkMe(data){
      if(data.id === this.store.user.id){
        return false
      }else{
        return true
      }
    },
    selectUser(data){
      this.store.selectedMemberInAdmin = data
      this.getSelectedUserAllImages()
      console.log(this.store.selectedMemberInAdmin.id)
    }
  },
  created(){

  },
  watch:{
    members:{
      handler(newValue,oldValue){
        if(newValue){
          this.membersList = newValue
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
