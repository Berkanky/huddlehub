<template>
  <q-dialog v-if="this.store.showMapActive" v-model="this.store.showMapActive" persistent :maximized="this.store.avatarActive ? false : true">
    <q-card :style="{'width':this.store.avatarActive ? '500px' : '100%'}" class="bg-dark text-white">
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
      </q-card-section>
      <l-map
          v-if="!this.store.showAllLocationsActive"
          style="width:100%;" :style="{'height':this.store.avatarActive ? '700px' : '700px'}"
            ref="map" v-model:zoom="this.mapData.zoom" :center="this.mapData.location">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker
              ref="marker"  :lat-lng="this.mapData.location"
              :visible="true">
            <l-popup content="Event Location" />
          </l-marker>
          </l-map>
          <l-map
          v-if="this.store.showAllLocationsActive&&this.allLocationsLocal.length"
            style="width:100%;" :style="{'height':this.store.avatarActive ? '700px' : '700px'}"
            ref="map" v-model:zoom="this.mapData.zoom" :center="this.mapData.location">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker
            v-for="(data,key) in this.allLocationsLocal" :key="key"
            ref="marker"  :lat-lng="data.position"
            :visible="data.visible" :draggable="data.draggable">
            <l-popup :content="data.eventDate" />
            </l-marker>
          </l-map>
    </q-card>
  </q-dialog>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedEventLocations','allLocations'],
  components:{
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      mapData:{
        zoom:14,
        location:[0,0],
        locations:[]
      },
      selectedEventLocationsLocal:{},
      allLocationsLocal:[]
    }
  },
  methods:{
    pushLocationsToList(){
      this.mapData.location = []
      this.mapData.location.push(this.selectedEventLocationsLocal.lat)
      this.mapData.location.push(this.selectedEventLocationsLocal.lng)
    },
    goBack(){
      this.store.showMapActive = false
      this.store.showAllLocationsActive = false
    }
  },
  watch:{
    allLocations:{
      handler(newValue,oldValue){
        if(newValue){
          this.allLocationsLocal = newValue
          console.log('allLocationsLocal',this.allLocationsLocal)
        }
      },
      immediate:true,
      deep:true
    },
    selectedEventLocations:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedEventLocationsLocal = newValue
          console.log('selectedEventLocationsLocal',this.selectedEventLocationsLocal)
          this.pushLocationsToList()
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
