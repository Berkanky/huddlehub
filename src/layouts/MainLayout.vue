<template>
  <q-layout view="hHr LpR fFr" v-if="!checkRouter()&&this.$route.path!='/chat'&&this.$route.path!='/profile'">
    <q-header elevated class="bg-grey-9 text-white" height-hint="98" v-if="this.$route.path!='/groupChat'&&this.$route.path!='/discussions'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="openLeft"
        v-if="this.$route.name !='groupActivities'&&!this.store.fullScreenMapActive"/>
        <q-btn
          v-on:click="goBeforePage"
          icon="keyboard_backspace" flat color="white"
          v-if="this.$route.name =='groupActivities'&&!this.store.fullScreenMapActive"></q-btn>
          <q-btn
            v-if="this.store.fullScreenMapActive"
            icon="fullscreen_exit" flat color="white"
            v-on:click="this.store.fullScreenMapActive =! this.store.fullScreenMapActive"></q-btn>
        <q-space></q-space>
        <!-- <q-btn dense flat round icon="menu" @click="openRight" /> -->
        <q-btn icon="filter_list_off" size="sm" color="blue" v-if="this.store.filterUserActive&&!this.store.avatarActive" v-on:click="clearFilters" class="q-mr-xs"></q-btn>
        <q-btn round  color="primary" icon="notifications" v-on:click="showNotifies" size="sm">
            <q-badge :color="checkLengthNotifies() ? 'red' : 'transparent'" rounded floating />
          </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="this.leftActive" side="left" elevated v-if="this.leftActive&&this.$route.path!='/discussions'" class="bg-dark">
      <q-list dark separator style="width:100%;" v-if="!this.store.showConnectionsActive">
      <q-item clickable v-ripple :class="this.$route.path === '/' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section><q-btn icon="home" label="Home" flat color="white" v-on:Click="this.$router.push({path:'/'})"></q-btn></q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path === '/chat' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section>
          <q-btn icon="chat" label="Chat" flat color="white" v-on:Click="this.$router.push({path:'/chat'})"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path === '/profile' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section>
          <q-btn icon="person" label="Profile" flat color="white" v-on:Click="this.$router.push({path:'/profile'})"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path === '/discussions' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section>
          <q-btn icon="diversity_2" label="Discussions" flat color="white" v-on:Click="this.$router.push({path:'/discussions'})"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="bg-dark">
        <q-item-section>
          <q-btn icon="groups" label="Eşleşmelerim" v-on:click="showMyConnections" flat color="white"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path=='/groupMeets' ? 'bg-blue text-white' : 'bg-dark text-white'">
        <q-item-section>
          <q-btn icon="groups" label="Group Meets" v-on:click="showGroupMeets" flat color="white"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="bg-dark">
        <q-item-section>
          <q-btn icon="logout" label="Logout" v-on:click="logoutButton" flat color="white"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list dark separator style="width:100%;" v-if="this.store.showConnectionsActive">
      <q-btn icon="keyboard_backspace" class="q-ma-sm" flat color="white" v-on:click="this.store.showConnectionsActive = false"></q-btn>
      <q-card class="bg-dark text-white" flat v-if="!checkLocalNotify()">
        <q-card-section horizontal>
          <q-card-section class="col">
            <div class="text-caption text-weight-bold text-capitalize text-center">
              Herhangi Bir Eşleşme veya İstek Yok !
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-card flat class="bg-transparent text-white" v-for="data in this.store.friendList" :key="data.id" v-on:click="goChat(data)" v-if="checkLocalNotify()">
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-avatar>
              <img :src="data.image" alt="" v-if="data.image">
              <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
            </q-avatar>
          </q-card-section>
          <q-card-section class="col-6">
            <div class="text-overline text-grey-4">
              {{ data.name ? data.name : data.email }}
            </div>
            <div class="text-caption text-grey-4">
              {{ findInfo(data)}}
            </div>
          </q-card-section>
          <q-card-section class="col-3">
            <q-btn icon="chevron_right" flat color="white"></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-card flat class="bg-transparent text-white" v-for="data in this.localNotifyList" :key="data.id" v-if="checkLocalNotify()">
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-avatar>
              <img :src="data.image" alt="" v-if="data.image">
              <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
            </q-avatar>
          </q-card-section>
          <q-card-section class="col-6">
            <div class="text-overline text-grey-4">
              {{ data.name ? data.name : data.email }}
            </div>
            <div class="text-caption text-grey-4">
              {{ findInfo(data)}}
            </div>
          </q-card-section>
          <q-card-section class="col-3">
            <q-spinner-hourglass
              color="blue"
              size="md"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-list>
    </q-drawer>
    <q-drawer
      show-if-above v-model="this.store.rightActive" side="right"
      elevated v-if="this.store.rightActive" class="bg-dark rightDraw" :width="this.store.avatarActive ? 600 : 370">
      <q-card style="width:100%;" class="bg-dark text-white" flat>
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="closeDetail"></q-btn>
        </q-card-section>
        <q-card-section>
          <selectedUserDetailVue @selectedImage="getselectedImage"/>
        </q-card-section>
      </q-card>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer  class="text-white bg-grey-9" style="padding:0px;" v-if="this.store.avatarActive&&this.$route.path!='/groupChat'&&this.$route.path!='/discussions'">
      <q-toolbar class="row">
        <div class="col text-right">
          <div class="text-overline" v-if="this.$route.path == '/login'">&copy; 2023 HuddleHub. All rights reserved.</div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>

  <q-layout view="hHr LpR fFr" v-if="!checkRouter()&&this.$route.path=='/profile'">
    <q-header elevated class="bg-grey-9 text-white" height-hint="98" >
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="openLeft" />
        <q-space></q-space>
        <q-btn dense flat round icon="menu" @click="openRight" />
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="this.leftActive" side="left" elevated v-if="this.leftActive" class="bg-dark">
      <options />
    </q-drawer>
    <q-drawer
      show-if-above v-model="this.store.rightActive" side="right"
      elevated v-if="this.store.rightActive&&this.store.selectedOption == 'myFav'" class="bg-dark rightDraw" :width="this.store.avatarActive ? 600 : 370">
      <q-card style="width:100%;" class="bg-dark text-white" flat>
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="closeDetail"></q-btn>
        </q-card-section>
        <q-card-section>
          <selectedUserDetailVue @selectedImage="getselectedImage"/>
        </q-card-section>
      </q-card>
    </q-drawer>
    <q-drawer show-if-above v-model="this.rightActive" side="right" elevated v-if="this.rightActive" class="bg-dark">
      <q-list dark  separator style="width:100%;">
      <q-item clickable v-ripple :class="this.$route.path === '/' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section><q-btn icon="home" label="Home" flat color="white" v-on:Click="this.$router.push({path:'/'})"></q-btn></q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path === '/chat' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section>
          <q-btn icon="chat" label="Chat" flat color="white" v-on:Click="this.$router.push({path:'/chat'})"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple :class="this.$route.path === '/profile' ? 'bg-blue-4' : 'bg-dark'">
        <q-item-section>
          <q-btn icon="person" label="Profile" flat color="white" v-on:Click="this.$router.push({path:'/profile'})"></q-btn>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="bg-dark">
        <q-item-section>
          <q-btn icon="logout" label="Logout" v-on:click="logoutButton" flat color="white"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container><!--
    <q-footer bordered class="text-white bg-grey-9" style="padding:0px;">
      <q-toolbar class="row">
        <q-btn icon="logout" v-on:click="logoutButton" flat color="white"></q-btn>
        <div class="col text-right">
          <div class="text-overline" v-if="this.$route.path == '/login'">&copy; 2023 HuddleHub. All rights reserved.</div>
        </div>
      </q-toolbar>
    </q-footer> -->
  </q-layout>

  <q-layout view="hHh lpR fFf" v-if="this.$route.path=='/chat'">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>


  <q-layout view="hHh lpR fFf" v-if="checkRouter()&&this.$route.path!='/chat'">

