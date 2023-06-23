<template>
  <q-dialog v-if="this.store.optionsActiveGroup" v-model="this.store.optionsActiveGroup" persistent :full-width="!this.store.avatarActive ? true : false">
    <q-card class="bg-dark" style="width:500px;max-width:80vw;">
      <q-card-section class="row" style="height:100%;">
        <q-card class="col-6 text-center bg-dark" style="height:200px;"
        v-for="data in this.options" :key="data.id" v-show="data.status">
          <q-btn :flat="checkSelected(data) ? false : true" :color="data.color" :icon="data.icon" style="height:100%;" class="full-width" v-on:Click="selectButton(data)"></q-btn>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedGroup'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selected:{},
      selectedGroupLocal:{},
      options:[
        {id:0,label:'goPersonAdd',icon:'person_add',color:'primary',status:this.store.user.id === this.selectedGroup.adminId ? true : false},
        {id:1,label:'goChat',icon:'chat',color:'green',status:true},
        {id:2,label:'goSettings',icon:'settings',color:'pink',status:this.store.user.id === this.selectedGroup.adminId ? true : false},
        {id:4,label:'goVote',icon:'fa-solid fa-person-booth',color:'yellow',status:true},
        {id:5,label:'goMembers',icon:'groups',color:'purple',status:true},
        {id:3,label:'goBack',icon:'logout',color:'orange',status:true},
      ]
    }
  },
  methods:{
    checkSelected(data){
      if(data.id === this.selected.id){
        return true
      }else{
        return  false
      }
    },
    selectButton(data){
      if(this.selected.id){
        this.selected = {}
      }else{
        if(data.label !== 'goBack'){
          this.selected = data
          this.$emit('selected',this.selected)
          this.store.optionsActiveGroup = false
        }else if(data.label === 'goBack'){
          this.store.optionsActiveGroup = false
        }
      }
    }
  },
  created(){

  },
  watch:{
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroupLocal = newValue
          console.log('yo',this.selectedGroupLocal)
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
