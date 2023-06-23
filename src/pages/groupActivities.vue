<template>
  <q-page class="flex-column bg-dark">
    <q-card flat
      :style="{'width':this.widthOptions(),'margin':this.marginOptions(),'height':this.store.fullScreenMapActive ? '750px' : `${this.mouseDirectives.position.top}px`}"
      class="bg-dark">
      <l-map ref="map"
          :key="mapKey"
          style="width:100%;"
          :style="{'height':this.store.fullScreenMapActive ? '750px' : `${this.mouseDirectives.position.top}px`}"
          v-on:click="setLocation"
          v-model:zoom="this.mapData.zoom"
          :center="this.mapData.myLocation">
          <l-tile-layer
            :url="`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker
            @dragend="setMarkerPosition"
            ref="marker"  :lat-lng="data.position" v-for="data in this.mapData.allLocations"
            :key="data.id" :visible="data.visible" :draggable="data.draggable">
            <l-popup :content="data.name" />
          </l-marker>
        </l-map>
    </q-card>
    <div class="text-center" :style="{'width':this.widthOptions(),'margin':this.marginOptions()}" v-if="this.store.avatarActive">
      <q-btn icon="maximize" class="q-pa-md" flat color="white" v-touch-pan.vertical.prevent.mouse="moreHeightButton"></q-btn>
    </div>
    <div class="row" :style="{'width':this.widthOptions(),'margin':this.marginOptions()}" v-if="!this.store.fullScreenMapActive">
          <q-space></q-space>
          <q-btn :icon="'fullscreen' " flat color="white" v-on:Click="mapFullScreenButton" v-if="!this.store.avatarActive"></q-btn>
        </div>
    <q-card
    v-if="!this.store.fullScreenMapActive"
    :style="{'width':this.widthOptions(),'margin':this.marginOptions()}"
    class="bg-dark text-white q-pa-xs" flat>
      <q-card-section class="text-center">
        <q-btn
          :color="this.selectedGroup.color"
          flat
          :icon="this.selectedGroup.icon" no-caps
          :label="this.selectedGroup.name ? this.selectedGroup.name : this.selectedGroup.optionName"></q-btn>
      </q-card-section>
      <q-card-section v-if="checkCurrentActivityOrNot()" class="text-center">
        <div class="text-overline text-weight-bold">
          <q-icon name="info" size="17px"></q-icon>
          Grup Buluşması {{ this.currentGroupActivity.eventDate }} Tarihinde.
          <q-icon name="event_available" size="17px"></q-icon>
        </div>
        <div>
          <q-btn icon="check" no-caps label='Eventi Bitir' v-if="this.store.user.id === this.selectedGroup.adminId" v-on:Click="endOfEvent"></q-btn>
        </div>
      </q-card-section>
      <q-card-section v-if="this.store.user.id !== this.selectedGroup.adminId&&checkConfirmedListAndMemberList()">
        <div class="text-overline text-weight-bold">
          <q-icon name="info " size="15px"></q-icon>
          Tüm Grup Üyeleri Konumu Uygun Olarak İşaretledi,
          <span class="text-pink">
            <q-icon name="admin_panel_settings" size="15px"></q-icon> {{ this.selectedGroup.adminName ? this.selectedGroup.adminName : this.selectedGroup.adminEmail }}
          </span>
          Onayı Bekleniyor.
        </div>
      </q-card-section>
      <q-card-section v-if="this.store.user.id === this.selectedGroup.adminId&&checkConfirmedListAndMemberList()" class="text-center">
        <div class="text-overline text-weight-bold">
          <q-icon name="info" size="15px"></q-icon>
          Aktiviteyi Admin Olarak Onaylıyor musunuz ?
          <q-btn icon="check" color="green-5" size="sm" v-on:Click="confirmActivity"></q-btn>
          <q-btn icon="remove" color="red-5" size="sm" class="q-ml-xs" v-on:Click="declineActivity"></q-btn>
        </div>
      </q-card-section>
      <q-card-section horizontal v-if="!checkConfirmedListAndMemberList()&&!checkCurrentActivityOrNot()">
        <div class="text-caption text-capitalize q-pa-sm">
          Grup Buluşma Lokasyonunu Ve Tarihini Onaylıyor musun ?
        </div>
        <q-btn icon="remove" color="red" flat v-on:click="cancelLocation" v-if="checkConfirmeds()">
        </q-btn>
        <q-btn icon="check" color="green" flat v-on:click="confirmLocation" v-if="!checkConfirmeds()"></q-btn>
        <q-btn icon="chat" color="grey-4" flat v-if="!checkConfirmeds()">
          <q-popup-edit v-model="this.reason" auto-save v-slot="scope" class="bg-dark">
            <q-input v-model="this.reason" dense autofocus counter @keyup.enter="defineDeclineReason()" dark/>
          </q-popup-edit>
        </q-btn>
      </q-card-section>
      <q-card-section v-if="!checkConfirmedListAndMemberList()&&!checkCurrentActivityOrNot()">
        <q-input
          :disable="this.selectedGroup.adminId ===  this.store.user.id ? false : true"
          v-model="this.groupMeetDate" dark color="white">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="this.groupMeetDate" mask="YYYY-MM-DD HH:mm" dark color="dark" today-btn>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="pink" flat />
                  <q-btn v-close-popup label="Confirm" color="pink" flat no-caps v-on:click="setGroupDateDay"></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="this.groupMeetDate" mask="YYYY-MM-DD HH:mm" format24h dark color="dark">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="red" flat no-caps/>
                  <q-btn v-close-popup label="Confirm" color="pink" flat no-caps v-on:click="setGroupDateHours"></q-btn>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row">
        <q-btn
            no-caps
            icon="location_on"
            flat :color="this.checkSharedOrNot() ? 'green' : 'red'" v-on:click="shareMyLocationWithOthers"></q-btn>
        <q-space></q-space>
        <q-btn icon="more_vert" color="pink" flat v-on:Click="openOptions" ></q-btn>
        <q-btn dense round flat icon="event" color="white" v-on:Click="showOldEventsButton">
          <q-badge color="pink-4" floating transparent>
            {{ this.oldGroupActivitiesList.length ? this.oldGroupActivitiesList.length : 0 }}
          </q-badge>
        </q-btn>
      </q-card-section>
    </q-card>
    <groupActivitiesVoteList v-if="this.currentListName ==='voteList'" :selectedGroup="this.selectedGroup"/>
    <q-card
    v-if="!this.store.fullScreenMapActive&&this.currentListName ==='memberList'"
    :style="{'width':this.widthOptions(),'margin':this.marginOptions()}"
    class="bg-dark text-white q-pa-xs" v-for="data in this.memberList" :key="data.id">
      <q-card-section horizontal>
        <q-card-section class="col-3">
          <q-avatar v-on:click="showUser(data)">
            <img :src="findImageUser(data)" alt="" v-if="checkImage(data)" style="object-fit:cover;">
            <q-btn icon="person" color="dark" round v-if="!checkImage(data)"></q-btn>
          </q-avatar>
        </q-card-section>
        <q-card-section class="col-6">
          <div class="text-overline">
            <q-icon v-if="this.selectedGroup.adminId === data.id" name="admin_panel_settings" size="15px"></q-icon>
            {{ findUserName(data) }}
            <q-icon name="fiber_manual_record" :color="findUserActivity(data) ? 'green' : 'red'"></q-icon>
            <q-icon name="location_on" :color="checkSharedOrNotInLoop(data) ? 'green' : 'red'"></q-icon>
          </div>
          <div class="text-caption" v-if="!checkReason(data)"> {{ findUserInfo(data) }}</div>
          <div class="text-caption text-weight-bold text-capitalize" v-if="checkReason(data)"> <q-icon name="info" size="15px"></q-icon> {{ findReason(data) }}</div>
        </q-card-section>
        <q-card-section class="col-1" v-if="!checkCurrentActivityOrNot()">
          <q-btn
            :icon="checkInConfirmedOrNot(data) ? 'check' : 'remove'"
            :color="checkInConfirmedOrNot(data) ? 'green' : 'red'"
            flat
            v-on:click="checkInConfirmedOrNot(data) ? cancelLocation() : ''"
          ></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card class="bg-dark" flat v-if="this.selectedGroup.adminId !== this.store.user.id&&!this.store.fullScreenMapActive">
      <q-card-section class="text-center">
        <q-btn class="full-width" icon-right="logout" flat color="red" label="Gruptan Ayrıl" no-caps v-on:click="leaveFromGroup"></q-btn>
      </q-card-section>
    </q-card>
    <optionsGroupActivities v-if="this.store.optionsActiveGroup" @selected="getSelectedFromOptions" :selectedGroup="this.selectedGroup"/>
    <notifyComp v-if="this.store.notifyListActive"/>
    <oldEventsComp v-if="this.store.showOldEventsActive" :selectedGroup="this.selectedGroup"/>
    <selectedUserDetailDialogVue v-if="this.store.showUserDetailActive"/>
    <addNewUserToGroupVue
      :invitesListAll="this.invitesListAll.length ? this.invitesListAll : ''"
      v-if="this.store.addNewUserActive" :selectedGroup="this.selectedGroup" :memberList="this.memberList.length ? this.memberList : ''"/>
  </q-page>