<!-- <q-header elevated class="bg-grey-9 text-white">
  <q-toolbar>
    <q-toolbar-title class="q-pa-sm">
      <q-avatar>
        <img :src="image" alt="">
      </q-avatar>
    </q-toolbar-title>
    <q-space></q-space>
    <q-btn icon="person" color="white" round flat></q-btn>
  </q-toolbar>
</q-header> -->

<q-page-container>
  <router-view />
</q-page-container>
<q-footer bordered class="text-white bg-grey-9" style="padding:0px;">
  <q-toolbar class="row">
    <div class="col text-right">
      <div class="text-overline" v-if="this.$route.path == '/login'">&copy; 2023 HuddleHub. All rights reserved.</div>
    </div>
  </q-toolbar>
  </q-footer>
</q-layout>
</template>

<script>
import appImage from '../images/group.png'
import options from 'src/components/options.vue'
import image from '../images/applogo.png'
import {auth} from '../firebase/index'
import {db} from '../firebase/index'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { useCounterStore } from 'src/stores/store'
import selectedUserDetailVue from 'src/components/selectedUserDetail.vue'
export default {
  components:{
    options,
    selectedUserDetailVue,
  },
  setup () {
    const store = useCounterStore()
    return {
      store,
      image,
      appImage
    }
  },
  data:function(){
    return{
      leftActive:false,
      rightActive:false,
      drawerWidth:'400px',
      localNotifyList:[]
    }
  },
  methods:{
    checkLocalNotify(){
      if(!this.localNotifyList.length && !this.store.friendList.length){
        return false
      }else{
        return true
      }
    },
    goBeforePage(){
      this.$router.go(-1)
    },
    showGroupMeets(){
      this.$router.push({path:'/groupMeets'})
    },
    goChat(data){
      console.log(data)
      this.store.selectedFav = data
      this.$router.push({path:'/chat'})
    },
    findInfo(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.info){
          const ınfo = result.info
          return ınfo
        }else{
          return 'Bilgi Yok'
        }
      }else{
        return 'Bilgi Yok'
      }
    },
    showMyConnections(){
      this.store.showConnectionsActive = true
    },
    checkLengthNotifies(){
      if(this.store.notifyList.length||this.store.invitesList.length){
        return true
      }else{
        return false
      }
    },
    showNotifies(){
      this.store.notifyListActive =! this.store.notifyListActive
    },
    clearFilters(){
      this.store.filteredList= []
      this.store.filterUserActive = false
    },
    getselectedImage(data){
      if(data){
        console.log(data)
      }
    },
    closeDetail(){
      this.store.rightActive = false
      this.store.selectedUserForDetail = {}
      this.store.selectedGroupForDetail = {}
    },
    updateWhenLogin(){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        online:false
      })
    },
    logoutFirebaseFunc(){
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$router.replace({path:'/login'})
        this.updateWhenLogin()
        this.store.user = {}
        this.$q.notify({
          type:'negative',
          message:'Logout Done Successfully !',
          timeout:700,
          position:'top'
        })
      }).catch((error) => {
        // An error happened.
      });
    },
    logoutButton(){
      this.logoutFirebaseFunc()
    },
    checkRouter(){
      if(this.$route.path=='/login'){
        return true
      }else{
        return false
      }
    },
    openLeft(){
      this.leftActive =! this.leftActive
    },
    openRight(){
      this.rightActive =! this.rightActive
    },
    filterMyNotifyList(){
      if(this.localNotifyList.length){
        this.localNotifyList = this.localNotifyList.filter(object => object.status === false)
      }
    }
  },
  updated(){
    this.store.getMyNotifyList()
  },
  watch:{
    'store.notifyList':{
      handler(newValue,oldValue){
        if(newValue){
          this.localNotifyList = newValue
          this.filterMyNotifyList()
        }
      },
      immediate:true,
      deep:true
    },
    'store.showConnectionsActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          this.store.getMyFriendList()
          this.store.getMyNotifyList()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>
.rightDraw::-webkit-scrollbar {
  width: 0px;
  background-color: transparent;
}
.rightDraw{
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  overflow-y: scroll;
}
</style>
