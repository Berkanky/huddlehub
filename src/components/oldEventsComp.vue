<template>
  <q-dialog
    :maximized="this.store.avatarActive ? false : true"
    transition-show="slide-up"
    transition-hide="slide-down"
    v-if="this.store.showOldEventsActive" v-model="this.store.showOldEventsActive" persistent>
    <q-card class="bg-dark" :style="{'width':this.store.avatarActive ? '500px' : '100%'}">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
        <q-btn icon="map" flat color="white" v-on:click="showAllLocation" v-if="!this.store.showFromProfileSavedEventsActive"></q-btn>
        <q-space></q-space>
        <q-avatar>
          <img :src="this.selectedGroup.image" alt="" v-if="this.selectedGroup.image" style="object-fit:cover;">
          <q-btn icon="person" round color="dark" v-if="!this.selectedGroup.image"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <q-card class="bg-dark text-white" v-for="data in this.oldEventsList" :key="data.id">
          <q-card-section horizontal>
            <q-btn :icon="checkSavedEventOrNot(data) ? 'bookmark_added' : 'event'" class="col-2" flat>
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" class="bg-dark text-white">
                <div class="text-overline text-weight-bold text-capitalize">
                  <q-icon name="info" color="white" round size="sm"></q-icon>
                  {{ findSavedDate(data) }}
                </div>
              </q-tooltip>
            </q-btn>
            <q-card-section class="col-6">
              <div class="text-caption text-grey-6 text-weight-bold">
                Event Tarihi - {{ data.eventDate }}
              </div>
              <div class="text-caption text-grey-7 text-weight-bold">
                Oluşturma Tarihi - {{ data.createdDate }}
              </div>
            </q-card-section>
            <q-card-section class="col-4">
              <q-btn icon="location_on" flat color="green" size="sm" v-on:click="checkLocationOfEVent(data)"></q-btn>
              <q-btn icon="collections_bookmark" color="dark" size="sm" push v-on:Click="showOldEventsDetail(data)">
                <q-badge floating :color="this.selectedGroupLocal.color ? this.selectedGroupLocal.color : 'pink'" rounded  v-if="checkImagesOrNot(data)"/>
              </q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <showMap v-if="this.store.showMapActive" :selectedEventLocations="this.selectedEventLocations" :allLocations="this.allLocations.length ? this.allLocations : ''"/>
    <oldEventDetail
    :selectedOldEvent="this.selectedOldEvent"
    :selectedGroupLocal="this.selectedGroupLocal"
    v-if="this.store.oldEventDetailActive"/>
  </q-dialog>
</template>

<script>
import oldEventDetail from "./oldEventDetail.vue";
import showMap from "./showMap.vue";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    showMap,
    oldEventDetail
  },
  props:['selectedGroup'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedGroupLocal:{},
      oldEventsList:[],
      selectedEventLocations:{},
      allLocations:[],
      selectedOldEvent:{}
    }
  },
  methods:{
    findSavedDate(data){
      const result = this.store.savedOldEventList.find(object => object.id === data.id)
      if(result){
        const date = result.savedDate ? result.savedDate : 'Kaydetme Tarihi Bulunamadı !'
        const totalMessage = date + ' ' + 'Tarihinde Kaydedildi.'
        return totalMessage
      }else{
        const date = 'Kaydedilmedi.'
        return date
      }
    },
    checkSavedEventOrNot(data){
      const result = this.store.savedOldEventList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkImagesOrNot(data){
      if(data.imagesActive == 'true' || data.images){
        return true
      }else{
        return false
      }
    },
    showOldEventsDetail(data){
      console.log(data)
      const list = data.members
      const result = list.some(object => object.id === this.store.user.id)
      if(result){
        this.selectedOldEvent = data
        this.store.oldEventDetailActive = true
      }else{
        this.$q.notify({
          type:'negative',
          message:'Bu Eventin Üyesi Olmadığınız İçin Detayları Görüntüleyemezsiniz !',
          timeout:700,
          position:'top'
        })
      }
    },
    showAllLocation(){
      this.allLocations = []

      this.selectedEventLocations = {lat:this.oldEventsList[0].lat,lng:this.oldEventsList[0].lng}
      this.oldEventsList.forEach(element => {
        if(element.lat && element.lng){
          console.log(element.lat,element.lng)
          this.allLocations.push({id:element.id,position:{lat:element.lat,lng:element.lng},eventDate:element.eventDate,visible:true,draggable:false})
        }
      });
      console.log(this.allLocations)

      this.store.showMapActive = true
      this.store.showAllLocationsActive = true
    },
    checkLocationOfEVent(data){
      console.log(data)
      this.selectedEventLocations.lat = data.lat
      this.selectedEventLocations.lng = data.lng
      this.store.showMapActive = true
    },
    getOldEventsFromProfileSaveds(){
      if(this.selectedGroup.oldGroupActivities){
        this.oldEventsList = this.selectedGroup.oldGroupActivities
      }else{
        this.oldEventsList = []
      }
    },
    getOldEvents(){
      if(this.selectedGroupLocal.oldGroupActivities){
        const list = []
        for (const [key, value] of Object.entries(this.selectedGroupLocal.oldGroupActivities)) {
          const groupData = {
            id: `${value.id}`,
            createdDate: `${value.createdDate}`,
            date: `${value.date}`,
            endDate: `${value.endDate}`,
            eventDate: `${value.eventDate}`,
            lat: `${value.lat}`,
            lng: `${value.lng}`,
            imagesActive: `${value.images ? true : false}`,
            members: []
          }
          for (const [secondKey, secondValue] of Object.entries(value.members)) {
            const memberData = {
              id: `${secondValue.id}`
            }
            groupData.members.push(memberData)
          }
          list.push(groupData)
        }
        this.oldEventsList = list
        console.log('oldEvents', this.oldEventsList)
      }
    },
    goBack(){
      this.store.showOldEventsActive = false
      if(this.store.showFromProfileSavedEventsActive){
        this.store.showFromProfileSavedEventsActive = false
      }
    },
  },
  created(){

  },
  watch:{
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroupLocal = newValue
          console.log('selectedGroupLocal',this.selectedGroupLocal)
          if(!this.store.showFromProfileSavedEventsActive){
            this.getOldEvents()
          }else{
            this.getOldEventsFromProfileSaveds()
          }
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
