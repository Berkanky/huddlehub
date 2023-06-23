<template>
  <q-card class="bg-transparent">
    <q-card-section class="text-center">
      <q-avatar size="150px" rounded>
        <img :src="this.store.selectedGroupForDetail.image" alt="" v-if="this.store.selectedGroupForDetail.image">
        <q-btn icon="person" color="dark" round v-if="!this.store.selectedGroupForDetail.image" size="xl"></q-btn>
      </q-avatar>
      <div class="text-overline text-weight-bold text-capitalize q-mt-sm">
        <q-icon name="groups" size="20px" color="pink"></q-icon>
        {{ this.store.selectedGroupForDetail.name }}
      </div>
      <div class="text-caption text-weight-bold text-grey-6">
        <q-icon :name="this.store.selectedGroupForDetail.icon" :color="this.store.selectedGroupForDetail.color" size="17px"></q-icon>
        {{ this.store.selectedGroupForDetail.optionName }}
      </div>
      <div class="text-overline text-weight-bold text-grey-6">
       {{ getMembers() }} Katılımcı
      </div>
    </q-card-section>
    <q-separator color="grey-4" size="5px"></q-separator>
    <q-card-section>
      <div class="text-overline text-weight-bold text-grey-6">
        <q-icon name="groups" color="grey-6" size="20px"></q-icon> Oluşturan : {{ findCreater() }}
      </div>
    </q-card-section>
    <q-separator color="grey-4" size="5px"></q-separator>
    <q-card-section>
      <q-card-section horizontal>
        <div class="text-overline text-weight-bold text-grey-6">
          {{ getMembers() }} Katılımcı
        </div>
        <q-space></q-space>
        <q-btn icon="filter_list_off" v-if="this.filterActive" v-on:Click="clearFilter" flat color="pink"></q-btn>
        <q-btn icon="search" flat color="grey-6" v-if="!this.filterActive">
          <q-popup-edit v-model="this.searchUser" class="bg-dark text-white" v-slot="scope">
          <q-input dark label="Kullanıcı Ara" color="white" v-model="this.searchUser" dense autofocus counter @keyup.enter="findUser">
            <template v-slot:append>
              <q-btn icon="search" v-on:click="findUser" round/>
            </template>
          </q-input>
        </q-popup-edit>
        </q-btn>
      </q-card-section>
      <q-card
          style="margin:0 auto;"
          bordered
          v-on:click="goChat(data)"
          v-for="data in this.memberList" :key="data.id" class="bg-transparent"
          :style="{'width':this.store.avatarActive ? '70%' : '100%'}">
          <q-card-section horizontal>
            <q-avatar size="80px" style="">
              <img :src="data.image" alt="" v-if="data.image" style="object-fit:Cover;">
              <q-btn icon="person" color="dark" size="xl" v-if="!data.image"></q-btn>
            </q-avatar>
            <q-card-section class="">
              <div class="text-grey-7  text-capitalize text-weight-bold text-caption">
                <q-icon name="person" size="17px"></q-icon>
                {{ findUserName(data) }}
              </div>
              <div class="text-caption text-weight-bold text-grey-6">
                <q-icon name="work" size="17px"></q-icon>
                {{ data.info ? data.info : 'Durum Belirtilmemiş' }}
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-section>
              <q-btn :icon="data.id !== this.store.selectedGroupForDetail.adminId ? 'chevron_right' : 'admin_panel_settings'" flat color="grey-7"></q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
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
      selectedGroupForDetail:{},
      memberList:[],
      searchUser:'',
      pureList:[],
      filterActive:false
    }
  },
  methods:{
    findUserName(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.id === this.store.user.id){
          const name = 'Siz'
          return name
        }else{
          if(result.name){
            const name = result.name
            return name
          }else{
            const email = result.email
            return email
          }
        }
      }
    },
    goChat(data){
      this.$emit('goChatUser',data)
    },
    clearFilter(){
      this.memberList = this.pureList
      this.filterActive = false
    },
    findUser(){
      this.memberList = this.pureList
      if(this.searchUser){
        const result = this.memberList.filter(object => (object.name.toLowerCase()).includes(this.searchUser.toLowerCase()) || (object.email.toLowerCase()).includes(this.searchUser.toLowerCase()))
        if(result.length){
          this.memberList = result
          this.filterActive = true
          console.log('filter',this.memberList)
        }else{
          this.$q.notify({
            type:'negative',
            message:`${this.searchUser} Adlı Kullanıcı Bulunamadı !`,
            timeout:700,
            position:'bottom'
          })
          this.searchUser = ''
        }
      }
    },
    getAllMembers(){
      if(this.store.selectedGroupForDetail.members){
        const list = []
        for(const [key,value] of Object.entries(this.store.selectedGroupForDetail.members)){
          const memberData = {
            id:`${value.id}`,
          }
          list.push(memberData)
        }
        this.memberList = []
        this.pureList =[]
        list.forEach(element => {
          const result = this.store.usersList.find(object => object.id === element.id)
          if(result){
            this.memberList.push(result)
            this.pureList.push(result)
          }
        });
        console.log('memberList',this.memberList)
      }
    },
    findCreater(){
      const result = this.store.usersList.find(object => object.id === this.store.selectedGroupForDetail.adminId)
      if(result){
        if(result.id === this.store.user.id){
          const name = 'Siz'
          return name
        }else{
          const name = result.name
          return name
        }
      }
    },
    getMembers(){
      if(this.store.selectedGroupForDetail.members){
        const memberValue = Object.entries(this.store.selectedGroupForDetail.members).length
        return memberValue
      }else{
        return 0
      }
    },
    getGroupInfo(){
      const db = getDatabase();
      const dbRef = ref(db, `activityGroups/${this.store.selectedGroupForDetail.id}`);
      onValue(dbRef, (snapshot) => {
        this.store.selectedGroupForDetail = snapshot.val();
        console.log('selectedGroupForDetail',this.selectedGroupForDetail)
        this.getAllMembers()
      });
    },
  },
  created(){
    this.getGroupInfo()
  },
  beforeMount(){
    this.store.getUsers()
  },
  watch:{
    'store.selectedGroupForDetail.id':{
      handler(newValue,oldValue){
        if(newValue){
          console.log('finded')

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
