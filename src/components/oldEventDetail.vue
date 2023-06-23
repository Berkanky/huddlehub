<template>
  <q-dialog
    v-if="this.store.oldEventDetailActive"
    v-model="this.store.oldEventDetailActive"
    persistent
    :full-height="this.store.avatarActive ? true : false"
    :maximized="this.store.avatarActive ? false : true"
    >
      <q-card
        dark
        :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'"
      >
        <q-card-section class="row">
          <q-btn
            icon="keyboard_backspace" flat
            color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn
            v-on:click="addSavedOrRemove"
            :color="this.checkColor() === true ? 'red' : 'green'"
            :icon="this.checkColor() === true ? 'bookmark_remove' : 'bookmark_add'" flat></q-btn>
          <q-btn
            no-caps
            :label="this.selectedGroup.name  ? this.selectedGroup.name : this.selectedGroup.optionName"
            :icon="this.selectedGroup.icon ? this.selectedGroup.icon : 'info'" size="sm" flat
            :color="this.selectedGroup.color ? this.selectedGroup.color : 'white'"></q-btn>
          <q-avatar>
            <img :src="this.selectedGroup.image" v-if="this.selectedGroup.image" style="object-fit:cover;">
          </q-avatar>
        </q-card-section>
<!--         <q-card-section class="text-center">
          <q-avatar rounded size="200px">
            <img :src="this.selectedGroup.image" v-if="this.selectedGroup.image" style="object-fit:cover;">
          </q-avatar>
        </q-card-section> -->
 <!--        <q-card-section class="text-center">
          <div class="text-overline text-grey-5">
            <q-icon
              :color="this.selectedGroup.color ? this.selectedGroup.color : 'white'"
              :name="this.selectedGroup.icon ? this.selectedGroup.icon : 'info'" size="17px"></q-icon>
            {{ this.selectedGroup.name  ? this.selectedGroup.name : this.selectedGroup.optionName }}
          </div>
        </q-card-section> -->
        <q-card-section>
          <q-stepper
      v-model="step"
      vertical
      dark
      animated
    >
      <q-step
        :name="3"
        title="Event Created Date"
        icon="event"
        :color="this.selectedGroupLocal.color ? this.selectedGroupLocal.color : 'pink'"
      >
          <q-icon name="event" size="17px"></q-icon>
          {{ this.selectedOldEventLocal.createdDate }}
      </q-step>

      <q-step
        :name="3"
        title="Event Date"
        icon="event"
        :color="this.selectedGroupLocal.color ? this.selectedGroupLocal.color : 'pink'"
      >
      <q-icon name="event" size="17px"></q-icon>
        {{this.selectedOldEventLocal.eventDate}}
      </q-step>

      <q-step
        :name="3"
        :color="this.selectedGroupLocal.color ? this.selectedGroupLocal.color : 'pink'"
        title="Event End Date"
        icon="event"
      >
      <q-icon name="event" size="17px"></q-icon>
        {{ this.selectedOldEventLocal.endDate }}
      </q-step>
    </q-stepper>
        </q-card-section>
        <q-card-section class="row">
          <div style="font-size:16px;" class="text-caption text-weight-bold text-grey-6 text-capitalize q-pa-md">
            <!-- <q-icon name="collections_bookmark" size="17px"></q-icon> -->
            <!-- <q-icon name="chevron_right" size="17px"></q-icon> -->
            Photos
          </div>
          <q-space></q-space>
          <q-btn icon="collections_bookmark" flat color="white" v-on:click="goGalleryComp">
            <q-badge floating :color="this.selectedGroup.color ? this.selectedGroup.color : 'pink'" rounded v-if="this.imageListGlobal.length"/>
          </q-btn>
        </q-card-section>
        <q-card-section class="row q-ml-md">
          <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;">
            <q-card-section class="text-center" style="width:100%;height:100%;">
              <q-btn icon="add" flat color="white" class="full-height full-width" v-on:click="openFile"></q-btn>
            </q-card-section>
          </q-card>
          <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;" v-for="data in this.myUploadedImages" :key="data.id" v-if="!this.mySelectedList.length&&this.myUploadedImages.length">
            <q-img
              loading="lazy"
              spinner-color="white"
              style="object-fit:cover;height:100%;"
              :src="data.image"
            >
              <div class="absolute-top-right bg-transparent" v-if="data.uploaderId === this.store.user.id">
                <q-btn icon="remove" color="dark" v-on:click="removeImage(data)" size="sm" round></q-btn>
              </div>
              <div class="absolute-bottom text-center" v-if="data.uploaderId !== this.store.user.id" style="display:block;">
                {{  findUser(data) }}
                <span>{{ data.date ? data.date : 'Tarih Bulunamadı !' }}</span>
              </div>
            </q-img>
          </q-card>
          <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;" v-for="data in this.filterForLoop()" :key="data.id" v-if="!this.mySelectedList.length&&!this.myUploadedImages.length">
            <q-img
              loading="lazy"
              spinner-color="white"
              style="object-fit:cover;height:100%;"
              :src="data.image"
            >
              <div class="absolute-top-right bg-transparent" v-if="data.uploaderId === this.store.user.id">
                <q-btn icon="remove" color="dark" v-on:click="removeImage(data)" size="sm" round></q-btn>
              </div>
              <div class="absolute-bottom text-center" v-if="data.uploaderId !== this.store.user.id" style="display:block;">
                {{  findUser(data) }}
                <span>{{ data.date ? data.date : 'Tarih Bulunamadı !' }}</span>
              </div>
            </q-img>
          </q-card>
          <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;" v-for="data in this.mySelectedList" :key="data.id" v-if="this.mySelectedList.length">
            <q-img
              loading="lazy"
              spinner-color="white"
              style="object-fit:cover;height:100%;"
              :src="data.image"
            >
              <div class="absolute-top-right bg-transparent" v-if="data.uploaderId === this.store.user.id">
                <q-btn icon="remove" color="dark" v-on:click="removeImage(data)" size="sm" round></q-btn>
              </div>
              <div class="absolute-bottom text-center" v-if="data.uploaderId !== this.store.user.id" style="display:block;">
                {{  findUser(data) }}
                <span>{{ data.date ? data.date : 'Tarih Bulunamadı !' }}</span>
              </div>
            </q-img>
          </q-card>
          <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;" v-if="this.mySelectedList.length">
            <q-card-section class="text-center" style="width:100%;height:150px;">
              <q-btn icon="upload" class="full-height full-width" v-on:click="confirmImages" color="green" flat></q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section>
            <q-card-section class="row">
              <div style="font-size:16px;" class="text-caption text-weight-bold text-grey-6 text-capitalize q-pa-sm">
                Videos
              </div>
              <q-space></q-space>
              <q-btn icon="videocam" flat color="white" v-on:click="showUploadedVideos">
                <q-badge floating :color="this.selectedGroup.color ? this.selectedGroup.color : 'pink'" rounded v-if="this.eventVideoList.length"/>
              </q-btn>
            </q-card-section>
            <q-card-section class="row">
              <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;">
                <q-card-section class="text-center" style="width:100%;height:100%;">
                  <q-btn icon="play_arrow" flat color="white" class="full-height full-width" v-on:click="openVideoFile"></q-btn>
                </q-card-section>
              </q-card>
              <q-card
                v-touch-hold:2000.mouse="event => removeVideo(data)"
                class="col-6 col-md-4 col-sm-4" dark style="height:150px;"
                v-for="data in this.videoList" :key="data.id" v-if="this.videoList.length">
                <video  style="width:100%;height:100%;" controls>
                  <source :src="data.videoForBack" type="video/mp4">
                  <source :src="data.videoForBack" type="video/ogg">
                Your browser does not support the video tag.
                </video>
              </q-card>
              <q-card
                class="col-6 col-md-4 col-sm-4" dark style="height:150px;"
                v-for="data in this.loopForVideo()" :key="data.id" v-if="this.eventVideoList.length&&!this.videoList.length">
                <video  style="width:100%;height:100%;" controls>
                  <source :src="data.videoForBack" type="video/mp4">
                  <source :src="data.videoForBack" type="video/ogg">
                Your browser does not support the video tag.
                </video>
              </q-card>
              <q-card class="col-6 col-md-4 col-sm-4" dark style="height:150px;" v-if="this.videoList.length">
                <q-card-section class="text-center" style="width:100%;height:100%;">
                  <q-btn icon="add" flat color="green" class="full-height full-width" v-on:click="uploadVideos"></q-btn>
                </q-card-section>
              </q-card>
            </q-card-section>
        </q-card-section>
        <q-card-section v-if="this.checkMembersOrNot()">
          <q-card-section class="row">
            <div style="font-size:16px;" class="text-caption text-weight-bold text-grey-6 text-capitalize q-pa-sm">
              Members
            </div>
            <q-space></q-space>
            <q-btn icon="groups" flat color="white" v-on:Click="showOldEventMembersFunction"></q-btn>
          </q-card-section>
          <q-card-section>
            <oldEventMembers :memberList="this.memberList.length ? this.memberList : ''"/>
          </q-card-section>
        </q-card-section>
        <q-card-section>
          <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
          <q-file ref="videoFileInput" v-model="this.video" style="display: none" @update:model-value="selectNewVideoFile"/>
        </q-card-section>
      </q-card>
      <videoGallery
        :selectedOldEvent="this.selectedOldEventLocal"
        :selectedGroup="this.selectedGroup"
        :memberList="this.memberList.length ? this.memberList : ''"
        :eventVideoList="this.eventVideoList.length ? this.eventVideoList : ''"
        v-if="this.store.oldEventVideoGalleryActive"
      />
      <showGalleryOldEvents
      :selectedOldEventLocal="this.selectedOldEventLocal"
      :selectedGroup="this.selectedGroup"
      :imageListGlobal="this.imageListGlobal.length ? this.imageListGlobal : ''"
      v-if="this.store.oldEventGalleryActive"/>
      <selectedUserDetailDialog v-if="this.store.showUserDetailActive"/>
    </q-dialog>
