<template>
  <q-card
  flat
  style="margin:0 auto;"
  :style="{'width':this.store.avatarActive ? '50%' : '100%'}"
  class="bg-transparent">
    <q-card-section>
      <q-card
      :flat="!this.store.avatarActive ? true : false"
      style="margin:0 auto;"
      class="bg-grey-2"
      :style="{'width':this.store.avatarActive ? '60%' : '100%'}">
      <div class="text-overline text-center text-weight-bold text-grey-9 q-pa-sm">Discovery Settings</div>
        <q-card-section class="text-center q-pa-md"  horizontal>
          <div class="col-6 text-left text-overline">City <q-icon name="chevron_right" size="17px"></q-icon></div>
          <div class="col-6 text-overline">
            {{ this.newFilter.city ? this.newFilter.city : 'Lütfen Bir Şehir Giriniz' }}
            <q-btn icon="search" flat color="dark" size="sm">
              <q-popup-edit v-model="this.newFilter.city" class="bg-dark text-white" v-slot="scope">
                <q-input dark color="white" v-model="this.newFilter.city" dense autofocus label="Şehir Giriniz" counter @keyup.enter="setCity">
                  <template v-slot:append>
                    <q-icon name="edit" />
                  </template>
                </q-input>
            </q-popup-edit>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section class="text-center q-pa-md" horizontal>
          <div class="col-6 text-left text-overline">Country <q-icon name="chevron_right" size="17px"></q-icon></div>
          <div class="col-6 text-overline">
            {{ this.newFilter.country ? this.newFilter.country : 'Lütfen Ülke Giriniz' }}
            <q-btn icon="search" flat color="dark" size="sm">
              <q-popup-edit v-model="this.newFilter.country" class="bg-dark text-white" v-slot="scope">
                <q-input dark color="white" v-model="this.newFilter.country" dense autofocus label="Ülke Giriniz" counter @keyup.enter="setCountry">
                  <template v-slot:append>
                    <q-icon name="edit" />
                  </template>
                </q-input>
            </q-popup-edit>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section horizontal class="text-center q-pa-md">
          <div class="col-3 text-left">
            Gender <q-icon name="chevron_right" size="17px"></q-icon>
          </div>
          <div class="col text-right">
            <q-btn-dropdown
              :icon="iconForPicker()" :color="colorForPicker()"
              flat no-caps :label="this.newFilter.gender ? this.newFilter.gender : 'Cinsiyet Seçiniz'">
              <q-list class="bg-dark">
                <q-item clickable v-close-popup @click="this.newFilter.gender = 'man'" class="text-white">
                  <q-item-section>
                    <q-item-label><q-btn icon="male" color="primary" flat label="Male" no-caps></q-btn></q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="this.newFilter.gender = 'woman'">
                  <q-item-section>
                    <q-item-label><q-btn icon="female" color="pink" flat label="Female" no-caps></q-btn></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-section>
        <q-card-section horizontal class="text-center q-pa-md">
          <div class="text-left text-overline col-2">
            Age <q-icon name="chevron_right" size="17px"></q-icon>
          </div>
          <div class="col">
            <q-range
              v-model="this.newFilter.age"
              :min="0"
              :max="50"
              label-always
              color="pink-4"
            />
          </div>
        </q-card-section>
        <q-separator color="grey-4" size="5px"></q-separator>
        <q-card-section class="text-center q-pa-md" horizontal>
          <div class="col-6 text-left text-caption">
            <q-icon name="info" color="grey-5" size="sm"></q-icon> Profilimi HuddleHub Uygulamasında Göster.
          </div>
          <div class="col-6 text-right">
            <q-toggle
              v-model="this.newFilter.showStatus"
              color="pink-4"
              keep-color
              @update:model-value="changeShowMe"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="text-left">
            Ethnicity
            <q-icon name="chevron_right" size="17px"></q-icon>
          </div>
          <div class="text-center q-pa-sm">
            <q-btn
              class="q-ml-xs q-mt-xs"
              :color="checkColor(data) ? 'pink':'white'" :text-color="checkColor(data) ? 'white' : 'dark'"
              v-for="data in this.ethnichList" :key="data.id" :label="data.name" no-caps
              rounded v-on:click="addToList(data)"></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="text-left">
            Drinking Habits
            <q-icon name="chevron_right" size="17px"></q-icon>
          </div>
          <div class="text-center">
            <q-btn
            :color="checkColorDrink(data) ? 'pink' : 'white'"
            :text-color="checkColorDrink(data) ? 'white' : 'dark'"
            :label="data.name" rounded class="q-ml-xs" no-caps
            v-on:Click="addToDrinkList(data)"
            v-for="data in this.drinkingType" :key="data.id"></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="text-left">
            Looking For <q-icon name="chevron_right" size="17px"></q-icon>
          </div>
          <div class="text-center">
            <q-btn
            :color="checkColorForLookingList(data) ? 'pink' : 'white'"
            :text-color="checkColorForLookingList(data) ? 'white' : 'dark' "
            v-on:click="addToLookingForList(data)"
            v-for="data in this.lookingForList" :key="data.id"
            :label="data.type" no-caps rounded class="q-ma-xs"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="text-right q-pa-sm">
          <q-btn icon="remove" label="Clear" no-caps rounded color="red-4" size="12px" v-on:Click="clearPage"></q-btn>
          <q-btn icon-right="check" label="Confirm" no-caps rounded color="pink-4" size="12px" class="q-ml-xs" v-on:click="filterUserList"></q-btn>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
