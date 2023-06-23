<template>
  <q-dialog
  persistent
  :fullHeight="this.store.avatarActive ? true : false"
  :maximized="this.store.avatarActive ? false : true"
  v-if="this.store.oldEventGalleryActive" v-model="this.store.oldEventGalleryActive">

    <q-card dark :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:Click="goBack"></q-btn>
        <q-space></q-space>
       <!--  <q-btn icon="more_vert" flat v-on:click="showOptions"></q-btn> -->
        <q-btn icon="filter_list" flat color="white" v-on:Click="filterGalleryButton" v-if="!this.filterActive"></q-btn>
        <q-btn icon="filter_list_off" flat color="white" v-on:click="clearFilter" v-if="this.filterActive"></q-btn>
      </q-card-section>
      <q-card-section class="">
        <div class="text-caption text-grey-6 text-weight-bold">
          <q-icon name="info" size="17px"></q-icon>
          Fonksiyonel Operasyonlar İçin Fotoğraf Üstüne 2 kere Tıklamanız Yeterli.
        </div>
      </q-card-section>
      <q-card-section v-if="this.filterActive">
        <q-card class="" dark flat>
          <q-card-section horizontal class="text-left">
            <q-btn
            dark
            no-caps=""
            :label="this.selectedUserFromDropDownButton.name ? this.selectedUserFromDropDownButton.name : this.selectedUserFromDropDownButton.email"
            icon="person"></q-btn>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="row">
        <q-card class="col-6 col-md-4 col-sm-4" dark v-for="data in this.images" :key="data.id" style="heigth:150px;" v-if="!this.filterActive">
          <q-img
            v-on:dblclick="selectImageForDownload(data)"
            v-on:Click="oneClickForSelect(data)"
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:cover;"
            :ratio="1"
            >
            <div class="absolute-top-right" style="border-radius:4px;">
              <q-btn icon="check" color="white" flat v-if=" checkDownloadList(data)" size="sm"></q-btn>
              <q-fab color="white"  icon="keyboard_arrow_left" direction="left" padding="xs" flat v-if="!checkDownloadList(data)">
                <q-fab-action icon="fullscreen" color="primary" size="xs" round v-on:click="selectImage(data)" />
                <q-fab-action icon="person" round size="xs" color="dark" v-on:click="showuploader(data)" />
                <q-fab-action icon="delete_forever" round size="xs" color="red" v-if="this.checkSelecAdminOrNot()" v-on:click="deleteImage(data)"></q-fab-action>
              </q-fab>
            </div>
<!--               <div class="absolute-bottom text-center"  style="display:block;">
                {{  findUser(data) }}
                <span>{{ data.date ? data.date : 'Tarih Bulunamadı !' }}</span>
              </div> -->
            </q-img>
        </q-card>
        <q-card class="col-6 col-md-4 col-sm-4" dark v-for="data in this.filteredList" :key="data.id" style="heigth:150px;" v-if="this.filterActive">
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:cover;height:150px;">
            <div class="absolute-top-right bg-transparent">
              <q-fab color="dark"  icon="keyboard_arrow_left" direction="left" padding="xs">
                <q-fab-action icon="fullscreen" color="primary" size="xs" round v-on:click="selectImage(data)" />
                <q-fab-action icon="person" round size="xs" color="dark" v-on:click="showuploader(data)" />
                <q-fab-action icon="delete_forever" round size="xs" color="red" v-if="this.checkSelecAdminOrNot()" v-on:click="deleteImage(data)"></q-fab-action>
              </q-fab>
<!--               <q-btn icon="fullscreen" color="primary" size="xs" round v-on:click="selectImage(data)"></q-btn>
              <q-space></q-space>
              <q-btn icon="person" round size="xs" color="dark" v-on:click="showuploader(data)"></q-btn> -->
            </div>
<!--               <div class="absolute-bottom text-center"  style="display:block;">
                {{  findUser(data) }}
                <span>{{ data.date ? data.date : 'Tarih Bulunamadı !' }}</span>
              </div> -->
            </q-img>
        </q-card>
      </q-card-section>
      <q-card-section class="text-right" v-if="this.selectedImagesForDownload.length">
        <q-btn
          :color="!this.checkSelectedAll() ? 'dark' : 'red'"
          :icon="this.checkSelectedAll() === false ? 'list' : 'clear_all'"
          :label="this.checkSelectedAll() === false ? 'Hepsini Seç' : 'Seçilenleri Temizle'"
          v-on:Click="this.checkSelectedAll() === false ? this.selectAllImages() : this.clearAll()"></q-btn>
          <q-btn
            class="q-ma-sm"
            :label="this.selectedImagesForDownload.length"
            icon="clear_all" color="red"
            v-if="this.selectedImagesForDownload.length&&!this.checkSelectedAll()" v-on:click="this.clearAll()"></q-btn>
        <q-btn
          icon="download" :label="`${this.selectedImagesForDownload.length} - Seçilen`"
          color="green" v-on:Click="downloadAll"></q-btn>
      </q-card-section>
    </q-card>
    <q-dialog v-if="this.zoomActive" v-model="this.zoomActive" persistent>
      <q-card dark :class="this.store.avatarActive ? 'forDesktop' : 'forMobile'" bordered>
        <q-img
          loading="lazy"
          spinner-color="white"
          v-if="this.selectedImage.image" :src="this.selectedImage.image" style="object-fit:cover;height:100%;width:100%;">
          <div class="absolute-bottom text-right">
            {{ this.selectedImage.date ? this.selectedImage.date : 'Tarih Bulunamadı !' }}
          </div>
          <div class="absolute-top-right bg-transparent row">
            <q-btn icon="download" color="primary" size="sm" round v-on:click="downloadImage"></q-btn>
            <q-btn icon="remove" color="dark" size="sm" round v-on:click="closeImage()"></q-btn>
          </div>
        </q-img>
      </q-card>
    </q-dialog>
    <selectedUserDetailDialog v-if="this.store.showUserDetail"/>
    <galleryDropDownComp
      @selectedUser="getselectedUser"
      @imagesList="getimagesList"
      :images="this.images.length ? this.images : ''"
      v-if="this.store.galleryFilterActive" :selectedGroupLocal="this.selectedGroupLocal"/>
  </q-dialog>
