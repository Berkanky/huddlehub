<template>
  <q-dialog
    v-if="this.store.selectedDiscussionDetailActive" v-model="this.store.selectedDiscussionDetailActive"
    :maximized="this.store.avatarActive ? false : true"
    dark
    persistent
    transition-hide="slide-down"
  >
    <q-card
      :style="{'width':this.store.widthOptions()}" style="margin:0 auto;"
      class="bg-dark text-white">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <div class="text-overline text-weight-bold text-grey-6">
            <q-icon name="groups" size="17px" class="q-mr-sm"></q-icon>
            <span> {{ this.store.selectedDisCurrent.name }} - {{ this.store.selectedDisCurrent.category }}</span>
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="170px" rounded>
            <img :src="this.store.selectedDisCurrent.image" alt="" v-if="this.store.selectedDisCurrent.image" style="object-fit:cover;">
            <q-btn icon="person" color="dark" round size="xl" v-if="!this.store.selectedDisCurrent.image"></q-btn>
          </q-avatar>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="q-pa-sm text-weight-bold text-caption text-grey-6">
            <q-icon name="event" size="xs"></q-icon>
            {{ this.createdDateInfo() }}
          </div>
        </q-card-section>
        <div class="text-right">
          <q-btn icon="search" class="q-mr-md" flat color="white" v-if="!this.filterActive">
            <q-popup-edit v-model="this.searchValue" auto-save v-slot="scope" dark class="">
              <q-input v-model="this.searchValue" autofocus counter color="white" dark>
                <template v-slot:append>
                  <q-btn icon="check" color="green" size="xs" round v-on:click="findUser"></q-btn>
                </template>
              </q-input>
            </q-popup-edit>
          </q-btn>
          <q-btn icon="clear_all" flat color="white" v-if="this.filterActive" v-on:click="clearFilter"></q-btn>
        </div>
        <q-card-section class="row">
          <q-scroll-area
            dark
            class="bg-dark text-white rounded-borders"
            style="height: 200px;width:100%;"
          >
          <q-card
            class="bg-dark text-white col-12 col-md-6 col-sm-6" v-for="data in this.members" :key="data.id"
            :dark="checkmeOrNot(data) ? true : false" bordered>
            <q-card-section horizontal>
              <q-card-section class="col-3">
                <q-avatar>
                  <img :src="data.image" alt="" v-if="data.image" style="object-fit:cover;">
                  <q-btn icon="person" v-if="!data.image" round color="dark"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-subtitle2">
                  <q-icon name="admin_panel_settings" v-if="data.id === this.store.selectedDisCurrent.createrId"></q-icon>
                  {{checkName(data)}}
                  <q-icon name="fiber_manual_record" :color="this.store.checkOnlineOrNotGlobal(data) ? 'green' : 'red'"></q-icon>
                </div>
                <div class="text-caption text-weight-bold text-grey-6">
                  {{ data.info ? data.info : 'Bilgi Yok' }}
                </div>
              </q-card-section>
              <q-card-section class="col-3">
                <q-btn icon="more_vert" flat color="white" v-on:click="selectUser(data)"></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-scroll-area>
        </q-card-section>
        <q-card-section class="row">
          <q-card class="col-4 bg-dark" style="height:100px;"
            v-if="this.images.length"
            v-for="data in this.forLoopİmages()" :key="data.imageId">
            <q-img
              loading="lazy"
              spinner-color="white"
              :src="data.image" style="object-fit:cover;height:100px;"></q-img>
          </q-card>
          <q-card class="col-4 bg-dark" style="height:100px;" v-on:click="showGallery" v-if="this.images.length">
            <q-btn icon="collections_bookmark" flat color="green" class="full-width full-height">
              <span class="text-white q-ml-sm">
                + {{ this.getImageLength() }}
              </span>
            </q-btn>
          </q-card>
        </q-card-section>
      </q-card>
      <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
      <q-dialog
        :maximized="this.store.avatarActive ? false : true"
        persistent
        v-if="this.galleryActive" v-model="this.galleryActive"
        dark
      >
        <q-card
          class="bg-dark"
          :style="{'width':this.store.widthOptions()}"
        >
          <q-card-section class="text-left">
            <q-btn icon="keyboard_backspace" flat color="white" v-on:click="this.galleryActive = false"></q-btn>
          </q-card-section>
          <q-card-section class="row">
            <q-card class="col-4 bg-dark" style="height:100px;"
              v-if="this.images.length"
              v-for="data in this.images" :key="data.imageId">
            <q-img
              loading="lazy"
              spinner-color="white"
              :src="data.image" style="object-fit:cover;height:100px;">
              <div class="absolute-top-right bg-transparent" v-if="this.checkAdminOrUser(data)">
                <q-btn icon="remove" size="xs" color="dark" round v-on:click="deleteImage(data)"></q-btn>
              </div>
              <div class="absolute-bottom-right bg-transparent">
                <q-btn icon="fullscreen" color="primary" size="xs" round v-on:click="selectImage(data)"></q-btn>
              </div>
            </q-img>
          </q-card>
          </q-card-section>
        </q-card>
        <zoomImageComp v-if="this.store.selectedZoomImageActive"/>
      </q-dialog>
  </q-dialog>
