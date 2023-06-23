<template>
  <div>
    <q-chat-message
        class="q-pa-xs q-ma-sm"
        v-for="data in this.chats" :key="data.id"
        :stamp="checkDeletedFromAdminOrNot(data)"
        :sent="data.senderId === this.store.user.id ? true : false"
        :bg-color="data.senderId === this.store.user.id ? 'green-6' : 'white'"
        :text-color="data.senderId === this.store.user.id ? 'white' : 'dark'"
      >
      <template v-slot:avatar>
        <img
          v-on:click="selectAvatar(data)"
          style="object-fit:cover;"
          :src="findUserImage(data)" alt=""
          class="q-message-avatar q-message-avatar--sent q-ma-sm" v-if="checkUserImage(data)&&!this.checkSelectedMessageOrNot(data)">
          <q-btn icon="check" color="dark" round v-if="this.checkSelectedMessageOrNot(data)" class="q-message-avatar q-message-avatar--sent q-ma-sm"></q-btn>
      </template>
      <div
      style="display:block;"
      :class="checkTextColor(data)"
      v-on:click="selectForOnlyDelete(data)"
      v-touch-hold.mouse="event => selectMessage(data)"
      >
        <div v-if="data.images" class="row q-mb-md">
          <q-card
            class="bg-transparent col-12 col-md-6 col-sm-6"
            bordered v-for="image in data.images" :key="image.imageId"
            style="height:150px;border-radius:4px;width:260px;">
            <q-img
              loading="lazy"
              spinner-color="white"
              :src="image.image" style="height:150px;width:100%;object-fit:cover;"></q-img>
          </q-card>
        </div>
        <span class="" :class="data.images ? 'q-mt-sm' : ''">
          <q-icon v-if="checkAdminEffect(data)" name="block"></q-icon>
          {{ data.message }}
        </span>
        <div class="text-weight-bold" v-if="!checkAdminEffect(data)&&data.senderId !== this.store.user.id">
          <q-btn
            flat
            icon="arrow_drop_up" size="md" round
            :color="checkLikedOrNot(data) ? 'red' : 'grey-8'"
            v-on:click="likeComment(data)"></q-btn>
            <q-btn flat :label="getHowManyLiked(data)" v-on:click="showLikers(data)"></q-btn>
        </div>
      </div>
      </q-chat-message>
      <showLikersDiscuss
      :likersList="this.likersList.length ? this.likersList : ''"
      v-if="this.store.showLikerActive"/>
      <filterForDiscussList v-if="this.store.showOptionsActive" @findedMessages="getfindedMessages"/>
      <discussionAdmin
        :chats="this.chats.length ? this.chats : ''"
        :selected="this.selected"
        v-if="this.store.adminPanelDisActive"/>
      <selectedUserDetailDialogVue v-if="this.store.showUserDetailActive"/>
  </div>
</template>

