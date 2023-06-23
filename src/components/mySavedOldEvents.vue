<template>
  <q-card
    :style="{'width':this.store.widthOptions()}" :dark="this.store.avatarActive ? true : false"
    style="margin:0 auto;" class="bg-dark">
    <q-card-section v-if="!this.oldEventsList.length">
      <q-card class="bg-dark text-white">
        <q-card-section horizontal>
          <q-card-section class="col">
            <q-icon name="info" size="sm"></q-icon>
            <div class="text-subtitle2 text-weight-bold text-capitalize">
              Herhangi Bir Event Kaydetmemişsiniz !
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section v-if="this.oldEventsList.length">
      <q-card bordered v-for="data in this.groupList" :key="data.id" flat class="bg-dark">
        <q-card-section horizontal>
          <q-card-section class="col-7 q-pt-xs">
            <div class="text-overline"><q-btn
              size="sm" flat
              :color="data.color ? data.color: 'dark'"
              :icon="data.icon ? data.icon : 'person'"
              :label="data.optionName"></q-btn></div>
            <div class="text-h6  q-mt-sm q-mb-xs text-white">{{data.name ? data.name : 'Başlık Belirtilmemiş'}}</div>
            <div class="text-caption text-grey">
              {{ data.groupExplain ? data.groupExplain : '' }}
            </div>
            <div class="text-overline text-weight-bold text-grey-6">
              <q-btn icon="fiber_manual_record" flat :color="checkGroupStillActiveOrNot(data) ? 'green' : 'red'" size="sm"></q-btn>
              {{ groupStatusMessage(data) }}
            </div>
            <div class="text-overline text-weight-bold text-grey-6">
              <q-icon name="admin_panel_settings" color="white" size="17px"></q-icon>
              {{ findAdminName(data) }}
            </div>
          </q-card-section>
          <q-card-section class="col-5 flex flex-center">
            <q-img
            loading="lazy"
            spinner-color="white"
            v-if="data.image" :src="data.image" :ratio="1" ></q-img>
            <q-btn icon="collections_bookmark" v-if="!data.image" flat></q-btn>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn flat icon="event" color="white" v-on:Click="selectGroupForShowEvents(data)">
            <q-badge color="red" floating>{{ checkEventsLength(data) }}</q-badge>
          </q-btn>
          <q-btn icon="delete_forever" flat color="red" v-on:Click="deleteEvent(data)">
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-card-section>
    <old-events-comp v-if="this.store.showOldEventsActive" :selectedGroup="this.selectedGroup"/>
  </q-card>
</template>

<script>
import oldEventsComp from "./oldEventsComp.vue";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    oldEventsComp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      oldEventsList:[],
      groupList:[],
      selectedGroup:{}
    }
  },
  methods:{
    selectGroupForShowEvents(data){
      this.selectedGroup = data
      this.selectedGroup.id = data.groupId
      console.log(this.selectedGroup,data)
      this.store.showFromProfileSavedEventsActive = true
      this.store.showOldEventsActive = true
    },
    checkEventsLength(data){
      if(data.oldGroupActivities){
        const length = data.oldGroupActivities.length
        return length
      }else{
        return 0
      }
    },
    deleteEvent(data){
      if(data.oldGroupActivities){
        const list = []
        for(const [key,value] of Object.entries(data.oldGroupActivities)){
          const groupData = {
            id:`${value.id}`
          }
          list.push(groupData)
        }
        console.log(list)
        list.forEach(element => {
          const db = getDatabase()
          remove(ref(db,`mySavedOldEvents/${this.store.user.id}/${element.id}`))
          this.oldEventsList = this.oldEventsList.filter(object => object.id !== element.id)
        });
        this.groupList = this.groupList.filter(object => object.id !== data.id)
      }
    },
    findAdminName(data){
      const result = this.store.usersList.find(object => object.id === data.adminId)
      if(result){
        if(result.id !== this.store.user.id){
          const name = result.name ? result.name : result.email
          return name
        }else{
          const name = 'Siz'
          return name
        }
      }
    },
    groupStatusMessage(data){
      if(this.checkGroupStillActiveOrNot(data)){
        const message = 'Grup Hala Aktif'
        return message
      }else{
        const message = 'Grup Aktif Değil.'
        return message
      }
    },
    checkGroupStillActiveOrNot(data){
      const some = this.store.activityGroupsList.find(object => object.id === data.groupId)
      if(some){
        return true
      }else{
        return false
      }
    },
    checkForHowManyEventForOneGroup(data){

    },
/*     createGroupForEvents() {
      const list = [];
      this.oldEventsList.forEach((element) => {
        console.log(element.images)
        const existingGroup = list.find((group) => group.groupId === element.groupId);
        if (!existingGroup) {
          const newGroup = {
            groupId: element.groupId,
            adminId: element.adminId,
            color: element.color ?? '',
            groupExplain: element.groupExplain ?? '',
            icon: element.icon,
            image: element.image ?? '',
            name: element.name ?? '',
            optionName: element.optionName,
            oldGroupActivities: {
              [element.id]: {
                id: element.id,
                createdDate: element.createdDate,
                date: element.date,
                endDate: element.endDate,
                eventDate: element.eventDate,
                images: element.images ?? '',
                lat: element.lat ?? 0,
                lng: element.lng ?? 0,
              }
            },
          };

          list.push(newGroup);
        } else {
          existingGroup.oldGroupActivities.push({
            id: element.id,
            createdDate: element.createdDate,
            date: element.date,
            endDate: element.endDate,
            eventDate: element.eventDate,
            images:element.images ? element.images : '',
            lat: element.lat ?? 0,
            lng: element.lng ?? 0,
          });
        }
      });
      console.log('groupList',list)
      this.groupList = list
    } */
    createGroupForEvents() {
    const list = [];
    this.oldEventsList.forEach((element) => {
      const existingGroup = list.find((group) => group.groupId === element.groupId);
      if (!existingGroup) {
        const newGroup = {
          groupId: element.groupId,
          adminId: element.adminId,
          color: element.color ?? '',
          groupExplain: element.groupExplain ?? '',
          icon: element.icon,
          image: element.image ?? '',
          name: element.name ?? '',
          optionName: element.optionName,
          oldGroupActivities: {
            [element.id]: {
              id: element.id,
              createdDate: element.createdDate,
              date: element.date,
              endDate: element.endDate,
              eventDate: element.eventDate,
              images: element.images ?? '',
              lat: element.lat ?? 0,
              lng: element.lng ?? 0,
              members:element.members ? element.members : ''
            },
          },
        };
        list.push(newGroup);
      } else {
        existingGroup.oldGroupActivities[element.id] = {
          id: element.id,
          createdDate: element.createdDate,
          date: element.date,
          endDate: element.endDate,
          eventDate: element.eventDate,
          images: element.images ?? '',
          lat: element.lat ?? 0,
          lng: element.lng ?? 0,
          members:element.members ? element.members : ''
        };
      }
    });
    console.log('groupList', list);
    this.groupList = list;
  }

  },
  created(){
    this.store.getActivityGroups()
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
    'store.savedOldEventList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.oldEventsList = newValue
          this.createGroupForEvents()
          console.log('oldEventsList',this.oldEventsList)
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
