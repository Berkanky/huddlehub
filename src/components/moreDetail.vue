<template>
  <q-card class="">
    <q-card-section class="text-center" style=" background: linear-gradient(to bottom, #ece9e6, #ffffff);">
      <q-avatar size="200px">
        <img :src="this.selectedUserLocal.image" alt="" v-if="this.selectedUserLocal.image" v-on:click="showProfilePic" style="object-fit:cover;">
        <q-btn icon="person" round v-if="!this.selectedUserLocal.image"></q-btn>
      </q-avatar>
      <div class="text-subtitle2 text-weight-bold text-grey-7" style="margin-top:2%;">{{ this.selectedUser.name ? this.selectedUser.name : this.selectedUser.email }}</div>
      <div class="text-caption text-grey-5 text-weight-bold"><q-icon name="phone" color="grey-5" size="15px"></q-icon> {{ this.selectedUserLocal.phone ? this.selectedUserLocal.phone : 'Numara Belirtilmemiş !' }}</div>
      <div class="q-mt-xs">
        <q-btn :icon="checkFriendOrNot() ? 'person_remove' : 'person_add'"  push  :color="checkFriendOrNot() ? 'light-green-5' : 'green'" v-on:click="addOrRemove"></q-btn>
        <span style="margin:1px;"></span>
        <q-btn :icon="checkFollowingOrNot() ? 'zoom_out' : 'zoom_in'"  push  :color="checkFriendOrNot() ? 'pink-4' : 'pink-4'" v-on:click="followUser"></q-btn>
      </div>
    </q-card-section>
    <q-separator color="lightgrey" size="5px"></q-separator>
    <q-card-section class="text-center">
      <div class="text-caption text-weight-bold text-grey-6">
        <q-icon name="fa-solid fa-info" color="grey-4" size="17px"></q-icon>
        {{  findThisUserFromFriendList() }}
      </div>
    </q-card-section>
    <q-separator color="lightgrey" size="5px"></q-separator>
    <q-card-section class="text-left">
      <div class="text-subtitle2 text-weight-bold text-grey-6 q-pa-sm">
        <q-icon name="question_mark" color="grey-4" size="21px"></q-icon>
        {{ this.selectedUserLocal.info ? this.selectedUserLocal.info : 'Hakkında !' }}</div>
      <div class="text-subtitle2 text-grey-6 text-weight-bold q-pa-sm">
        <q-icon name="badge" color="grey-4" size="21px"></q-icon>
        {{ this.selectedUser.age ? `${this.selectedUser.age}` : 'Yaş Belirtilmemiş !' }}</div>
      <div class="text-subtitle2 text-grey-6 text-weight-bold q-pa-sm">
        <q-icon name="fa-solid fa-info" color="grey-4" size="21px"></q-icon>
        {{ this.selectedUserLocal.birthday ? `Doğum Tarihi : ${this.selectedUserLocal.birthday}` : 'Doğum Tarihi Belirtilmemiş' }}</div>
    </q-card-section>
    <q-separator color="lightgrey" size="5px"></q-separator>
    <q-card-section>
      <div class="row">
        <div class="col-8">
          <q-btn flat label="Medya" no-caps color="grey-6"></q-btn>
        </div>
        <q-space></q-space>
        <div class="col text-right">
          <q-btn icon-right="chevron_right" flat color="grey-8" :label="this.imagesListLocal.length" v-on:click="goGallery"></q-btn>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-3" style="margin:1px;" v-for="data in imageLoop" :key="data.messageId">
          <div class="article-card">
            <div class="content">
              <p class="date">{{data.fullDate}}</p>
            </div>
            <img :src="data.image" alt="article-cover" v-on:click="selectforzoomImage(data)"/>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-btn label="Common Groups" no-caps color="grey-6" flat icon="groups" v-if="this.checkCommonGroupList()"></q-btn>
      <q-card class="bg-transparent text-dark" bordered v-for="data in this.commonGroupList" :key="data.id">
        <q-card-section horizontal>
          <q-img
            loading="lazy"
            spinner-color="white"
            class="col-3" :src="data.image" alt="" v-if="data.image" style="object-fit:Cover;"></q-img>
          <q-btn icon="groups" class="col-3" v-if="!data.image" color="dark"></q-btn>
          <q-card-section class="col-7">
            <div class="text-subtitle2 text-weight-bold text-grey-6 text-capitalize">
              <q-icon :name="data.icon ? data.icon : ''" size="19px" :color="data.color ? data.color : 'dark'"></q-icon>
              {{ data.name ? data.name : data.optionName}}
            </div>
            <div class="text-overline text-weight-bold">
              <q-icon name="groups" color="grey-6" size="17px"></q-icon>
              {{ this.getGroupMemberLength(data) }}
            </div>
          </q-card-section>
          <q-btn icon="login" class="col" flat :color="data.color ? data.color : 'pink'" v-on:Click="goGroup(data)"></q-btn>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-btn label="Common Discussions" no-caps color="grey-6" flat icon="group" v-if="this.checkCommonDiscussionList()"></q-btn>
      <q-card class="bg-transparent text-dark" bordered v-for="data in this.commonDiscussions" :key="data.id">
        <q-card-section horizontal>
          <q-img
          loading="lazy"
          spinner-color="white"
          class="col-3" :src="data.image" alt="" v-if="data.image" style="object-fit:Cover;"></q-img>
          <q-btn icon="group" class="col-3" v-if="!data.image" color="dark"></q-btn>
          <q-card-section class="col-7">
            <div class="text-subtitle2 text-weight-bold text-grey-6 text-capitalize">
              <q-icon name="group" size="19px" color="grey-6"></q-icon>
              {{ data.name ? data.name : data.optionName}}
            </div>
            <div class="text-caption text-capitalize text-weight-bold text-grey-6">
              {{ this.getDiscussionChatLength(data) }}
            </div>
          </q-card-section>
          <q-btn icon="login" class="col" flat :color="data.color ? data.color : 'pink'" v-on:Click="goDiscussion(data)"></q-btn>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
  <zoomImageComp />
