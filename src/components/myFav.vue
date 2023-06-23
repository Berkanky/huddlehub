<template>
  <div>
    <q-card
    :flat="!this.store.avatarActive ? true : false"
    class="bg-dark" style="margin:0 auto;" :style="{'width':this.store.avatarActive ? '50%' : '100%','margin-top':this.store.avatarActive ? '0%' : '0%'}">
    <q-card-section class="row" style="height:100%;" v-if="this.stepNumber === 0">
      <q-card class="bg-dark col-6" v-for="data in this.buttonsTypes" :key="data.id" style="height:170px;">
        <q-btn
          style="height:100%;"  :flat="!checkColor(data)" :color="!checkColor(data) ? data.color : data.color"
          :icon="data.icon" class="full-width" v-on:click="selectEvent(data)"></q-btn>
      </q-card>
    </q-card-section>
    <q-card-section class="bg-dark text-center" style="height:100%;" v-if="this.stepNumber === 1">
      <q-avatar size="150px" v-on:click="changeImage">
        <img :src="this.groupInfo.image" alt="" v-if="this.groupInfo.image" style="object-fit:cover;" v-on:click="removeImage">
        <q-btn icon="person" color="white" text-color="dark" round v-if="!this.groupInfo.image" size="xl"></q-btn>
      </q-avatar>
      <div class="text-center" v-if="this.changeImageActive">
        <upload @currentImageData="getcurrentImageData"/>
      </div>
      <div class="row">
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        v-model="this.groupInfo.name"
        :label="this.groupInfo.name ? this.groupInfo.name : 'Grup Adı Giriniz'">
          <template v-slot:prepend>
            <q-icon name="group"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        type="number"
        v-model.number="this.groupInfo.maxMember"
        :label="this.groupInfo.maxMember ? this.groupInfo.maxMember : 'Maksimum Üye Sayısı Belirleyiniz'">
          <template v-slot:prepend>
            <q-icon name="settings"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        dark color="white"
        readonly
        :label="this.groupInfo.adminName">
          <template v-slot:prepend>
            <q-icon name="supervisor_account"></q-icon>
          </template>
        </q-input>
        <q-input
        class="col-6 q-pa-xs"
        readonly dark :label-color="this.groupInfo.color"
        :label="this.groupInfo.optionName">
          <template v-slot:prepend>
            <q-icon name="mood" :color="this.groupInfo.color"></q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-section class="text-right" v-if="this.stepNumber === 1">
      <q-btn icon="remove" color="red" size="sm" v-on:click="clearGroupInfo" push glossy></q-btn>
      <q-btn icon="check" color="green" rounded size="sm" v-on:click="createGroup" :disable="checkAllInfos() ? false : true" class="q-ml-xs" push glossy></q-btn>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn icon="chevron_left" color="dark" v-on:click="backStep"></q-btn>
      <q-btn :label="this.stepNumber" color="dark"></q-btn>
      <q-btn icon-right="chevron_right" color="dark" v-on:Click="nextStep"></q-btn>
    </q-card-section>
  </q-card>
  </div>
</template>

<script>
import upload from './upload.vue';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database";
import { useCounterStore} from 'src/stores/store';
export default {
  components:{
    upload
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      changeImageActive:false,
      groupInfo:{},
      stepNumber:0,
      buttonsTypes:[
        {id:1,label:'Food',icon:'restaurant_menu',color:'green'},
        {id:2,label:'Game',icon:'sports_esports',color:'red'},
        {id:3,label:'Talk',icon:'phone_in_talk',color:'blue'},
        {id:4,label:'Drink',icon:'local_bar',color:'orange'}
      ]
    }
  },
  methods:{
    addAdminToMembers(){
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.groupInfo.id}/members/${this.store.user.id}`),{
        id:this.store.user.id,
        email:this.store.user.email,
        date:this.store.currentDateString(),
        name:this.store.userAllInfo.name ? this.store.userAllInfo.name : ''
      })
    },
    createGroup(){
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.groupInfo.id}`),{
        id:this.groupInfo.id,
        optionId:this.groupInfo.optionId,
        optionName:this.groupInfo.optionName,
        icon:this.groupInfo.icon,
        color:this.groupInfo.color,
        adminName:this.groupInfo.adminName,
        adminId:this.groupInfo.adminId,
        maxMember:this.groupInfo.maxMember,
        name:this.groupInfo.name,
        image:this.groupInfo.image,
        adminEmail:this.groupInfo.adminEmail
      })
      this.addAdminToMembers()
      this.$q.notify({
        type:'positive',
        message:`${this.groupInfo.name} Adlı Grup Oluşturuldu.`,
        timeout:700,
        position:'center'
      })
      this.clearGroupInfo()
    },
    clearGroupInfo(){
      this.groupInfo = {}
      this.stepNumber = 0
      this.changeImageActive = false
    },
    checkAllInfos(){
      if(this.groupInfo.name&&this.groupInfo.image&&this.groupInfo.maxMember){
        return true
      }else{
        return false
      }
    },
    removeImage(){
      this.groupInfo.image = ''
    },
    getcurrentImageData(data){
      if(data){
        this.groupInfo.image = data.image
        this.changeImageActive = false
      }
    },
    changeImage(){
      this.changeImageActive =! this.changeImageActive
    },
    checkColor(data){
      if(this.groupInfo.optionId === data.id){
        return true
      }else{
        return false
      }
    },
    backStep(){
      if(this.stepNumber != 0){
        this.stepNumber = this.stepNumber - 1
      }
    },
    nextStep(){
      if(this.groupInfo.optionName){
        this.stepNumber = this.stepNumber + 1
      }
    },
    selectEvent(data){
      this.groupInfo.id = uuidv4()
      this.groupInfo.optionId = data.id
      this.groupInfo.optionName = data.label
      this.groupInfo.icon = data.icon
      this.groupInfo.color = data.color
      this.groupInfo.adminName = this.store.userAllInfo.name ? this.store.userAllInfo.name : this.store.user.email
      this.groupInfo.adminEmail = this.store.user.email
      this.groupInfo.adminId = this.store.user.id
      this.stepNumber = this.stepNumber + 1
      console.log('groupInfo',this.groupInfo)
    },
  },
  watch:{
  }
}
</script>

<style>

</style>
