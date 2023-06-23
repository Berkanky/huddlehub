<template>
  <q-card
    :style="{'width':this.store.widthOptions()}" style="margin:0 auto;"
    class="bg-dark text-white">
    <q-card-section class="text-right">
      <q-btn icon="edit" :color="!this.showListActive ? 'white' : 'dark'" :text-color="!this.showListActive ? 'dark' : 'white'"></q-btn>
      <q-btn icon="list" v-on:click="showMyDiscuss" :color="this.showListActive ? 'white' : 'dark'" :text-color="this.showListActive ? 'dark' : 'white'"></q-btn>
    </q-card-section>
    <q-card-section class="text-center">
      <q-avatar size="180px">
        <img :src="this.currentData.image" alt="" v-if="this.currentData.image" style="object-fit:Cover;">
        <q-btn icon="person" round color="dark" v-if="!this.currentData.image" size="60px" v-on:Click="showOptionsForImage"></q-btn>
      </q-avatar>
    </q-card-section>
    <div class="text-right" style="width:30%;margin:0 auto;">
      <q-fab color="dark" text-color="white" push icon="more_vert" direction="right" flat>
        <upload @currentImageData="getcurrentImageData"/>
        <q-btn icon="remove" color="red" round v-on:click="clearImage"></q-btn>
      </q-fab>
    </div>
    <q-card-section class="row">
      <q-card-section class="col-md-4 col-sm-4 col-12">
        <q-input
          dark
          readonly
          :label="this.currentData.name ? this.currentData.name : 'Tartışma Adını Giriniz !'" color="white">
            <template v-slot:prepend>
              <q-icon name="diversity_2"></q-icon>
            </template>
            <template v-slot:append v-if="!this.updateActive&&this.currentData.name">
              <q-btn icon="remove" size="sm" color="dark" v-on:click="this.currentData.name = ''"></q-btn>
            </template>
            <q-popup-edit v-model="this.currentData.name"  v-slot="scope" dark>
              <q-input
                dark
                color="white"
                autofocus
                dense
                v-model="this.currentData.name"
                :model-value="this.currentData.name"
              >
                <template v-slot:after>
                  <q-btn
                    flat dense color="positive" icon="check_circle"
                    @click="setName"
                  />
                </template>
              </q-input>
            </q-popup-edit>
          </q-input>
      </q-card-section>
      <q-card-section class="col-md-4 col-sm-4 col-12">
        <q-input
          v-model.number="this.currentData.maxMessageValue"
          type="number"
          color="white"
          label-color="White"
          :label="this.currentData.maxMessageValue ? this.currentData.maxMessageValue : 'Mesaj Sınırlaması İçin Bir Sayı Giriniz !'"
          dark
          style="max-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-info" size="xs"></q-icon>
          </template>
          <q-popup-edit v-model="this.currentData.maxMessageValue"  v-slot="scope" dark>
              <q-input
                dark
                color="white"
                autofocus
                dense
                v-model="this.currentData.maxMessageValue"
                :model-value="this.currentData.maxMessageValue"
              >
                <template v-slot:after>
                  <q-btn
                    flat dense color="positive" icon="check_circle"
                    @click="updateMaxMessageValue"
                  />
                </template>
              </q-input>
            </q-popup-edit>
        </q-input>
      </q-card-section>
      <q-card-section class="col-md-4 col-sm-4 col-12">
        <q-input
          dark
          readonly
          :label="this.currentData.category ? this.currentData.category : 'Tartışma Kategorisi Giriniz'" color="white">
            <template v-slot:prepend>
              <q-icon name="category"></q-icon>
            </template>
            <template v-slot:append v-if="!this.updateActive&&this.currentData.category">
              <q-btn icon="remove" size="sm" color="dark" v-on:click="this.currentData.category = ''"></q-btn>
            </template>
            <q-popup-edit v-model="this.currentData.category"  v-slot="scope" dark>
              <q-input
                dark
                color="white"
                autofocus
                dense
                v-model="this.currentData.category"
                :model-value="this.currentData.category"
              >
                <template v-slot:after>
                  <q-btn
                    flat dense color="positive" icon="check_circle"
                    @click="setCategory"
                  />
                </template>
              </q-input>
            </q-popup-edit>
          </q-input>
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-input
        :label="this.currentData.explain ? this.currentData.explain : 'Açıklama Giriniz !'"
        color="white"
        v-model="this.currentData.explain"
        filled
        dark
        type="textarea"
      >
        <template v-slot:prepend v-if="this.currentData.explain&&!this.updateActive">
          <q-btn icon="remove" color="dark" size="sm" v-on:click="this.currentData.explain = ''"></q-btn>
        </template>
        <template v-slot:append v-if="this.updateActive">
          <q-btn icon="edit" flat color="green" v-on:click="setExplain"></q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="text-right">
      <q-btn icon="clear_all" color="red" :disable="this.checkForInputs() ? false : true" v-on:Click="clearAll" v-if="!this.updateActive"></q-btn>
      <q-btn icon="check" color="green" :disable="this.checkForInputs() ? false : true" v-on:click="setDiscussion" v-if="!this.updateActive"></q-btn>
      <q-btn icon="check" color="green" :disable="this.checkForInputs() ? false : true" v-on:click="updateDiscussion" v-if="this.updateActive"></q-btn>
    </q-card-section>
    <q-dialog
      persistent
      :maximized="this.store.avatarActive ? false : true"
      :full-height="this.store.avatarActive ? true : false"
      v-if="this.showListActive" v-model="this.showListActive">
        <q-card
          :style="{'width':this.store.avatarActive ? '700px' : '100%'}"
          dark class="text-white">
          <q-card-section class="text-left">
            <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          </q-card-section>
          <q-card-section  class="q-pa-sm" v-if="this.showListActive">
            <q-card  dark v-for="data in this.myDiscussions" :key="data.id" style="height:150px;">
              <q-card-section horizontal>
                <q-img class="col" v-if="data.image" :src="data.image" style="border-radius:4px;height:150px;">
                  <div class="absolute-bottom text-capitalize">
                    {{ data.name }} {{ data.updatedDate ? ` - ${data.updatedDate } Tarihinde Güncellendi`: '' }}
                  </div>
                </q-img>
                <q-card-actions vertical class="justify-around">
                  <q-btn flat round color="white" icon="fa-solid fa-info" size="sm"/>
                  <q-btn flat round color="red" icon="delete_forever" v-on:Click="deleteDiscuss(data)"></q-btn>
                  <q-btn flat round color="green" icon="edit" v-on:Click="goUpdate(data)"/>
              </q-card-actions>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </q-dialog>
  </q-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import upload from "./upload.vue";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    upload
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      currentData:{},
      updateActive:false,
      showListActive:false,
      myDiscussions:[]
    }
  },
  methods:{
    updateMaxMessageValue(){
      if(this.updateActive){
        const db = getDatabase()
        update(ref(db,`discussions/${this.currentData.id}`),{
          maxMessageValue:this.currentData.maxMessageValue ? this.currentData.maxMessageValue : 0
        })
      }
    },
    deleteDiscuss(data){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`${data.name} Adlı Tartışmayı Silmek İstediğinize Emin misiniz ?`
      }).onOk(() => {
        const db = getDatabase()
        remove(ref(db,`discussions/${data.id}`))
        this.store.allDiscussionsList = this.store.allDiscussionsList.filter(object => object.id !== data.id)
        this.$q.notify({
          type:'negative',
          icon:'delete_forever',
          timeout:'700',
          position:'top'
        })
      }).onCancel(() => {
        //
      })
    },
    setExplain(){
      if(this.updateActive){
        const db = getDatabase()
        update(ref(db,`discussions/${this.currentData.id}`),{
          explain:this.currentData.explain ? this.currentData.explain : ''
        })
      }
    },
    updateDiscussion(){
      const db = getDatabase()
      update(ref(db,`discussions/${this.currentData.id}`),{
        date:this.currentData.date,
        createdDate:this.currentData.createdDate,
        name:this.currentData.name ? this.currentData.name : '',
        category:this.currentData.category ? this.currentData.category : '',
        explain:this.currentData.explain ? this.currentData.explain : '',
        image:this.currentData.image ? this.currentData.image  : '',
        id:this.currentData.id,
        createrId:this.store.user.id,
        status:false,
        updatedDate:this.store.currentDateString()
      })
      this.$q.notify({
        type:'positive',
        message:'Updated',
        timeout:700,
        position:'top'
      })
      this.clearAll()
    },
    goUpdate(data){
      this.currentData = data
      this.updateActive = true
      this.showListActive = false
    },
    goBack(){
      this.showListActive = false
    },
    showMyDiscuss(){
      this.showListActive = true
    },
    getMyDiscussions(){
      this.myDiscussions = this.store.allDiscussionsList.filter(object => object.createrId === this.store.user.id)
      console.log('myDiscussions',this.myDiscussions)
    },
    setDiscussion(){
      if(this.checkForInputs()){
        const db = getDatabase()
        const randomId = uuidv4()
        set(ref(db,`discussions/${randomId}`),{
          date:Date.now(),
          createdDate:this.store.currentDateString(),
          name:this.currentData.name,
          category:this.currentData.category,
          explain:this.currentData.explain,
          image:this.currentData.image,
          id:randomId,
          createrId:this.store.user.id,
          status:false
        })
        this.$q.notify({
          type:'positive',
          position:'top',
          message:'Tartışma Başlatıldı',
          timeout:700
        })
        this.clearAll()
      }
    },
    clearAll(){
      if(!this.updateActive){
        this.currentData = {}
      }else{
        this.updateActive = false
        this.currentData = {}
      }
    },
    checkForInputs(){
      if(this.currentData.image&&this.currentData.name&&this.currentData.explain&&this.currentData.category){
        return true
      }else{
        return false
      }
    },
    setCategory(){
      console.log(this.currentData)
      if(this.updateActive){
        const db = getDatabase()
        update(ref(db,`discussions/${this.currentData.id}`),{
          category:this.currentData.category ? this.currentData.category : ''
        })
      }
    },
    setName(){
      console.log(this.currentData)
      if(this.updateActive){
        const db = getDatabase()
        update(ref(db,`discussions/${this.currentData.id}`),{
          name:this.currentData.name ? this.currentData.name : ''
        })
      }
    },
    clearImage(){
      if(this.updateActive){
        const db = getDatabase()
        update(ref(db,`discussions/${this.currentData.id}`),{
          image:this.currentData.image ? ' ' : ' '
        })
        this.currentData.image = ''
      }else{
        this.currentData.image = ''
      }
    },
    getcurrentImageData(data){
      if(data){
        this.currentData.image = data.image
      }
    }
  },
  created(){
    this.store.getAllDiscussions()
  },
  watch:{
    'store.allDiscussionsList':{
      handler(newValue,oldValue){
        if(newValue){
          this.getMyDiscussions()
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
</style>
