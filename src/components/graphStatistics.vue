<template>
  <apexchart
    width="100%"
    height="auto"
    type="bar"
    :options="this.chartOptions"
    :series="this.series"
  ></apexchart>
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
import VueApexCharts from "vue3-apexcharts";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    apexchart: VueApexCharts,
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data: function() {
    return {
      newListForLengthChats:[],
      uniqueList:[],
      chartOptions: {
        colors:['#FFC0CB'],
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: "",
          data: [],
        },
      ],
    };
  },
  methods:{
    getChatLengths(){
      this.newListForLengthChats = []
      var keys = Object.keys(this.store.onlyKeys);
      // döngü kullanarak her bir özellik için length değerini yazdırma
      for (var i = 0; i < keys.length; i++) {
        var prop = this.store.onlyKeys[keys[i]];
        console.log(keys[i] + " length: " + Object.keys(prop).length);
        this.newListForLengthChats.push({id:keys[i],lengthChat:Object.keys(prop).length})
      }
      console.log('newListForLengthChats',this.newListForLengthChats)
      this.uniqueList.forEach(element => {
        const result = this.newListForLengthChats.find(object => object.id === element.senderId)
        if(result){
          result.name = element.name
        }
      });
      console.log('lastnewListForLengthChats',this.newListForLengthChats)
      this.pushFriendsValues()
      //this.pushYValue()
    },
    pushYValue(){
      this.series[0].data = []
      this.newListForLengthChats.forEach(element => {
        this.series[0].data.push(Number(element.lengthChat))
      });
    },
    pushFriendsValues(){
      this.chartOptions.xaxis.categories = []
      //this.series[0].data = []
      this.newListForLengthChats.forEach(element => {
        this.chartOptions.xaxis.categories.push(element.name)
        //this.series[0].data.push(element.lengthChat)
      })
      this.pushYValue()
    },
    getHowManyChat(){
      const uniqueList = []
      this.store.chatKeys.forEach(element => {
        for(const [key,value] of Object.entries(element)){
          const messageData = {
            senderId:`${value.senderId}`,
            name:`${value.name}`
          }
          const result = uniqueList.find(object => object.senderId === messageData.senderId)
          if(!result){
            uniqueList.push(messageData)
          }
        }
      });
      this.uniqueList = uniqueList
      this.getChatLengths()
      console.log('uniqueList',uniqueList)
    },
    getOnlyKeyChats(){
      const db = getDatabase();
      const dbRef = ref(db, `chats/${this.store.user.id}`);
      onValue(dbRef, (snapshot) => {
        this.store.onlyKeys = snapshot.val();
        console.log('onlyKeys',this.store.onlyKeys)
        this.getHowManyChat()
      });
    },
    getMyChats(){
      const db = getDatabase()
      const dbRef = ref(db,`chats/${this.store.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.store.chatKeys = []
        snapshot.forEach((childSnapshot)=>{
          this.store.chatKeys.push(childSnapshot.val())
        })
        console.log('keys',this.store.chatKeys,this.store.user.id)
        this.getOnlyKeyChats()
      })
    }
  },
  created(){
    //this.getHowManyChat()
  },
  watch:{
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue || oldValue){
          this.getMyChats()
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
