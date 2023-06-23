<template>
  <q-card class="bg-transparent text-white" flat>
    <q-card-section class="text-center">
      <q-avatar size="230px" v-on:click="zoomProfilePic">
        <img :src="this.selectedUserForDetail.image" alt="" v-if="this.selectedUserForDetail.image" style="object-fit:cover;" >
        <q-btn icon="person" v-if="!this.selectedUserForDetail.image"></q-btn>
      </q-avatar>
      <div class="text-caption text-weight-bold q-mt-md">
         <q-icon name="person"></q-icon>
         {{ this.selectedUserForDetail.name ? this.selectedUserForDetail.name : 'Kullanıcı Adı Belirtilmemiş.' }},
         {{ this.selectedUserForDetail.age ? this.selectedUserForDetail.age : '' }}
      </div>
      <div class="text-caption">
       <q-icon name="email"></q-icon> {{ this.selectedUserForDetail.email }}
      </div>
    </q-card-section>
    <q-separator color="pink-4"></q-separator>
    <q-card-section class="row">
      <div class="q-pa-xs col-4" v-for="(data,key) in this.infosListSecond" :key="key">
        <q-btn :icon="checkIfSimilar(data) ? 'check' : data.icon" :label="data.name" no-caps :color="checkColor(data)"></q-btn>
      </div>
    </q-card-section>
    <q-separator color="pink-4"></q-separator>
    <q-card-section class="text-center">
      <div class="text-caption">
        <q-icon name="info"></q-icon>
        {{ this.selectedUserForDetail.name ? this.selectedUserForDetail.name : this.selectedUserForDetail.email }}
        Adlı Kullanıcı ile Eşleşme Oranı
        <q-badge text-color="white" color="transparent" class="text-weight-bold" :label="getValue()" />
        </div>
      <q-linear-progress
      max="100"
      min="0" style="border-radius:7px;"
      size="10px" :value="getValue()" color="primary">
      </q-linear-progress>
      <!-- <flipbook class="flipbookClass" :pages="imageList.map(item => item.image)"></flipbook> -->
    </q-card-section>
     <q-card-section horizontal class="q-ma-xs">
      <q-btn :label="`Images - ( ${getSelectedUserImageLength()} )`" no-caps flat></q-btn>
      <q-space></q-space>
      <q-btn icon-right="expand_more" flat></q-btn>
    </q-card-section>
     <q-card-section class="row">
      <q-card class="col-4 bg-dark" style="border-radius:4px;" v-for="data in this.imageList" :key="data.id">
        <q-img
        v-on:Click="zoomImage(data)"
        class="q-ma-xs"
        loading="lazy"
        spinner-color="white"
        :src="data.image" style="object-fit:cover;height:100%;"></q-img>
      </q-card>
    </q-card-section>
    <q-dialog
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="this.isActive" v-if="this.isActive" persistent :full-width="this.store.avatarActive ? false : true">
      <q-card class="bg-transparent" v-if="this.selectedImage.id" style="width:700px;max-width:80vw;">
        <q-img :src="this.selectedImage.image">
          <div class="absolute-top-right bg-transparent">
            <q-btn round icon="remove" color="dark"  size="sm" v-on:click="closeImage"></q-btn>
          </div>
        </q-img>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import Flipbook from 'flipbook-vue'
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, onValue } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    Flipbook
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedUserForDetail:{},
      imageList:[],
      infosList:[],
      myInfosList:[],
      myAcc:{},
      similarList:[],
      infosListSecond:[],
      isActive:false,
      selectedImage:{},
    }
  },
  methods:{
    zoomProfilePic(){
      const data  = {id:uuidv4(),image:this.selectedUserForDetail.image}
      this.zoomImage(data)
    },
    closeImage(){
      this.selectedImage = {}
      this.isActive = false
    },
    zoomImage(data){
      console.log(data)
      this.$emit('selectedImage',data)
      this.selectedImage = data
      this.isActive = true
    },
    checkIfSimilar(data){
      const result = this.similarList.find(object => object === data.name)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkColor(data){
      //burası color değişikliği yapıyor benzer özellikler için
      const result = this.similarList.find(object => object === data.name)
      if(result){
        const color = 'dark'
        return color
      }else{
        const color = 'dark'
        return color
      }
    },
    getValue(){
      const avg = 100/8
      const result = Number(avg.toFixed(2))
      const lengthList = this.similarList.length
      const totalResult = lengthList*result + '%'
      console.log(totalResult)
      return totalResult
    },
    lookForSimilar(){
      this.similarList = []
      for (var i = 0; i < this.myInfosList.length; i++) {
        if (this.infosList.includes(this.myInfosList[i])) {
          this.similarList.push(this.myInfosList[i]);
        }
      }
      console.log('similarList',this.similarList)
    },
    forListLoop(){
      this.infosListSecond = []
      this.infosListSecond.push({icon:'work',name:this.selectedUserForDetail.info ? this.selectedUserForDetail.info : ''})
      this.infosListSecond.push({icon:'location_city',name:this.selectedUserForDetail.city ? this.selectedUserForDetail.city : ''})
      this.infosListSecond.push({icon:'location_on',name:this.selectedUserForDetail.country ? this.selectedUserForDetail.country : ''})
      this.infosListSecond.push({icon:'fa-solid fa-info',name:this.selectedUserForDetail.ethnicType ? this.selectedUserForDetail.ethnicType : ''})
      this.infosListSecond.push({icon:'wine_bar',name:this.selectedUserForDetail.drinkingHabbit ? this.selectedUserForDetail.drinkingHabbit : ''})
      this.infosListSecond.push({icon:'person',name:this.selectedUserForDetail.genderOption ? this.selectedUserForDetail.genderOption : ''})
      this.infosListSecond.push({icon:'star',name:this.selectedUserForDetail.lookingForType ? this.selectedUserForDetail.lookingForType : ''})
      console.log('infosListSecond',this.infosListSecond)
    },
    getInfosSelectedUser(){
      this.infosList = []
      this.infosList.push(this.selectedUserForDetail.age ? this.selectedUserForDetail.age : '')
      this.infosList.push(this.selectedUserForDetail.city ? this.selectedUserForDetail.city : '')
      this.infosList.push(this.selectedUserForDetail.birthday ? this.selectedUserForDetail.birthday : '')
      this.infosList.push(this.selectedUserForDetail.country ? this.selectedUserForDetail.country : '')
      this.infosList.push(this.selectedUserForDetail.drinkingHabbit ? this.selectedUserForDetail.drinkingHabbit : '')
      this.infosList.push(this.selectedUserForDetail.ethnicType ? this.selectedUserForDetail.ethnicType : '')
      this.infosList.push(this.selectedUserForDetail.genderOption ? this.selectedUserForDetail.genderOption : '')
      this.infosList.push(this.selectedUserForDetail.lookingForType ? this.selectedUserForDetail.lookingForType : '')
      console.log('ınfosList',this.infosList)
    },
    getMyInfo(){
      this.myInfosList = []
      this.myInfosList.push(this.myAcc.age ? this.myAcc.age :'')
      this.myInfosList.push(this.myAcc.city ? this.myAcc.city :'')
      this.myInfosList.push(this.myAcc.birthday ? this.myAcc.birthday :'')
      this.myInfosList.push(this.myAcc.country ? this.myAcc.country :'')
      this.myInfosList.push(this.myAcc.drinkingHabbit ? this.myAcc.drinkingHabbit :'')
      this.myInfosList.push(this.myAcc.ethnicType ? this.myAcc.ethnicType :'')
      this.myInfosList.push(this.myAcc.genderOption ? this.myAcc.genderOption :'')
      this.myInfosList.push(this.myAcc.lookingForType ? this.myAcc.lookingForType :'')
      this.lookForSimilar()
    },
    getSelectedUserImages(){
      if(this.selectedUserForDetail.images){
        const imageList = []
        for(const [key,value] of Object.entries(this.selectedUserForDetail.images)){
          const imageData = {
            id:`${value.id}`,
            image:`${value.image}`
          }
          imageList.push(imageData)
        }
        this.imageList = imageList
        console.log('imageLis',this.imageList)
      }
    },
    getSelectedUserImageLength(){
      if(this.selectedUserForDetail.images){
        const length = Object.keys(this.selectedUserForDetail.images).length
        return length
      }else{
        return 0
      }
    },
    getSelectedUserAllInfo(){
      const db = getDatabase();
      const dbRef = ref(db, `users/${this.selectedUserForDetail.id}`);
      onValue(dbRef, (snapshot) => {
        this.selectedUserForDetail = snapshot.val();
        console.log('selectedUserForDetail',this.selectedUserForDetail)
        //burası store.selectedyserfordeatil kısmına
        this.store.getMyAcc()
          this.getMyInfo()
          this.getSelectedUserImages()
          this.getInfosSelectedUser()
          this.forListLoop()
      });
    },
  },
  created(){

  },
  watch:{
    'store.userAllInfo':{
      handler(newValue,oldValue){
        if(newValue){
          this.myAcc = newValue
          console.log('mya',this.myAcc)
          this.getMyInfo()
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedUserForDetail':{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedUserForDetail = newValue
          this.getSelectedUserAllInfo()
          console.log('selectedUserForDetail',this.selectedUserForDetail)
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
    width: 700px;
    max-width: 80vw;
  }
  .flipbookClass{
    margin-top:-40%;
    width: 100%;
    height: 30vh;
  }
</style>
