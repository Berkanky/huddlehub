<template>
  <q-page :class="!this.store.avatarActive ? 'mobileCardStyle' : 'desktopStyle'">
    <div class="q-pa-md" v-if="this.store.avatarActive" style=""></div>
    <homePage />
  </q-page>
</template>

<script>
import homePage from 'src/components/homePage.vue';
import {db} from '../firebase/index'
import { getDatabase, ref, set } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    homePage
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
  methods:{

  },
  mounted(){
    this.store.genderOptionActive = false
    this.store.rightActive = false
  },
  created(){
    if(this.$route.path === '/' && this.store.user.id){
      this.$q.loading.show()
    }
  },
  watch:{
    'store.secondUserList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.$q.loading.hide()
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
.mobileCardStyle{
  background-color: #231E39;
}
.desktopStyle{
  background: linear-gradient(to left, #ece9e6, #ffffff);
}
</style>
