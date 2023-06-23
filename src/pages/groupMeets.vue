<template>
  <q-page class="flex-column" :class="this.store.avatarActive ? 'bg-grey-9' : 'bg-dark'">
    <div :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'">
      <div class="text-right">
        <q-btn icon="search" flat color="white" v-on:click="searchButton" v-if="!this.store.filterOnActive"></q-btn>
        <q-btn
          :icon="this.store.filterOnActive ? 'filter_list_off' : 'filter_list'" class="q-ma-md" color="pink"
          push glossy size="sm"
          v-on:click="this.store.filterOnActive ? this.filterCancel() : this.filterList()"></q-btn>
      </div>
      <q-intersection
        ref="groupListRef"
        v-if="!this.store.filterOnActive"
        v-for="(data,index) in this.activityGroupsListLocal" :key="index"
        :id="data.id"
        :active="data.id === activeId"
        once
      >
        <q-card
          class="" dark flat bordered>
      <q-card-section horizontal>
        <q-card-section class="col-7">
          <div class="text-overline">
            <q-icon :name="data.icon" :color="data.color" size="17px" class="q-mr-sm"></q-icon>
            {{ data.optionName }}
          </div>
          <div class="text-subtitle2 q-mt-sm q-mb-xs">{{data.name ? data.name : ''}}</div>
          <div class="text-caption text-grey text-weight-bold">
            {{ data.groupExplain ? data.groupExplain : 'Bir Açıklama Girilmemiş !' }}
          </div>
          <div class="text-caption text-grey-6 text-weight-bold q-mt-md">
            Maks Üye : {{ data.maxMember }}
          </div>
          <div class="text-caption text-grey-6 text-weight-bold">
            Aktif Üye : {{ activeMember(data) }}
          </div>
          <div class="text-caption text-grey-5 text-weight-bold q-mt-sm q-pa-sm">
            <q-btn
              v-on:click="showThisAdminDetail(data)"
              icon="person" flat round :color="checkAdminFriendBoolean(data) ? data.color : 'white'"
              size="sm">
              <q-tooltip class="bg-red" :offset="[10, 10]">
                {{ checkAdminFriendOrNot(data) }}
              </q-tooltip>
            </q-btn>
            {{ findCreater(data) }}
          </div>
        </q-card-section>
        <q-card-section class="col flex flex-center">
          <q-img
            loading="lazy"
            spinner-color="white"
            v-if="data.image"
            style="height:150px;"
            class="rounded-borders"
            :src="data.image"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-btn
          :color="checkInSavedsOrNot(data) ? data.color : 'white'"
          v-on:click="checkInSavedsOrNot(data) ? removeMySavedGroups(data) : addMySavedGroups(data)"
          flat
          :icon="checkInSavedsOrNot(data) ? 'bookmark_add': 'bookmark_remove'">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="bg-pink text-white">
            <strong>{{ findSavedDate(data) }}</strong>
            <q-icon :name="checkInSavedsOrNot(data) ? 'bookmark_added' : 'bookmark_add'"></q-icon>
          </q-tooltip>
          </q-btn>
        <q-space></q-space>
        <q-btn flat round icon="event" v-on:click="goGroupActivitiesPage(data)" v-if="checkInOrNot(data)">
          <q-badge :color="data.color" rounded floating  v-if="checkIfAnCurrentActivity(data)"/>
        </q-btn>
        <q-btn
            v-if="!checkInOrNot(data)&&!checkWaiterList(data)"
            icon="join_right" flat color="pink" v-on:click="sendRequest(data)"></q-btn>
        <q-spinner-cube
          size="sm"
          color="pink"
          v-if="checkWaiterList(data)&&!checkInOrNot(data)"
          v-on:click="cancelProcess(data)"
        />
        <q-btn icon="chat" v-if="checkInOrNot(data)&&!checkWaiterList(data)" flat color="white" v-on:click="goGroupChat(data)"></q-btn>
      </q-card-section>
    </q-card>
      </q-intersection>
    <q-intersection
    once
    :id="data.id"
    v-if="this.store.filterOnActive"
    v-for="(data,index) in this.store.filteredActivityGroupList" :key="index"
    >
    <q-card
    class="" dark flat bordered >
      <q-card-section horizontal>
        <q-card-section class="col-6 q-pt-xs">
          <div class="text-overline">
            <q-icon :name="data.icon" :color="data.color" size="17px" class="q-mr-sm"></q-icon>
            {{ data.optionName }}
          </div>
          <div class="text-subtitle2 q-mt-sm q-mb-xs">{{data.name ? data.name : ''}}</div>
          <div class="text-caption text-grey text-weight-bold">
            {{ data.groupExplain ? data.groupExplain : 'Bir Açıklama Girilmemiş !' }}
          </div>
          <div class="text-caption text-grey-6 text-weight-bold q-mt-md">
            Maks Üye : {{ data.maxMember }}
          </div>
          <div class="text-caption text-grey-6 text-weight-bold">
            Aktif Üye : {{ activeMember(data) }}
          </div>
          <div class="text-caption text-grey-5 text-weight-bold q-mt-sm q-pa-sm">
            <q-btn
              v-on:click="showThisAdminDetail(data)"
              icon="person" flat round :color="checkAdminFriendBoolean(data) ? data.color : 'white'" size="sm">
              <q-tooltip class="bg-red" :offset="[10, 10]">
                {{ checkAdminFriendOrNot(data) }}
              </q-tooltip>
            </q-btn>
            {{ findCreater(data) }}
          </div>
        </q-card-section>
        <q-card-section class="col flex flex-center">
          <q-img
            loading="lazy"
            spinner-color="white"
            v-if="data.image"
            style="height:150px;"
            class="rounded-borders"
            :src="data.image"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-btn
          :color="checkInSavedsOrNot(data) ? data.color : 'white'"
          v-on:click="checkInSavedsOrNot(data) ? removeMySavedGroups(data) : addMySavedGroups(data)"
          flat
          :icon="checkInSavedsOrNot(data) ? 'bookmark_add': 'bookmark_remove'">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="bg-pink text-white">
            <strong>{{ findSavedDate(data) }}</strong>
            <q-icon :name="checkInSavedsOrNot(data) ? 'bookmark_added' : 'bookmark_add'"></q-icon>
          </q-tooltip>
          </q-btn>
        <q-space></q-space>
        <q-btn flat round icon="event" v-on:click="goGroupActivitiesPage(data)" v-if="checkInOrNot(data)">
          <q-badge :color="data.color" rounded floating  v-if="checkIfAnCurrentActivity(data)"/>
        </q-btn>
        <q-btn
            v-if="!checkInOrNot(data)&&!checkWaiterList(data)"
            icon="join_right" flat color="pink" v-on:click="sendRequest(data)"></q-btn>
        <q-spinner-cube
          size="sm"
          color="pink"
          v-if="checkWaiterList(data)&&!checkInOrNot(data)"
          v-on:click="cancelProcess(data)"
        />
        <q-btn icon="chat" v-if="checkInOrNot(data)&&!checkWaiterList(data)" flat color="white" v-on:click="goGroupChat(data)"></q-btn>
      </q-card-section>
    </q-card>
  </q-intersection>
    </div>
    <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
    <filterGroupMeets v-if="this.store.filterGroupMeetActive"/>
    <notifyComp v-if="this.store.notifyListActive"/>
    <findUserGroups v-if="this.store.searchButtonActive"/>
  </q-page>
