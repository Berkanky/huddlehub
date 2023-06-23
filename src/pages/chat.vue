<template>
    <div class="WAL position-relative" :style="style"
    >
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container >
      <q-header elevated class="" >
        <q-toolbar class="bg-grey-3 text-black" v-if="this.store.selectedGroupChat.id">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            v-on:click="toggleLeftDrawer"
          ></q-btn>
          <q-btn round flat>
            <q-avatar>
              <img :src="this.store.selectedGroupChat.image" alt="" v-if="this.store.selectedGroupChat.image">
              <q-btn icon="person" round color="dark" v-if="!this.store.selectedGroupChat.image"></q-btn>
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md" v-if="this.avatarActive">
            {{ this.store.selectedGroupChat.groupName ? this.store.selectedGroupChat.groupName : 'Grup Adı Yok' }}
          </span>
          <q-space></q-space>
          <q-btn
            color="dark"
            round  icon="search" flat/>
            <upload @currentImageData="getcurrentImageData"/>
          <q-btn color="red" flat icon="delete_forever" v-if="this.selectedMessages.length"  v-on:click="clearSelectedChatInGroupChat">
            <q-badge color="red" floating>{{ this.selectedMessages.length }}</q-badge>
          </q-btn>
          <q-btn round flat icon="more_vert" v-if="!this.selectedMessages.length">
            <q-menu auto-close>
              <q-list>
                <q-item clickable v-on:click="showGroupChatDetail">
                  <q-item-section>Show Details</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black" v-if="this.showDetailsActive&&this.store.galleryActive&&!this.store.selectedGroupChat.id">
          <q-btn icon="keyboard_backspace" flat color="dark" v-if="this.store.avatarActive" v-on:click="this.store.galleryActive=false"></q-btn>
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            v-on:click="this.store.galleryActive = false"
          ></q-btn>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black" v-if="this.showDetailsActive&&!this.store.galleryActive&&!this.store.selectedGroupChat.id">
          <q-btn icon="keyboard_backspace" color="dark" flat v-if="this.showDetailsActive&&this.store.avatarActive" v-on:click="this.showDetailsActive = false"></q-btn>
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            v-on:click="this.showDetailsActive = false"
          ></q-btn>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black" v-if="!this.showDetailsActive&&this.store.selectedGroupForChat.id&&!this.store.selectedGroupChat.id">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            v-on:click="toggleLeftDrawer"
            v-if="!this.store.selectedGroupForDetail.id"
          ></q-btn>
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            v-on:click="this.store.selectedGroupForDetail = {}"
            v-if="this.store.selectedGroupForDetail.id"
          ></q-btn>
          <q-btn
            icon="keyboard_backspace"
            flat color="dark"
            v-if="this.store.selectedGroupForDetail.id&&this.store.avatarActive" v-on:Click="this.store.selectedGroupForDetail = {}"></q-btn>
          <q-btn round flat v-if="!this.store.selectedGroupForDetail.id">
            <q-avatar>
              <img :src="this.store.selectedGroupForChat.image" alt="" v-if="this.store.selectedGroupForChat.image">
              <q-btn icon="person" round color="dark" v-if="!this.store.selectedGroupForChat.image"></q-btn>
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md" v-if="this.avatarActive&&!this.store.selectedGroupForDetail.id">
            {{ this.store.selectedGroupForChat.name ? this.store.selectedGroupForChat.name : this.store.selectedGroupForChat.optionName }}
          </span>
          <q-space></q-space>
          <q-btn
            v-if="!this.store.selectedGroupForDetail.id"
            color="dark"
            round :flat="this.searchMessageActive ? false : true" icon="search"
            v-on:click="this.searchMessageActive=!this.searchMessageActive"/>
          <div v-if="!this.store.selectedGroupForDetail.id">
            <upload @currentImageData="getcurrentImageData"/>
          </div>
          <q-btn color="red" flat icon="delete_forever" v-if="this.groupChatsForDelete.length" v-on:click="clearSelectedGroupChats">
            <q-badge color="red" floating>{{ this.groupChatsForDelete.length }}</q-badge>
          </q-btn>
          <q-btn round flat icon="more_vert" v-if="!this.groupChatsForDelete.length&&!this.store.selectedGroupForDetail.id">
            <q-menu auto-close>
              <q-list>
                <q-item clickable v-on:click="showGroupDetail" v-if="!this.store.selectedGroupForDetail.id">
                  <q-item-section>Show Details</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black" v-if="!this.showDetailsActive&&!this.store.selectedGroupForChat.id&&!this.store.selectedGroupChat.id">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="toggleLeftDrawer"
          />
          <q-btn round flat v-on:Click="selectImage">
            <q-avatar>
              <img v-if="checkSelectedUserImage()" :src="getSelectedUserImage()">
              <q-btn icon="person" round color="dark" v-if="!this.selectedUser.image"></q-btn>
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md" v-if="this.avatarActive">
            {{ this.selectedUser.name ? this.selectedUser.name : this.selectedUser.email }}
          </span>
          <q-btn icon="fiber_manual_record" flat size="xs" :color="checkSelectedUserActiveStatus() ? 'green' : 'red'"></q-btn>
            <q-space></q-space>
          <q-btn
            color="dark"
            round :flat="this.searchMessageActive ? false : true" icon="search"
            v-on:click="this.searchMessageActive=!this.searchMessageActive"/>
          <q-btn round flat>
            <!-- <q-icon name="attachment" class="rotate-135" /> -->
            <upload @currentImageData="getcurrentImageData"/>
          </q-btn>
          <q-btn round flat icon="more_vert" v-if="!this.selectedMessages.length">
            <q-menu auto-close>
              <q-list>
                <q-item clickable v-on:click="blockUser">
                  <q-item-section>{{checkForBloke() ? 'Remove Block' : 'Block'}}</q-item-section>
                </q-item>
                <q-item clickable v-on:Click="deleteMessages">
                  <q-item-section>Clear messages</q-item-section>
                </q-item>
                <q-item clickable v-on:click="showMoreDetail">
                  <q-item-section>Show Details</q-item-section>
                </q-item>
                <q-item clickable v-on:click="deleteAllDeletedMessages" v-if="checkDeletedMessage()">
                  <q-item-section>Delete All Deleted Messages</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat icon="delete" color="red" v-if="this.selectedMessages.length" v-on:click="deleteSelectedMessages">
            <q-badge color="red" floating>{{ this.selectedMessages.length }}</q-badge>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="this.leftActive"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-btn icon="keyboard_backspace" flat color=" dark" v-on:click="gobackPage"></q-btn>
          <q-space />
          <q-btn round  color="primary" icon="notifications" v-on:click="showNotifies" size="sm">
            <q-badge :color="this.store.notifyList.length ? 'red' : 'transparent'" rounded floating />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable v-on:click="showMyProfile">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable v-on:click="showNotifies">
                  <q-item-section>Notifies</q-item-section>
                </q-item>
                <q-item clickable v-on:click="friendList">
                  <q-item-section>Friend List</q-item-section>
                </q-item>
                <q-item clickable v-on:click="goProfile">
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable v-on:click="logoutButton">
                  <q-item-section>Logout</q-item-section>
                </q-item>
                <q-item clickable v-on:click="createChatGroupButton">
                  <q-item-section>Create Group</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="toggleLeftDrawer"
          />
        </q-toolbar>

        <q-toolbar class="bg-grey-2">
          <q-input rounded outlined dense class="WAL__field full-width" bg-color="white" v-model="this.searchValue" placeholder="Search or start a new conversation" v-on:keyup="findUser">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>
        <q-scroll-area style="height: calc(100% - 100px)" >
          <q-list class="">
            <!-- alta v-for ve key -->
            <q-btn icon="history" no-caps label="Last Chats" flat color="grey-7" class="q-pa-md" v-if="!this.searchValue&&this.myChats.length"></q-btn>
            <q-item
              v-if="!this.searchValue"
              v-for="data in this.myChats"
              :key="data.id"
              clickable
              v-ripple
              :style="{'background-color':changeSelectedStyle(data)}"
            >
              <q-item-section avatar>
                <q-avatar v-on:Click="selectUser(data)">
                  <img v-if="checkUserImage(data)" :src="getUserImage(data)" style="object-fit:cover;">
                  <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section v-on:Click="selectUser(data)">
                <q-item-label lines="1">
                  {{ getName(data)}}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <q-btn
                    icon-right="fiber_manual_record" no-caps :label="checkActiveUser(data) ? 'Online' : 'Offline'"
                    size="sm" flat :color="checkActiveUser(data) ? 'green' : 'red'"></q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-fab flat text-color="dark" icon="keyboard_arrow_left" direction="left" padding="5px">
