import { defineStore } from 'pinia';
import { getDatabase, ref, onValue, orderByChild, query, orderByKey } from "firebase/database";
import {db} from '../firebase/index'
export const useCounterStore = defineStore('counter', {
  state: () => ({
    loginInputValues:{},
    user:{},
    userAllInfo:{},
    usersList:[],
    secondUserList:[],

    //friendList Datas
    notifyList:[],
    friendListActive:false,
    notifyListActive:false,
    friendList:[],
    //options Values
    selectedOption:'myProfile',
    //

    //uploadVue Data
    imageForBack:'',
    //

    //galleryActive
    galleryActive:false,

    //cHatskeys
    chatKeys:[],
    onlyKeys:[],
    newOnlyKeyList:[], // 21.04.2023 16.59 childsnapshot.key
    //blocks
    blockList:[],

    //zoomActive
    selectedUserZoomActive:false,

    //zoomeveryımage comp
    selectedZoomImage:{},
    selectedZoomImageActive:false,

    //window innerheight
    newHeight:0,
    window:{
      width:0,
      height:0
    },
    avatarActive:false,

    //addmore photo
    addMorePhotoActive:false,
    imageListGlobal:[],
    //sliceperview
    slicePerViewNew:2,

    //genderQuestion
    genderOptionActive:false,

    //currentRouter
    currentRouterName:'',

    //dontShowList
    dontShowListAll:[],

    //homePageSelectedUser
    selectedUserForDetail:{},
    rightActive:false,

    //filterList
    filterUserActive:false,
    filteredList:[],

    //myFav List
    myFavList:[],

    //goChatFromHome
    selectedFav:{},
    //showOnlyconections
    showConnectionsActive:false,

    //activity Groups
    activityGroupsList:[],
    settingsActive:false,
    selectedGroupForSettings:{},
    //groupActivities
    fromOtherPageSelectedGroup:{},
    //activityGroups part 2
    selectedGroupForChat:{},
    selectedGroupForDetail:{},
    forDesktopChatActive:false,
    groupChatActive:false,
    activityGroupChats:[],

    //forDeleteGroup
    forDeleteSelectGroup:{},

    //filterGroupMeet
    filterGroupMeetActive:false,
    filteredActivityGroupList:[],
    myMemberedGroups:[],
    myWaitersGroups:[],
    filterOnActive:false,

    //pointNotify
    myPointNotify:[],
    //groupActivites
    fullScreenMapActive:false,

    //groupActivities dialog component
    addNewUserActive:false,

    //myinvitesList
    invitesList:[],

    //optionsGroupActivites
    optionsActiveGroup:false,

    //fromSettings go Group Meets selected group
    goGroupChatFromSettings:{},
    goGroupChatFromSettingsActive:false,

    //infochart for selectedUser
    showUserDetail:{},
    showUserDetailActive:false,

    //oldEventsComp
    showOldEventsActive:false,
    showMapActive:false,
    showAllLocationsActive:false,

    //saved Groups
    savedGroupsList:[],

    //fromProfileGroups go selectedUser Profile Detail
    fromProfileSUActive:false,
    //groupMeets searchButton
    searchButtonActive:false,

    //oldEventDetail
    oldEventDetailActive:false,
    oldEventGalleryActive:false,
    galleryFilterActive:false,
    oldEventVideoGalleryActive:false,
    videoGalleryFilterActive:false,
    //savedOldEvents
    savedOldEventList:[],
    showFromProfileSavedEventsActive:false,
    showOldEventMembersActive:false,

    //discussion
    //message
    messageInDiscuss:'',
    //
    allDiscussionsList:[],
    mySavedDiscussions:[],
    pureListDiscussions:[],
    selectedDis:{},
    //
    selectedDisCurrent:{},
    //
    showLikerActive:false,
    showOptionsActive:false,
    filterActiveOn:false,
    crudOptionActive:false,
    commentOptionActive:false,
    selectedCommentDiscuss:{},
    findMessageDiscuss:{},
    selectedDisChats:[],
    selectedDisChatFilterActive:false,
    findGroupDiscuss:{},
    voteListActive:false,
    likedCommentsSelectedDis:[],
    adminPanelDisActive:false,
    selectedMemberInAdmin:{},
    blockListDiscussion:[],

    fromParentToChildSelectCrudOption:false,
    resetChatFilterActive:false,
    selectedDiscussionDetailActive:false,
    discussionBlockedsActive:false,


    //for inputs image selecters
    selectedImagesForChats:[],
    imageObject:{}, //for send ımages,
    addNewPhotoActive:false,

    //createChatGroup.vue
    createChatGroupActive:false,
    groupChatList:[],
    selectedGroupChat:{},
    selectedGroupChatChat:[],
    showGroupChatDetailActive:false,
    currentGroupDetailChat:{}

  }),
  getters: {
  },
  actions: {
    getGroupChatChats(){
      const db = getDatabase()
      const dbRef = query(ref(db,`groupChats/${this.selectedGroupChat.id}/chats`),orderByChild('date','desc'))
      onValue(dbRef,(snapshot) => {
        this.selectedGroupChatChat = []
        snapshot.forEach((childSnapshot) => {
          this.selectedGroupChatChat.push(childSnapshot.val())
        })
        console.log('selectedGroupChatChat',this.selectedGroupChatChat)
      })
    },
    getGroupChatList(){
      const db = getDatabase()
      const dbRef = ref(db,`groupChats/`)
      onValue(dbRef,(snapshot) => {
        this.groupChatList = []
        snapshot.forEach((childSnapshot) => {
          this.groupChatList.push(childSnapshot.val())
        })
        console.log('groupChatList',this.groupChatList)
      })
    },
    checkOnlineOrNotGlobal(data){
      const result = this.usersList.find(object => object.id === data.id)
      if(result){
        if(result.online){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getMySavedDiscussions(){
      const db = getDatabase()
      const dbRef = ref(db,`mySavedDiscussions/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.mySavedDiscussions = []
        snapshot.forEach((childSnapshot) => {
          this.mySavedDiscussions.push(childSnapshot.val())
        })
        console.log('mySavedDiscussions',this.mySavedDiscussions)
      })
    },
    checkCurrentDiscussSavedOrNot(){
      const result = this.mySavedDiscussions.some(object => object.id === this.selectedDis.id )
      if(result){
        return true
      }else{
        return false
      }
    },
    findUserInfo(data){
      const result = this.usersList.find(object => object.id === data.id)
      if(result){
        const info = result.info ? result.info : 'Kullanıcı Açıklaması Yok'
        return  info
      }
    },
    checkUserImage(data){
      const result = this.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    findUserName(data){
      const result = this.usersList.find(object => object.id === data.id)
      if(result){
        if(result.id !== this.user.id){
          const name = result.name ? result.name : result.email
          return  name
        }else if(result.id === this.user.id){
          const name = 'Siz'
          return name
        }
      }
    },
    findUserImage(data){
      const result = this.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    },
    marginOptions(){
      if(this.avatarActive === true){
        return '0% auto'
      }else{
        return '0% auto'
      }
    },
    widthOptions(){
      if(this.avatarActive === true){
        return '45%'
      }else{
        return '100%'
      }
    },
    getAllDiscussions(){
      const db = getDatabase()
      const dbRef = query(ref(db,`discussions`),orderByChild('date','desc'))
      onValue(dbRef,(snapshot) => {
        this.allDiscussionsList = []
        snapshot.forEach((childSnapshot) => {
          this.allDiscussionsList.push(childSnapshot.val())
        })
        this.pureListDiscussions = this.allDiscussionsList
        console.log('allDiscussionsList',this.allDiscussionsList)
      })
    },
    getMySavedOldEvents(){
      const db = getDatabase()
      const dbRef = ref(db,`mySavedOldEvents/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.savedOldEventList = []
        snapshot.forEach((childSnapshot) => {
          this.savedOldEventList.push(childSnapshot.val())
        })
        console.log('savedOldEventList',this.savedOldEventList)
      })
    },
    getMySavedGroups(){
      const db = getDatabase()
      const dbRef = ref(db,`mySavedGroups/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.savedGroupsList = []
        snapshot.forEach((childSnapshot) => {
          this.savedGroupsList.push(childSnapshot.val())
        })
        console.log('savedGroupsList',this.savedGroupsList)
      })
    },
    getMyInvitesList(){
      const db = getDatabase()
      const dbRef = ref(db,`invites/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.invitesList = []
        snapshot.forEach((childSnapshot) => {
          this.invitesList.push(childSnapshot.val())
        })
        console.log('invitesList',this.invitesList)
      })
    },
    getMyPointNotifies(){
      const db = getDatabase()
      const dbRef = ref(db,`pointNotify/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.myPointNotify = []
        snapshot.forEach((childSnapshot) => {
          this.myPointNotify.push(childSnapshot.val())
        })
        console.log('myPointNotify',this.myPointNotify)
      })
    },
    getActivityGroups(){
      const db = getDatabase()
      const dbRef = ref(db,`activityGroups/`)
      onValue(dbRef,(snapshot) => {
        this.activityGroupsList = []
        snapshot.forEach((childSnapshot) => {
          this.activityGroupsList.push(childSnapshot.val())
        })
        console.log('activityGroupsList',this.activityGroupsList)
      })
    },
    getMyFavList(){
      const db = getDatabase()
      const dbRef = ref(db,`myFavs/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.myFavList = []
        snapshot.forEach((childSnapshot) => {
          this.myFavList.push(childSnapshot.val())
        })
        console.log('myFavList',this.myFavList)
      })
    },
    getDontShowList(){
      const db = getDatabase()
      const dbRef = ref(db,`dontShowList/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.dontShowListAll = []
        snapshot.forEach((childSnapshot) => {
          this.dontShowListAll.push(childSnapshot.val())
        })
        console.log('dontShowListAll',this.dontShowListAll)
      })
    },
    getMyFriendList(){
      const db = getDatabase()
      const dbRef = ref(db,`myFriendsList/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.friendList = []
        snapshot.forEach((childSnapshot) => {
          this.friendList.push(childSnapshot.val())
        })
        console.log('friendList',this.friendList)
      })
    },
    getMyNotifyList(){
      const db = getDatabase()
      const dbRef = ref(db,`notifyList/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.notifyList = []
        snapshot.forEach((childSnapshot) => {
          this.notifyList.push(childSnapshot.val())
        })
        console.log('notifyList',this.notifyList)
      })
    },
    getMyBlocks(){
      const db = getDatabase()
      const dbRef = ref(db,`myBlocks/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.blockList = []
        snapshot.forEach((childSnapshot) =>{
          this.blockList.push(childSnapshot.val())
        })
        console.log('blockList',this.blockList)
      })
    },
    currentDateString(){
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const second = now.getSeconds().toString().padStart(2, '0');
      const currentDate = `${day}-${month}-${year} ${hour}:${minute}:${second}`;
      return currentDate
    },
    getMyAcc(){
      const db = getDatabase();
      const dbRef = ref(db, `users/${this.user.id}`);
      onValue(dbRef, (snapshot) => {
        this.userAllInfo = snapshot.val();
        console.log('userAllInfo',this.userAllInfo)
      });
    },
    getUsers(){
      const db = getDatabase();
      const dbRef = ref(db, 'users');
      onValue(dbRef, (snapshot) => {
        this.usersList = []
        this.secondUserList = []
        snapshot.forEach((childSnapshot) => {
          this.usersList.push(childSnapshot.val())
          this.secondUserList.push(childSnapshot.val())
          console.log('usersList',this.usersList)
        });
      });
    },
    getOnlyKeyChats(){
      const db = getDatabase();
      const dbRef = ref(db, `chats/${this.user.id}`);
      onValue(dbRef, (snapshot) => {
        this.onlyKeys = snapshot.val();
        console.log('onlyKeys',this.onlyKeys)
      });
    },
    getMyChats(){
      const db = getDatabase()
      const dbRef = ref(db,`chats/${this.user.id}`)
      onValue(dbRef,(snapshot) => {
        this.chatKeys = []
        const list = []
        snapshot.forEach((childSnapshot)=>{
          this.chatKeys.push(childSnapshot.val())
          list.push(childSnapshot.key)
        })
        console.log('chats',this.chatKeys,this.user.id)
        this.newOnlyKeyList = list
        console.log('keys',this.newOnlyKeyList)
      })
    }
  },
});
