<template>
  <q-dialog
    v-if="this.store.addNewUserActive" v-model="this.store.addNewUserActive"
    :full-width="this.store.avatarActive ? false : true"
    persistent
  >
    <q-card class="bg-dark text-white" :style="{'width':this.store.avatarActive ? '700px' : '100%'}">
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section v-if="this.selectedUser.id">
        <q-card class="bg-dark" bordered>
          <q-card-section horizontal>
            <q-img
              class="col"
              v-if="this.selectedUser.image"
              :src="this.selectedUser.image"
            >
              <div class="absolute-bottom text-center">
                {{ this.selectedUser.name ? this.selectedUser.name : this.selectedUser.email }},
                {{ this.selectedUser.age ? this.selectedUser.age : '' }}
              </div>
            </q-img>
            <q-btn class="" round icon="person" color="dark" flat v-if="!this.selectedUser.image"></q-btn>
            <q-card-actions vertical class="justify-around">
              <q-btn flat round color="primary" icon="share"  v-on:click="sendToVoteListUser"/>
              <q-btn flat round color="green" icon="check" v-on:click="confirmUser"/>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-select
        @update:model-value="selectUser"
        dark color="white" label="Select User From Your FriendList" v-model="this.newUser" :options="this.optionList">
          <template v-slot:prepend>
            <q-icon name="person_add"></q-icon>
          </template>
          <template v-slot:append v-if="this.newUser">
            <q-btn icon="remove" flat color="white" v-on:click="clearSelected"></q-btn>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section>
        <q-card class="bg-dark text-white" flat v-for="data in this.invitesListAlllocal" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar>
                <img :src="findUserImage(data)" alt="" v-if="checkImageOrNot(data)" style="object-fit:cover;">
                <q-btn icon="person" v-if="!checkImageOrNot(data)" round color="dark"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-overline">
                {{ data.name ? data.name : data.email }}
              </div>
              <div class="text-caption">
                {{ data.date }}
              </div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-spinner-cube
                color="pink"
                size="2em"
                v-on:click="cancelProcess(data)"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedGroup','memberList','invitesListAll'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      filteredList:[],
      friendListLocal:[],
      newUser:'',
      selectedGroupLocal:{},
      memberListLocal:[],
      optionList:[],
      selectedUser:{},
      invitesListAlllocal:[],
      inviteType:''
    }
  },
  methods:{
    removeFromVoteList(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/voteList/${data.id}`))
    },
    removeFromUserInvites(data){
      if(data.type === 'request'){
        const db = getDatabase()
        remove(ref(db,`invites/${data.id}/${this.selectedGroupLocal.id}`))
        console.log('requet deleted')
      }else{
        console.log('vote deleted')
      }
    },
    cancelProcess(data){
      console.log(data)
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/invites/${data.id}`))
      this.invitesListAlllocal = this.invitesListAlllocal.filter(object => object.id !== data.id)
      this.removeFromUserInvites(data)
      this.removeFromVoteList(data)
    },
    sendToVoteListUser(){
      this.inviteType = 'vote'
      const newData = this.selectedUser
      this.allsoAddGroupInvıtesList(newData)
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.selectedGroupLocal.id}/voteList/${this.selectedUser.id}`),{
        id:newData.id,
        date:this.store.currentDateString(),
        email:newData.email,
        name:newData.name ? newData.name : '',
        info:newData.info ? newData.info : '',
        type:this.inviteType
      })
      this.$q.notify({
        type:'positive',
        icon:'check',
        timeout:700,
        position:'bottom'
      })
      this.newUser = ''
      this.selectedUser={}
    },
    checkImageOrNot(data){
      const result = this.store.usersList.find(object => object.id === data.id)
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
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    },
    allsoAddGroupInvıtesList(newData){
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.selectedGroupLocal.id}/invites/${newData.id}`),{
        id:newData.id,
        date:this.store.currentDateString(),
        email:newData.email,
        name:newData.name ? newData.name : '',
        info:newData.info ? newData.info : '',
        type:this.inviteType
      })
    },
    confirmUser(){
      this.inviteType = 'request'
      console.log(this.selectedUser)
      const newData  = this.selectedUser
      const db = getDatabase()
      set(ref(db,`invites/${this.selectedUser.id}/${this.selectedGroupLocal.id}`),{
        date:this.store.currentDateString(),
        email:this.selectedGroup.adminEmail,
        id:this.selectedGroupLocal.id,
        adminId:this.selectedGroupLocal.adminId,
        image:this.selectedGroupLocal.image ? this.selectedGroupLocal.image : '',
        message:`${this.selectedGroupLocal.name ? this.selectedGroupLocal.name : this.selectedGroupLocal.optionName} Grubu Tarafından Katılım Daveti Aldınız!`,
        name:this.selectedGroupLocal.name ? this.selectedGroupLocal.name : this.selectedGroupLocal.optionName,
        notifyMessage:`${this.selectedGroupLocal.name ? this.selectedGroupLocal.name : this.selectedGroupLocal.optionName} Grubu Tarafından Katılım Daveti Aldınız!`,
        requestType:'invite',
        sender:this.selectedGroupLocal.adminId,
        status:true
      })
      this.allsoAddGroupInvıtesList(newData)
      this.$q.notify({
        type:'positive',
        message:'Davet Yollandı',
        timeout:700,
        position:'bottom'
      })
      this.selectedUser = {}
      this.newUser = ''
    },
    selectUser(val){
      if(val){
        console.log(val)
        const result = this.store.usersList.find(object => object.email === val)
        if(result){
          this.selectedUser = result
          console.log('selecteUser',this.selectedUser)
        }
      }
    },
    filterList(){
      this.filteredList = []
      this.friendListLocal.forEach(element => {
        const result = this.memberListLocal.find(object => object.id === element.id)
        if(!result){
          this.filteredList.push(element)
        }
      });
      console.log('filteredList',this.filteredList)
      const list = []
      if(this.filteredList.length){
        this.filteredList.forEach(element => {
          list.push(element.email)
        });
      }
      this.optionList = list
    },
    clearSelected(){
      this.newUser = ''
      this.selectedUser = {}
    },
    goBack(){
      this.store.addNewUserActive = false
    }
  },
  created(){

  },
  mounted(){
    this.filterList()
  },
  watch:{
    invitesListAll:{
      handler(newValue,oldValue){
        if(newValue){
          this.invitesListAlllocal = newValue
          console.log('invitesListAlllocal',this.invitesListAlllocal)
        }
      },
      immediate:true,
      deep:true
    },
    memberList:{
      handler(newValue,oldValue){
        if(newValue){
          this.memberListLocal = newValue
          console.log('memberListLocal',this.memberListLocal)

        }
      },
      immediate:true,
      deep:true
    },
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroupLocal = newValue
          console.log('selectedGroupLocal',this.selectedGroupLocal)
        }
      },
      immediate:true,
      deep:true
    },
    'store.friendList':{
      handler(newValue,oldValue){
        if(newValue){
          this.friendListLocal = newValue
          console.log('friendListLocal',this.friendListLocal)
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMyFriendList()
        }
      },
      immediate:true,
      deep:true
    },
  }
}
</script>

<style scoped>
</style>
