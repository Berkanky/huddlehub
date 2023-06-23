<template>
  <q-page class="flex-column" style="background: linear-gradient(to bottom right, #424242 50%, #2a66c7 50%);">
    <q-card class="cardStyle bg-white" :style="{'height':this.newHeight + '%'}">
      <q-card-section class="text-center">
        <q-avatar size="80px">
          <img :src="appImage" alt="">
        </q-avatar>
        <div class="text-subtitle2 text-weight-bold text-blue-3" style="font-size:17px;">HuddleHub</div>
      </q-card-section>
    <q-card-section class="text-center">
      <q-btn
        icon="login"
        :text-color="checkCurrentType() ? 'blue' : 'white'"
        :color="checkCurrentType() ? 'white' :'blue-4'"
        push v-on:click="loginButton"></q-btn>
      <span class="q-pa-xs"></span>
      <q-btn
        icon="person_add"
        :text-color="checkCurrentType() ? 'white' : 'blue'"
        :color="checkCurrentType() ? 'blue-4' : 'white'"
        push v-on:click="registerButton"></q-btn>
    </q-card-section>
    <q-card-section style="max-width:95%;margin:0 auto;">
      <q-input
        v-model="this.user.phone"
        label="Phone Number"
        v-if="this.showPhoneInputActive"
        color="blue"
      >
        <template v-slot:prepend>
          <q-icon name="phone" :color="this.user.phone ? 'grey-3' :'grey-5'"></q-icon>
        </template>
        <template v-slot:append v-if="this.user.phone">
          <q-btn icon="remove" color="grey-7" size="sm" v-on:click="this.user.phone =''"></q-btn>
        </template>
      </q-input>
      <q-input
        v-model="this.user.email"
        label="E-mail"
        type="email"
        v-if="!this.showPhoneInputActive"
        color="blue">
          <template v-slot:prepend>
            <q-icon name="mail" :color="this.user.email ? 'grey-3' : 'grey-5'"></q-icon>
          </template>
          <template v-slot:append v-if="this.user.email">
            <q-btn icon="remove" color="grey-7" size="sm" v-on:click="this.user.email = ''"></q-btn>
          </template>
        </q-input>
        <span style="" class="q-pa-xs"></span>
        <q-input
        v-if="!this.showPhoneInputActive"
        label="Password"
        color="blue" v-model="this.user.password">
          <template v-slot:prepend>
            <q-icon name="lock" :color="this.user.password ? 'grey-3' : 'grey-5'"></q-icon>
          </template>
          <template v-slot:append v-if="this.user.password">
            <q-btn size="sm" icon="remove" color="grey-7" v-on:click="this.user.password = ''"></q-btn>
          </template>
        </q-input>
        <div class="text-right q-pa-xs">
          <q-btn size="sm" flat color="grey-7" label="Forgot Password ?" icon="lock" no-caps v-on:click="sendPasswordReset"></q-btn>
        </div>
    </q-card-section>
    <q-card-section style="max-width:95%;margin:0 auto;">
      <q-btn class="full-width" color="blue-4" label="Login" no-caps icon-right="login" v-if="checkCurrentType()" v-on:click="loginSystem"></q-btn>
      <q-btn class="full-width" color="blue-4" label="Register" no-caps icon-right="login" v-if="!checkCurrentType()" v-on:click="registerSystem"></q-btn>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn icon="fa-brands fa-google" size="16px" round color="grey-7" v-on:click="loginWithGoogle"></q-btn>
      <span class="q-pa-xs"></span>
      <q-btn icon="phone" round color="grey-7" size="16px" v-on:click="loginWithPhone"></q-btn>
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2 text-grey-7 text-weight-bold text-center q-pa-sm" >
        <q-btn icon="person_add" label="Or Join Us Quickly" v-if="checkCurrentType()" no-caps flat color="grey-6" icon-right="chevron_right" v-on:click="registerButton"></q-btn>
        <q-btn icon-right="login" label="Do You Have An Account ?" v-if="!checkCurrentType()" no-caps flat color="grey-6" icon="chevron_left" v-on:click="loginButton"></q-btn>
      </div>
    </q-card-section>
  </q-card>
  </q-page>
</template>

