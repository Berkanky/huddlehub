<template>
  <q-page class="page" style="">
    <div
          class="card-container" style="margin:0 auto;">
        <q-avatar style="margin:0 auto;" size="300px">
          <img
            v-on:click="this.infouser()"
            v-if="this.currentUser.image" :src="this.currentUser.image" style="object-fit:cover;" class="card_image"/>
        </q-avatar>
      <h6>
        <q-icon name="person"></q-icon>
        {{this.currentUser.name ? this.currentUser.name : this.currentUser.email}},
        {{ this.currentUser.age ? this.currentUser.age : '' }}
      </h6>
      <h6>
        <q-icon name="location_on"></q-icon>
        {{this.currentUser.city ? this.currentUser.city : ''}}, {{ this.currentUser.country ? this.currentUser.country : '' }}</h6>
      <p>
        <q-icon name="work"></q-icon>
        {{this.currentUser.info ? this.currentUser.info : ''}}</p>
      <div class="buttons">
        <q-btn icon="visibility_off" color="transparent" text-color="white" round size="12px" v-on:click="dontShow" glossy push></q-btn>
          <q-btn
            v-if="!checkMeInSelectedUserNotifyList()"
            :icon="checkForFriendOrNot() ? 'chat' : 'favorite'"
            color="transparent" text-color="white" round size="lg" class="q-ma-xs" glossy push v-on:click="checkForFriendOrNot() ? goChat() : addUser()"></q-btn>
            <q-btn
            v-if="checkMeInSelectedUserNotifyList()"
            icon="hourglass_top"
            color="transparent" text-color="white" round size="lg" class="q-ma-xs" glossy push v-on:click="cancelAddProcess"></q-btn>
            <q-btn icon="skip_next" color="transparent" text-color="white" size="lg" round class="q-ma-xs" glossy push v-on:click="this.swipeUser()"></q-btn>
          <q-btn :icon="checkForFavList() ? 'undo' : 'star'" color="transparent" text-color="white" round size="12px" glossy push v-on:click="checkForFavList() ? backFav() : addStar()"></q-btn>
      </div>
      <div class="skills">
        <h6>About</h6>
        <ul v-for="(data,key) in this.infosList" :key="key" style="display:inline-block;">
          <li>{{ data }}</li>
        </ul>
      </div>
    </div>
  <notifyComp v-if="this.store.notifyListActive"/>
  <genderQuestion v-if="this.store.genderOptionActive"/>
  </q-page>
</template>