</template>

<script>
import oldEventsComp from "src/components/oldEventsComp.vue";
import groupActivitiesVoteList from "src/components/groupActivitiesVoteList.vue";
import optionsGroupActivities from "src/components/optionsGroupActivities.vue";
import addNewUserToGroupVue from "src/components/addNewUserToGroup.vue";
import notifyComp from "src/components/notifyComp.vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
import { v4 as uuidv4 } from 'uuid';
import selectedUserDetailDialogVue from 'src/components/selectedUserDetailDialog.vue';
export default {
  components:{
    oldEventsComp,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    notifyComp,
    addNewUserToGroupVue,
    optionsGroupActivities,
    groupActivitiesVoteList,
    selectedUserDetailDialogVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store,
    }
  },
  data:function(){
    return{
      mouseDirectives:{
        position:{
          top:'350'
        }
      },
      fullScreenMapActive:false,
      groupMeetDate:'',
      groupMeetHours:'',
      newLocation:[0,0],
      currentGroupActivity:{},
      groupId:'',
      selectedGroup:{},
      error:null,
      memberList:[],
      sharedLocationList:[],
      confirmedList:[],
      declineReasonList:[],
      oldGroupActivitiesList:[],
      invitesListAll:[],
      currentListName:'memberList',
      reason:'',
      mapData:{
        mapKey:0,
        zoom: 14,
        location:{},
        allLocations:[

        ],
        myLocation:[0,0],
        groupMeetingLocation:{}
      }
    }
  },
  methods:{
    checkMeIfNotMember(){
      if(this.$route.name == 'groupActivities'){
        if (!this.memberList.some(object => object.id === this.store.user.id)) {
          this.$q.notify({
            type:'negative',
            message:'Artık Bu Grubun Üyesi Değilsiniz !, Ana Sayfaya Yönlendiriliyorsunuz.',
            timeout:1000,
            position:'top'
          })
          setTimeout(() =>{
            this.$router.replace({path:'/groupMeets'})
          },700)
        }
      }
    },
    showOldEventsButton(){
      if(this.selectedGroup.oldGroupActivities){
        this.store.showOldEventsActive = true
      }else{
        this.$q.notify({
          type:'negative',
          message:'Geçmiş Etkinlik Yok.',
          timeout:700,
          position:'bottom'
        })
      }
    },
    removeCurrentEvent(){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroup.id}/currentGroupActivity`))
      this.currentGroupActivity = {}
    },
    pusthToOldEvents(){
      const randomId = uuidv4()
      const db = getDatabase()
      const data = randomId
      set(ref(db,`activityGroups/${this.selectedGroup.id}/oldGroupActivities/${randomId}`),{
        id:randomId,
        endDate:this.store.currentDateString(),
        createdDate:this.currentGroupActivity.createdDate,
        eventDate:this.currentGroupActivity.eventDate,
        lat:this.currentGroupActivity.lat,
        lng:this.currentGroupActivity.lng,
        date:Date.now()
      })
      this.addCurrentUsersToEventMembers(data)
    },
    addCurrentUsersToEventMembers(data){
      this.memberList.forEach(element => {
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.selectedGroup.id}/oldGroupActivities/${data}/members/${element.id}`),{
          id:element.id,
        })
      });
    },
    endOfEvent(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Grup Aktivitesini Sonlandırmak İstediğinizden Emin misiniz ?'
      }).onOk(() => {
        this.pusthToOldEvents()
        this.removeCurrentEvent()
      }).onCancel(() => {
        //
      })
    },
    getCurrentGroupActivityEvent(){
      if(this.selectedGroup.currentGroupActivity){
        this.currentGroupActivity = this.selectedGroup.currentGroupActivity
        console.log('currentGRuopactivity',this.currentGroupActivity,this.selectedGroup.currentGroupActivity)
      }else{
        this.currentGroupActivity = {}
      }
    },
    checkCurrentActivityOrNot(){
      if(this.selectedGroup.currentGroupActivity){
        return true
      }else{
        return false
      }
    },
    clearAllConfirmeds(){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroup.id}/confirmeds`))
    },
    confirmActivity(){
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.selectedGroup.id}/currentGroupActivity/`),{
        date:Date.now(),
        createdDate:this.store.currentDateString(),
        lat:this.selectedGroup.groupMeetingLocation.x,
        lng:this.selectedGroup.groupMeetingLocation.y,
        eventDate:this.groupMeetDate
      })
      this.clearAllConfirmeds()
    },
    declineActivity(){
      this.cancelLocation()
    },
    checkConfirmedListAndMemberList(){
      if(this.confirmedList.length){
        const confirmedListLength = this.confirmedList.length
        const memberListLength = this.memberList.length
        if(confirmedListLength === memberListLength){
          return true
        }else{
          return false
        }
      }
    },
    moreHeightButton(event){
      //this.mouseDirectives.position.top = event.position.top
      if(event.position.top > 350){
        console.log(event.position.top)
        this.mouseDirectives.position.top = event.position.top
        const randomNumber = Math.floor(Math.random() * 10);
        this.mapKey = randomNumber
      }
    },
    getSelectedFromOptions(data){
      if(data){
        console.log(data)
        if(data.label === 'goPersonAdd'){
          this.addNewUserFromFriendList()
        }else if(data.label ==='goSettings'){
          this.goGroupSettings()
        }else if(data.label === 'goChat'){
          this.store.selectedGroupForChat = this.selectedGroup
          this.$router.push({path:'/chat'})
        }else if(data.label === 'goVote'){
          this.currentListName = 'voteList'
        }else if(data.label === 'goMembers'){
          this.currentListName = 'memberList'
        }
      }
    },
    goGroupSettings(){
      this.store.fromOtherPageSelectedGroup = this.selectedGroup
      this.$router.push({path:'/profile'})
      this.store.selectedOption = 'myGroups'
    },
    openOptions(){
      this.store.optionsActiveGroup = true
    },
    addNewUserFromFriendList(){
      this.store.addNewUserActive = true
    },
    sharedLocationMemberLength(){
      if(this.sharedLocationList.length){
        const length = this.sharedLocationList.length
        return length
      }else{
        return 0
      }
    },
    whenLeaveGropRemoveFromLocation(data){
      if(this.checkSharedOrNot()){
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.selectedGroup.id}/sharedLocations/${data.id}`))
        this.mapData.allLocations = this.mapData.allLocations.filter( object => object.id !== data.id)
      }
    },
    checkSharedOrNotInLoop(data){
      const result = this.sharedLocationList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    findUserNameReturn(element){
      const result = this.store.usersList.find(object => object.id === element.id)
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
    pushToSharedLocationsToMapData(){
      if(this.sharedLocationList.length){
        this.sharedLocationList.forEach(element => {
          const memberData= {
            id:element.id,position:{lat:element.lat,lng:element.lng},
            draggable:false,
            visible:true,name:this.findUserNameReturn(element)
          }
          if(memberData.id !== this.store.user.id){
            this.mapData.allLocations.push(memberData)
          }
        });
        console.log('allLocs',this.mapData.allLocations)
      }
    },
    checkSharedLocations(){
      if(this.selectedGroup.sharedLocations){
        const list = []
        for(const [key,value] of Object.entries(this.selectedGroup.sharedLocations)){
          const locData={
            id:`${value.id}`,
            lat:`${value.lat}`,
            lng:`${value.lng}`
          }
          list.push(locData)
        }
        this.sharedLocationList = list
        console.log('checkSharedLocations',this.sharedLocationList)
        this.pushToSharedLocationsToMapData()
      }else{
        this.sharedLocationList = []
        console.log('checkSharedLocations',this.sharedLocationList)
      }
    },
    checkSharedOrNot(){
      const result = this.sharedLocationList.find(object => object.id === this.store.user.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    shareMyLocationWithOthers(){
      if(!this.checkSharedOrNot()){
        console.log(this.mapData.myLocation,this.mapData.groupMeetingLocation)
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.selectedGroup.id}/sharedLocations/${this.store.user.id}`),{
          id:this.store.user.id,
          lat:this.mapData.location.x,
          lng:this.mapData.location.y
        })
      }else{
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.selectedGroup.id}/sharedLocations/${this.store.user.id}`))
        this.sharedLocationList = this.sharedLocationList.filter(object => object.id !== this.store.user.id)
      }
    },
    leaveFromGroup(){
      console.log(this.selectedGroup)
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`Gruptan Ayrılıyorsunuz İşlemi Onaylıyor musunuz ?`
      }).onOk(() => {
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.selectedGroup.id}/members/${this.store.user.id}`))
        const data = this.store.userAllInfo
        this.whenLeaveGropRemoveFromLocation(data)
        this.$router.replace({path:'/groupMeets'})
        this.$q.notify({
          type:'negative',
          icon:'check',
          timeout:700,
          position:'bottom'
        })
      }).onCancel(() => {
        //
      })
    },
    findUserActivity(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.online === true){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    mapFullScreenButton(){
      this.store.fullScreenMapActive =! this.store.fullScreenMapActive
    },
    findUserName(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.name){
          if(result.id === this.store.user.id){
            const name = 'Siz'
            return name
          }else{
            const name = result.name
            return name
          }
        }else{
          const email  = result.email
          return email
        }
      }
    },
    setGroupDateHours(){
      console.log(this.groupMeetDate)
    },
    setGroupDateDay(){
      console.log(this.groupMeetDate)
    },
    setGroupDate(val,reason,details){
      if(val){
        console.log(val,reason,details,this.groupMeetDate)
      }
    },
    checkReason(data){
      const result = this.declineReasonList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    findReason(data){
      const result = this.declineReasonList.find(object => object.id === data.id)
      if(result){
        const reasons = result.message
        return reasons
      }
    },
    getDeclineReasons(){
      if(this.selectedGroup.declineReasons){
        this.declineReasonList = []
        for(const [key,value] of Object.entries(this.selectedGroup.declineReasons)){
          const memberData = {
            id:`${value.id}`,
            message:`${value.message}`
          }
          this.declineReasonList.push(memberData)
        }
        console.log('declineReasonList',this.declineReasonList)
      }else{
        this.declineReasonList = []
      }
    },
    defineDeclineReason(){
      if(this.reason){
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.selectedGroup.id}/declineReasons/${this.store.user.id}`),{
          id:this.store.user.id,
          message:this.reason
        })
      }
    },
    checkInConfirmedOrNot(data){
      const result = this.confirmedList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    findUserInfo(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.info){
          const info = result.info
          return info
        }
      }
    },
    showUser(data){
      this.store.showUserDetail = data
      this.store.showUserDetailActive = true
    },
    checkImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
      }
    },
    findImageUser(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return  image
        }
      }
    },
    removeDeclineReason(){
      if(this.selectedGroup.declineReasons){
        const result = this.declineReasonList.find(object => object.id === this.store.user.id)
        if(result){
          const db = getDatabase()
          remove(ref(db,`activityGroups/${this.selectedGroup.id}/declineReasons/${this.store.user.id}`))
          this.declineReasonList = this.declineReasonList.filter(object => object.id !== this.store.user.id)
        }
      }
    },
    confirmLocation(){
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.selectedGroup.id}/confirmeds/${this.store.user.id}`),{
        id:this.store.user.id,
        date:this.store.currentDateString(),
        status:true,
        name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
        email:this.store.user.email
      })
      this.removeDeclineReason()
    },
    cancelLocation(){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroup.id}/confirmeds/${this.store.user.id}`))
    },
    checkConfirmeds(){
      const result = this.confirmedList.find(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
    },
    getConfirmeds(){
      if(this.selectedGroup.confirmeds){
        this.confirmedList = []
        for(const [key,value] of Object.entries(this.selectedGroup.confirmeds)){
          const memberData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            name:`${value.name}`,
            status:`${value.status}`
          }
          this.confirmedList.push(memberData)
        }
        console.log('confirmeds',this.confirmedList)
      }else{
        this.confirmedList = []
      }
    },
    getMembers(){
      if(this.selectedGroup.members){
        this.memberList = []
        for(const [key,value] of Object.entries(this.selectedGroup.members)){
          const memberData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            name:`${value.name}`
          }
          this.memberList.push(memberData)
        }
        console.log('memberList',this.memberList)
      }else{
        this.memberList = []
      }
    },
    getGroupMeetingLocationFromFirbase(){
      if(!this.selectedGroup.groupMeetingLocation){
        const groupLocation = {
          id:1,position:{lat:(this.mapData.location.x),lng:(this.mapData.location.y)},
          draggable:this.selectedGroup.adminId === this.store.user.id &&!this.checkCurrentActivityOrNot() ? true : false,
          visible:true,name:'Group Meet Location'
        }
        this.mapData.groupMeetingLocation = groupLocation
        console.log(this.mapData.groupMeetingLocation)
        this.mapData.allLocations.push(groupLocation)
      }else{
        const groupLocation = {
          id:1,position:{lat:(this.selectedGroup.groupMeetingLocation.x),lng:(this.selectedGroup.groupMeetingLocation.y)},
          draggable:this.selectedGroup.adminId === this.store.user.id &&!this.checkCurrentActivityOrNot() ? true :  false,
          visible:true,name:'Group Meet Location'
        }
        this.mapData.groupMeetingLocation = groupLocation
        console.log(this.mapData.groupMeetingLocation)
        this.mapData.allLocations.push(groupLocation)
      }
    },
    setMarkerPosition(e){
      if(this.selectedGroup.adminId === this.store.user.id){
        console.log(e.target._latlng)
        const db = getDatabase()
        this.mapData.allLocations.forEach(element => {
          if(element.id === this.mapData.groupMeetingLocation.id){
            element.position.lat = e.target._latlng.lat
            element.position.lng = e.target._latlng.lng
          }
        });
        set(ref(db,`activityGroups/${this.selectedGroup.id}/groupMeetingLocation/`),{
          x:e.target._latlng.lat,
          y:e.target._latlng.lng
        })
      }
    },
    setLocation(e){
      console.log(e)
    },
    pushToAllLocationList(){
      this.mapData.allLocations = []
      this.mapData.allLocations.push({
          id:this.store.user.id,
          position:{lat:this.mapData.location.x,lng:this.mapData.location.y},
          draggable:false,visible:true,
          name:'Your Location (Only You Can See).'
        })
      this.getGroupMeetingLocationFromFirbase()
      this.checkSharedLocations()
    },
    pushToList(){
      this.mapData.myLocation = []
      this.mapData.myLocation.push(this.mapData.location.x)
      this.mapData.myLocation.push(this.mapData.location.y)
      console.log(this.mapData.myLocation,this.mapData.location)
      this.pushToAllLocationList()
    },
    getMyLocation(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        //
      }
    },
    showPosition(position){
      this.mapData.location.x = position.coords.latitude
      this.mapData.location.y = position.coords.longitude
      console.log(this.mapData.location)
      this.pushToList()
    },
    marginOptions(){
      if(this.checkAvatarActive()){
        return '0% auto'
      }else{
        return '0% auto'
      }
    },
    widthOptions(){
      if(this.checkAvatarActive()){
        return '45%'
      }else{
        return '100%'
      }
    },
    checkAvatarActive(){
      if(this.store.avatarActive){
        return true
      }else{
        return false
      }
    },
    getId(){
      this.groupId = this.$route.params.id
      console.log(this.groupId)
    },
    getInvitesList(){
      if(this.selectedGroup.invites){
        const list = []
        for(const [key,value] of Object.entries(this.selectedGroup.invites)){
          const userData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            info:`${value.info}`,
            name:`${value.name ? value.name : ''}`,
            type:`${value.type}`
          }
          list.push(userData)
        }
        this.invitesListAll = list
        console.log('invitesListAll',this.invitesListAll)
      }else{
        this.invitesListAll = []
      }
    },
    getOldEvents(){
      if(this.selectedGroup.oldGroupActivities){
        const list = []
        for(const [key,value] of Object.entries(this.selectedGroup.oldGroupActivities)){
          const groupData = {
            id:`${value.id}`,
            createdDate:`${value.createdDate}`,
            date:`${value.date}`,
            endDate:`${value.endDate}`,
            eventDate:`${value.eventDate}`,
            lat:`${value.lat}`,
            lng:`${value.lng}`
          }
          list.push(groupData)
        }
        this.oldGroupActivitiesList = list
        console.log('oldGroupActivities',this.oldGroupActivitiesList)
      }else{
        this.oldGroupActivitiesList = []
      }
    },
    getSelectedGroupDetails(){
      const db = getDatabase();
      const dbRef = ref(db, `activityGroups/${this.groupId}`);
      onValue(dbRef, (snapshot) => {
        this.selectedGroup = snapshot.val();
        console.log('selectedGroup',this.selectedGroup)
        this.getMyLocation()
        this.getMembers()
        this.getConfirmeds()
        this.getInvitesList()
        this.getDeclineReasons()
        this.getGroupMeetDate()
        this.getCurrentGroupActivityEvent()
        this.getOldEvents()
        //
        this.checkMeIfNotMember()
      });
    },
    getGroupMeetDate(){
      if(this.selectedGroup.groupMeetDate){
        this.groupMeetDate = this.selectedGroup.groupMeetDate
      }else{
        this.groupMeetDate = ''
      }
    }
  },
  created() {
    this.store.getUsers()
    this.getId()
    this.getSelectedGroupDetails()
  },
  beforeCreate(){

  },
  mounted(){
  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMySavedOldEvents()
        }
      },
      immediate:true,
      deep:true
    },
    'store.fullScreenMapActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          const randomNumber = Math.floor(Math.random() * 10);
          this.mapKey = randomNumber
        }
      },
      immediate:true,
      deep:true
    },
    groupMeetDate:{
      handler(newValue,oldValue){
        if(newValue){
          console.log('last date hour',this.groupMeetDate)
          const db = getDatabase()
          update(ref(db,`activityGroups/${this.selectedGroup.id}`),{
            groupMeetDate:this.groupMeetDate ? this.groupMeetDate : ''
          })
        }
      },
      immediate:true,
      deep:true
    },
    groupId:{
      handler(newValue,oldValue){
        if(newValue){
          //this.getSelectedGroupDetails()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
  .my-marker .leaflet-marker-icon {
    background-color: red;
  }
</style>
