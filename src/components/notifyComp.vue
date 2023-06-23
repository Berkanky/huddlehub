<template>
  <q-dialog v-model="this.store.notifyListActive" v-if="this.store.notifyListActive" persistent full-height :maximized="this.store.avatarActive ? false : true">
    <q-card class="bg-dark text-dark" :style="{'width':this.store.avatarActive ? '400px' : '100%'}">
      <q-card-section class="left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="this.store.notifyListActive=false;this.notifyListLocal = []"></q-btn>
      </q-card-section>
      <q-card-section>
        <div class="text-overline text-white" v-if="!this.notifyListLocal.length&&!this.store.myPointNotify.length">
          Herhangi Bir Bildirim Yok !
        </div>
        <q-card v-for="data in this.notifyListLocal" :key="data.id" class="text-white bg-transparent">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar>
                <img :src="getUserImage(data)" alt="" v-if="data.image">
                <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-overline">{{ data.name ? data.name : data.email }}</div>
              <div class="text-caption" v-if="data.sender == this.store.user.id&&data.requestType=='friend'">{{ data.notifyMessage ? data.notifyMessage : 'Arkadaşlık İsteği Gönderildi !' }}</div>
              <div class="text-caption" v-if="data.sender !== this.store.user.id&&data.requestType=='friend'">{{ data.name ? data.name : data.email }} {{ data.message ? data.message : 'Sizinle Bağlantı Kurmak İstiyor' }}</div>
              <div class="text-caption" v-if="data.sender !== this.store.user.id&&data.requestType=='connection'">{{ data.message ? data.message : '' }}</div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-fab flat text-color="white" icon="keyboard_arrow_left" direction="left">
                <q-fab-action color="primary" text-color="white" @click="confirm(data)" icon="check" v-if="data.sender != this.store.user.id&&data.requestType=='friend'"/>
                <q-fab-action color="red" text-color="white" icon="remove" v-on:click="deleteNotify(data)"></q-fab-action>
              </q-fab>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card v-for="data in this.store.myPointNotify" :key="data.memberId" class="bg-dark">
          <q-card-section horizontal>
            <q-card-section class="col-2 text-left">
              <q-avatar>
                <img :src="data.groupImage" v-if="data.groupImage">
                <q-btn icon="groups" color="dark" round v-if="!data.groupImage"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-7 text-center">
              <div class="text-caption text-white">
                {{ checkMemberName(data) }}
              </div>
              <div class="text-caption text-grey-5 text-weight-bold">
                {{ data.groupName }}
              </div>
            </q-card-section>
            <q-card-section class="col-3 text-left">
              <q-btn icon="star" color="pink" flat>
                <q-popup-edit v-model="this.rateValues.myPoint" v-slot="scope" class="bg-dark">
                  <q-rating
                    v-model="this.rateValues.myPoint"
                    size="2.5em"
                    color="pink"
                    icon="star_border"
                  />
                  <q-btn icon="check" color="green" flat v-on:click="givePointToGroup(data)"></q-btn>
                </q-popup-edit>
              </q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="bg-dark text-white" v-for="data in this.store.invitesList" :key="data.id">
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar>
                <img :src="data.image" v-if="data.image" alt="">
                <q-btn icon="person" v-if="!data.image" round color="dark"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-caption text-weight-bold">
                {{ data.name }}
              </div>
              <div class="text-caption text-grey-3">
                {{ data.message }}
              </div>
            </q-card-section>
            <q-card-section class="col-3">
              <q-fab color="dark" text-color="white" icon="keyboard_arrow_left" direction="left">
                <q-fab-action color="dark" text-color="white" @click="confirmInvite(data)" icon="check" />
                <q-fab-action color="dark" text-color="red" @click="declineInvite(data)" icon="remove" />
              </q-fab>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import {db} from '../firebase/index'
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      notifyListLocal:[],
      rateValues:{
        max:5,
        min:0,
        myPoint:0
      }
    }
  },
  methods:{
    removeFromGroupVoteList(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${data.id}/voteList/${this.store.user.id}`))
    },
    confirmInvite(data){
      console.log(data)
      const db = getDatabase()
      set(ref(db,`activityGroups/${data.id}/members/${this.store.user.id}`),{
        date:this.store.currentDateString(),
        email:this.store.user.email,
        id:this.store.user.id,
        name:this.store.userAllInfo.name ? this.store.userAllInfo.name : ''
      })
      this.removeFromGroupInvites(data)
      this.removeFromMyInvitesList(data)
      this.removeFromGroupVoteList(data)
    },
    removeFromGroupInvites(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${data.id}/invites/${this.store.user.id}`))
    },
    removeFromMyInvitesList(data){
      const db = getDatabase()
      remove(ref(db,`invites/${this.store.user.id}/${data.id}`))
      this.store.invitesList = this.store.invitesList.filter(object => object.id !== data.id)
    },
    declineInvite(data){
      this.removeFromGroupInvites(data)
      this.removeFromMyInvitesList(data)
      this.$q.notify({
        type:'negative',
        message:'Reddedildi',
        timeout:600,
        position:'bottom'
      })
    },
    removeThenPoint(data){
      const db = getDatabase()
      remove(ref(db,`pointNotify/${this.store.user.id}/${data.groupId}`))
      this.store.myPointNotify = this.store.myPointNotify.filter(object => object.groupId !== data.groupId)
    },
    givePointToGroup(data){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Puanı Verdikten Sonra Birdaha Değişiklik Yapılmayacaktır !',
        cancel:true
      }).onOk(() => {
        console.log(data,this.rateValues)
        const db = getDatabase()
        set(ref(db,`activityGroups/${data.groupId}/pointers/${this.store.user.id}`),{
          point:this.rateValues.myPoint,
          fullDate:this.store.currentDateString(),
          id:this.store.user.id,
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          email:this.store.user.email,
          groupId:data.groupId
        })
        this.removeThenPoint(data)
        this.rateValues.myPoint = 0
      }).onCancel(() => {

      })
    },
    checkMemberName(data){
      const result = this.store.usersList.find(object => object.id === data.adminId)
      if(result){
        if(result.name){
          const name = result.name
          return name
        }else{
          const email = result.email
          return email
        }
      }
    },
    checkUserImage(data){
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
    getUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    },
    checkSender(data){

    },
    removeNotifyToOtherUser(data){
      const db = getDatabase()
      update(ref(db,`notifyList/${data.id}/${this.store.user.id}`),{
        notifyMessage:'Kullanıcı Eşleşme İsteğinizi Reddetti.',
        status:true
      })
    },
    deleteNotify(data){
      const db = getDatabase()
      remove(ref(db,`notifyList/${this.store.user.id}/${data.id}`))
      this.store.notifyList = this.store.notifyList.filter(object => object.id !== data.id)
      if(this.store.user.id !== data.sender){
        this.removeNotifyToOtherUser(data)
      }
    },
    removeFromMyNotify(data){
      const db = getDatabase()
      remove(ref(db,`notifyList/${this.store.user.id}/${data.id}`))
      this.notifyListLocal = this.notifyListLocal.filter(object => object.id !== data.id)
    },
    updateOtherUserNotify(data){
      const db = getDatabase()
      update(ref(db,`notifyList/${data.id}/${this.store.user.id}`),{
        notifyMessage:'Added To Friend List',
        status:true
      })
    },
    addOtherUserFriendList(data){
      const db = getDatabase()
      set(ref(db,`myFriendsList/${data.id}/${this.store.user.id}`),{
        id:this.store.user.id,
        email:this.store.user.email,
        name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
        image:this.store.userAllInfo.image ? this.store.userAllInfo.image  : '',
        date:this.store.currentDateString(),
      })
    },
    confirm(data){
      const db = getDatabase()
      set(ref(db,`myFriendsList/${this.store.user.id}/${data.id}`),{
        id:data.id,
        email:data.email,
        name:data.name ? data.name : '',
        image:data.image ? data.image  : '',
        date:this.store.currentDateString(),
      })
      this.addOtherUserFriendList(data)
      this.updateOtherUserNotify(data)
      this.removeFromMyNotify(data)
    }
  },
  created(){
    console.log(this.store.userAllInfo)
    this.store.getMyNotifyList()
  },
  beforeMount(){
    this.store.getUsers()
  },
  watch:{
    rateValues:{
      handler(newValue){
        if(newValue){
          console.log(this.rateValues)
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMyInvitesList()
          this.store.getMyPointNotifies()
        }
      },
      immediate:true,
      deep:true
    },
    'store.notifyList':{
      handler(newValue,oldValue){
        if(newValue){
          // .length yeni eklendi 15.03.2023
          this.notifyListLocal = newValue
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