</template>

<script>
import zoomImageComp from "./zoomImageComp.vue";
import { getDatabase, ref, onValue, remove, update, set} from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    zoomImageComp
  },
  props:['selectedUser','imagesList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedUserLocal:{},
      imagesListLocal:[],
      commonGroupList:[],
      commonDiscussions:[]
    }
  },
  methods:{
    goDiscussion(data){
      console.log(data)
      this.store.selectedDis = data
      this.$router.push({path:'/discussions'})
    },
    getDiscussionChatLength(data){
      if(data.chats){
        let list = []
        for(const [key,value] of Object.entries(data.chats)){
          const chatData = {
            id:`${value.id}`,
            senderId:`${value.senderId}`
          }
          const result = list.some(object => object.senderId === chatData.senderId)
          if(!result){
            list.push(chatData)
          }
        }
        const lengthChat = list.length
        const message = 'Katılımcı Sayısı ' + ' - ' + lengthChat
        return message
      }else{
        return
      }
    },
    findCommonDiscussions(data){
      if(this.store.allDiscussionsList.length){
        this.commonDiscussions = []
        this.store.allDiscussionsList.forEach(element => {
          if(element.chats){
            let list = []
            for(const [key,value] of Object.entries(element.chats)){
              const chatData = {
                id:`${value.id}`,
                senderId:`${value.senderId}`
              }
              const result = list.some(object => object.id === chatData.senderId)
              if(!result){
                list.push(chatData)
              }
            }
            console.log('commonDiscussionList',list)
            const secondResult = list.some(object => object.senderId === data.id)
            if(secondResult){
              const thirdResult = list.some(object => object.senderId === this.store.user.id)
              if(thirdResult){
                this.commonDiscussions.push(element)
              }
            }
          }else{
            this.commonDiscussions = []
          }
        });
        console.log('commonDiscussions',this.commonDiscussions)
      }else{
        this.commonDiscussions = []
      }
    },
    goGroup(data){
      this.store.selectedGroupForChat = data
    },
    getGroupMemberLength(data){
      if(data.members){
        const length = Object.entries(data.members).length
        const message = 'Üye Sayısı' + ' - ' + length
        return message
      }else{
        return
      }
    },
    checkCommonDiscussionList(){
      if(this.commonDiscussions.length){
        return true
      }else{
        return false
      }
    },
    checkCommonGroupList(){
      if(this.commonGroupList.length){
        return true
      }else{
        return false
      }
    },
    checkMembersOfActivityGroups(data){
      if(this.store.activityGroupsList.length){
        this.commonGroupList = []
        this.store.activityGroupsList.forEach(element => {
          if(element.members){
            let list = []
            for(const [key,value] of Object.entries(element.members)){
              const memberData = {
                id:`${value.id}`
              }
              list.push(memberData)
            }
            const result = list.some(object => object.id ===  data.id)
            if(result){
              this.commonGroupList.push(element)
            }
          }
        });
        this.commonGroupList.forEach(element => {
          if(element.members){
            const secondList = []
            for(const [key,value] of Object.entries(element.members)){
              const memberData = {
                id:`${value.id}`
              }
              secondList.push(memberData)
            }
            const result = secondList.some(object => object.id === this.store.user.id)
            if(!result){
              this.commonGroupList = this.commonGroupList.filter(object => object.id !== element.id)
            }
          }
        });

        console.log('commonGroups',this.commonGroupList)
      }else{
        this.commonGroupList = []
      }
    },
    checkFollowingOrNot(){
      if(this.selectedUserLocal.followers){
        const list = []
        for(const [key,value] of Object.entries(this.selectedUserLocal.followers)){
          const userData = {
            id:`${value.id}`,
            date:`${value.date}`
          }
          list.push(userData)
        }
        const result = list.find(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
      }
    },
    removeMyFollowList(){
      const db = getDatabase()
      remove(ref(db,`users/${this.store.user.id}/follows/${this.selectedUserLocal.id}`))
    },
    addMyFollowList(){
      const db = getDatabase()
      set(ref(db,`users/${this.store.user.id}/follows/${this.selectedUserLocal.id}`),{
        id:this.selectedUserLocal.id,
        date:this.store.currentDateString()
      })
    },
    followUser(){
      if(!this.checkFollowingOrNot()){
        const db = getDatabase()
        set(ref(db,`users/${this.selectedUserLocal.id}/followers/${this.store.user.id}`),{
          id:this.store.user.id,
          date:this.store.currentDateString(),
        })
        this.addMyFollowList()
      }else{
        const db = getDatabase()
        remove(ref(db,`users/${this.selectedUserLocal.id}/followers/${this.store.user.id}`))
        this.removeMyFollowList()
      }
    },
    showProfilePic(){
      this.store.selectedZoomImage = {senderId:this.selectedUserLocal.id,image:this.selectedUserLocal.image}
      this.store.selectedZoomImageActive = true
    },
    selectforzoomImage(data){
      this.store.selectedZoomImage = data
      this.store.selectedZoomImageActive = true
      console.log('mal',this.store.selectedZoomImage)
    },
    sendOtherUserNotifies(){
      const db = getDatabase()
      set(ref(db,`notifyList/${this.selectedUserLocal.id}/${this.store.user.id}`),{
          id:this.store.user.id,
          email:this.store.user.email,
          sender:this.store.user.id,
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          image:this.store.userAllInfo.image ? this.store.userAllInfo.image : '',
          date:this.store.currentDateString(),
          requestType:'friend'
        })
    },
    addFriend(){
      const db = getDatabase()
        set(ref(db,`notifyList/${this.store.user.id}/${this.selectedUserLocal.id}`),{
          id:this.selectedUserLocal.id,
          email:this.selectedUserLocal.email,
          sender:this.store.user.id,
          name:this.selectedUserLocal.name ? this.selectedUserLocal.name : '',
          image:this.selectedUserLocal.image ? this.selectedUserLocal.image : '',
          date:this.store.currentDateString(),
          requestType:'friend'
        })
        this.sendOtherUserNotifies()
    },
    removeMeFromOtherUser(){
      const db = getDatabase()
      remove(ref(db,`myFriendsList/${this.selectedUserLocal.id}/${this.store.user.id}`))
    },
    addOrRemove(){
      if(this.checkFriendOrNot()){
        const db = getDatabase()
        remove(ref(db,`myFriendsList/${this.store.user.id}/${this.selectedUserLocal.id}`))
        this.removeMeFromOtherUser()
        this.store.friendList = this.store.friendList.filter(object => object.id !== this.selectedUserLocal.id)
      }else{
        this.addFriend()
      }
    },
    checkFriendOrNot(){
      const result = this.store.friendList.find(object => object.id === this.selectedUserLocal.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    findThisUserFromFriendList(){
      const result = this.store.friendList.find(object => object.id === this.selectedUserLocal.id)
      if(result){
        const date = result.date + ' ' + ' Tarihinden Beri Arkadaşsınız.'
        return date
      }else{
        const ınfo = 'Arkadaş Listenizde Bulunamadı.'
        return ınfo
      }
    },
    goGallery(){
      this.store.galleryActive =! this.store.galleryActive

    },
    getSelectedUser(){
      const db = getDatabase();
      const dbRef = ref(db, `users/${this.selectedUserLocal.id}`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        this.selectedUserLocal = data
      });
    }
  },
  created(){
    this.store.getActivityGroups()
    this.getSelectedUser()
    this.store.getAllDiscussions()
  },
  computed:{
    imageLoop(){
      return this.imagesListLocal.slice(0,3)
    }
  },
  watch:{
    imagesList:{
      handler(newValue,oldValue){
        if(newValue){
          this.imagesListLocal = newValue
          console.log('imagesListLocal',this.imagesListLocal)
        }
      },
      immediate:true,
      deep:true
    },
    selectedUser:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedUserLocal = newValue
          const data = newValue
          this.checkMembersOfActivityGroups(data)
          this.findCommonDiscussions(data)
          console.log('moreDetailselectedUserLocal',this.selectedUserLocal)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
.article-card {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 300ms;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.article-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card .content {
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  padding: 30px 20px 20px 20px;
  height: auto;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.article-card .date,
.article-card .title {
  margin: 0;
}

.article-card .date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.article-card .title {
  font-size: 17px;
  color: #fff;
}

</style>
