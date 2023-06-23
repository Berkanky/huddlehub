<template>
  <div class="WAL position-relative bg-dark" :style="{'height':this.$q.screen.height + 'px'}">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="this.leftDrawerOpen =!this.leftDrawerOpen"
          />
          <q-avatar>
              <img v-if="this.store.selectedDisCurrent.image" :src="this.store.selectedDisCurrent.image">
            </q-avatar>
          <span class="q-subtitle-1 q-pl-md">
            {{ this.store.selectedDisCurrent.name ? this.store.selectedDisCurrent.name : '' }}
          </span>
          <q-space/>
          <q-btn
            :disable="this.checkSelectedOrNot() ? false : true"
            round flat icon="more_vert" v-on:Click="selectedDiscussionCompFilter"  v-if="!this.store.selectedDisChatFilterActive" color="dark">
          </q-btn>
          <q-btn icon="filter_list_off" flat color="dark" size="" v-on:Click="resetChatFilter" v-if="this.store.selectedDisChatFilterActive"></q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-btn icon="home" flat color="grey-8" v-on:click="goBeforePage"></q-btn>
          <q-space />
          <q-btn icon="more_vert" flat color="dark" v-on:click="showOptions" v-if="!this.store.filterActiveOn"></q-btn>
          <q-btn icon="filter_list_off" flat color="dark" v-on:click="clearFilter" v-if="this.store.filterActiveOn"></q-btn>
          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="this.leftDrawerOpen=!this.leftDrawerOpen"
          />
        </q-toolbar>
        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list bordered separator>
            <q-item
              :class="checkSelected(data) ? 'bg-pink-4 text-white' : 'bg-white text-dark'"
              clickable
              v-on:click="goDiscuss(data)" v-ripple v-for="data in this.store.allDiscussionsList"
              v-show="data.id"
              :key="data.id" horizontal>
              <q-btn :icon="this.checkIconName(data)" :color="checkSelected(data) ? 'white' : 'grey-8'" flat class="col-3"></q-btn>
              <q-item-section class="text-capitalize col-7">
                <q-item-label>
                  {{data.name}}
                </q-item-label>
                <q-item-label
                  caption
                  :class="this.store.selectedDisCurrent.id === data.id ? 'text-white text-weight-bold' : 'text-grey-7 text-weight-bold'">
                  {{ data.createdDate }}
                </q-item-label>
                <q-item-label caption
                :class="this.store.selectedDisCurrent.id === data.id ? 'text-white text-weight-bold' : 'text-grey-7 text-weight-bold'"
                >
                  {{ checkMaxMessage(data) }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="col-2">
                <q-item-label>
                  <q-icon name="chat" size="13px"></q-icon>
                  {{ getCommentNumber(data) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container
        class="bg-grey-2 pageContainer"
        :style="{'height':this.store.selectedDisChats.length ? '100%' : this.$q.screen.height + 'px'}">
        <selectedDiscussion
          :forDeleteListLocal="this.forDeleteListLocal"
          @forDeleteList="getforDeleteList"
          :message="this.message"
          v-if="this.store.selectedDis.id"/>
          <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="this.forDeleteListLocal.length">
            <q-btn round color="red" icon="delete_forever" v-on:click="deleteSelecteds"/>
            <q-btn label="Iptal" color="dark" v-on:click="cancelForDeleteList"></q-btn>
          </q-page-sticky>
      </q-page-container>
      <q-footer>
        <selectedImagesShowOnInput
          @sendSelectedImages="getsendSelectedImages"
          v-if="this.store.selectedImagesForChats.length"/>
        <q-toolbar class="bg-grey-3 text-black row">
          <attachFileButtonVue v-if="!this.getBlockeds() && this.checkHowManyMessageSended()"/>
          <q-input
            :disable="this.checkSelectedOrNot() && !this.getBlockeds()&& this.checkHowManyMessageSended() ? false : true"
            color="white"
            v-on:keyup.enter="sendMessage"
            rounded outlined dense class="WAL__field col-grow q-mr-sm"
            bg-color="white" v-model="this.message" placeholder="Type a message">
            <template v-slot:prepend v-if="!this.message">
              <q-icon name="chat" color="grey-6"></q-icon>
            </template>
            <template v-slot:prepend v-if="this.message">
              <q-btn icon="remove" color="grey-7" v-on:click="this.message = ''" size="sm" round></q-btn>
            </template>
            <template v-slot:after v-if="this.message">
              <q-btn icon="send" round color="pink" glossy v-on:click="this.sendMessage()" size="13px"></q-btn>
            </template>
          </q-input>
        </q-toolbar>
      </q-footer>
    </q-layout>
    <notifyComp v-if="this.store.notifyListActive"/>
    <filter-for-discuss-list v-if="this.store.showOptionsActive"/>
    <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
    <selectedDiscussionDetail
      v-if="this.store.selectedDiscussionDetailActive"/>
  </div>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild, orderByKey } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import selectedImagesShowOnInput from 'src/components/selectedImagesShowOnInput.vue';
import attachFileButtonVue from '../components/attachFileButton.vue'
import selectedDiscussionDetail from 'src/components/selectedDiscussionDetail.vue';
import notifyComp from 'src/components/notifyComp.vue';
import selectedUserDetailDialog from 'src/components/selectedUserDetailDialog.vue';
import filterForDiscussList from 'src/components/filterForDiscussList.vue';
import selectedDiscussion from '../components/selectedDiscussion.vue'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    selectedImagesShowOnInput,
    notifyComp,
    filterForDiscussList,
    selectedDiscussion,
    selectedUserDetailDialog,
    selectedDiscussionDetail,
    attachFileButtonVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store,
    }
  },
  data:function(){
    return{
      message:'',
      selectedDis:{},
      leftDrawerOpen:false,
      randomId:'',
      forDeleteListLocal:[]
    }
  },
  methods:{
    cancelForDeleteList(){
      this.forDeleteListLocal = []
    },
    deleteSelecteds(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Seçili Mesajları Silmek İstediğinizden Emin misiniz ?',
        cancel:true
      }).onOk(()=>{
        this.forDeleteListLocal.forEach(element => {
          const db = getDatabase()
          remove(ref(db,`discussions/${this.store.selectedDis.id}/chats/${element.id}`))
          this.forDeleteListLocal = this.forDeleteListLocal.filter(object => object.id !== element.id)
        });
      }).onCancel(()=>{
        //
      })
    },
    getforDeleteList(data){
      if(data){
        this.forDeleteListLocal = data
      }
    },
    checkAllDiscussions(){
    },
    checkMaxMessage(data){
      if(data.maxMessageValue){
        const number = data.maxMessageValue
        const message = `Kullanıcıların ${number} Mesaj Hakkı Bulunmaktadır.`
        return message
      }else{
        return ''
      }
    },
    checkHowManyMessageSended(){
      if(this.store.selectedDisCurrent.maxMessageValue){
        let list = this.store.selectedDisChats.filter(object => object.senderId === this.store.user.id && !object.adminEffect)
        if(list){
          let lengthList = list.length
          if(lengthList< Number(this.store.selectedDisCurrent.maxMessageValue)){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      }else{
        return true
      }
    },
    getBlockeds(){
      if(this.store.selectedDisCurrent.blocks){
        const list = []
        for(const [key,value] of Object.entries(this.store.selectedDisCurrent.blocks)){
          const blockerData = {
            id:`${value.id}`
          }
          list.push(blockerData)
        }
        const result = list.some(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    sendImagesInToChat(data){
      this.store.selectedImagesForChats.forEach(element => {
        const db = getDatabase()
        set(ref(db,`discussions/${this.store.selectedDis.id}/chats/${data}/images/${element.id}`),{
          imageId:element.id,
          date:Date.now(),
          imageDate:this.store.currentDateString(),
          image:element.image
        })
        this.store.selectedImagesForChats = this.store.selectedImagesForChats.filter(object => object.id !== element.id)
      });
      this.store.imageObject = {}
      this.randomId = ''
    },
    sendImagesLikeSendMessages(){
      if(this.store.selectedImagesForChats.length){
        this.randomId = uuidv4()
        const data = this.randomId
        const db = getDatabase()
        set(ref(db,`discussions/${this.store.selectedDis.id}/chats/${this.randomId}`),{
          date:Date.now(),
          fullDate:this.store.currentDateString(),
          id:this.randomId,
          senderId:this.store.user.id,
          senderName:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          updatedStatus:false,
          status:false,
          message:this.store.imageObject.message ? this.store.imageObject.message : '',
        })
        this.sendImagesInToChat(data)
      }
    },
    getsendSelectedImages(data){
      if(data){
        this.$q.dialog({
          dark:true,
          cancel:true,
          title:'Warning',
          message:'Fotoğrafları Gönderme İşlemini Onaylıyor musunuz ?'
        }).onOk(()=>{
          this.sendImagesLikeSendMessages()
        }).onCancel(()=>{

        })
      }
    },
    checkSelectedOrNot(){
      if(this.store.selectedDis.id){
        return true
      }else{
        return false
      }
    },
    sendMessage(){
      if(this.message){
        this.store.messageInDiscuss = this.message
        console.log(this.store.messageInDiscuss)
        this.message = ''
      }
    },
    goBeforePage(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`Bu Sayfayadan Ayrılıyorsunuz, Onaylıyor musunuz ?`
      }).onOk(()=>{
        this.$router.go(-1)
      }).onCancel(()=>{
        //
      })
    },
    resetChatFilter(){
      this.store.resetChatFilterActive = true
    },
    checkYouMemberOrNot(){
      if(this.store.selectedDisCurrent.chats){
        const list = []
        for(const [key,value] of Object.entries(this.store.selectedDisCurrent.chats)){
          const memberData = {
            senderId:`${value.senderId}`
          }
          const result = list.some(object => object.senderId === memberData.senderId)
          if(!result){
            list.push(memberData)
          }
        }
        const secondResult = list.some(object => object.senderId === this.store.user.id)
        if(secondResult){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    selectedDiscussionCompFilter(){
      if(this.checkYouMemberOrNot()){
        this.store.fromParentToChildSelectCrudOption = true
      }else{
        this.$q.notify({
          type:'negative',
          message:'Grup Hakkında Daha Fazla Bilgiye Ulaşmak İçin Gruba Katılım Göstermeniz Gerekmektedir.',
          timeout:800,
          position:'top'
        })
      }
    },
    checkIconName(data){
      if(this.store.selectedDis.id === data.id){
        const iconName = 'check'
        return iconName
      }else if(this.store.mySavedDiscussions.some(object => object.id === data.id)){
        const iconName ='bookmark_added'
        return iconName
      }else{
        const iconName = 'groups'
        return iconName
      }
    },
    firstLoadIfNotSelected(){
      if(this.store.allDiscussionsList.length && !this.selectedDis.id){
        this.selectedDis = this.store.allDiscussionsList[0]
      }else{
        //
      }
    },
    clearFilter(){
      this.store.filterActiveOn = false
      this.store.allDiscussionsList = this.store.pureListDiscussions
    },
    showOptions(){
      this.store.showOptionsActive = true
    },
    checkForRespon(){
      if(this.store.avatarActive){
        return false
      }else if(!this.store.avatarActive&&this.store.selectedDis.id){
        return true
      }
    },
    checkSelected(data){
      if(this.store.selectedDis.id === data.id){
        return true
      }else{
        return false
      }
    },
    goDiscuss(data){
      console.log(data.id)
      console.log(this.store.mySavedDiscussions)
      this.store.selectedDis = data
    },
    getCommentNumber(data){
      if(data.chats){
        const length = Object.entries(data.chats).length
        return length
      }else{
        return 0
      }
    }
  },
  mounted(){
   // this.firstLoadIfNotSelected()
  },
  created(){
    this.store.getUsers()
    this.store.getAllDiscussions()
    this.checkAllDiscussions()
  },
  watch:{
    'store.selectedDisCurrent':{
      handler(newValue,oldValue){
        if(newValue){
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMySavedDiscussions()
          this.store.getMyBlocks()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  background: linear-gradient(to bottom right, #d7dde8 50%, #F06292 50%)
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
