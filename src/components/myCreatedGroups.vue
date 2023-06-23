<template>
  <q-card class="bg-dark" v-if="!checkForAnyGroup()"
  :flat="this.store.avatarActive ? false : true"
  :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'"
  >
    <q-card-section horizontal>
      <q-card-section class="col-9">
        <div class="text-caption text-weight-bold text-white text-capitalize">
          Herhangi Bir Meeting Grubu Oluşturmamışsınız !
        </div>
      </q-card-section>
      <q-card-section class="col-3 text-right">
        <q-btn icon="add_circle" flat color="white" v-on:click="goCreateGroupPage"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
  <q-card
  dark
  v-if="checkForAnyGroup()"
  :flat="this.store.avatarActive ? false : true"
  :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'" class="bg-dark">
  <q-card-section class="row" v-if="this.store.settingsActive">
    <q-btn icon="keyboard_backspace" v-on:click="cancelUpdate" flat color="white"></q-btn>
    <q-space></q-space>
    <q-btn icon="delete_forever" flat color="red" v-on:click="deleteThisGroup"></q-btn>
  </q-card-section>
    <q-card-section v-if="!this.store.settingsActive">
      <q-card flat
        class="bg-dark text-white"
        v-for="data in this.activityGroupsListLocal" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar>
                <img :src="data.image" alt="" v-if="data.image">
                <q-btn v-if="!data.image" icon="person" color="dark" round></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-overline text-weight-bold text-white text-capitalize">
                <q-icon :name="data.icon" :color="data.color" size="20px"></q-icon>
                {{ data.name }}
              </div>
              <div class="text-caption">
                Üye Sayısı - {{ getMemberValue(data) }}
              </div>
              <div class="text-caption">
                İstek - {{ getWaitersValue(data) }}
              </div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-btn icon="settings" :color="data.color" flat v-on:click="goSettings(data)"></q-btn>
            </q-card-section>
          </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section class="bg-dark text-center" style="height:100%;" v-if="this.store.settingsActive">
      <q-avatar size="170px" v-on:click="changeImage">
        <img :src="this.store.selectedGroupForSettings.image" alt="" v-if="this.store.selectedGroupForSettings.image" style="object-fit:cover;" v-on:click="removeImage">
        <q-btn icon="person" color="white" text-color="dark" round v-if="!this.store.selectedGroupForSettings.image" size="xl"></q-btn>
      </q-avatar>
      <div class="text-center" v-if="this.changeImageActive">
        <upload @currentImageData="getcurrentImageData"/>
      </div>
      <div class="text-center">
        <q-btn icon="info" flat color="pink" v-on:click="goGroupActivitiesPage"></q-btn>
      </div>
      <div class="row">
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        v-on:keyup.enter="changeNameGroup"
        v-model="this.store.selectedGroupForSettings.name"
        :label="this.store.selectedGroupForSettings.name ? this.store.selectedGroupForSettings.name : 'Grup Adı Giriniz'">
          <template v-slot:prepend>
            <q-icon name="group"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        type="number"
        v-on:keyup="changeMaxMember"
        v-model.number="this.store.selectedGroupForSettings.maxMember"
        :label="this.store.selectedGroupForSettings.maxMember ? this.store.selectedGroupForSettings.maxMember : 'Maksimum Üye Sayısı Belirleyiniz'">
          <template v-slot:prepend>
            <q-icon name="settings"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        readonly
        :label="this.store.selectedGroupForSettings.adminName ? this.store.selectedGroupForSettings.adminName : 'Admin Adı Belirtilmemiş.'">
          <template v-slot:prepend>
            <q-icon name="supervisor_account"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        readonly dark :label-color="this.store.selectedGroupForSettings.color ? this.store.selectedGroupForSettings.color : 'white'"
        :label="this.store.selectedGroupForSettings.optionName ? this.store.selectedGroupForSettings.optionName: 'Mood Girilmemiş.'">
          <template v-slot:prepend>
            <q-icon name="mood" :color="this.store.selectedGroupForSettings.color ? this.store.selectedGroupForSettings.color : 'white'"></q-icon>
          </template>
        </q-input>

        <q-input
        :label="this.store.selectedGroupForSettings.groupExplain ? this.store.selectedGroupForSettings.groupExplain : 'Grup Açıklaması Giriniz'"
        class="col-12" filled type="textarea" dark color="white" v-model="this.store.selectedGroupForSettings.groupExplain" v-on:keyup.enter="setGroupExplain">
          <template v-slot:prepend v-if="this.store.selectedGroupForSettings.groupExplain">
            <q-btn icon="remove" color="dark" v-on:click="this.store.selectedGroupForSettings.groupExplain = ''"></q-btn>
          </template>
        </q-input>

        <div class="col-4">
          <q-btn
          v-on:click="showMembers"
          icon="groups" class="q-pa-md"
          no-caps flat color="white"
          :label="`Aktif Üye - ${getActiveMemberValue()}`"></q-btn>
        </div>
        <div class="col-4">
          <q-btn
            v-on:click="showWaiters"
            icon="groups" label="İstekler" class="q-pa-md"
            flat color="white" no-caps :icon-right="this.store.selectedGroupForSettings.waiters ? 'expand_more' : 'exposure_zero'"></q-btn>
        </div>
        <div class="col-4">
          <q-btn
          class="q-pa-md"
          icon="groups" flat color="white" no-caps label="Points"
          :icon-right="this.store.selectedGroupForSettings.pointers ? 'expand_more' : 'exposure_zero'" v-on:click="showPointers"></q-btn>
        </div>
      </div>
      <div class="" v-if="this.waiterActive">
        <q-card class="bg-transparent text-white" v-for="data in this.waitersList" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-2">
              <q-avatar >
                <img :src="getImageWaiter(data)" alt="" style="object-fit:Cover;" v-on:Click="selectUserForDetail(data)">
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2 text-weight-bold">
                {{ getNameWaiter(data) }}
              </div>
              <div class="text-caption">
                {{ getInfoWaiter(data) }}
              </div>
            </q-card-section>
            <q-card-section class="col-4 text-right">
              <q-fab color="dark" text-color="white" icon="keyboard_arrow_left" direction="left">
                <q-btn icon="remove"  color="red" v-on:click="removeUser(data)" round></q-btn>
                <q-btn icon="check" color="green"  v-on:click="confirm(data)" round></q-btn>
              </q-fab>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="" v-if="this.memberActive">
        <q-card class="bg-transparent text-white" v-for="data in this.memberList" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-2">
              <q-avatar>
                <img :src="getImageWaiter(data)" alt="" style="object-fit:cover;" v-on:click="selectUserForDetail(data)">
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2 text-weight-bold">
                {{ getNameWaiter(data) }}
              </div>
              <div class="text-caption">
                {{ getInfoWaiter(data) }}
              </div>
            </q-card-section>
            <q-card-section class="col-4 text-right">
              <q-fab color="dark" text-color="white" icon="keyboard_arrow_left" direction="left">
                <q-btn icon="remove"  color="red" v-on:click="kickUser(data)"
                round v-if="checkAdminWho(data)"></q-btn>
              </q-fab>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="" v-if="this.pointersActive">
        <q-card class="bg-transparent text-white" v-for="data in this.pointersList" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-2">
              <q-avatar>
                <img :src="getImageWaiter(data)" alt="" style="object-fit:cover;" v-on:click="selectUserForDetail(data)">
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2 text-weight-bold">
                {{ getNameWaiter(data) }}
              </div>
              <div class="text-caption">
                {{ getInfoWaiter(data) }}
              </div>
            </q-card-section>
            <q-card-section class="col-4 text-right">
              <q-btn flat color="white" :label="data.point + 'P'"></q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="bg-transparent text-white">
          <q-card-section class="text-right">
            <div class="text-caption text-weight-bold text-white">
              Total <q-icon name="fa-thin fa-equals fa-spin fa-md" size="md"></q-icon> {{ sumEachPoint() }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-card-section v-if="checkMemberValue()">
        <q-btn icon="remove" color="red" flat label="End Group Meet" v-on:click="endTheMeeting" icon-right="warning"></q-btn>
      </q-card-section>
    </q-card-section>
    <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
  </q-card>
</template>

<script>
import selectedUserDetailDialog from "./selectedUserDetailDialog.vue";
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database";
import upload from './upload.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload,
    selectedUserDetailDialog
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
      changeImageActive:false,
      waitersList:[],
      sharedLocationList:[],
      memberList:[],
      memberActive:false,
      waiterActive:false,
      pointersActive:false,
      pointersList:[]
    }
  },
  methods:{
    selectUserForDetail(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    goGroupActivitiesPage(){
      this.store.goGroupChatFromSettingsActive = true
      this.store.goGroupChatFromSettings = this.store.selectedGroupForSettings
      this.$router.push({path:'/groupMeets'})
    },
    deleteThisGroup(){
      console.log('this.store.selectedGroupForSettings',this.store.selectedGroupForSettings)
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Grubu Silmek İstediğinizden Emin misiniz ?',
        cancel:true
      }).onOk(() =>{
        this.store.forDeleteSelectGroup = this.store.selectedGroupForSettings
        this.store.settingsActive = false
      }).onCancel(() =>{
        //
      })
    },
    goCreateGroupPage(){
      this.store.selectedOption = 'myFav'
    },
    checkForAnyGroup(){
      if(this.activityGroupsListLocal.length){
        return true
      }else{
        return false
      }
    },
    sumEachPoint() {
      if(this.pointersList.length){
        let sum = 0;
        this.pointersList.forEach(element => {
          sum += Number(element.point);
        });
        return sum;
      }else{
        return 0
      }
    },
    getPointsList(){
      if(this.store.selectedGroupForSettings.id){
        if(this.store.selectedGroupForSettings.pointers){
          const list = []
          for(const [key,value] of Object.entries(this.store.selectedGroupForSettings.pointers)){
            const memberData = {
              id:`${value.id}`,
              email:`${value.email}`,
              fullDate:`${value.fullDate}`,
              groupId:`${value.groupId}`,
              name:`${value.name}`,
              point:`${value.point}`
            }
            list.push(memberData)
          }
          this.pointersList = list
          console.log('pointersList',this.pointersList)
        }else{
          this.pointersList = []
        }
      }
    },
    showPointers(){
      this.pointersActive =! this.pointersActive
      this.waiterActive = false
      this.memberActive = false
    },
    checkMemberValue(){
      if(this.getActiveMemberValue() > 1){
        return true
      }else{
        return false
      }
    },
    sendToNotifyUsers(element){
      const db = getDatabase()
      set(ref(db,`pointNotify/${element.id}/${this.store.selectedGroupForSettings.id}`),{
        adminId:this.store.selectedGroupForSettings.adminId,
        endDate:this.store.currentDateString(),
        message:`${this.store.selectedGroupForSettings.adminName ? this.store.selectedGroupForSettings.adminName : this.store.selectedGroupForSettings.adminEmail} Kişiyi ${this.store.selectedGroupForSettings.name ? this.store.selectedGroupForSettings.name : this.store.selectedGroupForSettings.optionName} Adlı Grup Koordinasyonu İçin Puanlayınız !`,
        status:false,
        memberId:element.id,
        meetFaceToFace:false,
        moreDetail:'',
        groupName:this.store.selectedGroupForSettings.name,
        groupOptionName:this.store.selectedGroupForSettings.optionName,
        groupİcon:this.store.selectedGroupForSettings.icon,
        groupColor:this.store.selectedGroupForSettings.color,
        groupId:this.store.selectedGroupForSettings.id,
        groupImage:this.store.selectedGroupForSettings.image
      })
      this.memberList = this.memberList.filter(object => object.id !== element.id)
    },
    endTheMeeting(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`${this.store.selectedGroupForSettings.name ? this.store.selectedGroupForSettings.name : this.store.selectedGroupForSettings.optionName} Adlı Grup Buluşmasını Sonlandırmak İstediğinizden Emin misiniz ?`,
        cancel:true
      }).onOk(() => {
        this.memberList.forEach(element => {
          if(element.id !== this.store.selectedGroupForSettings.adminId){
            const db = getDatabase()
            remove(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}/members/${element.id}`))
            this.sendToNotifyUsers(element)
          }
        });
      }).onCancel(() => {
        //
      })
    },
    getMemberValue(data){
      if(data.members){
        const number = Object.entries(data.members).length
        return number
      }else{
        return 0
      }
    },
    getActiveMemberValue(){
      if(this.store.selectedGroupForSettings.members){
        const length = Object.entries(this.store.selectedGroupForSettings.members).length
        return length
      }else{
        return 0
      }
    },
    getSharedLocations(){
      if(this.store.selectedGroupForSettings.id){
        if(this.store.selectedGroupForSettings.sharedLocations){
          const list = []
          for(const [key,value] of Object.entries(this.store.selectedGroupForSettings.sharedLocations)){
            const userData = {
              id:`${value.id}`,
              lat:`${value.lat}`,
              lng:`${value.lng}`
            }
            list.push(userData)
          }
          this.sharedLocationList = list
          console.log('sharedLoaction',this.sharedLocationList)
        }
      }
    },
    removeLocationUser(data){
      const result = this.sharedLocationList.find(object => object.id === data.id)
      if(result){
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}/sharedLocations/${data.id}`))
        this.sharedLocationList = this.sharedLocationList.filter(object => object.id !== data.id)
      }
    },
    kickUser(data){
      const element = data
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}/members/${data.id}`))
      this.sendToNotifyUsers(element)
      this.removeLocationUser(data)
      //this.memberList = this.memberList.filter(object => object.id !== data.id)
    },
    checkAdminWho(data){
      if(this.store.user.id !== data.id){
        return true
      }else{
        return false
      }
    },
    getMembers(){
      if(this.store.selectedGroupForSettings.id){
        if(this.store.selectedGroupForSettings.members){
          this.memberList = []
          const memberList = []
            for(const [key,value] of Object.entries(this.store.selectedGroupForSettings.members)){
              const memberData = {
                id:`${value.id}`,
                date:`${value.date}`,
                email:`${value.email}`,
                name:`${value.name ? value.name : ''}`
              }
              memberList.push(memberData)
            }
            this.memberList = memberList
            console.log('memberList',this.memberList)
        }else{
          this.memberList = []
        }
      }
    },
    showMembers(){
      this.pointersActive = false
      this.waiterActive = false
      this.memberActive = true
    },
    removeUser(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}/waiters/${data.id}`))
      this.waitersList = this.waitersList.filter(object => object.id !== data.id)
    },
    checkMaxMemberLength(){
      if(this.store.selectedGroupForSettings.maxMember){
        const maxNumber = this.store.selectedGroupForSettings.maxMember
        if(this.store.selectedGroupForSettings.members){
          const memberLength = Object.entries(this.store.selectedGroupForSettings.members).length
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
    confirm(data){
      if(this.checkMaxMemberLength()){
        if(this.store.usersList.length){
          const result = this.store.usersList.find(object => object.id === data.id)
          if(result){
            const db = getDatabase()
            set(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}/members/${data.id}`),{
              id:data.id,
              email:data.email,
              name:data.name ? data.name : '',
              date:this.store.currentDateString(),
            })
            this.removeUser(data)
          }
        }
      }else{
        this.$q.notify({
          type:'negative',
          message:'Daha Fazla Üye Alamazsınız, Maksimum Üye Sayısını Ayarlayın !',
          position:'bottom',
          timeout:700
        })
      }
    },
    getInfoWaiter(data){
      if(this.store.usersList.length){
        const result = this.store.usersList.find(object => object.id === data.id)
        if(result){
          if(result.info){
            const name = result.info
            return name
          }else{
            const email = 'Meslek Belirtilmemiş.'
            return email
          }
        }
      }
    },
    getNameWaiter(data){
      if(this.store.usersList.length){
        const result = this.store.usersList.find(object => object.id === data.id)
        if(result){
          if(result.id === this.store.user.id){
            if(result.name){
              const name = 'Siz'
              return name
            }else{
              const email = result.email
              return email
            }
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
      }
    },
    getImageWaiter(data){
      if(this.store.usersList.length){
        const result = this.store.usersList.find(object => object.id === data.id)
        if(result){
          if(result.image){
            const image = result.image
            return image
          }
        }
      }
    },
    getWaitersValue(data){
      if(data.waiters){
        const length = Object.entries(data.waiters).length
        return length
      }else{
        return 0
      }
    },
    getWaiters(){
      if(this.store.selectedGroupForSettings.id){
        if(this.store.selectedGroupForSettings.waiters){
          this.waitersList = []
          const waitersList = []
          for(const [key,value] of Object.entries(this.store.selectedGroupForSettings.waiters)){
            const memberData = {
              id:`${value.id}`,
              date:`${value.date}`,
              email:`${value.email}`
            }
            waitersList.push(memberData)
          }
          this.waitersList = waitersList
          console.log('waitersList',this.waitersList)
        }else{
          this.waitersList = []
        }
      }
    },
    showWaiters(){
      this.memberActive = false
      this.waiterActive = true
      this.pointersActive = false
    },
    changeMaxMember(){
      if(this.store.selectedGroupForSettings.members){
        const lengthMember = Object.entries(this.store.selectedGroupForSettings.members).length
        if(lengthMember <= this.store.selectedGroupForSettings.maxMember){
          const db = getDatabase()
          update(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}`),{
            maxMember:this.store.selectedGroupForSettings.maxMember
          })
          this.$q.notify({
            type:'positive',
            icon:'check',
            timeout:700,
            position:'bottom'
          })
        }else{
          this.$q.notify({
            type:'negative',
            message:'Maksimum Üye Değeri Mevcut Üye Sayısından Fazla Olmalı !',
            timeout:700,
            position:'bottom'
          })
        }
      }
    },
    setGroupExplain(){
      const db = getDatabase()
      update(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}`),{
        groupExplain:this.store.selectedGroupForSettings.groupExplain
      })
    },
    changeNameGroup(){
      const db = getDatabase()
      update(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}`),{
        name:this.store.selectedGroupForSettings.name
      })
    },
    cancelUpdate(){
      this.store.settingsActive = false
      this.store.selectedGroupForSettings = {}
    },
    changeImage(){
      this.changeImageActive =! this.changeImageActive
    },
    removeImage(){
      this.store.selectedGroupForSettings.image = ''
    },
    getcurrentImageData(data){
      if(data){
        this.store.selectedGroupForSettings.image = data.image
        const db = getDatabase()
        update(ref(db,`activityGroups/${this.store.selectedGroupForSettings.id}`),{
          image:this.store.selectedGroupForSettings.image ? this.store.selectedGroupForSettings.image : ''
        })
        this.changeImageActive = false
      }
    },
    goSettings(data){
      console.log('selectedGroupForSettings',data)
      this.store.selectedGroupForSettings = data
      this.store.settingsActive = true
    },
    filterForActivityGroups(){
      if(this.activityGroupsListLocal.length){
        this.activityGroupsListLocal = this.activityGroupsListLocal.filter(object => object.adminId === this.store.user.id)
        console.log('filteredVersion',this.activityGroupsListLocal)
      }
    },
    getDynamic(){
      const db = getDatabase();
      const dbRef = ref(db, `activityGroups/${this.store.selectedGroupForSettings.id}`);
      onValue(dbRef, (snapshot) => {
        this.store.selectedGroupForSettings = snapshot.val();
        console.log('selectedGroupForSettings',this.store.selectedGroupForSettings)
        this.getWaiters()
        this.getMembers()
        this.getPointsList()
        this.getSharedLocations()
      });
    }
  },
  created(){
  },
  mounted(){
    this.store.selectedGroupForSettings = {}
  },
  beforeMount(){
    this.store.getActivityGroups()
    this.store.getUsers()
  },
  watch:{
    'store.fromOtherPageSelectedGroup':{
      handler(newValue,oldValue){
        if(newValue.id){
          const data = newValue
          setTimeout(() => {
            this.goSettings(data)
            setTimeout(() => {
              this.store.fromOtherPageSelectedGroup = {} //profilden gruplara gidildiğinde settingse atlamasın diye
            },150)
          },150)
        }
      },
      immediate:true,
      deep:true
    },
    'store.forDeleteSelectGroup':{
      handler(newValue,oldValue){
        if(newValue.id && !this.store.settingsActive){
          const db = getDatabase()
          remove(ref(db,`activityGroups/${this.store.forDeleteSelectGroup.id}`))
          this.activityGroupsListLocal = this.activityGroupsListLocal.filter(object => object.id !== this.store.forDeleteSelectGroup.id)
          this.$q.notify({
            type:'negative',
            messsage:'Grup Silindi',
            timeout:700,
            position:'bottom'
          })
          this.store.selectedGroupForSettings = {}
          this.store.forDeleteSelectGroup = {}
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedGroupForSettings.id':function(){
      if(this.store.selectedGroupForSettings.id){
        this.getDynamic()
      }
    },
    'store.activityGroupsList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.activityGroupsListLocal = newValue
          console.log('activityGroupsListLocal',this.activityGroupsListLocal)
          this.filterForActivityGroups()
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){

        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
  .forDesktop{
    width:50%;
    margin:0% auto;
  }
</style>
