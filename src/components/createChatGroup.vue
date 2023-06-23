<template>
  <q-dialog
    v-if="this.store.createChatGroupActive" v-model="this.store.createChatGroupActive"
    :full-height="this.store.avatarActive ? false : true"
    dark
    :maximized="this.store.avatarActive ? false : true"
    persistent
  >
    <q-card class="bg-dark text-white" :style="{'width':this.store.widthOptions()}" style="margin:0 auto;">
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section class="text-center">
        <q-fab color="dark" glossy icon="person" direction="right" padding="50px" v-if="!this.selectedImage.image">
          <uploadVue @currentImageData="getcurrentImageData"/>
        </q-fab>
        <q-avatar rounded size="140px" v-if="this.selectedImage.image">
          <img :src="this.selectedImage.image" alt="" style="object-fit:cover;" v-on:click="removeImage">
        </q-avatar>
      </q-card-section>
      <q-card-section class="row">
        <q-input

          class="col-12 col-md-6 col-sm-6"
          dark color="white" v-model="this.groupData.name"
          :label="this.groupData.name ? this.groupData.name : 'Grup Adı Giriniz'">
            <template v-slot:prepend>
              <q-icon name="group"></q-icon>
            </template>
          </q-input>
          <q-input
          class="col-12 col-md-6 col-sm-6"
          dark color="white" v-model="this.groupData.explain"
          :label="this.groupData.explain ? this.groupData.explain : 'Grup Konusu Giriniz'">
            <template v-slot:append>
              <q-icon name="info"></q-icon>
            </template>
          </q-input>
      </q-card-section>
      <q-card-section>
        <q-input
          v-on:keyup.enter="searchUserInput"
          dark color="white" v-model="this.searchValue"
          :label="this.searchValue ? this.searchValue : 'Lütfen Kişi Adı Yada E-Maili Giriniz'">
          <template v-slot:prepend>
            <q-icon name="search"></q-icon>
          </template>
          <template v-slot:append v-if="this.searchValue">
            <q-btn icon="remove"  color="dark" size="sm" v-on:click="this.searchValue = '';this.findedUsers=[]"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row">
        <div class="text-overline text-weight-bold text-grey-6 text-capitalize" v-if="this.findedUsers.length">
          <q-icon name="search"></q-icon>
          Bulunan Kullanıcılar - {{ this.findedUsers.length }}
        </div>
        <q-space></q-space>
        <q-btn
          v-on:click="showSelectedListButton"
          icon="list"
          :label="this.selectedList.length" v-if="this.selectedList.length" flat color="white"></q-btn>
      </q-card-section>
      <q-card-section class="row">
        <q-card
          :dark="this.checkAddedOrNot(data) ? true : false"
          class="bg-dark col-12 col-md-6 col-sm-6" v-for="data in this.findedUsers" :key="data.id">
          <q-card-section class="row">
            <q-btn icon="person" color="white" class="col-2" flat></q-btn>
            <q-card-section class="col-7">
              <div class="text-overline text-weight-bold text-grey-6">
                <q-icon name="person"></q-icon>
                {{ data.name ? data.name : data.email }}
              </div>
              <div class="text-caption text-weight-bold text-grey-5">
                <q-icon name="work"></q-icon>
                {{ data.info ? data.info : '' }}
              </div>
            </q-card-section>
            <q-btn icon="add" flat color="green" class="col" v-on:click="addWishList(data)"></q-btn>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="text-right">
        <q-btn no-caps label="Clear" color="red" flat v-on:click="cancelButton"></q-btn>
        <q-btn label="Onayla" no-caps flat color="green" v-on:click="createGroup" :disable="this.checkGroupData() ? false : true"></q-btn>
      </q-card-section>
    </q-card>
    <q-dialog
      dark
      v-model="this.selectedListActive" v-if="this.selectedListActive"
      persistent
      :maximized="this.store.avatarActive ? false : true"
      :full-height="this.store.avatarActive ? false : true"
    >
      <q-card class="bg-dark text-white" :style="{'width':this.store.widthOptions()}" style="margin:0 auto;">
        <q-card-section class="row">
          <q-btn icon="remove" flat color="white" v-on:click="this.selectedListActive = false"></q-btn>
          <q-space></q-space>
          <q-btn icon-right="delete_forever" flat color="red" label="Clear All" no-caps v-on:click="removeAllSelecteds"></q-btn>
        </q-card-section>
        <q-card-section class="row">
          <q-card
          :dark="this.checkAddedOrNot(data) ? true : false"
          class="bg-dark col-12 col-md-6 col-sm-6" v-for="data in this.selectedList" :key="data.id">
          <q-card-section class="row">
            <q-btn icon="person" color="white" class="col-2" flat></q-btn>
            <q-card-section class="col-7">
              <div class="text-overline text-weight-bold text-grey-6">
                <q-icon name="person"></q-icon>
                {{ data.name ? data.name : data.email }}
              </div>
              <div class="text-caption text-weight-bold text-grey-5">
                <q-icon name="work"></q-icon>
                {{ data.info ? data.info : '' }}
              </div>
            </q-card-section>
            <q-btn icon="add" flat color="green" class="col" v-on:click="addWishList(data)"></q-btn>
          </q-card-section>
        </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
