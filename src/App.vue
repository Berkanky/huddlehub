<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import {auth} from '../src/firebase/index'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import {db} from '../src/firebase/index'
import { defineComponent } from 'vue'
import { useCounterStore } from './stores/store';
export default defineComponent({
  name: 'App',
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      path:''
    }
  },
  methods:{
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
    checkAuthFirebase(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.store.user.email = user.email
          this.store.user.id = user.uid
          console.log('authDetected',this.store.user)
          this.store.getMyAcc()
        } else {
          this.$router.replace({path:'/login'})
        }
      });
    }
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    'store.window':{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.store.newHeight = 100
          this.store.avatarActive = false
          console.log('newHeight',this.store.newHeight)
          this.store.slicePerViewNew = 1
          console.log('avatar',this.store.avatarActive)
        }else{
          this.store.slicePerViewNew = 2
          this.store.newHeight = 80
          this.store.avatarActive = true
          console.log('avatar',this.store.avatarActive)
        }
      },
      immediate:true,
      deep:true
    },
    $route:{
      handler(route){
        this.path = route.path
        this.store.currentRouterName = route.path
        console.log(this.path,this.store.currentRouterName)
        this.checkAuthFirebase()
      }
    }
  }
})
</script>

<style>
 .app{
  font-family: 'Montserrat', sans-serif;
 }
</style>
