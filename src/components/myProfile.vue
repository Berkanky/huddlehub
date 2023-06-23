<template>
  <q-card
    flat
    class="my-card bg-transparent"
    :style="{ width: this.store.avatarActive ? '70%' : '100%' }"
    style="margin: 0 auto;background: linear-gradient(to bottom, #ece9e6, #ffffff)"
  >
    <q-card-section
      class="text-center row"
      style=""
    >
      <q-card-section class="col-xs-12 col-sm-12 col-md-6">
        <div class="text-right">
            <q-fab color="gray-7" icon="more_vert" flat direction="down">
              <upload @currentImageData="getcurrentImageData" v-if="!checkİmage()" />
              <q-btn
                icon="remove"
                round
                color="red"
                v-if="checkİmage()"
                v-on:click="clearImage"
              ></q-btn>
              <q-btn
                icon="check"
                round
                color="primary"
                v-if="checkİmage()"
                v-on:click="updateImage"
              ></q-btn>
              <q-btn icon="add" round color="dark" v-on:click="addMorePhoto"></q-btn>
            </q-fab>
          </div>
        <q-avatar size="200px">
            <img
              style="object-fit: cover"
              :src="
                this.selectedImage.image
                  ? this.selectedImage.image
                  : this.store.userAllInfo.image
              "
              alt=""
              v-if="this.selectedImage.image || this.store.userAllInfo.image"
            />
            <q-btn
              icon="person"
              color="grey-9"
              round
              size="55px"
              v-if="!this.selectedImage.image && !this.store.userAllInfo.image"
            ></q-btn>
          </q-avatar>
          <div class="">
            <q-btn
                icon="remove"
                icon-right="remove"
                flat
                label="Profil Fotoğrafını Kaldır"
                no-caps=""
                color="red"
                v-if="!checkİmage() && this.store.userAllInfo.image"
                v-on:click="deleteProfileImage"
              ></q-btn>
          </div>
        <q-separator size="2px" color="grey-5" style="margin-top:5px;"></q-separator>
        <q-card-section>
          <div
            class="text-subtitle2 text-weight-bold q-pa-sm text-grey-8"
            style="font-size: 15px"
          >
            <q-btn
              icon="badge"
              no-caps
              :label="
                this.store.userAllInfo.name ? this.store.userAllInfo.name : 'İsim Giriniz'
              "
              size="md"
              flat
              color="gray-7"
            >
              <q-popup-edit v-model="this.newData.name" auto-save v-slot="scope">
                <q-input
                  v-model="this.newData.name"
                  dense
                  autofocus
                  counter
                  @keyup.enter="setName"
                  label="Adınızı Giriniz !"
                />
              </q-popup-edit>
            </q-btn>
            -
            <q-btn
              icon-right="celebration"
              :label="
                this.store.userAllInfo.age ? this.store.userAllInfo.age : 'Yaş Girilmemiş'
              "
              size="md"
              no-caps
              flat
              color="gray-7"
            >
              <q-popup-edit v-model="this.newData.age" auto-save v-slot="scope">
                <q-input
                  v-model="this.newData.age"
                  dense
                  autofocus
                  counter
                  @keyup.enter="setAge"
                  label="Yaşınızı Giriniz !"
                />
              </q-popup-edit>
            </q-btn>
          </div>
          <div
            class="text-overline text-weight-bold q-pa-xs text-grey-8"
            style=""
          >
            <q-btn
              icon="location_on"
              no-caps
              :label="
                this.store.userAllInfo.city ? this.store.userAllInfo.city : 'Şehir Giriniz'
              "
              size="12px"
              flat
              color="gray-7"
            >
              <q-popup-edit v-model="this.newData.city" auto-save v-slot="scope">
                <q-input
                  v-model="this.newData.city"
                  dense
                  autofocus
                  counter
                  @keyup.enter="setCity"
                  label="Şehrinizi Giriniz !"
                />
              </q-popup-edit>
            </q-btn>
            -
            <q-btn
              icon-right="flag"
              :label="
                this.store.userAllInfo.country ? this.store.userAllInfo.country : 'Ülke Giriniz'
              "
              size="12px"
              no-caps
              flat
              color="gray-7"
            >
              <q-popup-edit v-model="this.newData.country" auto-save v-slot="scope">
                <q-input
                  v-model="this.newData.country"
                  dense
                  autofocus
                  counter
                  @keyup.enter="setCountry"
                  label="Ülkenizi Giriniz !"
                />
              </q-popup-edit>
            </q-btn>
            <q-select
              filled
              style="margin:0 auto;"
              :style="{'width':this.store.avatarActive ? '40%' : '95%'}"
              class=""
              color="dark"
              label-color="dark"
              bg-color="grey-3"
              @update:model-value="selectGenderMy"
              v-model="this.store.userAllInfo.genderOption" :options="listForGenderOption()"
              :label="this.store.userAllInfo.genderOption ? this.store.userAllInfo.genderOption : 'Lütfen Cinsiyetinizi Belirleyiniz'" />
          </div>
          <div class="q-pa-sm">
            <q-input
              filled color="grey-8"
              v-on:keyup.enter="setInfo"
              v-model="this.newData.info"
              :label="this.store.userAllInfo.info ? this.store.userAllInfo.info : 'Durum Giriniz '">
              <template v-slot:prepend>
                <q-icon name="work" size="sm"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-pa-xs">
          <div class="q-mb-sm">
            <q-badge color="grey-6">
              {{ this.store.userAllInfo.birthday ? this.store.userAllInfo.birthday : 'Doğum Tarihi Giriniz' }}
            </q-badge>
          </div>
          <q-btn icon="event" round color="grey-8">
            <q-popup-proxy @before-show="updateBirthday" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="this.newData.birthday" today-btn color="dark" text-color="white">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="red" flat v-close-popup />
                  <q-btn label="OK" color="dark" flat @click="setBirthday" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
          <q-card-section class="" style="display: inline-block">
            <q-card class="bg-grey-2">
              <div
              class="text-overline text-weight-bold q-pa-sm"
              style="font-size: 17px; display: inline-block"
            >
              <span style="display: block">{{ getLengthFollowers() }}</span>
              <span style="display: block" class="text-caption">Follower</span>
            </div>
            <span>|</span>
            <div
              class="text-overline text-weight-bold q-pa-sm"
              style="font-size: 17px; display: inline-block"
            >
              <span style="display: block">{{
                getFollowLength()
              }}</span>
              <span style="display: block" class="text-caption">Follow</span>
            </div>
            <span>|</span>
            <div
              class="text-overline text-weight-bold q-pa-sm"
              style="font-size: 17px; display: inline-block"
            >
              <span style="display: block">{{
                findFriendNumber()
              }}</span>
              <span style="display: block" class="text-caption">Friends</span>
            </div>
            </q-card>
          </q-card-section>
        </q-card-section>
        <q-card-section horizontal>
          <q-input
            class="col-12"
            mask="(###) ### - ####"
            v-on:keyup.enter="setPhone"
            v-model="this.newData.phone"
            filled :label="this.store.userAllInfo.phone ? this.store.userAllInfo.phone : 'Numara Belirtilmemiş !'"
            color="pink-4">
              <template v-slot:prepend>
                <q-icon name="phone" size="sm"></q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-section horizontal>
          <q-btn-dropdown color="grey-5" class="q-ml-xs col-6 q-mt-sm"
            :label="this.store.userAllInfo.drinkingHabbit ? this.store.userAllInfo.drinkingHabbit : 'Select Drinking Habbit Type'" no-caps>
              <q-list>
                <q-item clickable v-close-popup @click="selectDrinkingHabbitType(data)" v-for="data in this.drinkingType" :key="data.id">
                  <q-item-section>
                    <q-item-label>{{data.name}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn-dropdown color="grey-5" class=" col-6 q-mt-sm" :label="this.store.userAllInfo.ethnicType ? this.store.userAllInfo.ethnicType : 'Select Ethnic Type'" no-caps>
              <q-list>
                <q-item clickable v-close-popup @click="selectEtnich(data)" v-for="data in this.ethnichList" :key="data.id">
                  <q-item-section>
                    <q-item-label>{{data.name}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
        </q-card-section>
        <q-card-section horizontal>
          <q-btn-dropdown color="grey-5" class="q-ml-xs col-12 q-mt-sm"
            :label="this.store.userAllInfo.lookingForType ? this.store.userAllInfo.lookingForType : 'Select Looking For Type'" no-caps>
              <q-list>
                <q-item clickable v-close-popup @click="selectLookingForType(data)" v-for="data in this.lookingForList" :key="data.id">
                  <q-item-section>
                    <q-item-label>{{data.type}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
        </q-card-section>
      </q-card-section>
      <q-card-section class="col-xs-12 col-sm-12 col-md-6" style="border-radius:4px;">
        <q-carousel
              swipeable
              animated
              v-model="this.imageNumber"
              arrows
              thumbnails
              v-model:fullscreen="this.fullScreenMode"
              infinite
            >
              <q-carousel-slide
                style="border-radius:7px;"
                v-for="(data,index) in this.myImages" :key="data.id"
                :name="index" :img-src="data.image" />
                <template v-slot:control>
                  <q-carousel-control
                    position="bottom-right"
                    :offset="[18, 18]"
                  >
                    <q-btn
                      push round dense color="white" text-color="dark"
                      :icon="this.fullScreenMode ? 'fullscreen_exit' : 'fullscreen'"
                      @click="this.fullScreenMode =! this.fullScreenMode"
                    />
                  </q-carousel-control>
                </template>
            </q-carousel>
          <graphStatistics />
          <div class="text-caption">
            <q-icon name="info" size="17px" color="grey-6"></q-icon>
            Chat İstatistikleri Yukarıda Gösterilmektedir
          </div>
        </q-card-section>
    </q-card-section>
    <addMorePhoto  :myImages="this.myImages.length ? this.myImages : ''" v-if="this.store.addMorePhotoActive"/>
  </q-card>
</template>

<script>
//
import { getDatabase, ref, set, update, remove } from "firebase/database";
import { db } from "../firebase/index";
import addMorePhoto from "./addMorePhoto.vue";
import upload from "./upload.vue";
import graphStatistics from "./graphStatistics.vue";
import { useCounterStore } from "../stores/store";
export default {
  components: {
    addMorePhoto,
    upload,
    graphStatistics,

  },
  setup() {
    const store = useCounterStore();
    return {
      store,
    };
  },
  data: function () {
    return {
      newData: {},
      selectedImage: {},
      myImages: [],
      slicePerViewNewLocal:2,
      imageNumber:0,
      fullScreenMode:false,
      genderList:[
        {id:0,gender:'male',value:'man'},
        {id:1,gender:'female',value:'woman'}
      ],
      ethnichList:[
        {id:1,name:'asian'},
        {id:2,name:'black'},
        {id:3,name:'other'},
        {id:4,name:'white'},
        {id:5,name:'hispanic'}
      ],
      drinkingType:[
        {id:1,name:'never'},
        {id:2,name:'socially'},
        {id:3,name:'mad drinker'}
      ],
      lookingForList:[
        {id:1,type:'something serious'},
        {id:2,type:'lets see what happens'},
        {id:3,type:'just for fun'}
      ],
    };
  },
  methods: {
    selectGenderMy(val){
      if(val){
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          genderOption:val
        })
      }
    },
    listForGenderOption(){
      const list = []
      this.genderList.forEach(element => {
        list.push(element.value)
      });
      return list
    },
    selectLookingForType(data){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        lookingForType:data.type
      })
    },
    selectDrinkingHabbitType(data){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        drinkingHabbit:data.name
      })
    },
    selectEtnich(data){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        ethnicType:data.name
      })
    },
    getFollowLength(){
      if(this.store.userAllInfo.follows){
        const lengthFollow = Object.entries(this.store.userAllInfo.follows).length
        return lengthFollow
      }else{
        return 0
      }
    },
    setPhone(){
      if(this.newData.phone){
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          phone:this.newData.phone
        })
        this.newData.phone = ''
      }
    },
    setInfo(){
      if(this.newData.info){
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          info:this.newData.info
        })
        this.newData.info = ''
      }
    },
    setBirthday(){
      if(this.newData.birthday){
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          birthday:this.newData.birthday
        })
      }
    },
    setCountry(){
      if(this.newData.country){
        this.newData.country = this.newData.country.toLowerCase()
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          country:this.newData.country
        })
      }
    },
    setCity(){
      if(this.newData.city){
        this.newData.city = this.newData.city.toLowerCase()
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          city:this.newData.city
        })
      }
    },
    findFriendNumber(){
      if(this.store.friendList.length){
        const numberFriend = this.store.friendList.length
        return numberFriend
      }else{
        return 0
      }
    },
    removeMyImage(data){
      console.log(data)
      const db = getDatabase()
      remove(ref(db,`users/${this.store.user.id}/images/${data.id}`))
      this.myImages = this.myImages.filter(object => object.id !== data.id)
    },
    getLengthFollowers() {
      if (this.store.userAllInfo.followers) {
        const length = Object.entries(this.store.userAllInfo.followers).length;
        return length;
      } else {
        return 0;
      }
    },
    getMyImages() {
      this.myImages = [];
      for (const [key, value] of Object.entries(this.store.userAllInfo.images)) {
        const imageData = {
          id: `${value.id}`,
          image: `${value.image}`,
        };
        this.myImages.push(imageData);
      }
      console.log("myImages", this.myImages);
    },
    addMorePhoto() {
      this.store.addMorePhotoActive = true;
    },
    deleteProfileImage() {
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Profil Fotoğrafını Silmek İstediğinizden Emin misiniz ?'
      }).onOk(() =>{
        const db = getDatabase();
        update(ref(db, `users/${this.store.user.id}`), {
          image: "",
        });
      }).onCancel(() => {

      })
    },
    setName() {
      if (this.newData.name) {
        const db = getDatabase();
        update(ref(db, `users/${this.store.user.id}`), {
          name: this.newData.name,
        });
      }
    },
    setAge() {
      if (this.newData.age) {
        const db = getDatabase();
        update(ref(db, `users/${this.store.user.id}`), {
          age: this.newData.age,
        });
      }
    },
    updateImage() {
      const db = getDatabase();
      update(ref(db, `users/${this.store.user.id}`), {
        image: this.selectedImage.image ? this.selectedImage.image : "",
      });
      this.selectedImage = {};
    },
    clearImage() {
      this.selectedImage = {};
    },
    checkİmage() {
      if (this.selectedImage.image) {
        return true;
      } else {
        return false;
      }
    },
    getcurrentImageData(data) {
      if (data) {
        this.selectedImage = data;
      }
    },
  },
  created() {
    this.store.getMyFriendList()
    this.store.getMyAcc();
  },
  watch: {
    'store.slicePerViewNew':{
      handler(newValue,oldValue){
        if(newValue){
          this.slicePerViewNewLocal = newValue
        }
      },
      immediate:true,
      deep:true
    },
    "store.userAllInfo.images": {
      handler(newValue, oldValue) {
        if (newValue) {
          this.getMyImages();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style></style>
