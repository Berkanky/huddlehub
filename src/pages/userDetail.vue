<template>
  <q-page class="flex-column"></q-page>
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
  }
}
</script>

<style>

</style>
