<template>
  <q-page class="bg-dark text-white">
    <selectedDiscussionVue />
  </q-page>
</template>

<script>
import { useCounterStore } from 'src/stores/store';
import selectedDiscussionVue from 'src/components/selectedDiscussion.vue';
export default {
  components:{
    selectedDiscussionVue
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
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
