<template>
  <q-dialog v-model="this.store.forDesktopChatActive" v-if="this.store.forDesktopChatActive" position="right" full-height persistent>
    <q-card class="bg-dark" style="width: 500px; max-width: 80vw;">
      <q-card-section  class="text-white q-pa-md" horizontal>
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-btn
          flat no-caps
          :icon="this.selectedGroupForChatLocal.icon" :color="this.selectedGroupForChatLocal.color"
          :label="this.selectedGroupForChatLocal.name"></q-btn>
        <q-space></q-space>
        <upload @currentImageData="getcurrentImageData"/>
        <q-btn icon="fa-solid fa-info" flat color="white" size="sm" v-on:click="goGroupDetail"></q-btn>
      </q-card-section>
      <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 80%; max-width: 100%;"
      >
      <q-page-container>
        <q-intersection
          v-for="(data,index) in this.chats"
          :key="index"
          once
          transition="scale"
          >
          <q-chat-message
            class="q-pa-xs"
            :stamp="data.fullDate"
            :sent="data.senderId === this.store.user.id ? true : false"
            text-color="white"
            :bg-color="data.senderId === this.store.user.id ? 'pink-4' : 'green-4'"
          >
            <template v-slot:avatar v-if="checkImage(data)">
              <img :src="findUserImage(data)" alt=""  class="q-message-avatar q-message-avatar--sent q-ma-xs">
            </template>
            <template v-slot:name v-if="!checkImage(data)">
              <span>{{ data.name }}</span>
            </template>
            <div class="display:block;">
              <img :src="data.image" alt="" v-if="data.image" style="width:100%;height:100px;display:block;object-fit:cover;">
              <span class="">{{ data.message }}</span>
            </div>
          </q-chat-message>
        </q-intersection>
        <q-card v-if="this.selectedImage.image">
          <q-img
          loading="lazy"
          spinner-color="white"
          :src="this.selectedImage.image" style="object-fit:Cover;">
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="remove" color="white" size="sm" text-color="dark" v-on:click="this.selectedImage = {}"></q-btn>
            </div>
          </q-img>
        </q-card>
      </q-page-container>
    </q-scroll-area>
    <q-card-section>
      <q-input
        style="width:100%;margin:0 auto;"
        dark color="white"
        v-model="this.message"
        placeholder="Type your message here"
        @keyup.enter="sendMessage"
      >
      <template v-slot:prepend>
        <q-icon name="chat"></q-icon>
      </template>
      <template v-slot:append v-if="this.message">
        <q-btn icon="remove" color="dark" v-on:click="this.message = ''"></q-btn>
      </template>
      <template v-slot:after v-if="this.message">
        <q-btn icon="send" round flat color="white" v-on:click="this.sendMessage()"></q-btn>
      </template>
      </q-input>
    </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
import upload from "src/components/upload.vue";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload
  },
  setup(){
    const store = useCounterStore()
    return{
      store,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  data:function(){
    return{
      selectedGroupForChatLocal:{},
      chats:[],
      message:'',
      selectedImage:{},
      randomId:''
    }
  },
  computed:{
  },
  methods:{
    goGroupDetail(){
      console.log(this.store.selectedGroupForChat)
      this.store.selectedGroupForDetail = this.store.selectedGroupForChat
      this.store.rightActive = true
      //this.$router.push({path:'/selectedGroupDetail'})
    },
    checkImage(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
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
    getChats(){
      const db = getDatabase()
      const dbRef = query(ref(db,`activityGroups/${this.store.selectedGroupForChat.id}/chats/`),orderByChild('date','desc'))
      onValue(dbRef, (snapshot) => {
        this.chats = []
        snapshot.forEach((childSnapshot) => {
          this.chats.push(childSnapshot.val())
        });
        console.log('chaats',this.chats)
      });
    },
    sendMessage(){
      if(this.message){
        this.randomId = uuidv4()
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.selectedGroupForChatLocal.id}/chats/${this.randomId}`),{
          messageId:this.randomId,
          fullDate:this.store.currentDateString(),
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          email:this.store.user.email,
          senderId:this.store.user.id,
          date:Date.now(),
          image:this.selectedImage.image ? this.selectedImage.image : '',
          deleteStatus:false,
          message:this.message
        })
        this.message = ''
        this.randomId = ''
        this.selectedImage = {}
      }
    },
    getcurrentImageData(data){
      if(data){
        this.selectedImage = data
      }
    },
    goBack(){
      this.store.forDesktopChatActive = false
    },
    getGroupChat(){
      if(this.selectedGroupForChatLocal.chats){
        const db = getDatabase();
        const dbRef = ref(db, `activityGroups/${this.selectedGroupForChatLocal.id}/chats`);
        onValue(dbRef, (snapshot) => {
          this.chats = []
          snapshot.forEach((childSnapshot) => {
            this.chats.push(childSnapshot.val())
            console.log('chats',this.chats)
          });
        });
      }else{
        console.log('noChat')
      }
    },
    getGroupInfo(){
     const db = getDatabase();
      const dbRef = ref(db, `activityGroups/${this.store.selectedGroupForChat.id}`);
      onValue(dbRef, (snapshot) => {
        this.selectedGroupForChatLocal = snapshot.val();
        console.log('selectedGroupForChatLocal',this.selectedGroupForChatLocal)
      });
    },
  },
  beforeMount(){
    this.store.getUsers()
  },
  created(){
    this.getGroupInfo()
    this.getChats()
  },
  watch:{
    'store.selectedGroupForChat':{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedGroupForChatLocal = newValue
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
    display: none;
}
</style>