<script>
import appImage from '../images/group.png'
import image from '../images/applogo.png'
import {auth} from '../firebase/index'
import {db} from '../firebase/index'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, sendPasswordResetEmail} from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store,
      image,
      appImage
    }
  },
  data:function(){
    return{
      currentType:'login',
      showPhoneInputActive:false,
      user:{},
      newHeight:0,
      window:{
        width:0,
        height:0
      }
    }
  },
  methods:{
    updateWhenLogin(){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        online:true
      })
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      console.log('window',this.window)
    },
    updateMyPassword(){
      if(this.store.loginInputValues.password != this.store.userAllInfo.password){
        const db = getDatabase()
        update(ref(db,`users/${this.store.user.id}`),{
          password:this.user.password
        })
        console.log('updated')
      }
    },
    sendPasswordReset(){
      if(this.user.email){
        this.$q.dialog({
          dark:true,
          cancel:true,
          title:'Warning',
          message:`Are You Sure You Want To Send The Password Reset Link To ${this.user.email} ?`
        }).onOk(()=>{
          const auth = getAuth();
          sendPasswordResetEmail(auth, this.user.email)
            .then(() => {
              this.$q.notify({
                type:'positive',
                position:'center',
                message:'Password Reset Link Sended',
                timeout:800
              })
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
            });
        })
      }else{
        this.$q.notify({
          type:'negative',
          message:'Please Enter Your Email !',
          timeout:700,
          position:'top'
        })
      }
    },
    loginWithPhone(){
      this.currentType = 'register'
      this.showPhoneInputActive =! this.showPhoneInputActive
    },
    addInfosDatabase(){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        email:this.store.user.email,
        id:this.store.user.id,
        password:this.user.password ? this.user.password : ''
      })
    },
    loginWithGoogle(){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user)
          this.store.user.email = user.email
          this.store.user.id = user.uid
          this.addInfosDatabase()
          this.updateWhenLogin()
          this.$router.push({path:'/'})
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          console.log(errorCode)
          console.log(errorMessage)
          console.log(email)
          console.log(credential)
        });
    },
    phoneFirebaseFunc(){
      const phoneNumber = this.user.phone;
      const appVerifier = window.recaptchaVerifier;
      const auth = getAuth();
      auth.languageCode = 'tr'; // Set the language code to 'en' for English

      // Create a new reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA verification completed successfully
          console.log('reCAPTCHA verification completed successfully');
        },
        // Optional settings:
        // 'hl': Language code (e.g. 'en')
        // 'theme': 'light' or 'dark'
        // 'badge': 'bottomright', 'bottomleft', 'inline' or 'none'
      });
      // Set the reCAPTCHA verifier
      window.recaptchaVerifier = recaptchaVerifier;

      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          this.$router.push({path:'/'});
        })
        .catch((error) => {
          console.log(error);
        });
    },
    registerSystem(){
      if(!this.showPhoneInputActive){
        this.firebaseRegisterFunc()
      }else if(this.showPhoneInputActive){
        console.log(this.user.phone)
        this.phoneFirebaseFunc()
      }
    },
    checkMyPassword(){
      this.store.getUsers()
    },
    firebaseRegisterFunc(){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.store.user.id = user.uid
          this.store.user.email = user.email
          this.$q.notify({
            type:'positive',
            position:'right',
            message:'Successfully Registered, Welcome:)',
            timeout:700
          })
          this.addInfosDatabase()
          this.updateWhenLogin()
          this.$router.push({path:'/'})
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode,errorMessage)
        });
    },
    loginSystem(){
      this.firebaseLoginFunc()
    },
    getMyAccInLogin(){
      this.store.getMyAcc()
      this.updateMyPassword()
    },
    firebaseLoginFunc(){
      const auth = getAuth()
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
      .then((userCredential) => {
        this.store.loginInputValues.password = this.user.password
        const user = userCredential.user;
        this.store.user.id = user.uid
        this.store.user.email = user.email
        console.log('store.user',this.store.user)
        this.$q.notify({
            type:'positive',
            position:'right',
            message:'Successfully Signed In, Welcome :)',
            timeout:700
          })
          this.checkMyPassword()
          this.getMyAccInLogin()
          this.updateWhenLogin()
          this.$router.push({path:'/'})
      })
      .catch((error) => {
        const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage)
          console.log(errorCode)
          if(errorCode){
            this.$q.notify({
              type:'negative',
              position:'top',
              message:'Make Sure You Enter Required Information !',
              timeout:1000
            })
            this.user.password = ''
          }
      });
    },
    loginButton(){
      this.currentType = 'login'
    },
    registerButton(){
      this.currentType = 'register'
    },
    checkCurrentType(){
      if(this.currentType == 'login'){
        return true
      }else{
        return false
      }
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    window:{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.newHeight = 100
          console.log('newHeight',this.newHeight)
        }else{
          this.newHeight = 80
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style scoped>
  .cardStyle{
    width:100%;
    max-width: 600px;
    width:100% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-width: 500px) {width: 100% !important;
    };

  }
</style>