</template>

<script>
import zoomImageComp from "./zoomImageComp.vue";
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import selectedUserDetailDialog from "./selectedUserDetailDialog.vue";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    selectedUserDetailDialog,
    zoomImageComp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      searchValue:'',
      searchedUsers:[],
      adminInfo:{},
      pureListMembers:[],
      members:[],
      images:[],
      galleryActive:false,
      filterActive:false
    }
  },
  methods:{
    clearFilter(){
      this.members = this.pureListMembers
      this.filterActive = false
    },
    findUser(){
      const list = this.pureListMembers
      if(this.searchValue){
        const result = list.filter(object => (object.name.toLowerCase()).includes(this.searchValue.toLowerCase()) || (object.email.toLowerCase()).includes(this.searchValue.toLowerCase()))
        if(result.length){
          console.log('findeds',result)
          this.members = result
          this.filterActive = true
        }else{
          this.$q.notify({
            type:'negative',
            message:'Üye Bulunamadı !',
            timeout:700,
            position:'bottom'
          })
          this.searchValue = ''
        }
      }
    },
    deleteImage(data){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Seçili Mesajı Silmek İstediğinzden Emin misiniz ?'
      }).onOk(()=>{
        const db = getDatabase()
        remove(ref(db,`discussions/${this.store.selectedDisCurrent.id}/chats/${data.messageId}/images/${data.imageId}`))
        this.images = this.images.filter(object => object.imageId !== data.imageId)
        this.$q.notify({
          type:'positive',
          icon:'check',
          position:'bottom',
          timeout:700
        })
      }).onCancel(()=>{
        //
      })
    },
    checkAdminOrUser(data){
      if(data.senderId === this.store.user.id || this.store.selectedDisCurrent.createrId === this.store.user.id){
        return true
      }else{
        return false
      }
    },
    getImageLength(){
      if(this.images.length){
        const length = this.images.length
        return length
      }else{
        return 0
      }
    },
    selectImage(data){
      console.log(data)
      this.store.selectedZoomImage.id = data.imageId
      this.store.selectedZoomImage.image = data.image
      this.store.selectedZoomImage.senderId = data.senderId
      this.store.selectedZoomImageActive = true
    },
    showGallery(){
      this.galleryActive = true
    },
    forLoopİmages(){
      if(this.images.length){
        const list = this.images.slice(0,3)
        return list
      }
    },
    getChatImages(){
      if(this.store.selectedDisChats.length){
        const list = []
        this.store.selectedDisChats.forEach(element => {
          if(element.images){
            for(const [key,value] of Object.entries(element.images)){
              const imageData = {
                imageId:`${value.imageId}`,
                date:`${value.date}`,
                image:`${value.image}`,
                imageDate:`${value.imageDate}`,
                senderId:`${element.senderId}`,
                messageId:`${element.id}`
              }
              const result = list.some(object => object.imageId === imageData.imageId)
              if(!result){
                list.push(imageData)
              }
            }
          }
        });
        this.images = list
        console.log('imagesList',this.images)
      }else{
        this.images = []
      }
    },
    getMembersLength(){
      if(this.members.length){
        const length = this.members.length
        return length
      }else {
        return 0
      }
    },
    selectUser(data){
      this.store.showUserDetail = data
      this.store.showUserDetailActive = true
    },
    checkmeOrNot(data){
      if(data.id === this.store.user.id){
        return true
      }else{
        return false
      }
    },
    checkName(data){
      if(data.id === this.store.user.id){
        const name = 'Siz'
        return name
      }else{
        const name = data.name ? data.name : data.email
        return name
      }
    },
    getMembers(data){
      if(data.chats){
        this.members = []
        for(const [key,value] of Object.entries(data.chats)){
          const result = this.store.usersList.find(object => object.id === `${value.senderId}`)
          if(result){
            const check = this.members.some(object => object.id === result.id)
            if(!check){
              this.members.push(result)
            }
          }
        }
        this.pureListMembers = this.members
        console.log('members',this.members)
      }
    },
    findAdmin(){
      const result = this.store.usersList.find(object => object.id === this.store.selectedDisCurrent.createrId)
      if(result){
        this.adminInfo = result
      }
    },
    goBack(){
      this.store.selectedDiscussionDetailActive = false
    },
    createdDateInfo(){
      const message = this.store.selectedDisCurrent.createdDate ? `${this.store.selectedDisCurrent.createdDate } Tarihinde Oluşturuldu.`: 'Tarih Belirli Değil !'
      return message
    }
  },
  created(){

  },
  watch:{
    'store.selectedDisCurrent':{
      handler(newValue,oldValue){
        if(newValue.id){
          const data = newValue
          this.getMembers(data)
          this.getChatImages()
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedDiscussionDetailActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          this.findAdmin()
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
