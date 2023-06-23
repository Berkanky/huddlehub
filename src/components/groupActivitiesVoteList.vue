<template>
  <q-card
  :dark="checkForMaximumVoter(data) ? true : false"
  :style="{'width':this.store.avatarActive ? '45%' : '100%','margin':this.store.marginOptions()}"
  class="bg-dark text-white q-pa-xs"
  v-for="data in this.votesList" :key="data.id"
  bordered
  >
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar>
          <img :src="findUserImage(data)" alt="" v-if="checkImage(data)" style="object-fit:cover;">
          <q-btn icon="person" color="dark" round v-if="!checkImage(data)"></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-6">
        <div class="text-caption text-capitalize text-weight-bold text-grey-5">
          {{ data.name ? data.name : data.email }}
        </div>
        <div class="text-caption text-capitalize text-weight-bold">
          Oylanma Sayısı - {{ userVoterList(data) }}
        </div>
      </q-card-section>
      <q-card-section class="col-3">
        <q-btn icon="add" flat color="green" v-on:Click="voteUser(data)" v-if="!checkVotedOrNot(data)"></q-btn>
        <q-btn icon="remove" flat color="red"  v-on:click="removeVote(data)" v-if="checkVotedOrNot(data)"></q-btn>
        <q-btn icon="cancel" flat color="red" v-on:Click="deleteUser(data)" v-if="this.selectedGroupLocal.adminId === this.store.user.id"></q-btn>
        <q-btn icon="check" flat color="green" v-if="checkForMaximumVoter(data)&&this.memberListValue()" v-on:Click="sendToRequest(data)"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  props:['selectedGroup'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedGroupLocal:{},
      votesList:[],
      maxVotesList:[],
      invitesListAll:[],
      memberList:[],
      inviteType:''
    }
  },
  methods:{
    getMembers(){
      if(this.selectedGroupLocal.members){
        this.memberList = []
        for(const [key,value] of Object.entries(this.selectedGroupLocal.members)){
          const memberData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            name:`${value.name}`
          }
          this.memberList.push(memberData)
        }
        console.log('memberList',this.memberList)
      }else{
        this.memberList = []
      }
    },
    getInvitesList(){
      if(this.selectedGroupLocal.invites){
        const list = []
        for(const [key,value] of Object.entries(this.selectedGroupLocal.invites)){
          const userData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            info:`${value.info}`,
            name:`${value.name ? value.name : ''}`,
            type:`${value.type}`
          }
          list.push(userData)
        }
        this.invitesListAll = list
        console.log('invitesListAll',this.invitesListAll)
      }else{
        this.invitesListAll = []
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
    confirmUser(data){
      this.inviteType = 'request'
      const newData  = data
      const db = getDatabase()
      set(ref(db,`invites/${data.id}/${this.selectedGroupLocal.id}`),{
        date:this.store.currentDateString(),
        email:this.selectedGroupLocal.adminEmail,
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
    },
    sendToRequest(data){
      const result = this.memberList.find(object => object.id === data.id)
      if(result){
        this.$q.notify({
          type:'negative',
          message:`${data.name ? data.name : data.email} Adlı Kullanıcı Zaten Gruba Eklenmiş !`,
          timeout:700,
          position:'bottom'
        })
        this.deleteUser(data)
        this.removeFromInvites(data)
      }else{
        this.confirmUser(data)
      }
    },
    removeFromInvites(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/invites/${data.id}`))
    },
    checkForMaximumVoter(data){
      const result = this.maxVotesList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    findMaxVote(){
      const maxNumber = Math.max(...this.votesList.filter(e => e.votes).map(e => Object.keys(e.votes).length))
      this.maxVotesList = this.votesList.filter(e => e.votes && Object.keys(e.votes).length === maxNumber)
    },
    deleteUser(data){
      console.log(data)
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroup.id}/voteList/${data.id}`))
      this.votesList = this.votesList.filter(object => object.id !== data.id)
      this.$q.notify({
        type:'negative',
        message:`${data.name ? data.name : data.email} Adlı Kullanıcı Vote Listesinden Silindi !`,
        timeout:700,
        position:'bottom'
      })
    },
    checkVotedOrNot(data){
      if(data.votes){
        const list = []
        for(const [key,value] of Object.entries(data.votes)){
          const voterData = {
            id:`${value.id}`
          }
          list.push(voterData)
        }
        const result = list.find(object => object.id === this.store.user.id)
        if(result){
          return true
        }else{
          return false
        }
      }
    },
    removeVote(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/voteList/${data.id}/votes/${this.store.user.id}`))
    },
    voteUser(data){
      console.log(data)
      const db = getDatabase()
      set(ref(db,`activityGroups/${this.selectedGroupLocal.id}/voteList/${data.id}/votes/${this.store.user.id}`),{
        id:this.store.user.id,
        date:this.store.currentDateString()
      })
    },
    userVoterList(data){
      if(data.votes){
        const length = Object.entries(data.votes).length
        this.votesList.forEach(element => {
          if(element.id === data.id){
            element.voteValue = length
          }
        });
        return length
      }else{
        return 0
      }
    },
    checkImage(data){
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
    getVotesList(){
      if(this.selectedGroupLocal.voteList){
        const db = getDatabase()
        const dbRef = ref(db,`activityGroups/${this.selectedGroupLocal.id}/voteList/`)
        onValue(dbRef,(snapshot) => {
          this.votesList = []
          snapshot.forEach((childSnapshot)=>{
            this.votesList.push(childSnapshot.val())
          })
          console.log('votesList',this.votesList)
          this.findMaxVote()
        })
      }
    },
    memberListValue(){
      if(this.selectedGroupLocal.members){
        const length = Object.entries(this.selectedGroupLocal.members).length
        const maxNumber = Math.max(...this.votesList.filter(e => e.votes).map(e => Object.keys(e.votes).length))
        if(length === maxNumber){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getCurrentGroupInfo(){
      const db = getDatabase();
      const dbRef = ref(db, `activityGroups/${this.selectedGroupLocal.id}`);
      onValue(dbRef, (snapshot) => {
        this.selectedGroupLocal = snapshot.val();
        console.log('selectedGroupLocalUpdated',this.selectedGroupLocal)
        this.getVotesList()
        this.getInvitesList()
        this.getMembers()
      });
    }
  },
  watch:{
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroupLocal = newValue
         // console.log('selectedGroupLocal',this.selectedGroupLocal)
          this.getCurrentGroupInfo()
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
