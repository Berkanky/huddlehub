<template>
  <q-dialog
    v-if="this.store.showOptionsActive"
    v-model="this.store.showOptionsActive"
    :maximized="this.store.avatarActive ? false : true"
    dark
    persistent
  >
    <q-card
      :style="{'width':this.store.widthOptions()}" style="margin:0 auto;"
      class="bg-dark text-white">
        <q-card-section class="row">
          <q-card class="bg-dark text-white col-6" v-for="data in this.options" :key="data.id" style="height:150px;" v-if="!this.store.crudOptionActive&&!this.store.commentOptionActive">
            <q-btn
              :color="data.color" :flat="this.selectedOption.id === data.id && data.id != 4 ? false : true"
              :icon="data.icon" class="full-width full-height" v-on:click="selectOption(data)"></q-btn>
          </q-card>
          <q-card class="bg-dark text-white col-6" v-for="data in this.crudList" :key="data.id" style="height:150px;" v-if="this.store.crudOptionActive">
            <q-btn
              :disable="!checkAdminOrNot(data) ? true : false"
              :color="data.color" :flat="this.selectedOption.id === data.id && data.id != 4 ? false : true"
              :icon="data.icon" class="full-width full-height" v-on:click="selectOptionCrud(data)"></q-btn>
          </q-card>
          <q-card class="bg-dark text-white col-6" v-for="data in this.commentOptionsList" :key="data.id" style="height:150px;" v-if="this.store.commentOptionActive">
            <q-btn
              :disable="data.status ? false : true"
              :color="data.color" flat
              :icon="data.icon" class="full-width full-height" v-on:click="selectCommentOption(data)"></q-btn>
          </q-card>
        </q-card-section>
      </q-card>
      <q-dialog
        dark
        persistent
        :maximized="this.store.avatarActive ? false : true"
        v-if="this.store.voteListActive" v-model="this.store.voteListActive">
      <q-card class="bg-dark text-white" :style="{'width':this.store.widthOptions()}" style="margin:0 auto;">
        <q-card-section class="text-left">
          <q-btn
            icon="keyboard_backspace" flat color="white"
            v-on:click="this.store.likedCommentsSelectedDis = [];this.store.voteListActive = false"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-card
          v-for="data in this.store.likedCommentsSelectedDis" :key="data.id"
          class="bg-dark text-white"  style="margin:0 auto;">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-btn icon="person" v-on:click="showSenderUser(data)"></q-btn>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2">
                {{ data.message }}
              </div>
              <div class="text-caption text-weight-bold text-grey-6">
                {{ data.fullDate }}
              </div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-btn icon="favorite" flat color="red"></q-btn>
              <span>{{ getLikedLength(data) }}</span>
            </q-card-section>
          </q-card-section>
        </q-card>
        </q-card-section>
      </q-card>
      </q-dialog>
      <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
  </q-dialog>
</template>

