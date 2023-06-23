<template>
  <q-dialog
    v-if="this.store.filterGroupMeetActive" v-model="this.store.filterGroupMeetActive"
    :full-width="this.store.avatarActive ? false : true"
    persistent>
    <q-card class="bg-dark">
<!--       <div class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack" class="q-ma-sm"></q-btn>
      </div> -->
      <q-card-section style="height:100%;" class="row">
        <q-card class="bg-dark col-6" v-for="data in this.buttonsTypes" :key="data.id" style="height:170px;">
          <q-btn
            style="height:100%;"  :flat="!checkColor(data)" :color="!checkColor(data) ? data.color : data.color"
            :icon="data.icon" class="full-width" v-on:click="selectEvent(data)"></q-btn>
        </q-card>
      </q-card-section>
<!--       <div class="text-right">
        <q-btn icon="check" class="q-ma-md" glossy push :color="this.selectedOption.color" v-if="this.selectedOption.optionId" v-on:click="confirmFilter"></q-btn>
      </div> -->
    </q-card>
  </q-dialog>
</template>

<script>
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
      buttonsTypes:[
        {id:1,label:'Food',icon:'restaurant_menu',color:'green'},
        {id:2,label:'Game',icon:'sports_esports',color:'red'},
        {id:3,label:'Talk',icon:'phone_in_talk',color:'blue'},
        {id:4,label:'Drink',icon:'local_bar',color:'orange'},
        {id:5,label:'MyGroups',icon:'login',color:'pink'},
        {id:6,label:'Waiting',icon:'hourglass_top',color:'pink'},
        {id:8,label:'Saveds',icon:'bookmark',color:'white'},
        {id:7,label:'goBack',icon:'keyboard_backspace',color:'white'}
      ],
      selectedOption:{}
    }
  },
  methods:{
    checkFilterList(){
      if(this.store.filteredActivityGroupList.length){
        this.store.filterGroupMeetActive = false
        this.store.filterOnActive = true
        console.log('filterOnActive',this.store.filterOnActive)
      }else{
        this.$q.notify({
          type:'negative',
          message:`${this.selectedOption.optionName} Kategorisinde Grup Bulunamadı !`,
          position:'bottom',
          timeout:700
        })
        this.selectedOption = {}
      }
    },
    confirmFilter(){
      if(this.selectedOption.optionId !== 5 && this.selectedOption.optionId !== 6){
        this.store.filteredActivityGroupList = this.store.activityGroupsList.filter(object => object.optionName === this.selectedOption.optionName)
        console.log('filtered',this.store.filteredActivityGroupList)
      }else if (this.selectedOption.optionId !== 6 && this.selectedOption.optionId === 5){
        if(this.store.activityGroupsList.length){
          this.store.myMemberedGroups = []
          this.store.activityGroupsList.forEach(element => {
            if(element.members){
              const list = []
              for(const [key,value] of Object.entries(element.members)){
                const memberData = {
                  id:`${value.id}`,
                  date:`${value.date}`,
                  email:`${value.email}`,
                  name:`${value.name ? value.name : ''}`
                }
                list.push(memberData)
              }
              const result = list.find(object => object.id === this.store.user.id)
              if(result){
                this.store.myMemberedGroups.push(element)
              }
            }
          });
          this.store.filteredActivityGroupList = this.store.myMemberedGroups
          console.log('filteredActivityGroupList',this.store.filteredActivityGroupList)
        }
      }else if (this.selectedOption.optionId === 6 && this.selectedOption.optionId !== 5){
        if(this.store.activityGroupsList.length){
          this.store.myWaitersGroups = []
          this.store.activityGroupsList.forEach(element => {
            if(element.waiters){
              const list = []
              for(const [key,value] of Object.entries(element.waiters)){
                const memberData = {
                  id:`${value.id}`,
                  date:`${value.date}`,
                  email:`${value.email}`,
                }
                list.push(memberData)
              }
              const result = list.find(object => object.id === this.store.user.id)
              if(result){
                this.store.myWaitersGroups.push(element)
              }
            }
          });
          this.store.filteredActivityGroupList = this.store.myWaitersGroups
          console.log('filteredActivityGroupList',this.store.filteredActivityGroupList)
        }
      }
      this.checkFilterList()
    },
    goBack(){
      this.selectedOption = {}
      this.store.filterGroupMeetActive = false
    },
    showMySavedsOnly(){
      if(this.store.activityGroupsList.length){
        const list = []
        this.store.activityGroupsList.forEach(element => {
          const result = this.store.savedGroupsList.find(object => object.id === element.id)
          if(result){
            list.push(element)
          }
        });
        console.log('saveds',list)
        this.store.filteredActivityGroupList = list
        this.checkFilterList()
      }
    },
    selectEvent(data){
      this.store.filteredActivityGroupList = this.store.activityGroupsList
      if(!this.selectedOption.optionId&&data.label != 'goBack' && data.label != 'Saveds'){
        this.selectedOption.optionId = data.id
        this.selectedOption.optionName = data.label
        this.selectedOption.color = data.color
        console.log(this.selectedOption)
        this.confirmFilter()
      }else if(data.label === 'Saveds'){
        this.showMySavedsOnly()
      }
      else if(data.label === 'goBack'){
        this.goBack()
      }
      else{
        this.selectedOption = {}
      }
    },
    checkColor(data){
      if(this.selectedOption.optionId === data.id){
        return true
      }else{
        return false
      }
    },
  },
  created(){

  },
  beforeMount(){
    this.store.getActivityGroups()
  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMySavedGroups()
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
