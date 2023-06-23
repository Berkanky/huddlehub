<template>
  <q-dialog
    v-if="this.store.adminPanelDisActive" v-model="this.store.adminPanelDisActive"
    dark :maximized="this.store.avatarActive ? false : true"
    persistent
  >
    <q-card class="bg-dark text-white q-pa-sm" style="margin:0 auto;"
      :style="{'width':this.store.avatarActive ? '1000px' : '100%','min-width':this.store.avatarActive ? '1000px' : '100%'}" >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="this.selectedPageType != '' ? this.goFirstPage() : this.goBack()"></q-btn>
        <q-space></q-space>
        <q-avatar>
          <img
            style="object-fit:cover;"
            :src="this.selectedLocal.image" alt="" v-if="this.selectedLocal.image">
          <q-btn icon="person" round color="dark" v-if="!this.selectedLocal.image"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="row" v-if="!this.selectedPageType">
        <q-card class="col-md-4 col-sm-4 col-12" dark v-for="data in this.options" :key="data.id" style="height:150px;" bordered>
          <q-btn
            v-on:click="selectOption(data)"
            :icon="data.icon" :color="data.color" flat  class="full-width full-height"
          ></q-btn>
        </q-card>
      </q-card-section>
      <q-card-section class="" v-if="this.selectedPageType === 'Members'">
        <discussionAdminMembers
          :members="this.members.length ? this.members : ''"
          v-if="this.selectedPageType === 'Members'"/>
      </q-card-section>
      <q-card-section class="" v-if="this.selectedPageType === 'Reports'">
        <discussionAdminReports
          v-if="this.selectedPageType === 'Reports'"
          :reportedChats="this.reportedChats.length ? this.reportedChats : ''"/>
      </q-card-section>
    </q-card>
    <blockedUsersDiscussion
      :blockedList="this.blockedList.length ? this.blockedList : ''"
      v-if="this.store.discussionBlockedsActive"/>
  </q-dialog>
</template>
<script>
import blockedUsersDiscussion from './blockedUsersDiscussion.vue'
import discussionAdminReports from './discussionAdminReports.vue'
import discussionAdminMembers from './discussionAdminMembers.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    discussionAdminMembers,
    discussionAdminReports,
    blockedUsersDiscussion
  },
  props:['selected','chats'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      reportedChats:[],
      selectedLocal:{},
      blockedList:[],
      members:[],
      selectedPageType:'',
      chatsLocal:[],
      options:[
        {id:1,label:'Members',icon:'groups',color:'white'},
        {id:2,label:'Blockes',icon:'block',color:'red'},
        {id:3,label:'Reports',icon:'flag',color:'orange'}
      ]
    }
  },
  methods:{
    getReportedChats(data){
      this.reportedChats = []
      if(this.chatsLocal.length){
        this.reportedChats = this.chatsLocal.filter(object => object.reports)
        console.log('firstReportedChats',this.reportedChats)
        if(this.reportedChats.length){
          this.selectedPageType = data.label
        }
      }else{
        this.reportedChats = []
      }
    },
    goFirstPage(){
      this.selectedPageType = ''
    },
    getMembers(){
      if(this.selectedLocal.chats){
        const list = []
        for(const [key,value] of Object.entries(this.selectedLocal.chats)){
          const memberData = {
            id:`${value.senderId}`,
            senderName:`${value.senderName}`,
          }
          list.push(memberData)
        }
        this.members = []
        list.forEach(element => {
          const result = this.store.usersList.find(object => object.id === element.id)
          if(result){
            const secondResult = this.members.some(object => object.id === result.id)
            if(!secondResult){
              this.members.push(result)
            }
          }
        });
        console.log('members',this.members)
      }else{
        this.members = []
      }
    },
    selectOption(data){
      if(data.id === 1){
        this.getMembers()
        if(this.members.length){
          this.selectedPageType = data.label
        }else{
          this.$q.notify({
            type:'negative',
            message:`${this.selectedLocal.name} Adlı Tartışma Grubunun Bir Katılımcısı Henüz Yok :()`,
            timeout:700,
            position:'top'
          })
        }
      }else if(data.id === 3){
        if(this.chatsLocal.length){
          this.getReportedChats(data)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Herhangi Bir Mesaj Ve Report Bulunamadı !',
            timeout:700,
            position:'top'
          })
        }
      }else if(data.id === 2){
        this.getBlockedUsers()
        if(this.blockedList.length){
          this.store.discussionBlockedsActive = true
        }
      }
    },
    getBlockedUsers(){
      if(this.selectedLocal.blocks){
        const list = []
        for(const [key,value] of Object.entries(this.selectedLocal.blocks)){
          const memberData = {
            id:`${value.id}`,
            blockedDate:`${value.blockedDate}`,
            name:`${value.name ? value.name : ''}`
          }
          list.push(memberData)
        }
        this.blockedList = list
        console.log('blocks',this.blockedList)
      }else{
        this.$q.notify({
          type:'negative',
          message:'Bloklanan Bir Kullanıcı Bulunamadı !',
          timeout:700,
          position:'bottom'
        })
        this.blockedList = []
      }
    },
    goBack(){
      this.store.adminPanelDisActive = false
    }
  },
  created(){
    this.store.getUsers()
  },
  watch:{
    chats:{
      handler(newValue,oldValue){
        if(newValue){
          this.chatsLocal = newValue
        }
      },
      immediate:true,
      deep:true
    },
    selected:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedLocal = newValue
          console.log('selectedLocal',this.selectedLocal)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>

</style>