<script>
import notifyComp from './notifyComp.vue';
import { v4 as uuidv4 } from 'uuid';
import genderQuestion from './genderQuestion.vue';
import {db} from '../firebase/index'
import { getDatabase, ref, set, update, remove, onValue } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    genderQuestion,
    notifyComp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myAcc:{},
      imageNumber:0,
      currentUser:{},
      number:0,
      images:[],
      currentImage:'',
      selectedUserNotifyList:[],
      infosList:[],
    }
  },
  methods:{
    swipeUser(){
      const maxNumber = this.store.secondUserList.length - 1;
      this.imageNumber = (this.imageNumber + 1) % (maxNumber + 1);
      this.currentUser = this.store.secondUserList[this.imageNumber];
    },
    getInfosSelectedUser(data){
      this.infosList = []
      this.infosList.push(data.age ? data.age : '')
      this.infosList.push(data.city ? data.city : '')
      this.infosList.push(data.birthday ? data.birthday : '')
      this.infosList.push(data.country ? data.country : '')
      this.infosList.push(data.drinkingHabbit ? data.drinkingHabbit : '')
      this.infosList.push(data.ethnicType ? data.ethnicType : '')
      this.infosList.push(data.genderOption ? data.genderOption : '')
      this.infosList.push(data.lookingForType ? data.lookingForType : '')
      console.log('ınfosList',this.infosList)
    },
    checkCurrentUserActive(){
      const result = this.store.usersList.find(object => object.id === this.currentUser.id)
      if(result){
        if(result.online){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    alsoRemoveFromMyNotify(){
      const db = getDatabase()
      remove(ref(db,`notifyList/${this.store.user.id}/${this.currentUser.id}`))
      this.store.notifyList = this.store.notifyList.filter(object => object.id !== this.currentUser.id)
    },
    cancelAddProcess(){
      const db = getDatabase()
      remove(ref(db,`notifyList/${this.currentUser.id}/${this.store.user.id}`))
      this.selectedUserNotifyList = this.selectedUserNotifyList.filter(object => object.sender !== this.store.user.id)
      this.alsoRemoveFromMyNotify()
    },
    backFav(){
      const db = getDatabase()
      remove(ref(db,`myFavs/${this.store.user.id}/${this.currentUser.id}`))
      this.store.myFavList = this.store.myFavList.filter(object => object.id !== this.currentUser.id)
    },
    checkForFavList(){
      if(this.store.myFavList.length){
        const result = this.store.myFavList.find(object => object.id === this.currentUser.id)
        if(result){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    addStar(){
      const db = getDatabase()
      set(ref(db,`myFavs/${this.store.user.id}/${this.currentUser.id}`),{
        age:this.currentUser.age ? this.currentUser.age : '',
        name:this.currentUser.name ? this.currentUser.name : '',
        email:this.currentUser.email,
        id:this.currentUser.id,
        info:this.currentUser.info ? this.currentUser.info : '',
        date:this.store.currentDateString()
      })
    },
    clearFilter(){
      this.store.filterUserActive = false
      this.store.filteredList = []
    },
    goChat(){
      this.store.selectedFav = this.currentUser
      //console.log(this.store.selectedFav)
      this.$router.push({path:'/chat'})
    },
    checkForFriendOrNot(){
      if(this.store.friendList.length){
        const result = this.store.friendList.find(object => object.id === this.currentUser.id)
        if(result){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findProfilePic(data){
      if(data.image === this.currentUser.image){
        return 'person'
      }else{
        return 'maximize'
      }
    },
    selectSpecificImage(data){
      this.currentImage = data.image
    },
    selectedImage(){
      if(this.currentUser.image){
        this.currentImage = this.currentUser.image
      }else if(this.images.length){
        const img = this.images[0]
        this.currentImage = img.image
      }
    },
    checkCurrentImage(data){
      if(data.image === this.currentImage){
        return 'blue'
      }else{
        return 'white'
      }
    },
    getImagesWithoutClick(){
      this.images = []
      for(const [key,value] of Object.entries(this.currentUser.images)){
        const imageData = {
          id:`${value.id}`,
          image:`${value.image}`
        }
        this.images.push(imageData)
      }
      this.images.push({id:uuidv4(),image:this.currentUser.image})
      console.log('images',this.images)
    },
    changeImage(data){
      if(this.images.length >= this.number){
        this.number = this.number + 1
        if(this.number == this.images.length){
          this.number = 0
        }
      }
      const newImage = this.images[this.number]
      this.currentImage = newImage.image
    },
    infouser(){
      const data = this.currentUser
      this.selectThisUser(data)
    },
    getSelectedUser(){
      const db = getDatabase();
      const dbRef = ref(db, `users/${this.currentUser.id}`);
      onValue(dbRef, (snapshot) => {
        this.currentUser = snapshot.val();
        console.log('currentUser',this.currentUser)
      });
    },
    sendNotify(){
      const db = getDatabase()
      set(ref(db,`notifyList/${this.currentUser.id}/${this.store.user.id}`),{
        id:this.store.user.id,
        email:this.store.user.email,
        sender:this.store.user.id,
        name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
        image:this.store.userAllInfo.image ? this.store.userAllInfo.image : '',
        date:this.store.currentDateString(),
        message:`${this.store.user.name ? this.store.user.name : this.store.user.email} Adlı Kullanıcı Sizinle Eşleşmek İstiyor.`,
        requestType:'friend',
        status:false
      })
    },
    addUser(){
      console.log(this.store.userAllInfo,this.currentUser)
      const db = getDatabase()
      set(ref(db,`notifyList/${this.store.user.id}/${this.currentUser.id}`),{
        id:this.currentUser.id,
        email:this.currentUser.email,
        sender:this.store.user.id,
        name:this.currentUser.name ? this.currentUser.name : '',
        image:this.currentUser.image ? this.currentUser.image : '',
        date:this.store.currentDateString(),
        message:`${this.currentUser.name ? this.currentUser.name : this.currentUser.email} Adlı Kişiye İstek Yolladınız.`,
        requestType:'friend',
        status:false
      })
      this.sendNotify()
    },
    selectThisUser(data){
      this.number = 0
      this.getSelectedUser()
      this.store.selectedUserForDetail = data
      this.store.rightActive = true
    },
    filterForDontShow(){
      this.store.secondUserList = this.store.usersList
      this.store.dontShowListAll.forEach(element => {
        const result = this.store.secondUserList.find(object => object.id === element.id)
        if(result){
          this.store.secondUserList = this.store.secondUserList.filter(object=> object.id !== element.id)
        }
      })
      console.log('dontsjowfilter',this.store.secondUserList)
    },
    dontShow(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`${this.currentUser.name} Adlı Kullancıyı Birdaha Görmeyeceksiniz, İşlemi Onaylıyor musunuz ?`,
        cancel:true
      }).onOk(() => {
        if(this.store.user.id !== this.currentUser.id){
          const db = getDatabase()
          set(ref(db,`dontShowList/${this.store.user.id}/${this.currentUser.id}`),{
            id:this.currentUser.id,
            date:this.store.currentDateString()
          })
          this.store.secondUserList = this.store.secondUserList.filter(object => object.id !== this.currentUser.id)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Kendinizi Kara Listeye Alamazsınız !',
            timeout:700,
            position:'bottom'
          })
        }
      }).onCancel(() => {
        //
      })
    },
    getSelectedUserNotifyList(data){
      const db = getDatabase()
      const dbRef = ref(db,`notifyList/${data.id}`)
      onValue(dbRef,(snapshot) => {
        this.selectedUserNotifyList = []
        snapshot.forEach((childSnapshot) => {
          this.selectedUserNotifyList.push(childSnapshot.val())
        })
        console.log('selectedUserNotifyList',this.selectedUserNotifyList)
      })
    },
    checkMeInSelectedUserNotifyList(){
      const result = this.selectedUserNotifyList.find(object => object.sender === this.store.user.id)
      if(result){
        return true
      }else{
        return false
      }
    }
  },
  mounted(){

  },
  beforeMount(){
    this.store.getUsers()
  },
  created(){
    //this.store.getMyAcc()
  },
  watch:{
    currentUser:{
      handler(newValue,oldValue){
        if(newValue.id){
          const data = this.currentUser
          this.getSelectedUserNotifyList(data)
          this.getInfosSelectedUser(data)
        }
      },
      immediate:true,
      deep:true
    },
    'store.secondUserList':{
      handler(newValue,oldValue){
        if(newValue.length){
          if(!this.store.filterUserActive){
            this.currentUser = this.store.secondUserList[this.imageNumber]
          }else{
            this.currentUser = this.store.filteredList[this.imageNumber]
          }
        }
      },
      immediate:true,
      deep:true
    },
    'store.dontShowListAll':{
      handler(newValue,oldValue){
        this.filterForDontShow()
        if(newValue){
          this.filterForDontShow()
        }
      },
      immediate:true,
      deep:true
    },
    imageNumber:{
      handler(newValue,oldValue){
        if(newValue || oldValue){
          console.log(newValue)
          if(!this.store.filterUserActive){
            this.currentUser = this.store.secondUserList[newValue]
          }else{
            this.currentUser = this.store.filteredList[newValue]
          }
          this.getImagesWithoutClick()
          this.selectedImage()
          if(this.store.rightActive){
            const data = this.currentUser
            this.selectThisUser(data)
          }
        }
      },
      immediate:true,
      deep:true
    },
    myAcc:{
      handler(newValue,oldValue){
        if(newValue.id){
          console.log('filterUserActive',this.store.filterUserActive)
         // this.store.getUsers()
          this.store.getMyFriendList()
          this.store.getMyNotifyList()
          this.store.getMyFavList()
          if(this.myAcc.genderOption){
            this.store.genderOptionActive = false
          }else{
            this.store.genderOptionActive = true
          }
        }
      },
      immediate:true,
      deep:true
    },
    'store.userAllInfo':{
      handler(newValue,oldValue){
        if(newValue){
          this.myAcc = newValue
          console.log('myAc',this.myAcc)
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getDontShowList()
          this.store.getMyAcc()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
  .page{
    height:100%;
  }
  .forMobile{
    width:100%;
  }
  .forDesktop{
    width:23%;
    min-width: 420px;
    margin:0% auto;
  }
  h3 {
	margin: 10px 0;
}

h6 {
	margin: 5px 0;
	text-transform: uppercase;
}

p {
	font-size: 14px;
	line-height: 21px;
}
.card_image{
  border: 5px solid #272133;
  margin-top:-15px;
  box-shadow: 0 10px 50px rgba(235, 25, 110, 1);
}
.card-container {
	background-color: #231E39;
	border-radius: 5px;
	box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.75);
	color: #B3B8CD;
	padding-top: 30px;
	position: relative;
	width: 350px;
	max-width: 100%;
	text-align: center;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-container .pro {
	color: #231E39;
	background-color: #FEBB0B;
	border-radius: 3px;
	font-size: 14px;
	font-weight: bold;
	padding: 3px 7px;
	position: absolute;
	top: 30px;
	left: 30px;
}

.card-container .round {
	border: 1px solid #03BFCB;
	border-radius: 50%;
	padding: 7px;
  max-width: 100%;
}

button.primary {
	background-color: #03BFCB;
	border: 1px solid #03BFCB;
	border-radius: 3px;
	color: #231E39;
	font-family: Montserrat, sans-serif;
	font-weight: 500;
	padding: 10px 25px;
}

button.primary.ghost {
	background-color: transparent;
	color: #02899C;
}

.skills {
	background-color: #1F1A36;
	text-align: left;
	padding: 15px;
	margin-top: 30px;
}

.skills ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
}

.skills ul li {
	border: 1px solid #2D2747;
	border-radius: 2px;
	display: inline-block;
	font-size: 12px;
	margin: 0 7px 7px 0;
	padding: 7px;
}
</style>