<script>
import selectedUserDetailDialog from './selectedUserDetailDialog.vue';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, onValue, set, update, remove, query, orderByChild } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    selectedUserDetailDialog
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      reportMessage:{},
      selectedOption:{},
      commentOptionsList:[
        {id:1,label:'Delete',icon:'delete_forever',color:'red',status:this.store.user.id === this.store.selectedCommentDiscuss.senderId ? true : false},
        {id:2,label:'Update',icon:'edit',color:'green' ,status:this.store.user.id === this.store.selectedCommentDiscuss.senderId ? true : false},
        {id:3,label:'Save',icon:'star',color:'yellow',status:true},
        {id:5,label:'Report',icon:'flag',color:'red',status:true},
        {id:4,label:'Back',icon:'logout',color:'yellow',status:true}
      ],
      crudList:[
        {id:1,label:'Save',icon:this.store.checkCurrentDiscussSavedOrNot() ? 'bookmark_remove' : 'bookmark_add',color:this.store.checkCurrentDiscussSavedOrNot() ? 'red' : 'green',status:this.store.checkCurrentDiscussSavedOrNot() ? true : false},
        {id:2,label:'Vote',icon:'where_to_vote',color:'green',status:false},
        {id:4,label:'Search',icon:'search',color:'green',status:false},
        {id:6,label:'Detail',icon:'fa-solid fa-info',color:'green',status:false},
        {id:5,label:'Admin',icon:'settings',color:'green',status:false,adminActive:this.store.selectedDis.createrId === this.store.user.id ? true : false},
        {id:3,label:'Back',icon:'logout',color:'red',status:false}
      ],
      options:[
        {id:1,label:'Search',icon:'search',color:'primary',status:false},
        {id:2,label:'Saveds',icon:'bookmark',color:'orange',status:false},
        {id:3,label:'Joineds',icon:'chat',color:'green',status:false},
        {id:4,label:'Back',icon:'logout',color:'white',status:false}
      ]
    }
  },
  methods:{
    showSenderUser(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    checkAdminOrNot(data){
      if(data.id ===5 && data.label === 'Admin'){
        if(data.adminActive){
          if(data.adminActive === true){
            return true
          }else{
            return false
          }
        }
      }else{
        return true
      }
    },
    getLikedLength(data){
      if(data.likes){
        const length = Object.entries(data.likes).length
        return length
      }else{
        return 0
      }
    },
    selectCommentOption(data){
      this.selectedOption = data
      if(this.selectedOption.id === 1){
        this.$q.dialog({
          dark:true,
          cancel:true,
          title:'Warning',
          message:'Seçili Mesajı Silme İşlemini Onaylıyor musunuz ?'
        }).onOk(() => {
          const db =getDatabase()
          remove(ref(db,`discussions/${this.store.selectedDis.id}/chats/${this.store.selectedCommentDiscuss.id}`))
          this.goBack()
        })
      }else if(this.selectedOption.id  === 4){
        this.goBack()
      }else if(this.selectedOption.id === 2){
        this.$q.dialog({
          dark: true,
          title: 'Update',
          message: 'Update Selected Message',
          prompt: {
            model: this.store.selectedCommentDiscuss.message,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          maximized:this.store.avatarActive ? false : true
        }).onOk(data => {
          const db = getDatabase()
          update(ref(db,`discussions/${this.store.selectedDis.id}/chats/${this.store.selectedCommentDiscuss.id}`),{
            message:data,
            updatedDate:this.store.currentDateString(),
            updatedStatus:true
          })
          this.goBack()
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }else if(this.selectedOption.id === 5){
        this.$q.dialog({
          dark: true,
          title: 'Report',
          message: 'Lütfen Şikayet Gerekçesini Giriniz !',
          prompt: {
            model: this.reportMessage.reportMessage,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          maximized:this.store.avatarActive ? false : true
        }).onOk(data => {
          const randomId = uuidv4()
          const db = getDatabase()
          update(ref(db,`discussions/${this.store.selectedDisCurrent.id}/chats/${this.store.selectedCommentDiscuss.id}/reports/${randomId}`),{
            reportMessage:data,
            reporterId:this.store.user.id,
            reportDate:this.store.currentDateString(),
            date:Date.now()
          })
          this.$q.notify({
            type:'negative',
            icon:'flag',
            timeout:700,
            position:'bottom'
          })
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }
    },
    saveDiscuss(data){
      if(this.store.checkCurrentDiscussSavedOrNot()){
        const db = getDatabase()
        remove(ref(db,`mySavedDiscussions/${this.store.user.id}/${data.id}`))
      }else{
        console.log(data)
        const db = getDatabase()
        set(ref(db,`mySavedDiscussions/${this.store.user.id}/${data.id}`),{
          id:data.id,
          image:data.image ? data.image : '',
          category:data.category,
          chats:data.chats ? data.chats : '',
          createdDate:data.createdDate,
          savedDate:this.store.currentDateString(),
          date:data.date,
          explain:data.explain ? data.explain : '',
          name:data.name ? data.name : '',
          status:data.status,
          updatedDate:data.updatedDate ? data.updatedDate : ''
        })
      }
    },
    getSavedsDiscuss(){
      if(this.store.mySavedDiscussions.length){
        this.store.allDiscussionsList = this.store.pureListDiscussions
        const savedIds = this.store.mySavedDiscussions.map(discussion => discussion.id);
        this.store.allDiscussionsList = this.store.allDiscussionsList.filter(discussion => savedIds.includes(discussion.id));
        if(this.store.allDiscussionsList.length){
          this.store.filterActiveOn = true
          this.store.crudOptionActive = false
          this.store.showOptionsActive = false
        }else{
          this.$q.notify({
            type:'negative',
            message:'Sonuç Alınamadı !',
            timeout:700,
            position:'top'
          })
          this.store.allDiscussionsList = this.store.pureListDiscussions
        }
      }
    },
    findMessageInChat(data){
      const list = this.store.selectedDisChats.filter(object => object.message.includes(data))
      if(list.length){
        console.log(list)
        this.$emit('findedMessages',list)
        this.store.selectedDisChatFilterActive = true
        this.goBack()
      }else{
        this.$q.notify({
          type:'negative',
          position:'top',
          message:'Birdaha Deneyiniz !',
          timeout:700
        })
      }
    },
    selectOptionCrud(data){
      this.selectedOption = data
      if(this.selectedOption.id === 3){
        this.goBack()
      }else if(this.selectedOption.id === 1){
        const data = this.store.selectedDis
        this.saveDiscuss(data)
        this.goBack()
      }else if(this.selectedOption.id === 4){
        this.$q.dialog({
          dark: true,
          title: 'Find',
          message: 'Find Searching Message',
          prompt: {
            model: this.store.findMessageDiscuss.message,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          maximized:this.store.avatarActive ? false : true
        }).onOk(data => {
          this.findMessageInChat(data)
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }else if(this.selectedOption.id === 2){
        let list = []
        this.store.selectedDisChats.forEach(element => {
          if(element.likes){
            list.push(element)
          }
        });
        list = list.sort((a,b) => {
          return (Object.entries(b.likes).length) - (Object.entries(a.likes).length)
        })
        this.showVotesCommentsAll(list)
      }else if(this.selectedOption.id === 5){
        this.store.adminPanelDisActive = true
      }else if(this.selectedOption.id === 6){
        this.store.selectedDiscussionDetailActive = true
        this.goBack()
      }
    },
    showVotesCommentsAll(list){
      console.log('list',list)
      list = list.filter(object => !object.adminEffect)
      if(list.length){
        this.store.likedCommentsSelectedDis = list
        this.store.voteListActive  = true
      }else{
        this.$q.notify({
          type:'negative',
          message:'Herhangi Bir Yorum Beğenisi Bulunamadı',
          timeout:700,
          position:'top'
        })
      }
    },
    getJoinedDiscuss(){
      const joinedDiscussList = []
      this.store.allDiscussionsList.forEach(element => {
        if(element.chats){
          const list = []
          for(const [key,value] of Object.entries(element.chats)){
            const chatData = {
              id:`${value.id}`,
              senderId:`${value.senderId}`
            }
            list.push(chatData)
          }
          const result = list.some(object => object.senderId === this.store.user.id)
            if(result){
              joinedDiscussList.push(element.id)
            }
          }
      });
      console.log('joinedList',joinedDiscussList)
      const joinedIds = joinedDiscussList.map(object => object)
      this.store.allDiscussionsList = this.store.allDiscussionsList.filter(object => joinedIds.includes(object.id))
      if(this.store.allDiscussionsList.length){
        this.store.crudOptionActive = false
        this.store.showOptionsActive = false
        this.store.filterActiveOn = true
      }else{
        this.$q.notify({
          type:'negative',
          message:'Sonuç Alınamadı !',
          timeout:700,
          position:'top'
        })
      }
    },
    searchGroup(){
      this.$q.dialog({
          dark: true,
          title: 'Find',
          message: 'Find Searching Group Or Admin',
          prompt: {
            model: this.store.findGroupDiscuss.groupName,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          maximized:this.store.avatarActive ? false : true
        }).onOk(data => {
          if(data){
            const list = this.store.pureListDiscussions.filter(object => object.name.includes(data))
            if(list.length){
              console.log('searchedGroups',list)
              this.store.allDiscussionsList = list
              this.store.filterActiveOn = true
              this.goBack()
            }else{
              this.$q.notify({
                type:'negative',
                message:'Grup Bulunamadı !',
                timeout:700,
                position:'top'
              })
            }
          }
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },
    selectOption(data){
      this.selectedOption = data
      if(this.selectedOption.id === 4){
        this.goBack()
      }else if(this.selectedOption.id === 2){
        this.getSavedsDiscuss()
      }else if(this.selectedOption.id === 3){
        this.getJoinedDiscuss()
      }else if(this.selectedOption.id === 1){
        this.searchGroup()
      }
    },
    goBack(){
      this.store.commentOptionActive = false
      this.store.crudOptionActive = false
      this.store.showOptionsActive = false
      this.store.fromParentToChildSelectCrudOption = false
     // this.selectedOption = {}
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
