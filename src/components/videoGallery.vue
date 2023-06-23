<template>
  <q-dialog
  persistent
  :fullHeight="this.store.avatarActive ? true : false"
  :maximized="this.store.avatarActive ? false : true"
  v-if="this.store.oldEventVideoGalleryActive" v-model="this.store.oldEventVideoGalleryActive"
  >
    <q-card dark :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn
          v-on:click="this.filterActive ? this.clearFilter() : this.openFilter()"
          :icon="this.filterActive ? 'clear_all' : 'filter_list'" flat color="white" v-if="!this.deleteList.length"></q-btn>
          <q-fab color="dark" glossy icon="keyboard_arrow_down" direction="down" v-if="this.deleteList.length">
            <q-fab-action color="dark" text-color="red" @click="deleteAll" icon="delete_forever" />
            <q-fab-action color="amber" text-color="black" @click="onClick" icon="alarm" />
          </q-fab>
        <q-btn
          icon="check_box"
          :flat="this.multipleSelectActive ? false : true"
          :color="this.multipleSelectActive ? 'green' : 'white'"
          v-on:click="multipleSelectActiveButton"
          ></q-btn>
        <q-btn icon="download" color="green" v-if="this.selectedVideosForDownload.length" v-on:click="downloadButton"></q-btn>
      </q-card-section>
      <q-card-section class="row">
        <q-card
          v-touch-hold:600.mouse="event => addDeleteList(data)"
          v-on:click="!this.multipleSelectActive ? this.selectMoreVideo(data) : this.selectForDownload(data)"
          :dark="this.checkDeleteList(data) ? true : false"
          class="col-6 col-md-6 col-sm-6" style="height:150px;border-radius:7px;"
          v-for="data in this.videos" :key="data.id" v-if="this.videos.length">
            <video  style="width:100%;height:100%;" controls>
              <source :src="data.videoForBack" type="video/mp4">
              <source :src="data.videoForBack" type="video/ogg">
              Your browser does not support the video tag.
            </video>
          </q-card>
      </q-card-section>
    </q-card>
    <q-dialog
      dark
      v-model="this.store.videoGalleryFilterActive" v-if="this.store.videoGalleryFilterActive"
      persistent
      :maximized="this.store.avatarActive ? false : true"
      >
        <q-card :style="{'width':this.store.avatarActive ? '300px' : '100%'}" class="bg-dark text-white">
          <q-card-section class="text-left">
            <q-btn icon="remove" flat color="white" v-on:click="this.store.videoGalleryFilterActive = false"></q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn-dropdown
                split
                color="dark"
                no-caps
                icon="person"
                label="Members"
                class="full-width"
                @click="onMainClick"
              >
                <q-list class="bg-dark text-white">
                  <q-item clickable v-close-popup @click="selectUser(data)" v-for="data in this.members" :key="data.id">
                    <q-item-section avatar>
                      <q-btn icon="person" color="dark" round></q-btn>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{this.store.findUserName(data)}} </q-item-label>
                      <q-item-label class="text-white">{{this.store.findUserInfo(data)}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        v-if="this.downloadDialogActive" v-model="this.downloadDialogActive"
        persistent
        :fullHeight="this.store.avatarActive ? true : false"
        :maximized="this.store.avatarActive ? false : true"
        dark
      >
        <q-card :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'" class="bg-dark">
          <q-card-section class="row">
            <q-btn icon="keyboard_backspace" flat color="white" v-on:click="closeDownloadPage"></q-btn>
            <q-space></q-space>
            <q-btn icon="delete_forever" flat color="red" v-on:click="removeAllList"></q-btn>
          </q-card-section>
          <q-card-section class="row">
            <q-card
              v-on:click="removeFromList(data)"
              class="col-6 col-md-6 col-sm-6" style="height:150px;border-radius:7px;"
              v-for="data in this.selectedVideosForDownload" :key="data.id" v-if="this.selectedVideosForDownload.length">
                <video  style="width:100%;height:100%;" controls>
                  <source :src="data.videoForBack" type="video/mp4">
                  <source :src="data.videoForBack" type="video/ogg">
                  Your browser does not support the video tag.
                </video>
              </q-card>
            </q-card-section>
            <q-card-section class="text-right">
              <q-btn icon="check" color="green" v-on:Click="downloadAllVideos"></q-btn>
            </q-card-section>
        </q-card>
      </q-dialog>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  props:['eventVideoList','memberList','selectedOldEvent','selectedGroup'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      videos:[],
      members:[],
      filterActive:false,
      deleteList:[],
      selectedEvent:{},
      selectedGroupLocal:{},
      multipleSelectActive:false,
      selectedVideosForDownload:[],
      downloadDialogActive:false
    }
  },
  methods:{
    downloadAllVideos() {
      let status = false;
      this.$q.dialog({
        dark: true,
        title: 'Warning',
        cancel: true,
        message: 'Seçili Videoları İndirmek İstiyor musunuz ?',
      }).onOk(() => {
        status = !status;
        if (status) {
          for (const element of this.selectedVideosForDownload) {
            fetch(element.videoForBack)
              .then(res => res.blob())
              .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${element.name ? element.name : element.id}.mp4`;
                document.body.appendChild(link);
                link.click();
              });
              this.selectedVideosForDownload = this.selectedVideosForDownload.filter(object => object.id !== element.id)
          }
          if(!this.selectedVideosForDownload.length){
            this.removeAllList()
          }
          this.$q.notify({
            type:'positive',
            icon:'check',
            position:'bottom',
            timeout:700
          })
        }
      });
    },
    removeFromList(data){
      const result = this.selectedVideosForDownload.some(object => object.id === data.id)
      if(result){
        this.selectedVideosForDownload = this.selectedVideosForDownload.filter(object => object.id !== data.id)
        if(!this.selectedVideosForDownload.length){
          this.downloadDialogActive = false
          this.multipleSelectActive = false
        }
      }
    },
    removeAllList(){
      this.selectedVideosForDownload = []
      this.downloadDialogActive = false
      this.multipleSelectActive = false
    },
    closeDownloadPage(){
      this.downloadDialogActive = false
    },
    downloadButton(){
      this.downloadDialogActive = true
    },
    selectForDownload(data){
      console.log(data)
      const result = this.selectedVideosForDownload.some(object => object.id === data.id)
      if(result){
        this.selectedVideosForDownload = this.selectedVideosForDownload.filter(object => object.id !== data.id)
      }else{
        this.selectedVideosForDownload.push(data)
      }
    },
    multipleSelectActiveButton(){
      this.multipleSelectActive =! this.multipleSelectActive
      if(this.multipleSelectActive === false){
        this.selectedVideosForDownload = []
      }
    },
    deleteAll(){
      if(this.deleteList.length){
        this.deleteList.forEach(element => {
          const db = getDatabase()
          remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/oldGroupActivities/${this.selectedEvent.id}/videos/${element.id}`))
          this.deleteList = this.deleteList.filter(object => object.id !== element.id)
          this.videos = this.videos.filter(object => object.id !== element.id)
        });
      }
    },
    selectMoreVideo(data){
      if(this.deleteList.length&&data.uploaderId === this.store.user.id){
        const result = this.deleteList.some(object => object.id === data.id)
        if(result){
          this.deleteList = this.deleteList.filter(object => object.id !== data.id)
        }else{
          this.deleteList.push(data)
          console.log(this.deleteList)
        }
      }
    },
    checkDeleteList(data){
      const result = this.deleteList.some(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addDeleteList(data){
      if(data.uploaderId === this.store.user.id){
        const result = this.deleteList.some(object => object.id === data.id)
        if(result){
          this.deleteList = this.deleteList.filter(object => object.id !== data.id)
        }else{
          this.deleteList.push(data)
          console.log(this.deleteList)
        }
      }
    },
    selectUser(data){
      const result = this.videos.filter(object => object.uploaderId === data.id)
      if(result.length){
        this.videos = result
        this.store.videoGalleryFilterActive = false
        this.filterActive = true
      }else{
        this.videos = this.eventVideoList
        this.$q.notify({
          type:'negative',
          message:`${this.store.findUserName(data)} Adlı Kullanıcının Videosu Yok !`,
          timeout:700,
          position:'top'
        })
      }
    },
    clearFilter(){
      this.videos = this.eventVideoList
      this.filterActive = false
    },
    openFilter(){
      this.store.videoGalleryFilterActive = true
    },
    goBack(){
      this.store.oldEventVideoGalleryActive = false
    }
  },
  created(){

  },
  watch:{
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedGroupLocal = newValue
          console.log('selected group',this.selectedGroupLocal)
        }
      },
      immediate:true,
      deep:true
    },
    selectedOldEvent:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedEvent = newValue
          console.log('selected event',this.selectedEvent)
        }
      },
      immediate:true,
      deep:true
    },
    memberList:{
      handler(newValue,oldValue){
        if(newValue.length){
          this.members = newValue
        }
      },
      immediate:true,
      deep:true
    },
    eventVideoList:{
      handler(newValue,oldValue){
        if(newValue.length){
          this.videos = newValue
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