</template>

<script>
import findUserGroups from '../components/findUserGroups.vue'
import selectedUserDetailDialog from "src/components/selectedUserDetailDialog.vue";
import groupChatComponent from "src/components/groupChatComponent.vue";
import filterGroupMeets from "src/components/filterGroupMeets.vue";
import notifyComp from "src/components/notifyComp.vue";
import { getDatabase, ref, set, update, remove, onValue } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    selectedUserDetailDialog,
    notifyComp,
    filterGroupMeets,
    groupChatComponent,
    findUserGroups
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      activityGroupsListLocal:[],
    }
  },
  methods:{
    checkIfAnCurrentActivity(data){
      if(data.currentGroupActivity){
        return true
      }else{
        return false
      }
    },
    searchButton(){
      this.store.searchButtonActive = true
    },
    showThisAdminDetail(data){
      const result = this.store.usersList.find(object => object.id === data.adminId)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    checkAdminFriendBoolean(data){
      const result = this.store.friendList.find(object => object.id === data.adminId)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkAdminFriendOrNot(data){
      const result = this.store.friendList.find(object => object.id === data.adminId)
      if(result){
        const name = result.name ? result.name : result.email
        const message = name + ' ' + 'İle Arkadaşsınız.'
        return message
      }else{
        const message = 'Arkadaş Değilsiniz !'
        return message
      }
    },
    findCreater(data){
      const result = this.store.usersList.find(object => object.id === data.adminId)
      if(result){
        const name = result.name ? result.name : result.email
        const message = name + ' ' + 'Tarafından Oluşturuldu.'
        return message
      }else{
        const ınfo = 'Bulunamadı'
        return  ınfo
      }
    },
    addMySavedGroups(data){
      const db = getDatabase()
      set(ref(db,`mySavedGroups/${this.store.user.id}/${data.id}`),{
        id:data.id,
        date:Date.now(),
        savedDate:this.store.currentDateString()
      })
      //this.store.savedGroupsList.push(data)
      console.log('after add button',this.store.savedGroupsList)
    },
    removeMySavedGroups(data){
      const db = getDatabase()
      remove(ref(db,`mySavedGroups/${this.store.user.id}/${data.id}`))
      this.store.savedGroupsList = this.store.savedGroupsList.filter(object => object.id !== data.id)
    },
    findSavedDate(data){
      if(this.checkInSavedsOrNot(data) === true){
        const result = this.store.savedGroupsList.find(object => object.id === data.id)
        if(result.savedDate){
          const savedDate  = result.savedDate
          return savedDate
        }else{
          const ınfo = 'Kaydedilmemiş !'
          return ınfo
      }
      }else{
        const ınfo = 'Kaydedilmemiş !'
        return ınfo
      }
    },
    checkInSavedsOrNot(data){
      const result = this.store.savedGroupsList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkMaxMemberLength(data){
      if(data.maxMember){
        const maxNumber = data.maxMember
        if(data.members){
          const memberLength = Object.entries(data.members).length
          if(memberLength < maxNumber){
            return true
          }else{
            return false
          }
        }else{
          return true
        }
      }
    },
    goGroupActivitiesPage(data){
      console.log(data)
      if(data.members){
        const keys = Object.keys(data.members);
        const result = keys.find(key => data.members[key].id === this.store.user.id);
        if (result) {
          this.$router.push({name:`groupActivities`,params:{id:data.id}})
        } else {
          console.log('none');
        }
      }
    },
    filterCancel(){
      this.store.filterOnActive = false
      this.store.filteredActivityGroupList = []
    },
    filterList(){
      this.store.filterGroupMeetActive = true
    },
    goGroupChat(data){
      console.log(data)
      this.store.selectedGroupForChat = data
      this.store.groupChatActive = true
      console.log(this.store.selectedGroupForChat)
      this.$router.push({name:'chat',params:{selectedGroupForChat:data}})
    },
    cancelProcess(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${data.id}/waiters/${this.store.user.id}`))
    },
    sendRequest(data){
      if(this.checkMaxMemberLength(data)){
        const db = getDatabase()
        set(ref(db,`activityGroups/${data.id}/waiters/${this.store.user.id}`),{
          id:this.store.user.id,
          date:this.store.currentDateString(),
          email:this.store.user.email
        })
      }else{
        this.$q.notify({
          type:'negative',
          message:'Grup Kapasitesi Full',
          timeout:700,
          position:'bottom'
        })
        console.log('yo')
      }
    },
    checkWaiterList(data){
      if(data.waiters){
        const memberList = []
        for(const [key,value] of Object.entries(data.waiters)){
          const memberData = {
            id:`${value.id}`,
          }
          memberList.push(memberData)
        }
        const result = memberList.find(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
      }
    },
    checkInOrNot(data){
      if(data.members){
        const memberList = []
        for(const [key,value] of Object.entries(data.members)){
          const memberData = {
            id:`${value.id}`,
          }
          memberList.push(memberData)
        }
        const result = memberList.find(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
      }
    },
    activeMember(data){
      if(data.members){
        const length = Object.entries(data.members).length
        return length
      }else{
        return 0
      }
    },
    firstLoadPage(){
      this.$q.loading.show()
      setTimeout(() => {
        if(!this.store.activityGroupsList.length){
          this.$q.loading.hide()
          this.$q.notify({
            type:'negative',
            position:'top',
            timeout:700,
            message:'Sayfa Yüklenirken Hata Oluştu ! Tekrar Deneyiniz.'
          })
        }
      },10000)
    }
  },
  beforeMount(){
    this.firstLoadPage()
    this.store.getActivityGroups()
  },
  created(){
  },
  mounted(){

  },
  watch:{
    activityGroupsListLocal:{
      handler(newValue,oldValue){
        if(newValue.length){
          this.$q.loading.hide()
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMySavedGroups()
          this.store.getMyFriendList()
        }
      },
      immediate:true,
      deep:true
    },
    'store.goGroupChatFromSettingsActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          const data = this.store.goGroupChatFromSettings
          setTimeout(() => {
            this.goGroupActivitiesPage(data)
            setTimeout(() => {
              this.store.goGroupChatFromSettings = {}
              this.store.goGroupChatFromSettingsActive = false
            },100)
          },100)
        }
      },
      immediate:true,
      deep:true
    },
    'store.activityGroupsList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.activityGroupsListLocal = newValue
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
  .forMobile{

  }
  .forDesktop{
    width:35%;
    margin:0 auto;
  }
</style>
