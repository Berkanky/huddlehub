<template>
  <q-dialog
    persistent
    v-if="this.store.galleryFilterActive" v-model="this.store.galleryFilterActive"
    :full-height="this.store.avatarActive ? true : false"
    :maximized="this.store.avatarActive ? false : true"
  >
    <q-card :style="{'width':this.store.avatarActive ? '700px' : '100%'}" dark>
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn-dropdown
          dark
          no-caps
          icon="collections_bookmark"
          label="Gallery Members"
          @click="showGalleryUsers"
          class="full-width"
        >
          <q-list class="bg-dark text-white">
            <q-item clickable v-close-popup @click="selectUser(data)" v-for="data in this.members" :key="data.id">
              <q-item-section avatar>
                <q-avatar >
                  <img :src="findUserImage(data)" alt="" v-if="checkImage(data)" style="object-fit:cover;">
                  <q-btn icon="person" round color="dark" v-if="!checkImage(data)"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{data.name ? data.name : data.email}}</q-item-label>
                <q-item-label caption class="text-white">{{findUserInfo(data)}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="pink" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  props:['selectedGroupLocal','images'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedGroup:{},
      members:[],
      imagesList:[],

    }
  },
  methods:{
    selectUser(data){
      const result = this.images.find(object => object.uploaderId === data.id)
      if(result){
        const list = this.imagesList.filter(object => object.uploaderId === data.id)
        console.log('list',list)
        this.$emit('imagesList',list)
        const user = this.store.usersList.find(object => object.id === data.id)
        if(user){
          this.$emit('selectedUser',user)
        }else if (!user){
          this.$emit('selectedUser',data)
        }
        this.store.galleryFilterActive = false
      }else{
        this.$q.notify({
          type:'negative',
          position:'top',
          message:`${data.name ? data.name : data.email} Adlı Kullanıcı Bir Fotoğraf Yüklememiş.`,
          timeout:700
        })
      }
    },
    findUserInfo(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        const info = result.info ? result.info : 'Üye Detayı Alınamadı !'
        return info
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
        const image = result.image ? result.image : ''
        return image
      }
    },
    getMembers(){
      if(this.selectedGroup.members){
        this.members = []
        for(const [key,value] of Object.entries(this.selectedGroup.members)){
          const memberData = {
            id:`${value.id}`,
            date:`${value.date}`,
            email:`${value.email}`,
            name:`${value.name ? value.name : ''}`
          }
          this.members.push(memberData)
        }
        console.log('members',this.members)
      }
    },
    showGalleryUsers(){

    },
    goBack(){
      this.store.galleryFilterActive = false
    }
  },
  beforeMount(){

  },
  created(){
  },
  watch:{
    images:{
      handler(newValue,oldValue){
        if(newValue){
          this.imagesList = newValue
          console.log('imagesList',this.imagesList)
        }
      },
      immediate:true,
      deep:true
    },
    selectedGroupLocal:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.selectedGroup = newValue
          this.getMembers()
          console.log('selectedGroup',this.selectedGroup)
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
