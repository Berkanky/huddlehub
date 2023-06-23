<template>
    <q-list bordered separator class="bg-transparent text-white">
      <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      <q-item
        clickable v-ripple v-on:click="selectProfile"
        :class="{'bg-grey-3 text-dark':this.store.selectedOption === 'myProfile'}"
        >
        <q-item-section>
          <q-item-label>Profilim</q-item-label>
          <q-item-label caption
          class="text-white"
          :class="{'text-black':this.store.selectedOption === 'myProfile'}"
          >Profil Ayarları</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="selectOptions"
      :class="{'bg-grey-3 text-dark':this.store.selectedOption === 'myOptions'}">
        <q-item-section>
          <q-item-label>Eşleşme Tercihlerim</q-item-label>
          <q-item-label caption
          :class="{'text-black':this.store.selectedOption === 'myOptions'}"
          class="text-white">Eşleşme Tercihlerini Düzenle</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="selectMyFavList"
      :class="{'bg-grey-3 text-dark':this.store.selectedOption === 'myFav'}"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'myFav' ? 'text-black' : 'text-white'">Grup Oluştur</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'myFav' ? 'text-black': 'text-white'"
          >Grup Aktiviteleri İçin Grup Oluştur</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="showMyGroups"
        :class="this.store.selectedOption === 'myGroups' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'myGroups' ? 'text-black' : 'text-white'">Gruplarım</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'myGroups' ? 'text-black': 'text-white'"
          >Grup Aktiviteleri İçin Oluşturduğun Grupları Listele</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="showMySavedUsers"
        :class="this.store.selectedOption === 'mySavedUsers' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'mySavedUsers' ? 'text-black' : 'text-white'">Kaydettiklerim</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'mySavedUsers' ? 'text-black': 'text-white'"
          >Kaydettiğim Kişiler Listesi</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="showMyDarkList"
        :class="this.store.selectedOption === 'myDontShowList' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'myDontShowList' ? 'text-black' : 'text-white'">Dark List</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'myDontShowList' ? 'text-black': 'text-white'"
          >Kara Listem</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="goSavedOldEvents"
        :class="this.store.selectedOption === 'savedOldEvents' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'savedOldEvents' ? 'text-black' : 'text-white'">Kaydedilen Etkinlikler</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'savedOldEvents' ? 'text-black': 'text-white'"
          >Kaydedilen Etkinlikleri Görüntüle</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="goCreateDiscussionPage"
        :class="this.store.selectedOption === 'createDiscussion' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'createDiscussion' ? 'text-black' : 'text-white'">Tartışma Başlat</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'createDiscussion' ? 'text-black': 'text-white'"
          >Tartışma Başlat veya Tartışmalarını Görüntüle</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-on:click="goDonatePage"
        :class="this.store.selectedOption === 'donatePage' ? 'text-dark bg-white' : 'text-white'"
      >
        <q-item-section>
          <q-item-label overline  :class="this.store.selectedOption === 'donatePage' ? 'text-black' : 'text-white'">Donate</q-item-label>
          <q-item-label
          caption
          :class="this.store.selectedOption === 'donatePage' ? 'text-black': 'text-white'"
          >Bağış Yap</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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

    }
  },
  methods:{
    goCreateDiscussionPage(){
      this.store.selectedOption = 'createDiscussion'
    },
    goSavedOldEvents(){
      this.store.selectedOption = 'savedOldEvents'
    },
    goDonatePage(){
      this.store.selectedOption = 'donatePage'
      this.$router.push({path:'/donatePage'})
    },
    showMyDarkList(){
      this.store.selectedOption = 'myDontShowList'
    },
    showMySavedUsers(){
      this.store.selectedOption = 'mySavedUsers'
    },
    showMyGroups(){
      this.store.selectedOption = 'myGroups'
    },
    selectMyFavList(){
      this.store.selectedOption = 'myFav'
    },
    selectOptions(){
      this.store.selectedOption = 'myOptions'
    },
    checkForStyle(){
      if(this.store.selectedOption === this.store.selectedOption){

      }
    },
    goBack(){
      this.$router.push({path:'/'})
    },
    selectProfile(){
      this.store.selectedOption = 'myProfile'
    }
  }
}
</script>

<style>

</style>