import { getDatabase, ref, set, update } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      newFilter:{showStatus:false},
      ethnichList:[
        {id:1,name:'asian'},
        {id:2,name:'black'},
        {id:3,name:'other'},
        {id:4,name:'white'},
        {id:5,name:'hispanic'}
      ],
      selectList:[],
      drinkingType:[
        {id:1,name:'never'},
        {id:2,name:'socially'},
        {id:3,name:'mad drinker'}
      ],
      drinkSelectList:[],
      lookingForList:[
        {id:1,type:'something serious'},
        {id:2,type:'lets see what happens'},
        {id:3,type:'just for fun'}
      ],
      lookingForAddList:[]
    }
  },
  methods:{
    setCountry(){
    },
    filterSecondList(){
     // this.store.secondUserList = this.store.usersList;
      for (const key in this.newFilter) {
        if (Object.hasOwnProperty.call(this.newFilter, key)) {
          const filterValue = this.newFilter[key];
          switch (key) {
            case 'gender':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.genderOption === filterValue);
              break;
            case 'age':
              if (filterValue.min && filterValue.max) {
                this.store.secondUserList = this.store.secondUserList.filter(object => Number(object.age) <= filterValue.max && Number(object.age) >= filterValue.min);
              }
              break;
            case 'drinkingHabbit':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.drinkingHabbit === filterValue)
              break;
            case 'lookingForType':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.lookingForType === filterValue)
              break;
            case 'city':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.city === filterValue)
              break;
            case 'country':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.country === filterValue)
              break;
            case 'ethnicType':
              this.store.secondUserList = this.store.secondUserList.filter(object => object.ethnicType === filterValue)
              break;
            default:
              break;
          }
        }
      }
/*       if(this.selectList.length){
        this.selectList.forEach(element => {
          this.store.secondUserList = this.store.secondUserList.filter(object => object.ethnicType === element.name)
        });
        console.log(this.store.secondUserList)
      }
      console.log('secondUserListFilter',this.store.secondUserList); */
      console.log('secondUserListFilter',this.store.secondUserList);
      if(!this.store.secondUserList.length){
        this.$q.notify({
          type:'negative',
          message:'Aradığınız Kriterler de Kullanıcı Bulunamadı !',
          timeout:700,
          position:'bottom'
        })
        this.clearPage()
        //this.$q.loading.hide()
      }else{
        this.store.filteredList = this.store.secondUserList
        this.store.filterUserActive = true
        this.$router.push({path:'/'})
        //this.$q.loading.hide()
      }
    },
    filterUserList(){
      //this.$q.loading.show()
      this.store.getUsers()
      //this.newFilter.drinkSelectList = this.drinkSelectList
      //this.newFilter.lookingForAddList = this.lookingForAddList
      //this.newFilter.selectList = this.selectList
      console.log(this.newFilter)
      console.log(this.store.secondUserList)
      this.filterSecondList()
    },
    clearPage(){
      this.selectList = []
      this.drinkSelectList = []
      this.lookingForAddList = []
      this.store.filterUserActive = false
      if(this.store.userAllInfo.showMe){
        this.newFilter = {showStatus:this.store.userAllInfo.showMe}
      }else{
        this.newFilter = {showStatus:false}
      }
    },
    checkColorForLookingList(data){
      const result = this.lookingForAddList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addToLookingForList(data){
      console.log(data)
      const result = this.lookingForAddList.find(object => object.type === data.type)
      if(result){
        this.lookingForAddList = this.lookingForAddList.filter(object => object.id !== data.id)
        this.newFilter.lookingForType = ''
      }else{
        this.lookingForAddList = []
        this.lookingForAddList.push(data)
        this.newFilter.lookingForType = data.type
      }
    },
    checkColorDrink(data){
      const result = this.drinkSelectList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addToDrinkList(data){
      const result = this.drinkSelectList.find(object => object.name === data.name)
      if(result){
        this.drinkSelectList = this.drinkSelectList.filter(object => object.id !== data.id)
        this.newFilter.drinkingHabbit = ''
      }else{
        this.drinkSelectList = []
        this.drinkSelectList.push(data)
        this.newFilter.drinkingHabbit = data.name
      }
    },
    checkColor(data){
      const result = this.selectList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addToList(data){
/*       const result = this.selectList.find(object => object.id === data.id)
      if(result){
        this.selectList = this.selectList.filter(object => object.id !== data.id)
      }else{
        this.selectList.push(data)
      }
      console.log(this.selectList) */
      const result = this.selectList.find(object => object.id === data.id)
      if(result){
        this.selectList = this.selectList.filter(object => object.id !== result.id)
      }else{
        this.selectList = []
        this.selectList.push(data)
        this.newFilter.ethnicType = data.name
      }
    },
    changeShowMe(){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        showMe:this.newFilter.showStatus
      })
    },
    iconForPicker(){
      if(this.newFilter.gender){
        if(this.newFilter.gender == 'male'){
          return 'male'
        }else{
          return 'female'
        }
      }else{
        return ''
      }
    },
    colorForPicker(){
      if(this.newFilter.gender){
        if(this.newFilter.gender == 'male'){
          return 'primary'
        }else{
          return 'pink'
        }
      }else{
        return 'dark'
      }
    },
    setCity(){
      console.log(this.newFilter)
    }
  },
  created(){
  },
  watch:{
    'store.userAllInfo':{
      handler(newValue,oldValue){
        if(newValue){
          if(this.store.userAllInfo.showMe){
            this.newFilter.showStatus = this.store.userAllInfo.showMe
          }else{
            this.newFilter.showStatus = false
          }
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
