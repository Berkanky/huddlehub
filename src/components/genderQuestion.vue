<template>
  <q-dialog v-model="this.store.genderOptionActive" v-if="this.store.genderOptionActive" persistent>
    <q-card style="width:300px;height:190px;" class="bg-dark">
      <q-card-section class="full-height " horizontal>
        <q-btn icon="male" class="full-height col-6" flat color="primary" v-on:click="selectMan" size="lg"></q-btn>
        <q-btn icon="female" class=" full-height col-6" flat color="pink" v-on:click="this.selectFemale()" size="lg"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {db} from '../firebase/index'
import { getDatabase, ref, set, update, remove } from "firebase/database";
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
    selectMan(){
      console.log('mal')
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        genderOption:'man'
      })
      this.store.genderOptionActive = false
    },
    selectFemale(){
      console.log('mal')
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        genderOption:'woman'
      })
      this.store.genderOptionActive = false
    }
  },
}
</script>

<style>

</style>