</template>

<script>
import galleryDropDownComp from "./galleryDropDownComp.vue";
import selectedUserDetailDialog from "./selectedUserDetailDialog.vue";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    selectedUserDetailDialog,
    galleryDropDownComp
  },
  props:['imageListGlobal','selectedGroup','selectedOldEventLocal'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      images:[],
      zoomActive:false,
      selectedImage:{},
      selectedGroupLocal:{},
      filteredList:[],
      selectedUserFromDropDownButton:{},
      filterActive:false,
      selectedEvent:{},
      selectedImagesForDownload:[]
    }
  },
  methods:{
    downloadAll(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`Fotoğraf Devam Ederseniz Bilgisayarınıza İndirilecek, İşlemi Onaylıyor musunuz ?`,
      }).onOk(() => {
        this.selectedImagesForDownload.forEach(element => {
          const result = this.store.usersList.find(object => object.id === element.uploaderId)
          if(result){
            const name = result.name ? result.name : result.email
            const link = document.createElement('a');
            link.href = element.image;
            link.download = `${name}.jpg`; // specify the filename here
            document.body.appendChild(link);
            link.click();
          }
          this.selectedImagesForDownload = this.selectedImagesForDownload.filter(object => object.id !== element.id)
        });
      }).onCancel(() => {
        //
      })

    },
    clearAll(){
      this.selectedImagesForDownload = []
    },
    checkSelectedAll(){
      const maxLength = this.images.length
      const selectedListLength = this.selectedImagesForDownload.length
      if(maxLength == selectedListLength){
        return true
      }else{
        return false
      }
    },
    selectAllImages(){
      this.images.forEach(element => {
        const result = this.selectedImagesForDownload.some(object => object.id === element.id)
        if(!result){
          this.selectedImagesForDownload.push(element)
        }
      });
    },
    oneClickForSelect(data){
      if(this.selectedImagesForDownload.length){
        this.selectImageForDownload(data)
      }
    },
    checkDownloadList(data){
      const result = this.selectedImagesForDownload.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    selectImageForDownload(data){
      const result = this.selectedImagesForDownload.find(object => object.id === data.id)
      if(result){
        this.selectedImagesForDownload = this.selectedImagesForDownload.filter(object => object.id !== data.id)
      }else{
        this.selectedImagesForDownload.push(data)
      }
    },
    showOptions(){

    },
    downloadImage(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`Fotoğraf Devam Ederseniz Bilgisayarınıza İndirilecek, İşlemi Onaylıyor musunuz ?`,
      }).onOk(() => {
        const result = this.store.usersList.find(object => object.id === this.selectedImage.uploaderId)
        if(result){
          const name = result.name ? result.name : result.email
          const link = document.createElement('a');
          link.href = this.selectedImage.image;
          link.download = `${name}.jpg`; // specify the filename here
          document.body.appendChild(link);
          link.click();
        }
      }).onCancel(() => {
        //
      })
    },
    deleteImage(data){
      const db = getDatabase()
      remove(ref(db,`activityGroups/${this.selectedGroupLocal.id}/oldGroupActivities/${this.selectedEvent.id}/images/${data.id}`))
      this.images = this.images.filter(object => object.id !== data.id)
      const result = this.filteredList.find(object => object.id === data.id)
      if(result){
        this.filteredList = this.filteredList.filter(object => object.id !== data.id)
      }
    },
    checkSelecAdminOrNot(){
      if(this.selectedGroupLocal.adminId === this.store.user.id){
        return true
      }else{
        return false
      }
    },
    getselectedUser(data){
      if(data){
        this.selectedUserFromDropDownButton = data
      }
    },
    clearFilter(){
      this.selectedUserFromDropDownButton = {}
      this.filteredList = []
      this.filterActive = false
    },
    emitFromFilterDrop(data){
      this.filterActive = true
      console.log('filteredİmages',data)
      this.filteredList = data
    },
    getimagesList(data){
      if(data){
        this.emitFromFilterDrop(data)
      }
    },
    filterGalleryButton(){
      this.store.galleryFilterActive = true
    },
    showuploader(data){
      console.log(data.uploaderId)
      const result = this.store.usersList.find(object => object.id === data.uploaderId)
      if(result){
        this.store.showUserDetail = result
        this.store.showUserDetailActive = true
      }
    },
    closeImage(){
      this.selectedImage = {}
      this.zoomActive = false
    },
    selectImage(data){
      this.selectedImage = data
      this.zoomActive = true
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
    goBack(){
      this.store.oldEventGalleryActive = false
    }
  },
  created(){
    this.store.getUsers()
  },
  watch:{
    selectedOldEventLocal:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedEvent = newValue
        }
      },
      immediate:true,
      deep:true
    },
    selectedGroup:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroupLocal = newValue
        }
      },
      immediate:true,
      deep:true
    },
    imageListGlobal:{
      handler(newValue,oldValue){
        if(newValue){
          this.images = newValue
          console.log('images',this.images)
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