</template>

<script>
import videoGallery from './videoGallery.vue';
import selectedUserDetailDialog from './selectedUserDetailDialog.vue';
import oldEventMembers from './oldEventMembers.vue';
import showGalleryOldEvents from './showGalleryOldEvents.vue';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    selectedUserDetailDialog,
    showGalleryOldEvents,
    oldEventMembers,
    videoGallery,
  },
  props:['selectedGroupLocal','selectedOldEvent'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedGroup:{},
      step:3,
      selectedOldEventLocal:{},
      video:'',
      image:'',
      imageForBack:'',
      videoForBack:'',
      currentImageData:{},
      imageListGlobal:[],
      serverImageList:[],
      mySelectedList:[],
      myUploadedImages:[],
      memberList:[],
      videoList:[], //seçilenler yüklemek için
      eventVideoList:[], //yüklenenler
    }
  },
  computed: {

  },
  methods:{
    loopForVideo(){
      const list = this.eventVideoList.slice(0,3)
      return list
    },
    getVideos(data){
      if(data.videos){
        const list = []
        for(const [key,value] of Object.entries(data.videos)){
          const videoData = {
            id:`${value.id}`,
            date:`${value.date}`,
            fullDate:`${value.fullDate}`,
            uploaderId:`${value.uploaderId}`,
            video:`${value.video}`,
            videoForBack:`${value.videoForBack}`,
          }
          const result = list.some(object => object.id === videoData.id)
          if(!result){
            list.push(videoData)
          }
        }
        this.eventVideoList = list
        console.log('videos',this.eventVideoList)
      }else{
        this.eventVideoList = []
      }
    },
    checkHowManyVideoUploaded(){
      const result = this.eventVideoList.filter(object => object.uploaderId === this.store.user.id)
      if(result.length){
        const lengthList = result.length
        console.log('eventVideoList',this.eventVideoList)
        console.log(lengthList,'lengthList')
        if(lengthList < 2){
          return true
        }else{
          return false
        }
      }else{
        return true
      }
    },
    uploadVideos(){
      if(this.checkHowManyVideoUploaded() === true){
        console.log(this.selectedGroup.id,this.selectedOldEventLocal.id)
        this.videoList.forEach(element => {
          const db = getDatabase()
          set(ref(db,`activityGroups/${this.selectedGroup.id}/oldGroupActivities/${this.selectedOldEventLocal.id}/videos/${element.id}`),{
            uploaderId:element.uploaderId,
            video:element.video,
            videoForBack:element.videoForBack,
            date:Date.now(),
            id:element.id,
            fullDate:this.store.currentDateString()
          })
          this.videoList = this.videoList.filter(object => object.id !== element.id)
        });
      }else{
        this.$q.notify({
          type:'negative',
          message:'Max 2 Video Yükleyebilirsiniz ! ',
          timeout:700,
          position:'top'
        })
      }
    },
    removeVideo(data){
      const result = this.videoList.some(object => object.id === data.id)
      if(result){
        this.videoList = this.videoList.filter(object => object.id !== data.id)
        this.$q.notify({
          type:'positive',
          timeout:700,
          icon:'check',
          position:'top'
        })
      }
    },
    selectNewVideoFile(){
      this.$q.loading.show()
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const videoForBack = reader.result;
        console.log('videoForBack',videoForBack)
        if (this.video && this.video.size <= 10 * 1024 * 1024) {
          const currentVideoData = {
            id: uuidv4(),
            uploaderId: this.store.user.id,
            video: this.video,
            videoForBack: videoForBack
          };
          this.pushVideoList(currentVideoData);
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            type:'negative',
            message:'Seçilen Dosya Çok Büyük',
            timeout:700,
            position:'top'
          })
        }
      });
      if(this.video) {
        reader.readAsDataURL(this.video);
      }
    },
    pushVideoList(currentVideoData){
      const result = this.videoList.some(object => object.id === currentVideoData.id)
      if(!result){
        this.videoList.push(currentVideoData)
      }
      console.log(this.videoList)
    },
    openVideoFile(){
      this.$refs.videoFileInput.$el.click()
      console.log('videoUploadTricked')
    },
    showUploadedVideos(){
      this.store.oldEventVideoGalleryActive  = true
      console.log('selectedOldEventLocal',this.selectedOldEventLocal)
      console.log('selectedGroup',this.selectedGroup)
    },
    checkMembersOrNot(){
      if(this.memberList.length){
        return true
      }else{
        return false
      }
    },
    getMembersOfOldEvent(data){
      if(data.members){
        const list = []
        for(const [key,value] of Object.entries(data.members)){
          const memberData = {
            id:`${value.id}`
          }
          list.push(memberData)
        }
        this.memberList = list
        console.log('members',this.memberList)
      }else{
        this.memberList = []
      }
    },
    showOldEventMembersFunction(){
      this.store.showOldEventMembersActive = true
    },
    addSavedOrRemove(){
      if(this.checkColor()){
        const db = getDatabase()
        remove(ref(db,`mySavedOldEvents/${this.store.user.id}/${this.selectedOldEventLocal.id}`))
        this.store.savedOldEventList = this.store.savedOldEventList.filter(object => object.id !== this.selectedOldEventLocal.id)
      }else{
        const db = getDatabase()
        set(ref(db,`mySavedOldEvents/${this.store.user.id}/${this.selectedOldEventLocal.id}`),{
          savedDate:this.store.currentDateString(),
          date:Date.now(),
          id:this.selectedOldEventLocal.id,
          groupId:this.selectedGroup.id,
          adminId:this.selectedGroup.adminId,
          images:this.selectedOldEventLocal.images ? this.selectedOldEventLocal.images : '',
          name:this.selectedGroup.name ? this.selectedGroup.name : '',
          createdDate:this.selectedOldEventLocal.createdDate,
          endDate:this.selectedOldEventLocal.endDate,
          eventDate:this.selectedOldEventLocal.eventDate,
          lat:this.selectedOldEventLocal.lat ? this.selectedOldEventLocal.lat : '',
          lng:this.selectedOldEventLocal.lng ? this.selectedOldEventLocal.lng : '',
          image:this.selectedGroup.image ? this.selectedGroup.image : '',
          optionName:this.selectedGroup.optionName ? this.selectedGroup.optionName : '',
          color:this.selectedGroup.color ? this.selectedGroup.color : '',
          icon:this.selectedGroup.icon ? this.selectedGroup.icon : '',
          groupExplain:this.selectedGroup.groupExplain ? this.selectedGroup.groupExplain : '',
          members:this.selectedOldEventLocal.members ? this.selectedOldEventLocal.members : ''
        })
      }
    },
    checkColor(){
      const result = this.store.savedOldEventList.find(object => object.id === this.selectedOldEventLocal.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    filterForMyImages(){
      this.myUploadedImages = this.imageListGlobal.filter(object => object.uploaderId === this.store.user.id)
      console.log('myUploadedImages',this.myUploadedImages)
    },
    goGalleryComp(){
      this.store.oldEventGalleryActive = true
      console.log(this.imageListGlobal)
    },
    filterForLoop(){
      return this.imageListGlobal.slice(0,3)
    },
    findUser(data){
      const result = this.store.usersList.find(object => object.id === data.uploaderId)
      if(result){
        const name = result.name ? result.name : result.email
        return name
      }else{
        const name = 'Bulunamadı !'
        return name
      }
    },
    confirmImages(){
      this.mySelectedList.forEach(element => {
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.selectedGroupLocal.id}/oldGroupActivities/${this.selectedOldEventLocal.id}/images/${element.id}`),{
          id:element.id,
          uploaderId:element.uploaderId,
          image:element.image,
          date:this.store.currentDateString()
        })
        this.mySelectedList = this.mySelectedList.filter(object => object.id !== element.id)
      });
    },
    removeImage(data){
      const result = this.serverImageList.find(object => object.id === data.id)
      if(result){
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/oldGroupActivities/${this.selectedOldEventLocal.id}/images/${data.id}`))
        this.$q.notify({
          type:'positive',
          message:`Veri Tabanından Silindi !`,
          timeout:700,
          position:'bottom'
        })
      }
      this.imageListGlobal = this.imageListGlobal.filter(object => object.id !== data.id)
      this.mySelectedList = this.mySelectedList.filter(object => object.id !== data.id)
      console.log('mySelectdList',this.mySelectedList)
    },
    pushList(){
      const result = this.imageListGlobal.find(object => object.id === this.currentImageData.id)
        if(!result){
          this.imageListGlobal.push(this.currentImageData)
          this.mySelectedList.push(this.currentImageData)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Seçili Fotoğraf Yüklenemedi !',
            position:'top',
            timeout:700
          })
        }
        //this.mySelectedList = this.imageListGlobal
        console.log(this.imageListGlobal)
        console.log('mySelectedList',this.mySelectedList)
    },
    openFile(){
      this.$refs.fileInput.$el.click()
      console.log('yo')
    },
    async selectNewFile(){
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageForBack = reader.result;
        this.currentImageData = {
          id: uuidv4(),
          uploaderId:this.store.user.id,
          image: this.imageForBack
        };
        console.log(this.currentImageData)
        this.pushList()
      });
      if (this.image) {
        reader.readAsDataURL(this.image);
      }
    },
    getEventCurrentImages(data){
      if(data.images){
        this.imageListGlobal = []
        this.serverImageList = []
        for(const [key,value] of Object.entries(data.images)){
          const imageData = {
            id:`${value.id}`,
            image:`${value.image}`,
            uploaderId:`${value.uploaderId}`,
            date:`${value.date}`
          }
          this.imageListGlobal.push(imageData)
          this.serverImageList.push(imageData)
        }
        this.filterForMyImages()
      }else{
        this.imageListGlobal = []
      }
    },
    getCurrentOldEventDetails(data){
      if(!this.store.showFromProfileSavedEventsActive){
        const db = getDatabase();
        const dbRef = ref(db, `activityGroups/${this.selectedGroupLocal.id}/oldGroupActivities/${data.id}`);
        onValue(dbRef, (snapshot) => {
          this.selectedOldEventLocal = snapshot.val();
          console.log('selectedOldEventLocal',this.selectedOldEventLocal)
          const data = this.selectedOldEventLocal
          this.getEventCurrentImages(data)
          this.getMembersOfOldEvent(data)
          this.getVideos(data)
        });
      }else{
        this.getVideos(data)
        this.selectedOldEventLocal = data
        this.getEventCurrentImages(data)
        this.getMembersOfOldEvent(data)
      }
    },
    goBack(){
      this.store.oldEventDetailActive = false
    }
  },
  created(){
    this.store.getActivityGroups()
  },
  mounted(){
    this.mySelectedList = []
    console.log('mySelectedList',this.mySelectedList)
  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          //this.store.getMySavedOldEvents()
        }
      },
      immediate:true,
      deep:true
    },
    selectedOldEvent:{
      handler(newValue,oldValue){
        if(newValue.id){
          const data = newValue
          this.getCurrentOldEventDetails(data)
/*           let data = newValue
          const result = this.store.activityGroupsList.some(object => object.id === data.id)
          if(result){
            this.getCurrentOldEventDetails(data)
          }else{
            this.selectedOldEventLocal = newValue
            this.getEventCurrentImages(data)
          } */
        }
      },
      immediate:true,
      deep:true
    },
    selectedGroupLocal:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroup = newValue
          console.log('selectedGroup',this.selectedGroup)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style scoped>
  ::-webkit-scrollbar {
    display: none;
  }

  body {
    scrollbar-width: none;
  }
  .dialog-content {
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .forMobile{
    width:100%;
  }
  .forDesktop{
    width:700px;
    max-width:80vw;
  }
</style>