import uploadVue from './upload.vue';
export default {
  components:{
    uploadVue
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
      selectedImage:{},
      groupData:{},
      users:[],
      findedUsers:[],
      selectedList:[],
      selectedListActive:false
    }
  },
  methods:{
    addMyAccToMember(data){
      const db = getDatabase()
      set(ref(db,`groupChats/${data}/members/${this.store.user.id}`),{
        id:this.store.user.id,
        image:this.store.userAllInfo.image ? this.store.userAllInfo.image : '',
        memberDate:this.store.currentDateString(),
        date:Date.now(),
      })
    },
    addSelectedUsersToGroup(data){
      if(this.selectedList.length){
        this.selectedList.forEach(element => {
          const db = getDatabase()
          set(ref(db,`groupChats/${data}/members/${element.id}`),{
            id:element.id,
            image:element.image ? element.image : '',
            memberDate:this.store.currentDateString(),
            date:Date.now(),
          })
          this.selectedList = this.selectedList.filter(object => object.id !== element.id)
        });
        this.addMyAccToMember(data)
        this.$q.notify({
          type:'positive',
          message:'Grup Oluşturuldu.',
          timeout:700,
          position:'bottom'
        })
        this.cancelButton()
      }
    },
    checkGroupData(){
      if(this.selectedImage.image&&this.groupData.name&&this.groupData.explain&&this.selectedList.length){
        return true
      }else{
        return false
      }
    },
    createGroup(){
      const db = getDatabase()
      this.groupData.id = uuidv4()
      const data = this.groupData.id
      set(ref(db,`groupChats/${this.groupData.id}`),{
        id:this.groupData.id,
        date:Date.now(),
        createdDate:this.store.currentDateString(),
        createrId:this.store.user.id,
        groupName:this.groupData.name,
        groupExplain:this.groupData.explain,
        image:this.selectedImage.image ? this.selectedImage.image : '',
      })
      this.addSelectedUsersToGroup(data)
    },
    cancelButton(){
      this.selectedList = []
      this.findedUsers = []
      this.searchValue = ''
      this.selectedImage = {}
      this.groupData = {}
    },
    removeAllSelecteds(){
      this.selectedList = []
      this.selectedListActive = false
    },
    showSelectedListButton(){
      this.selectedListActive =! this.selectedListActive
    },
    checkAddedOrNot(data){
      const result = this.selectedList.some(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addWishList(data){
      const result = this.selectedList.some(object => object.id === data.id)
      if(result){
        this.selectedList = this.selectedList.filter(object => object.id !== data.id)
      }else{
        this.selectedList.push(data)
      }
    },
    searchUserInput(){
      if(this.searchValue){
        this.users = this.store.secondUserList
        const result = this.users.filter(object => (object.name.toLowerCase()).includes(this.searchValue.toLowerCase()) || (object.email.toLowerCase()).includes(this.searchValue.toLowerCase()))
        if(result.length){
          this.findedUsers = result
          console.log(this.findedUsers)
          this.findedUsers.forEach(element => {
            console.log(element)
            const checkFriend = this.store.friendList.some(object => object.id === element.id)
            if(checkFriend === false){
              this.findedUsers = this.findedUsers.filter(object => object.id !== element.id)
            }
          });
          console.log('filteredREsult',this.findedUsers)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Kullanıcı Bulunamadı',
            timeout:700,
            position:'bottom'
          })
          this.searchValue = ''
          this.findedUsers = []
          this.users = this.store.secondUserList
        }
      }
    },
    removeImage(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Fotoğrafı Siliyosunuz, İşlemi Onaylıyorsanız OK ',
        cancel:true
      }).onOk(()=>{
        this.selectedImage = {}
      }).onCancel(()=>{
        //
      })
    },
    getcurrentImageData(data){
      if(data){
        this.selectedImage = data
        console.log('selectedImage',this.selectedImage)
      }
    },
    goBack(){
      this.store.createChatGroupActive = false
    }
  },
  created(){
    this.store.getUsers()
  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMyFriendList()
        }
      },
      immediate:true,
      deep:true
    },
    'store.secondUserList':{
      handler(newValue,oldValue){
        if(newValue){
          this.users = newValue
        }
      },
      immediate:true,
      deep:true
    }
  },
  mounted(){
    this.selectedImage = {}
  }
}
</script>

<style>

</style>