<script>
import selectedUserDetailDialogVue from '../components/selectedUserDetailDialog.vue'
import discussionAdmin from "./discussionAdmin.vue";
import filterForDiscussList from "./filterForDiscussList.vue";
import showLikersDiscuss from "./showLikersDiscuss.vue";
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { useCounterStore } from 'src/stores/store';
export default {
  props:['message','forDeleteListLocal'],
  components:{
    showLikersDiscuss,
    filterForDiscussList,
    discussionAdmin,
    selectedUserDetailDialogVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selected:{},
      message:{},
      chats:[],
      likersList:[],
      forDeleteList:[]
    }
  },
  methods:{
    checkSelectedMessageOrNot(data){
      const result = this.forDeleteList.some(object => object.id ===  data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    selectForOnlyDelete(data){
      if(data.senderId === this.store.user.id){
        const result = this.forDeleteList.some(object => object.id === data.id)
        if(result){
          this.forDeleteList = this.forDeleteList.filter(object => object.id !== data.id)
        }else{
          if(!data.adminEffect){
            this.forDeleteList.push(data)
          }
        }
        this.$emit('forDeleteList',this.forDeleteList)
      }
    },
    checkTextColor(data){
      if(this.store.user.id === data.senderId){
        return 'white'
      }else if(this.store.user.id !== data.senderId){
        return 'grey-6'
      }else if(data.adminEffect&&this.store.user.id !== data.senderId){
        return 'grey-7 text-weight-bold'
      }else if(data.adminEffect&&this.store.user.id === data.senderId){
        return 'grey-5 text-weight-bold'
      }
    },
    selectAvatar(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    adminDetail(){
      const result = this.store.usersList.find(object => object.id === this.selected.createrId)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    findCreater(){
      const result = this.store.usersList.find(object => object.id === this.selected.createrId)
      if(result){
        if(result.id === this.store.user.id){
          const name = 'Siz'
          return name
        }else{
          const name = result.name ? result.name : result.email
          return name
        }
      }
    },
    checkDeletedFromAdminOrNot(data){
      if(data.adminEffect){
        const date = data.removedDate ? data.removedDate : ''
        return date
      }else{
        const date = data.fullDate ? data.fullDate : ''
        return date
      }
    },
    checkAdminEffect(data){
      if(data.adminEffect){
        return true
      }else{
        return false
      }
    },
    checkBlockListInGroup(){
      const result = this.store.blockListDiscussion.some(object => object.id === this.store.user.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    getBlockListInGroup(){
      if(this.selected.blocks){
        const list = []
        for(const [key,value] of Object.entries(this.selected.blocks)){
          const memberData = {
            id:`${value.id}`,
            name:`${value.name}`,
            blockedDate:`${value.blockedDate}`
          }
          list.push(memberData)
        }
        this.store.blockListDiscussion = list
        console.log('blockList',this.store.blockListDiscussion)
      }else{
        this.store.blockListDiscussion  = []
      }
    },
    resetChatFilter(){
      this.chats = this.store.selectedDisChats
      this.store.selectedDisChatFilterActive = false
      this.store.resetChatFilterActive =  false
    },
    getfindedMessages(data){
      if(data){
        console.log(data)
        this.chats = data
      }
    },
    selectMessage(data){
      if(!this.checkAdminEffect(data)){
        console.log(data)
        this.store.selectedCommentDiscuss = data
        this.store.showOptionsActive = true
        this.store.commentOptionActive = true
      }
    },
    checkForSaved(){
      if(this.store.checkCurrentDiscussSavedOrNot()){
        const result = this.store.mySavedDiscussions.find(object => object.id === this.store.selectedDis.id)
        if(result){
          const date = result.savedDate ? result.savedDate : 'Tarih Bulunamadı'
          const message = date + ' ' + 'Tarihinde Kaydedildi'
          return message
        }
      }
    },
    selectCrudOption(){
      this.store.crudOptionActive = true
      this.store.showOptionsActive = true
      this.store.fromParentToChildSelectCrudOption = false
    },
    showLikers(data){
      if(data.likes){
        const list = []
        for(const [key,value] of Object.entries(data.likes)){
          const likerData = {
            id:`${value.id}`,
            date:`${value.date}`,
            fullDate:`${value.fullDate}`
          }
          list.push(likerData)
        }
        this.likersList = list
        this.store.showLikerActive = true
        console.log('liker',this.likersList)
      }else{
        this.likersList = []
        console.log('liker',this.likersList)
      }
    },
    getHowManyLiked(data){
      if(data.likes){
        const lengthLike = Object.entries(data.likes).length
        return lengthLike
      }else{
        return 0
      }
    },
    checkLikedOrNot(data){
      return !!data.likes && Object.values(data.likes).some(value => value.id === this.store.user.id);
    },
    likeComment(data){
      if(!this.checkLikedOrNot(data)){
        const db = getDatabase()
        set(ref(db,`discussions/${this.selected.id}/chats/${data.id}/likes/${this.store.user.id}`),{
          id:this.store.user.id,
          date:Date.now(),
          fullDate:this.store.currentDateString()
        })
      }else{
        const db = getDatabase()
        remove(ref(db,`discussions/${this.selected.id}/chats/${data.id}/likes/${this.store.user.id}`))
      }

    },
    scrollToBottom() {
      const chatArea = this.$refs.chatArea.$el;
      chatArea.scrollTop = chatArea.scrollHeight;
    },
    checkUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    },
    getCurrentSelectedDis(){
      const db = getDatabase()
      const dbRef = ref(db,`discussions/${this.selected.id}`)
      onValue(dbRef,(snapshot) => {
        this.selected = snapshot.val()
        this.store.selectedDisCurrent = snapshot.val()
        console.log('currentSEelctedDis',this.store.selectedDisCurrent)
        this.getBlockListInGroup()
      })
    },
    getSelectedDisChats(data){
      const db = getDatabase()
      const dbRef = query(ref(db,`discussions/${data.id}/chats`),orderByChild('date','desc'))
      onValue(dbRef,(snapshot) => {
        this.chats = []
        snapshot.forEach((childSnapshot) => {
          this.chats.push(childSnapshot.val())
        })
        this.store.selectedDisChats = this.chats
        console.log('chats',this.chats)
      })
    },
    sendMessage(){
      if(this.message.message){
        const randomId = uuidv4()
        this.message.id = randomId
        console.log(this.message)
        const db = getDatabase()
        set(ref(db,`discussions/${this.selected.id}/chats/${this.message.id}`),{
          date:Date.now(),
          fullDate:this.store.currentDateString(),
          id:this.message.id,
          senderId:this.store.user.id,
          senderName:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          updatedStatus:false,
          status:false,
          message:this.message.message
        })
        this.message = {}
      }
    },
    goBack(){
      this.store.selectedDis = {}
    }
  },
  created(){
    this.store.getUsers()
  },
  watch:{
    forDeleteListLocal:{
      handler(newValue,oldValue){
        if(newValue){
          this.forDeleteList = newValue
        }
      },
      immediate:true,
      deep:true
    },
    'store.messageInDiscuss':{
      handler(newValue,oldValue){
        if(newValue != '' && newValue != null){
          this.message.message = newValue
          this.sendMessage()
        }
      },
      immediate:true,
      deep:true
    },
/*     message:{
      handler(newValue,oldValue){
        if(newValue !=null &&  newValue != ''){
          this.message.message = newValue
          console.log(this.message)
        }
      },
      immediate:true,
      deep:true
    }, */
    'store.resetChatFilterActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          this.resetChatFilter()
        }
      },
      immediate:true,
      deep:true
    },
    'store.fromParentToChildSelectCrudOption':{
      handler(newValue,oldValue){
        if(newValue === true){
          this.selectCrudOption()
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedDis':{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selected = newValue
          const data = newValue
          this.getCurrentSelectedDis()
          this.getSelectedDisChats(data)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
</style>