<!--                   <q-fab-action
                    :disable="checkFriendFor(data) ? true : false"
                    color="primary" text-color="white" @click="addFriend(data)"
                    icon="person_add"/> -->
                </q-fab>
              </q-item-section>
            </q-item>
            <q-item
              v-if="this.searchValue"
              v-for="(data,key) in this.findedUsers"
              :key="key"
              clickable
              v-ripple
              v-on:Click="selectUser(data)"
              :style="{'background-color':changeSelectedStyle(data)}"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img v-if="checkUserImage(data)" :src="getUserImage(data)">
                  <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  {{ data.name ? data.name : data.email }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
            <q-btn icon-right="groups" no-caps label="Friends" flat color="grey-7" class="q-pa-md" v-if="!this.searchValue&&this.store.friendList.length&&this.store.friendListActive"></q-btn>
            <q-item
              v-if="!this.searchValue&&this.store.friendList.length&&this.store.friendListActive"
              v-for="(data) in this.store.friendList"
              :key="data.id"
              clickable
              v-ripple
              v-on:Click="selectUser(data)"
              :style="{'background-color':changeSelectedStyle(data)}"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img v-if="checkUserImage(data)" :src="getUserImage(data)" style="object-fit:cover;">
                  <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  {{ data.name ? data.name : data.email }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <q-btn
                    icon-right="fiber_manual_record" no-caps :label="checkActiveUser(data) ? 'Online' : 'Offline'"
                    size="sm" flat :color="checkActiveUser(data) ? 'green' : 'red'"></q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-fab flat text-color="black" icon="keyboard_arrow_left" direction="left" padding="5px">
                  <!-- <q-fab-action color="red" text-color="white" @click="removeFromMyFrienList(data)" icon="remove"/> -->
                </q-fab>
              </q-item-section>
            </q-item>
            <q-btn icon="group" label="Group Chats" v-if="this.groupChatListLocal.length" no-caps flat color="grey-7" class="q-pa-md"></q-btn>
            <q-item
              v-for="data in this.groupChatListLocal" :key="data.id" clickable v-ripple
              v-if="this.groupChatListLocal.length">
              <q-item-section avatar>
                <q-avatar>
                  <img v-if="data.image" :src="data.image" style="object-fit:Cover;">
                  <q-btn icon="group" round color="dark" v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  <q-icon :name="data.icon" :color="data.color" size="20px"></q-icon>
                  {{ data.groupName ? data.groupName : 'Grup Adı Yok' }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  {{ data.groupExplain ? data.groupExplain : 'Grup Açıklaması Yok' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="login" flat color="blue" v-on:click="goGroupChat(data)"></q-btn>
              </q-item-section>
              </q-item>
            <q-btn icon="groups" flat color="grey-7" class="q-pa-md" no-caps label="Groups" v-if="this.myActivityGroups.length"></q-btn>
            <q-item
              :class="checkColorForSelectedGroup(data)"
              v-for="data in this.myActivityGroups" :key="data.id" clickable v-ripple
              v-if="this.myActivityGroups.length">
              <q-item-section avatar>
                <q-avatar>
                  <img v-if="data.image" :src="data.image" style="object-fit:Cover;">
                  <q-btn icon="person" round color="dark" v-if="!data.image"></q-btn>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  <q-icon :name="data.icon" :color="data.color" size="20px"></q-icon>
                  {{ data.name }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  {{ data.optionName }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                </q-item-label>
                <q-btn icon="login" flat color="blue" v-on:click="goChatGroup(data)"></q-btn>
              </q-item-section>
              </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container
        :style="{'height':this.store.selectedGroupChatChat.length ? '100%' : this.$q.screen.height + 'px'}"
        class="" style="background:linear-gradient(to right,#ece9e6, #ffffff);" v-if="this.store.selectedGroupChat.id"
      >
      <q-intersection
          v-if="this.store.selectedGroupChatChat.length"
          v-for="(data,index) in this.store.selectedGroupChatChat"
          :key="index"
          once
          transition="scale"
        >
        <q-chat-message
          class="q-pa-md"
          :stamp="data.fullDate"
          :text-color="data.senderId === this.store.user.id ? 'dark' : 'white'"
          :sent="data.senderId === this.store.user.id ? true : false"
          :bg-color="data.senderId === this.store.user.id ? 'grey-3' : 'light-green-6'"
        >
        <template v-slot:avatar v-if="this.avatarActive&&checkImage(data)">
          <img
            loading="lazy"
            spinner-color="white"
            class="q-message-avatar q-message-avatar--sent"
            :src="findAvatar(data)"
          >
        </template>
          <div style="display:block;" :style="{'opacity':checkSelectedMessagesStyle(data)}">
            <q-img
              v-on:click="zoomThisImage(data)"
              v-if="data.image" :src="data.image"
              style="border-radius:4px;width:250px;height:140px;object-fit:cover;"></q-img>
            <span
              v-on:click="selectMessage(data)"
              style="display:block;"><q-icon name="block" :color="data.senderId === this.store.user.id ? 'white' : 'white'"
              v-if="checkForDeleteMessage(data)" size="20px"></q-icon>  <span :style="{'color':checkForColor(data)}">{{ data.message }}</span></span>
          </div>
        </q-chat-message>
      </q-intersection>

      </q-page-container>

      <q-page-container
        :style="{'height':this.chats.length ? '100%' : this.$q.screen.height + 'px'}"
        class="" style=" background: linear-gradient(to right, #ece9e6, #ffffff);" v-if="!this.store.groupChatActive&&!this.store.selectedGroupChat.id">
        <galleryVue v-if="this.store.galleryActive" :imagesList="this.imagesList"/>
        <moreDetailVue
          v-if="this.showDetailsActive&&!this.store.galleryActive"
          :selectedUser="this.selectedUser" :imagesList="this.imagesList"/>
        <q-intersection
          v-for="(data,index) in this.chats"
          :key="index"
          once
          transition="scale"
        >
        <q-chat-message
          v-if="!this.showDetailsActive&&!this.store.galleryActive"
          class="q-pa-md"
          :stamp="data.fullDate"
          :text-color="data.senderId === this.store.user.id ? 'dark' : 'white'"
          :sent="data.senderId === this.store.user.id ? true : false"
          :bg-color="data.senderId === this.store.user.id ? 'grey-3' : 'light-green-6'"
        >
        <template v-slot:avatar v-if="this.avatarActive&&checkImage(data)">
          <img
            loading="lazy"
            spinner-color="white"
            class="q-message-avatar q-message-avatar--sent"
            :src="findAvatar(data)"
          >
        </template>
          <div style="display:block;" :style="{'opacity':checkSelectedMessagesStyle(data)}">
            <q-img
              v-on:click="zoomThisImage(data)"
              v-if="data.image" :src="data.image"
              style="border-radius:4px;width:250px;height:140px;object-fit:cover;"></q-img>
            <span
              v-on:click="selectMessage(data)"
              style="display:block;"><q-icon name="block" :color="data.senderId === this.store.user.id ? 'white' : 'white'"
              v-if="checkForDeleteMessage(data)" size="20px"></q-icon>  <span :style="{'color':checkForColor(data)}">{{ data.message }}</span></span>
          </div>
        </q-chat-message>
      </q-intersection>
        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="!this.showDetailsActive&&!this.store.galleryActive">
          <q-btn
            label="Iptal" no-caps size="sm" push
            icon-right="remove" color="dark" v-on:click="removeAllSelecteds()"
            v-if="this.selectedMessages.length">
            </q-btn>
        </q-page-sticky>
      </q-page-container>
      <q-page-container
        :style="{'height':this.store.activityGroupChats.length ? '100%' : this.$q.screen.height + 'px'}"
        class="" style=" background: linear-gradient(to right, #ece9e6, #ffffff);" v-if="this.store.groupChatActive&&!this.store.selectedGroupChat.id">
        <selectedGroupDetail v-if="this.store.selectedGroupForDetail.id" @goChatUser="getgoChatUser"/>
        <q-intersection
          v-if="!this.store.selectedGroupForDetail.id"
          v-for="(data,index) in this.store.activityGroupChats"
          :key="index"
          once
          transition="scale"
          >
          <q-chat-message
            :style="{'opacity':checkGroupMessageStyle(data)}"
            class="q-pa-xs"
            :stamp="data.fullDate"
            :sent="data.senderId === this.store.user.id ? true : false"
            text-color="white"
            :bg-color="data.senderId === this.store.user.id ? 'blue-4' : 'green-4'"
          >
            <template v-slot:avatar v-if="checkImage(data)&&this.store.avatarActive">
              <img :src="findAvatar(data)" alt=""  class="q-message-avatar q-message-avatar--sent q-ma-xs">
            </template>
            <template v-slot:name v-if="!checkImage(data)">
              <span>{{ data.name }}</span>
            </template>
            <div class="display:block;" v-on:click="selectMessageForDelete(data)">
              <q-img
              loading="lazy"
              spinner-color="white"
              :src="data.image" alt="" v-if="data.image" style="width:100%;height:100px;display:block;object-fit:cover;"/>
              <span class="" >{{ data.message }}</span>
            </div>
          </q-chat-message>
        </q-intersection>
        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="this.groupChatsForDelete.length">
          <q-btn
            label="Iptal" no-caps size="sm" push
            icon-right="remove" color="dark" v-on:click="clearAllSelectedGroupChats()"
            >
            </q-btn>
        </q-page-sticky>
      </q-page-container>

      <q-footer v-if="!this.showDetailsActive&&!this.store.galleryActive&&!this.store.selectedGroupForDetail.id">
        <q-card-section v-if="this.selectedImage.image" class="bg-grey-2">
          <q-img style="border-radius:4px;" :src="this.selectedImage.image">
            <div class="absolute-top-right bg-transparent text-center">
              <q-btn icon="remove" color="grey-8" size="sm" v-on:click="this.selectedImage={}"></q-btn>
            </div>
          </q-img>
        </q-card-section>
        <q-toolbar class="bg-grey-3 text-black row" v-if="!this.store.selectedGroupForChat.id&&!this.store.selectedGroupChat.id">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" color="grey" v-if="!this.searchMessageActive"/>
          <q-input
            label="Aramak İstediğiniz Mesajı Giriniz"
            rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white"
            color="grey-6"
            v-if="this.searchMessageActive" v-on:keyup="searchMessage"
            v-model="this.searchMessageValue"></q-input>
          <q-input
            v-if="!this.searchMessageActive"
            color="grey-6"
            :label="checkForBlocke() ? 'Kullanıcı Sizi Engelledi !' : 'Type a message'"
            :disable=" checkForBlocke() || !checkFriendOrNotForPreventMessage() ? true : false"
            rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="this.message"
            v-on:keyup.enter="sendMessage">
              <template v-slot:append v-if="this.message">
                <q-btn icon="remove" round size="xs" color="grey-6" v-on:click="this.message =''"></q-btn>
              </template>
            </q-input>
          <q-btn round flat icon="send" v-on:click="sendMessage" color="grey-8" v-if="this.message"/>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black row" v-if="this.store.selectedGroupForChat.id&&!this.store.selectedGroupChat.id">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" color="grey" v-if="!this.searchMessageActive"/>
          <q-input
            color="grey-6"
            label="Mesaj Giriniz"
            rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="this.message"
            v-on:keyup.enter="sendMessageGroup">
              <template v-slot:append v-if="this.message">
                <q-btn icon="remove" round size="xs" color="grey-6" v-on:click="this.message =''"></q-btn>
              </template>
            </q-input>
          <q-btn round flat icon="send" v-on:click="sendMessageGroup" color="grey-8" v-if="this.message"/>
        </q-toolbar>
        <q-toolbar class="bg-grey-3 text-black row" v-if="this.store.selectedGroupChat.id&&!this.store.selectedGroupForChat.id">
          <q-input
            color="grey-6"
            label="Mesaj Giriniz"
            rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="this.message"
            v-on:keyup.enter="sendMessageToGroupChat">
              <template v-slot:append v-if="this.message">
                <q-btn icon="remove" round size="xs" color="grey-6" v-on:click="this.message =''"></q-btn>
              </template>
            </q-input>
          <q-btn round flat icon="send" v-on:click="sendMessageToGroupChat" color="grey-8" v-if="this.message"/>
        </q-toolbar>
      </q-footer>
    </q-layout>
    <groupChatDetailCompVue v-if="this.store.showGroupChatDetailActive"/>
    <createChatGroup v-if="this.store.createChatGroupActive"/>
    <notifyComp v-if="this.store.notifyListActive"/>
    <zoomProfilePictureVue v-if="this.store.selectedUserZoomActive" :selectedUser="this.selectedUser"/>
    <q-dialog v-model="this.isActive" v-if="this.isActive">
      <q-card style="height:400px;width:100%;">
        <q-img style="width:100%;height:100%;" :src="this.selectedZoomImage.image">
          <div class="absolute-top-left bg-transparent">
            <q-btn icon="remove" color="dark" round v-on:click="this.isActive = false;this.selectedZoomImage = {}"></q-btn>
          </div>
        </q-img>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import groupChatDetailCompVue from '../components/groupChatDetailComp.vue'
import createChatGroup from 'src/components/createChatGroup.vue'
import selectedGroupDetail from 'src/components/selectedGroupDetail.vue';
import galleryVue from '../components/gallery.vue'
import notifyComp from 'src/components/notifyComp.vue';
import moreDetailVue from '../components/moreDetail.vue'
import zoomProfilePictureVue from '../components/zoomProfilePicture.vue'
import upload from '../components/upload.vue'
import { v4 as uuidv4 } from 'uuid';
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import image from '../images/applogo.png'
import {auth} from '../firebase/index'
import {db} from '../firebase/index'
import { getAuth, signOut ,createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, sendPasswordResetEmail} from "firebase/auth";
import { getDatabase, ref, set, onValue, update, query, orderByChild, remove } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    galleryVue,
    notifyComp,
    groupChatDetailCompVue,
    moreDetailVue,
    zoomProfilePictureVue,
    selectedGroupDetail,
    upload,
    createChatGroup
  },
  setup(){
    const $q = useQuasar()
    const style = computed(() => ({
      height: $q.screen.height + 'px'
    }))
    const store = useCounterStore()
    return{
      store,
      image,
      style
    }
  },
  data:function(){
    return{
      showDetailsActive:false,
      selectedUserBlockList:[],
      imagesList:[],
      selectedMessages:[],
      rightActive:false,
      selectedImage:{},
      leftActive:false,
      searchValue:'',
      message:'',
      selectedUser:{},
      randomId:'',
      groupChatListLocal:[],
      chats:[],
      myChats:[],
      findedUsers:[],
      searchMessageValue:'',
      searchMessageActive:false,
      pureChatList:[],
      newHeight:0,
      uniqueChatListId:[],
      window:{
        width:0,
        height:0
      },
      avatarActive:false,
      isActive:false,
      selectedZoomImage:{},
      activityGroupsListLocal:[],
      myActivityGroups:[],
      groupChatsForDelete:[]
    }
  },
  methods:{
    showGroupChatDetail(){
      this.store.showGroupChatDetailActive = true
    },
    clearSelectedChatInGroupChat(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Seçili Mesajları Silmek İstediğinize Emin misiniz ?'
      }).onOk(()=>{
        this.selectedMessages.forEach(element => {
          const db = getDatabase()
          remove(ref(db,`groupChats/${this.store.selectedGroupChat.id}/chats/${element.messageId}`))
          this.selectedMessages = this.selectedMessages.filter(object => object.messageId !== element.messageId)
        });
      }).onCancel(()=>{
        //
      })
    },
    sendMessageToGroupChat(){
      if(this.message){
        const randomId = uuidv4()
        const db = getDatabase()
        set(ref(db,`groupChats/${this.store.selectedGroupChat.id}/chats/${randomId}`),{
          messageId:randomId,
          fullDate:this.store.currentDateString(),
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          email:this.store.user.email,
          senderId:this.store.user.id,
          date:Date.now(),
          image:this.selectedImage.image ? this.selectedImage.image : '',
          deleteStatus:false,
          message:this.message
        })
        this.message = ''
        this.selectedImage = {}
      }
    },
    checkMemberOfGroupChatOrNot(data){
      this.groupChatListLocal = []
      data.forEach(element => {
        console.log(element)
        if(element.members){
          let list = []
          for(const [key,value] of Object.entries(element.members)){
            const memberData = {
              id:`${value.id}`
            }
            const result = list.some(object => object.id === memberData.id)
            if(!result){
              list.push(memberData)
            }
          }
          console.log('list',list)
          const lastResult = list.some(object => object.id === this.store.user.id)
          if(lastResult){
            this.groupChatListLocal.push(element)
          }
        }
      });
      console.log('groupChatListLocal',this.groupChatListLocal)
    },
    goGroupChat(data){
      this.showDetailsActive = false
      this.store.selectedGroupForChat = {}
      this.selectedUser = {}
      this.store.selectedGroupChat = data
    },
    createChatGroupButton(){
      this.store.createChatGroupActive = true
    },
    getgoChatUser(value){
      if(value){
        console.log(value)
        const data = value
        this.selectUser(data)
        setTimeout(() => {
          this.selectUser(data)
        },150)
      }
    },
    clearAllSelectedGroupChats(){
      this.groupChatsForDelete = []
    },
    clearSelectedGroupChats(){
      this.groupChatsForDelete.forEach(element => {
        const db = getDatabase()
        remove(ref(db,`activityGroups/${this.store.selectedGroupForChat.id}/chats/${element.messageId}`))
        this.groupChatsForDelete = this.groupChatsForDelete.filter(object => object.messageId !== element.messageId)
      });
    },
    checkGroupMessageStyle(data){
      const result = this.groupChatsForDelete.find(object => object.messageId === data.messageId)
      if(result){
        return '0.5'
      }else{
        return '1'
      }
    },
    selectMessageForDelete(data){
      if(data.senderId === this.store.user.id){
        const result = this.groupChatsForDelete.find(object => object.messageId === data.messageId)
        if(result){
          this.groupChatsForDelete = this.groupChatsForDelete.filter(object => object.messageId !== result.messageId)
        }else{
          this.groupChatsForDelete.push(data)
        }
        console.log(this.groupChatsForDelete)
      }
    },
    showGroupDetail(){
      this.store.selectedGroupForDetail = this.store.selectedGroupForChat
      console.log(this.store.selectedGroupForDetail)
    },
    sendMessageGroup(){
      if(this.message){
        const randomId = uuidv4()
        const db = getDatabase()
        set(ref(db,`activityGroups/${this.store.selectedGroupForChat.id}/chats/${randomId}`),{
          messageId:randomId,
          fullDate:this.store.currentDateString(),
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          email:this.store.user.email,
          senderId:this.store.user.id,
          date:Date.now(),
          image:this.selectedImage.image ? this.selectedImage.image : '',
          deleteStatus:false,
          message:this.message
        })
        this.message = ''
        this.selectedImage = {}
      }
    },
    checkColorForSelectedGroup(data){
      if(this.store.selectedGroupForChat.id){
        if(this.store.selectedGroupForChat.id === data.id){
          return 'bg-grey-4'
        }else{
          return 'bg-white'
        }
      }else{
        return 'bg-white'
      }
    },
    getGroupChat(){
      if(this.store.selectedGroupForChat.chats){
        const db = getDatabase();
        const dbRef = query(ref(db, `activityGroups/${this.store.selectedGroupForChat.id}/chats`),orderByChild('date','desc'))
        onValue(dbRef, (snapshot) => {
          this.store.activityGroupChats = []
          snapshot.forEach((childSnapshot) => {
            this.store.activityGroupChats.push(childSnapshot.val())
          });
          console.log('activityGroupChats',this.store.activityGroupChats)
        });
      }else{
        this.store.activityGroupChats = []
        console.log('noChat')
      }
    },
    goChatGroup(data){
      this.store.selectedGroupChat = {}
      if(this.store.selectedGroupForDetail.id){
        this.store.selectedGroupForDetail = {}
      }
      if(this.selectedUser.id){
        this.selectedUser = {}
      }
      if(!this.store.avatarActive){
        this.leftActive = false
      }
      this.showDetailsActive = false
      this.store.groupChatActive = true
      this.store.selectedGroupForChat = data
      this.getGroupChat()
      console.log(this.store.selectedGroupForChat)
    },
    showMyProfile(){
      this.selectedMessages = []
      const result = this.store.usersList.find(object => object.id ===  this.store.user.id)
      if(result){
        this.selectedUser = result
      }
      console.log(this.selectedUser)
      this.getChats()
      this.getSelectedUserBlock()
      this.showDetailsActive = true
      this.store.galleryActive = false
      if(!this.avatarActive){
        this.leftActive = false
      }
    },
    updateWhenLogin(){
      const db = getDatabase()
      update(ref(db,`users/${this.store.user.id}`),{
        online:false
      })
    },
    logoutFirebaseFunc(){
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$router.replace({path:'/login'})
        this.updateWhenLogin()
        this.store.user = {}
        this.$q.notify({
          type:'negative',
          message:'Logout Done Successfully !',
          timeout:700,
          position:'top'
        })
      }).catch((error) => {
        // An error happened.
      });
    },
    logoutButton(){
      this.logoutFirebaseFunc()
    },
    checkDeletedMessage(){
      const result = this.chats.find(object => object.deleteStatus === true && object.senderId === this.store.user.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkSelectedUserActiveStatus(){
      const result = this.store.usersList.find(object => object.id === this.selectedUser.id)
      if(result){
        if(result.online){
          return true
        }else{
          return false
        }
      }
    },
    deleteAllDeletedMessages(){
      this.chats.forEach(element => {
        if(element.senderId === this.store.user.id && element.deleteStatus){
          const db = getDatabase()
          remove(ref(db,`chats/${this.store.user.id}/${this.selectedUser.id}/${element.messageId}`))
         // remove(ref(db,`chats/${this.selectedUser.id}/${this.store.user.id}/${element.messageId}`))
          this.chats = this.chats.filter(object => object.messageId !== element.messageId)
        }
      })
    },
    checkFriendOrNotForPreventMessage(){
      const result = this.store.friendList.find(object => object.id === this.selectedUser.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    goProfile(){
      this.store.selectedOption = 'myProfile'
      this.$router.push({path:'/profile'})
    },
    zoomThisImage(data){
      this.isActive = true
      this.selectedZoomImage = data
    },
    checkActiveUser(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.online){
          return true
        }else{
          return false
        }
      }
    },
    checkSelectedUserImage(){
      const result = this.store.usersList.find(object => object.id === this.selectedUser.id)
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
    checkUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
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
    getSelectedUserImage(){
      if(this.selectedUser.id){
        const result = this.store.usersList.find(object => object.id === this.selectedUser.id)
        if(result){
          if(result.image){
            const image = result.image
            return image
          }
        }
      }
    },
    getUserImage(data){
      const result = this.store.usersList.find(object => object.id === data.id)
      if(result){
        if(result.image){
          const image = result.image
          return image
        }
      }
    },
    removeFromMyFrienList(data){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`${data.name ? data.name : data.email} Kişisini Silmek İstediğinizden Emin misiniz ?`,
        cancel:true
      }).onOk(() => {
        const db = getDatabase()
        remove(ref(db,`myFriendsList/${this.store.user.id}/${data.id}`))
        this.store.friendList = this.store.friendList.filter(object => object.id !== data.id)
      })
    },
    showNotifies(){
      this.store.notifyListActive =! this.store.notifyListActive
    },
    checkFriendFor(data){
      const result = this.store.friendList.find(object => object.id === data.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    sendOtherUserNotifies(data){
      const db = getDatabase()
      set(ref(db,`notifyList/${data.id}/${this.store.user.id}`),{
          id:this.store.user.id,
          email:this.store.user.email,
          sender:this.store.user.id,
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : '',
          image:this.store.userAllInfo.image ? this.store.userAllInfo.image : '',
          date:this.store.currentDateString(),
          requestType:'friend'
        })
    },
    addFriend(data){
      const db = getDatabase()
        set(ref(db,`notifyList/${this.store.user.id}/${data.id}`),{
          id:data.id,
          email:data.email,
          sender:this.store.user.id,
          name:data.name ? data.name : '',
          image:data.image ? data.image : '',
          date:this.store.currentDateString(),
          requestType:'friend'
        })
        this.sendOtherUserNotifies(data)
    },
    friendList(){
      this.store.friendListActive =! this.store.friendListActive
    },
    showMoreDetail(){
      this.showDetailsActive = true
      this.getImages()
    },
    checkForColor(data){
      if(data.deleteStatus){
        if(data.senderId === this.store.user.id){
          return '#ffffff'
        }else{
          return '#ffffff'
        }
      }else{
        return 'dark'
      }
    },
    checkForDeleteMessage(data){
      if(data.deleteStatus){
        return true
      }else{
        return false
      }
    },
    removeAllSelecteds(){
      this.selectedMessages = []
    },
    selectImage(){
      this.store.selectedUserZoomActive = true
    },
    checkForBlocke(){
      const result = this.selectedUserBlockList.find(object => object.id === this.store.user.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    getSelectedUserBlock(){
      const db = getDatabase()
      const dbRef = ref(db,`myBlocks/${this.selectedUser.id}`)
      onValue(dbRef,(snapshot) => {
        this.selectedUserBlockList = []
        snapshot.forEach((childSnapshot) => {
          this.selectedUserBlockList.push(childSnapshot.val())
        })
        console.log('selectedUserBlockList',this.selectedUserBlockList)
      })
    },
    checkForBloke(){
      //this.store.getMyBlocks()
      const result = this.store.blockList.find(object => object.id === this.selectedUser.id)
      if(result){
        return true
      }else{
        return false
      }
    },
    blockUser(){
      //this.store.getMyBlocks()
      const result = this.store.blockList.find(object => object.id === this.selectedUser.id)
      if(result){
        const db = getDatabase()
        remove(ref(db,`myBlocks/${this.store.user.id}/${this.selectedUser.id}`))
        this.store.blockList = this.store.blockList.filter(object=>object.id !== this.selectedUser.id)
        this.$q.notify({
          type:'positive',
          message:'Bloke Kaldırıldı',
          timeout:700
        })
      }else{
        const db = getDatabase()
        set(ref(db,`myBlocks/${this.store.user.id}/${this.selectedUser.id}`),{
          id:this.selectedUser.id,
          name:this.selectedUser.name ? this.selectedUser.name : this.selectedUser.email
        })
        this.$q.notify({
          type:'negative',
          message:`${this.selectedUser.name ? this.selectedUser.name : this.selectedUser.email} Adlı Kullanıcı Bloke Edildi !`,
          timeout:700
        })
      }
    },
    getImages(){
      this.imagesList = []
      this.chats.forEach(element => {
        const result = this.imagesList.find(object => object.messageId === element.messageId)
        if(!result&&element.image){
          this.imagesList.push(element)
        }
      })
      console.log('imageList',this.imagesList)
    },
    checkSelectedMessagesStyle(data){
      const result = this.selectedMessages.find(object => object.messageId === data.messageId)
      if(result){
        return '0.5'
      }else{
        return '1'
      }
    },
    selectMessage(data){
      if(data.senderId === this.store.user.id && !data.deleteStatus){
        const result = this.selectedMessages.find(object => object.messageId === data.messageId)
        if(result){
          this.selectedMessages = this.selectedMessages.filter(object => object.messageId !== data.messageId)
        }else{
          this.selectedMessages.push(data)
        }
      }
      console.log(this.selectedMessages)
    },
    gobackPage(){
      // this.$router.push({path:'/'})
      history.back()
    },
    goDown(){
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    },
    checkImage(data){
      const result = this.store.usersList.find(object => object.id === data.senderId)
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
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
    getcurrentImageData(data){
      if(data){
        this.selectedImage = data
        console.log('selectedImage',this.selectedImage)
      }
    },
    searchMessage(){
      if(this.searchMessageValue){
        const result = this.chats.find(object => (object.message.toLowerCase().includes(this.searchMessageValue.toLowerCase())))
        if(result){
          this.chats = this.chats.filter(object => object.message === result.message)
        }
      }else{
        this.chats = this.pureChatList
      }
    },
    getName(data){
      if(data.id === this.store.user.id){
        const name = 'Ben'
        return name
      }else{
        const name = data.name ? data.name : data.email
        return name
      }
    },
    findUser(){
      const myChatList = this.myChats
      const pureList = this.store.usersList
      this.findedUsers = []
      if(this.searchValue){
        //const result = this.chats.filter(object => (object.message.toLowerCase()).includes(this.messageValue.toLowerCase())).shift()
        if(this.store.usersList.length){
          const result = this.store.usersList.find(object => (object.email.toLowerCase()).includes(this.searchValue.toLowerCase()))
          if(result){
            this.findedUsers.push(result)
          }
        }
        console.log('findedUsers',this.findedUsers)
      }else{
        this.store.usersList = pureList
        this.myChats = myChatList
        console.log('userList',this.store.usersList)
      }
    },
    deleteFromSelectedUserMessage(element){
      const db = getDatabase()
      update(ref(db,`chats/${this.selectedUser.id}/${this.store.user.id}/${element.messageId}`),{
        message:'Mesaj Silindi',
        deleteStatus:true,
        image:element.image ? '' : ''
      })
      this.selectedMessages = this.selectedMessages.filter(object => object.messageId !== element.messageId)
    },
    deleteSelectedMessages(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        cancel:true,
        message:`Seçili Mesajları Silmek İstediğinizden Emin misiniz ?`
      }).onOk(() => {
        console.log(this.selectedMessages)
        this.selectedMessages.forEach(element => {
          const db = getDatabase()
          update(ref(db,`chats/${this.store.user.id}/${this.selectedUser.id}/${element.messageId}`),{
            message:'Mesaj Silindi',
            image:element.image ?  '' : '',
            deleteStatus:true
          })
          this.deleteFromSelectedUserMessage(element)
        });
      })
    },
    deleteMessages(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warnnig',
        message:`${this.selectedUser.name} İle Olan Mesajları Silmek İstediğinize Emin misiniz ?`
      }).onOk(() =>{
        const db = getDatabase()
        remove(ref(db,`chats/${this.store.user.id}/${this.selectedUser.id}`))
        this.myChats = this.myChats.filter(object => object.id !== this.selectedUser.id)
      })
    },
/*     filterForChatList(){
      this.myChats = []
      this.store.usersList.forEach(element => {
        const result = this.uniqueChatListId.find(object => object.id === element.id)
        if(result){
          this.myChats.push(element)
        }
      });
      console.log(this.myChats)
    }, */
    changeSelectedStyle(data){
      if(this.selectedUser.id){
        if(data.id === this.selectedUser.id){
        return 'lightgrey'
        }else{
          return 'white'
        }
      }else{
        return 'white'
      }
    },
    getChats(){
      const db = getDatabase()
      const dbRef = query(ref(db,`chats/${this.store.user.id}/${this.selectedUser.id}`),orderByChild('date','desc'))
      onValue(dbRef,(snapshot) => {
        this.chats = []
        snapshot.forEach((childSnapshot) => {
          this.chats.push(childSnapshot.val())
        })
        //this.myChats = this.chats
        this.pureChatList = this.chats
        this.getImages()
        console.log('chats',this.chats)
      })
    },
    sendToOtherUser(){
      const db = getDatabase()
      set(ref(db,`chats/${this.selectedUser.id}/${this.store.user.id}/${this.randomId}`),{
          messageId:this.randomId,
          date:Date.now(),
          fullDate:this.store.currentDateString(),
          message:this.message,
          senderId:this.store.user.id,
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : this.store.user.email,
          image:this.selectedImage.image ? this.selectedImage.image : '',
          deleteStatus:false
        })
        this.message = ''
        this.randomId = ''
        this.selectedImage = {}
    },
    sendMessage(){
      if(this.message){
        this.randomId = uuidv4()
        const db = getDatabase()
        set(ref(db,`chats/${this.store.user.id}/${this.selectedUser.id}/${this.randomId}`),{
          messageId:this.randomId,
          date:Date.now(),
          fullDate:this.store.currentDateString(),
          message:this.message,
          senderId:this.store.user.id,
          name:this.store.userAllInfo.name ? this.store.userAllInfo.name : this.store.user.email,
          image:this.selectedImage.image ? this.selectedImage.image : '',
          deleteStatus:false
        })
        this.sendToOtherUser()
      }else{
        this.$q.notify({
          type:'negative',
          position:'bottom',
          message:'Lütfen Mesaj Giriniz',
          timeout:600
        })
      }
    },
    selectUser(data){
      this.store.selectedGroupChat = {}
      this.store.groupChatActive = false;
      if (Object.keys(this.store.selectedGroupForChat).length > 0) {
        this.store.selectedGroupForChat = {};
      }
      if (Object.keys(this.store.selectedGroupForDetail).length > 0) {
        this.store.selectedGroupForDetail = {};
      }
      this.selectedMessages.length = 0;
      const result = this.store.usersList.find((object) => object.id === data.id);
      if (result) {
        this.selectedUser = result;
        console.log(this.selectedUser);
        this.getChats();
        this.getSelectedUserBlock();
        this.showDetailsActive = false;
        this.store.galleryActive = false;
        if(!this.store.avatarActive){
          this.leftActive = false;
        }
        console.log('finished',this.selectedUser)
      }
    },
    getAllUsers(){
      this.store.getUsers()
    },
    toggleLeftDrawer(){
      this.leftActive =! this.leftActive
    },
    findAvatar(data){
      if(this.store.usersList.length){
        const result = this.store.usersList.find(object => object.id === data.senderId)
        if(result){
          const image = result.image ? result.image : ''
          return image
        }
      }
    },
  /*   getChatKeys(){
      this.store.getMyChats()
    }, */
/*     filterChatKeys(){
      let senderList = []
      this.store.chatKeys.forEach(element => {
        console.log('eleeemen',element)
        for(const [key,value] of Object.entries(element)){
          const dataKey = {
            id:`${value.senderId}`
          }
          console.log('dataKey',dataKey)
          const result = senderList.find(object =>object.id === dataKey.id)
          if(!result){
            senderList.push(dataKey)
          }
        }
      })
      this.uniqueChatListId = senderList
      console.log('uniqueChatListId',this.uniqueChatListId)
    }, */
    filterActivityGroups(){
      if(this.activityGroupsListLocal.length){
        this.myActivityGroups = []
        this.activityGroupsListLocal.forEach(element => {
        //  console.log(element)
          if(element.members){
            const list = []
            for(const [key,value] of Object.entries(element.members)){
              const memberData = {
                id:`${value.id}`,
                date:`${value.date}`,
                email:`${value.email}`,
                name:`${value.name}`
              }
              list.push(memberData)
            }
            console.log('list',list)
            const result = list.find(object => object.id === this.store.user.id)
            if(result){
              this.myActivityGroups.push(element)
            }
          }
        });
        console.log('myActivityGroups',this.myActivityGroups)
      }
    },
    selectedGroupDetail(){
      if(this.store.selectedGroupForChat.id){
        const db = getDatabase()
        const dbRef = ref(db,`activityGroups/${this.store.selectedGroupForChat.id}`)
        onValue(dbRef,(snapshot) => {
          this.store.selectedGroupForChat = snapshot.val()
          console.log('storeselectedGroup',this.store.selectedGroupForChat)
          this.getGroupChat()
        })
      }
    },
    watchRouteParams(){
      this.$watch(
        () => this.$route.params,
        (params) => {
          this.store.selectedGroupForChat = params.selectedGroupForChat
          console.log('params',this.store.selectedGroupForChat)
        }
      );
    },
    getHistoryChat(data){
      if(data.length){
        this.myChats = []
        data.forEach(element => {
          const result = this.store.usersList.find(object => object.id === element)
          if(result){
            this.myChats.push(result)
          }
        });
      }else{
        this.myChats = []
      }
    }
  },
  beforeMount(){
    this.getAllUsers()
    this.store.getActivityGroups()
   // this.watchRouteParams()
  },
  created(){
    //this.store.getMyBlocks()
    //this.store.getMyFriendList()
    //this.store.getMyNotifyList()
    //this.getAllUsers()
    //this.getChats()
    //this.getChatKeys()
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.store.getGroupChatList()
  },
  mounted(){
    //this.getChatKeys()
    console.log(this.store.selectedGroupForChat,this.store.groupChatActive)
  },
  destroyed(){
    window.removeEventListener('resize', this.handleResize);
  },
  updated(){
   // this.getChats()
   //this.checkForBloke()
  },
  watch:{
    'store.selectedGroupChat':{
      handler(newValue,oldValue){
        if(newValue.id){
          if(newValue.chats){
            this.store.getGroupChatChats()
          }else{
            console.log('no Chat')
          }
        }
      }
    },
    'store.groupChatList':{
      handler(newValue,oldValue){
        if(newValue.length){
          const data = newValue
          console.log('yoooo',data)
          this.checkMemberOfGroupChatOrNot(data)
        }
      },
      immediate:true,
      deep:true
    },
    'store.fromProfileSUActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          setTimeout(() => {
            console.log('clicked')
            this.showMoreDetail()
          },50)
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedGroupForChat':{
      handler(newValue,oldValue){
        if(newValue.id){
          const data = newValue
          if(data){
            setTimeout(() => {
              this.goChatGroup(data)
              setTimeout(() =>{
                this.goChatGroup(data)
              },30)
            },20)
          }
        }
      },
      immediate:true,
      deep:true
    },
    'store.activityGroupsList':{
      handler(newValue,oldValue){
        if(newValue.length){
          this.activityGroupsListLocal = newValue
          console.log('activityGroupsListLocal',this.activityGroupsListLocal)
          this.filterActivityGroups()
        }
      },
      immediate:true,
      deep:true
    },
    'store.user.id':{
      handler(newValue,oldValue){
        if(newValue){
        this.store.getMyBlocks()
        this.store.getMyFriendList()
        this.store.getMyNotifyList()
        this.getChats()
        //this.getChatKeys()
        this.store.getMyChats()
        }
      },
      immediate:true,
      deep:true
    },
    'store.selectedFav':{
      handler(newValue,oldValue){
        if(newValue){
          const data = newValue
          this.selectUser(data)
        }
      },
      immediate:true,
      deep:true
    },
/*     uniqueChatListId:{
      handler(newValue,oldValue){
        if(newValue){
          this.filterForChatList()
        }
      },
      immediate:true,
      deep:true
    }, */
    'store.newOnlyKeyList':{
      handler(newValue,oldValue){
        if(newValue){
          const data = newValue
           this.getHistoryChat(data)
        }
      },
      immediate:true,
      deep:true
    },
     'store.chatKeys':{
      handler(newValue,oldValue){
        if(newValue){
         // this.filterChatKeys()
        }
      },
      immediate:true,
      deep:true
    },
    window:{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.newHeight = 100
          this.avatarActive = false
          console.log('newHeight',this.newHeight)
        }else{
          this.newHeight = 80
          this.avatarActive = true
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  background: linear-gradient(to bottom right, #424242 50%, #2a66c7 50%)
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
