<template>
  <q-page class=""
    :class=" this.store.selectedOption != 'myProfile' && this.store.selectedOption != 'myOptions' ? 'bg-dark' : 'bg-white'">
    <q-card class="bg-transparent" bordered style="width:100%;height:100%;">
      <q-card-section>
        <myProfile v-if="this.store.selectedOption == 'myProfile'"/>
        <myOptions  v-if="this.store.selectedOption == 'myOptions'" />
        <myFav v-if="this.store.selectedOption == 'myFav'"/>
        <myCreatedGroups v-if="this.store.selectedOption == 'myGroups'"/>
        <mySavedUsers v-if="this.store.selectedOption == 'mySavedUsers'"/>
        <myDontShowList v-if="this.store.selectedOption == 'myDontShowList'"/>
        <mySavedOldEvents v-if="this.store.selectedOption == 'savedOldEvents'"/>
        <createDiscussion v-if="this.store.selectedOption == 'createDiscussion'"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import createDiscussion from 'src/components/createDiscussion.vue'
import mySavedOldEvents from 'src/components/mySavedOldEvents.vue'
import myDontShowList from 'src/components/myDontShowList.vue'
import mySavedUsers from 'src/components/mySavedUsers.vue'
import myCreatedGroups from 'src/components/myCreatedGroups.vue'
import myFav from 'src/components/myFav.vue'
import myOptions from 'src/components/myOptions.vue'
import myProfile from 'src/components/myProfile.vue'
import options from 'src/components/options.vue'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    createDiscussion,
    options,
    myProfile,
    myOptions,
    myFav,
    myCreatedGroups,
    mySavedUsers,
    myDontShowList,
    mySavedOldEvents
  },
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
  created(){
    this.store.getUsers()
  },
  methods:{

  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
          this.store.getMyFriendList()
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
