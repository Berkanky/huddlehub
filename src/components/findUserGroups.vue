<template>
    <q-dialog v-model="this.store.searchButtonActive" persistent :maximized="this.store.avatarActive ? false : true">
      <q-card dark :style="{'width':this.store.avatarActive ? '500px' : '100%'}">
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-h6">Search User Or Group</div>
        </q-card-section>
        <q-card-section class="row">
          <q-radio dark v-model="this.type" val="admin" label="Find Admin" />
          <q-radio dark v-model="this.type" val="group" label="Find Group" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="this.search.searchValue" autofocus @keyup.enter="findGroupOrUser" dark color="pink">
            <template v-slot:prepend>
              <q-icon name="search"></q-icon>
            </template>
            <template v-slot:append v-if="this.search.searchValue">
              <q-btn icon="remove" color="white" flat v-on:click="this.search.searchValue = ''"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat icon="remove" color="white" v-on:Click="this.search.searchValue = ''" :disable="this.checkSearchValue() ? false : true"/>
          <q-btn flat icon="search" v-on:click="findGroupOrUser" color="pink" :disable="this.checkSearchValue() ? false : true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
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
      type:'admin',
      search:{},
      findedUsers:[]
    }
  },
  methods:{
    checkSearchValue(){
      if(this.search.searchValue){
        return true
      }else{
        return false
      }
    },
    goBack(){
      this.store.searchButtonActive = false
    },
    filterNow(){
      const groupList = this.store.activityGroupsList
      let filteredList = []
      this.findedUsers.forEach(element => {
        filteredList = filteredList.concat(groupList.filter(object => object.adminId.includes(element.id)))
      });
      this.store.filteredActivityGroupList = filteredList
      console.log('adminFinded',this.store.filteredActivityGroupList)
    },
    findAdminName(){
      const list = this.store.usersList
      const result = list.filter(object=> object.name.includes(this.search.searchValue) || object.email.includes(this.search.searchValue))
      if(result.length){
        this.findedUsers = []
        result.forEach(element => {
          this.findedUsers.push(element)
        });
        console.log(this.findedUsers)
        if(this.findedUsers.length){
          this.filterNow()
        }
      }
    },
    filterGroupName(){
      const list = this.store.activityGroupsList
      const result = list.filter(object => object.name.includes(this.search.searchValue))
      if(result){
        this.store.filteredActivityGroupList = result
        console.log('groupFiltered',this.store.filteredActivityGroupList)
      }
    },
    findGroupOrUser(){
      if(this.search.searchValue){
        if(this.type === 'admin'){
          this.findAdminName()
        }else{
          this.filterGroupName()
        }
        if(this.store.filteredActivityGroupList.length){
          this.store.filterOnActive = true
          this.goBack()
        }else if(!this.store.filteredActivityGroupList.length){
          this.$q.notify({
            type:'negative',
            message:'Sonuç Alınamadı, Tekrar Deneyiniz !',
            position:'bottom',
            timeout:700
          })
          this.search.searchValue = ''
        }
      }
    }
  },
  created(){
    this.store.getUsers()
    this.store.getActivityGroups()
  },
  watch:{

  }
}
</script>

<style>

</style>
