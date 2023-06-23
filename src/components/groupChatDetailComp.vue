<template>
  <q-dialog
    :maximized="this.store.avatarActive ? false : true"
    :full-height="this.store.avatarActive ? false : true"
    persistent
    dark
    v-if="this.store.showGroupChatDetailActive" v-model="this.store.showGroupChatDetailActive"
  >
    <q-card
      :style="{'width':this.store.widthOptions()}" style="margin:0 auto;"
      class="bg-dark text-capitalize">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
          <q-space></q-space>
          <div class="text-caption text-weight-bold text-grey-4 text-capitalize">
            <q-icon name="groups" size="14px"></q-icon>
            {{ this.store.selectedGroupChat.groupName }}
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar rounded size="150px">
            <img
              style="object-fit:cover;"
              :src="this.store.currentGroupDetailChat.image" alt="" v-if="this.store.currentGroupDetailChat.image">
            <q-btn icon="group" v-if="!this.store.currentGroupDetailChat.image" color="dark" round size="xl"></q-btn>
          </q-avatar>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-caption text-weight-bold text-grey-6">
            <q-icon name="event" size="17px"></q-icon>
            {{ this.store.currentGroupDetailChat.createdDate ? this.store.currentGroupDetailChat.createdDate : '' }}
          </div>
        </q-card-section>
        <q-card-section class="row" v-if="this.memberList.length">
          <q-btn :label="`Üye Sayısı - ${this.memberList.length}`" no-caps flat color="white" icon="groups"></q-btn>
          <q-space></q-space>
          <q-btn
            :color="this.searchActive ? 'red' : 'white'"
            :icon="!this.searchActive ? 'search' : 'clear_all'" flat
            v-on:click="this.searchActive ? this.resetSearch() : this.searchUser()"></q-btn>
        </q-card-section>
        <q-card-section class="row">
          <q-card
            :dark="this.store.user.id === data.id ? true : false"
            class="bg-dark q-mb-xs col-12 col-md-6 col-sm-6" v-for="data in this.memberList" :key="data.id">
            <q-card-section class="row">
              <q-card-section class="col-3">
                <q-avatar v-on:click="selectUser(data)">
                  <img :src="data.image" alt="" v-if="data.image" style="object-fit:cover;">
                  <q-btn icon="person" color="dark" round v-if="!data.image"></q-btn>
                </q-avatar>
              </q-card-section>
              <q-card-section class="col">
                <div class="text-subtitle2 text-weight-bold text-grey-6">
                  <q-icon name="admin_panel_settings" color="white" v-if="this.store.currentGroupDetailChat.createrId === data.id"></q-icon>
                  <q-icon name="person" color="white"></q-icon>
                  {{ this.store.findUserName(data) }}
                  <q-btn
                    v-if="this.store.user.id !== data.id"
                    flat :color="data.online ? 'green' : 'red'" icon="fiber_manual_record" size="sm"></q-btn>
                </div>
                <div class="text-caption text-weight-bold text-grey-6">
                  <q-icon name="work" color="white"></q-icon>
                  {{ data.info ? data.info : '' }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section class="row">
          <q-btn icon="collections_bookmark" flat color="white" :label="`Image - ${this.imageList.length}`" no-caps></q-btn>
          <q-space></q-space>
          <q-btn icon="chevron_right" flat color="white" v-on:Click="openGallery"></q-btn>
        </q-card-section>
        <q-card-section class="row">
          <q-card class="bg-dark col-12 col-md-4 col-sm-4" dark bordered v-for="(data,key) in this.loopForImage()" :key="key" style="height:100px;">
            <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:cover;height:100px;"></q-img>
          </q-card>
        </q-card-section>
      </q-card>
      <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
      <q-dialog
        v-if="this.imageDialogActive" v-model="this.imageDialogActive"
        :full-height="this.store.avatarActive ? false : true"
        :maximized="this.store.avatarActive ? false : true"
        persistent dark
      >
        <q-card class="bg-dark" :style="{'width':this.store.widthOptions()}" style="margin:0 auto;">
          <q-card-section class="row">
            <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBackFromGallery"></q-btn>
            <q-space></q-space>
            <q-btn icon="clear_all" flat color="white" v-if="this.imageFilterActive" v-on:click="resetImageListFilter"></q-btn>
            <q-btn-dropdown
              v-if="!this.imageFilterActive"
              split
              dark
              no-caps
              text-color="white"
              icon="groups"
              label="Members"
            >
              <q-list class="bg-dark text-white">
                <q-item clickable v-close-popup @click="selectMember(data)" v-for="data in this.memberList" :key="data.id">
                  <q-item-section avatar>
                    <q-avatar icon="person" color="dark" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{getNameMembers(data)}}</q-item-label>
                    <q-item-label caption class="bg-dark text-white">{{data.info ? data.info : ''}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="fiber_manual_record" flat :color="data.online ? 'green' : 'red'" size="sm"></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
          <q-card-section class="" v-if="this.selectedMemberForImageFilter.id">
            <q-card class="bg-dark text-white" flat>
              <q-card-section horizontal>
                <q-btn icon="person" color="dark" round size="md"></q-btn>
                <div class="text-caption text-weight-bold text-grey-6">
                  {{ this.selectedMemberForImageFilter.name ? this.selectedMemberForImageFilter.name : this.selectedMemberForImageFilter.email }}
                  Adlı Kullanıcıya Ait Fotoğraflar
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
          <q-card-section class="row">
            <q-card class="col-4 bg-dark text-white" dark bordered style="height:150px;" v-for="(data,key) in this.imageList" :key="key">
              <q-img
                loading="lazy"
                spinner-color="white"
                style="height:150px;object-fit:cover;" :src="data.image" v-on:click="selectImage(data)" v-touch-hold:1000.mouse="event => removeSelectedImage(data)">
     <!--              <div class="absolute-top-right bg-transparent" v-if="data.senderId === this.store.user.id">
                    <q-btn icon="remove" color="dark" round size="sm" v-on:Click="removeSelectedImage(data)"></q-btn>
                  </div> -->
                </q-img>
            </q-card>
          </q-card-section>
        </q-card>
      </q-dialog>
      <zoomImageComp v-if="this.store.selectedZoomImageActive"/>
  </q-dialog>
</template>

<script>
import zoomImageComp from '../components/zoomImageComp.vue'
import selectedUserDetailDialog from "./selectedUserDetailDialog.vue";
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
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
      memberList:[],
      pureMemberList:[],
      searchValue:'',
      searchActive:false,
      imageList:[],
      pureImageList:[],
      imageDialogActive:false,
      imageFilterActive:false,
      selectedMemberForImageFilter:{}
    }
  },
  methods:{
    removeSelectedImage(data){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`Seçili Fotoğrafı Silme İşlemini Onaylıyor musunuz ?`
      }).onOk(()=>{
        console.log('groupChats/',this.store.selectedGroupChat.id,data.messageId,data)
        const db = getDatabase()
        remove(ref(db,`groupChats/${this.store.selectedGroupChat.id}/chats/${data.messageId}/image`))
        const result = this.imageList.find(object => object.messageId === data.messageId)
        if(result){
          result.image = ''
        }
        this.$q.notify({
          type:'positive',
          message:'Fotoğraf Silindi',
          timeout:700,
          position:'bottom'
        })
      }).onCancel(()=>{
        //
      })
    },
    getNameMembers(data){
      if(data.id === this.store.user.id){
        const name = 'Siz'
        return name
      }else{
        const name = data.name ? data.name : data.email
        return name
      }
    },
    selectImage(data){
      this.store.selectedZoomImageActive = true
      this.store.selectedZoomImage = data
      console.log(data)
    },
    resetImageListFilter(){
      this.imageList = this.pureImageList
      this.imageFilterActive = false
      this.selectedMemberForImageFilter = {}
    },
    selectMember(data){
      this.imageList = this.pureImageList
      const result = this.imageList.filter(object => object.senderId === data.id)
      if(result.length){
        this.imageList = result
        this.imageFilterActive = true
        this.selectedMemberForImageFilter = data
      }else{
        this.$q.notify({
            type:'negative',
            message:`${data.name  ? data.name : data.email} Ait Fotoğraf Bulunamadı !`,
            timeout:700,
            icon:'info',
            position:'bottom'
          })
      }
    },
    filterImages(){
    },
    goBackFromGallery(){
      this.imageDialogActive = false
    },
    openGallery(){
      this.imageDialogActive = true
    },
    loopForImage(){
      const list = this.imageList.slice(0,4)
      return list
    },
    resetSearch(){
      this.searchActive = false
      this.memberList = this.pureMemberList
    },
    findUserFunction(data){
      this.memberList = this.pureMemberList
      const result = this.store.usersList.filter(object => (object.name ? object.name : object.email).toLowerCase().includes(String(data).toLowerCase()))
      if(result.length){
        const list = []
        result.forEach(element => {
          const secondResult = this.memberList.some(object => object.id === element.id)
          if(secondResult){
            list.push(element)
          }
        });
        console.log(list)
        if(list.length){
          this.memberList = list
          this.searchActive = true
          this.searchValue = ''
        }else{
          this.searchActive = false
          this.$q.notify({
            type:'negative',
            message:`${data} Bulunamadı !`,
            timeout:700,
            icon:'info',
            position:'bottom'
          })
          this.searchValue = ''
        }
      }
    },
    searchUser(){
      this.$q.dialog({
        dark: true,
        title: 'Members',
        message: 'What is your name?',
        maximized:this.store.avatarActive ? false : true,
        fullHeight:this.store.avatarActive ? false : true,
        prompt: {
          model: this.searchValue,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {

        this.findUserFunction(data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    selectUser(data){
      this.store.showUserDetail = data
      this.store.showUserDetailActive = true
    },
    goBack(){
      this.store.showGroupChatDetailActive = false
      this.store.currentGroupDetailChat = {}
    },
    getGroupMembers(data){
      if(data.members){
        let list = []
        for(const [key,value] of Object.entries(data.members)){
          const memberData = {
            id:`${value.id}`,
            date:`${value.date}`,
            image:`${value.image ? value.image : ''}`,
            memberDate:`${value.memberDate}`
          }
          const result = list.some(object => object.id === memberData.id)
          if(!result){
            list.push(memberData)
          }
        }
        const secondList = []
        list.forEach(element => {
          const thirdResult = this.store.usersList.find(object => object.id === element.id)
          if(thirdResult){
            secondList.push(thirdResult)
          }
        });
        if(list.length){
          this.memberList = secondList
          this.pureMemberList = secondList
          console.log('memberList',this.memberList)
        }
      }else{
        this.memberList = []
      }
    },
    getCurrentGroupChatDetail(){
      const db = getDatabase();
      const dbRef = ref(db, `groupChats/${this.store.selectedGroupChat.id}`);
      onValue(dbRef, (snapshot) => {
        this.store.currentGroupDetailChat = snapshot.val();
        console.log('currentGroupDetailChat',this.store.currentGroupDetailChat)
        const data = this.store.currentGroupDetailChat
        this.getGroupMembers(data)
        this.getCurrentGroupChatImages(data)
      });
    },
    getCurrentGroupChatImages(data){
      if(data.chats){
        const list = []
        for(const [key,value] of Object.entries(data.chats)){
          const chatData = {
            messageId:`${value.messageId}`,
            name:`${value.name ? value.name : ''}`,
            senderId:`${value.senderId}`,
            image:`${value.image ? value.image : ''}`,
            email:`${value.email ? value.email : ''}`,
            fullDate:`${value.fullDate}`,
            date:`${value.date}`
          }
          const result = list.some(object => object.messageId === chatData.messageId)
          if(!result && chatData.image){
            list.push(chatData)
          }
        }
        this.imageList = list
        console.log('images',list)
        this.pureImageList = list
      }else{
        this.imageList = []
      }
    }
  },
  created(){
    this.getCurrentGroupChatDetail()
  },
  mounted(){

  },
  watch:{
    'store.selectedGroupChat':{
      handler(newValue,oldValue){
        if(newValue){
          const data  = newValue
          console.log(data)

        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
</style>
