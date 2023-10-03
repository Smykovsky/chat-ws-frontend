<template>
  <div class="container">
    <div v-if="userData.connected" class="chat-box">
      <div class="member-list">
        <ul>
          <li @click="setTab('CHATROOM')" :class="{ active: tab === 'CHATROOM' }">Chatroom</li>
          <li
            @click="setTab(name)"
            :class="{ active: tab === name }"
            v-for="(name, index) in onlineUsers"
            :key="index"
          >{{ name }}</li>
        </ul>
      </div>
      <div v-if="tab === 'CHATROOM'" class="chat-content">
        <ul class="chat-messages">
          <li
            class="message"
            :class="{ self: chat.senderName === userData.username }"
            v-for="(chat, index) in publicChats"
            :key="index"
          >
            <div v-if="chat.senderName !== userData.username" class="avatar">{{ chat.senderName }}</div>
            <div class="message-data">{{ chat.message }}</div>
            <div v-if="chat.senderName === userData.username" class="avatar self">{{ chat.senderName }}</div>
          </li>
        </ul>
        <div class="send-message">
          <input type="text" class="input-message" placeholder="enter the message" v-model="userData.message" @input="handleMessage" />
          <button type="button" class="send-button" @click="sendValue">send</button>
        </div>
      </div>
      <div v-else class="chat-content">
        <ul class="chat-messages">
          <li
            class="message"
            :class="{ self: chat.senderName === userData.username }"
            v-for="(chat, index) in privateChats[tab]"
            :key="index"
          >
            <div v-if="chat.senderName !== userData.username" class="avatar">{{ chat.senderName }}</div>
            <div class="message-data">{{ chat.message }}</div>
            <div v-if="chat.senderName === userData.username" class="avatar self">{{ chat.senderName }}</div>
          </li>
        </ul>
        <div class="send-message">
          <input type="text" class="input-message" placeholder="enter the message" v-model="userData.message" @input="handleMessage" />
          <button type="button" class="send-button" @click="sendPrivateValue">send</button>
        </div>
      </div>
    </div>
    <div v-else class="register">
      <input
        id="user-name"
        placeholder="Enter your name"
        name="userName"
        v-model="userData.username"
        @input="handleUsername"
        margin="normal"
      />
      <button type="button" @click="registerUser">
        connect
      </button>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { EventBus } from "~/plugins/eventBus";

export default {
  data() {
    return {
      privateChats: new Map(),
      publicChats: [],
      tab: 'CHATROOM',
      userData: {
        username: '',
        receiverName: '',
        connected: false,
        message: '',
      },
      stompClient: null,
      onlineUsers: []
    };
  },
  methods: {
    connect() {
      const Sock = new SockJS('http://localhost:8080/ws');
      this.stompClient = over(Sock);
      this.stompClient.connect({}, this.onConnected, this.onError);
    },
    onConnected() {
      this.userData.connected = true;
      this.stompClient.subscribe('/chatroom/public', this.onMessageReceived);
      this.stompClient.subscribe('/user/' + this.userData.username + '/private', this.onPrivateMessageReceived);
      this.userJoin();
    },
    userJoin() {
      const chatMessage = {
        senderName: this.userData.username,
        status: 'JOIN',
      };
      this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    },
    onMessageReceived(payload) {
      const payloadData = JSON.parse(payload.body);
      switch (payloadData.status) {
        case 'JOIN':
          if (this.privateChats[payloadData.senderName]) {
            this.$set(this.privateChats, payloadData.senderName, []);
            console.log("Witaj: " + payloadData.senderName)
          }
          if (!this.onlineUsers.includes(payloadData.senderName)) {
            this.onlineUsers.push(payloadData.senderName);
            EventBus.$emit('updateOnlineUsers', this.onlineUsers);
            console.log("Dodaje nowego użytkownika: " + payloadData.senderName)
          }
          break;
        case 'MESSAGE':
          this.publicChats.push(payloadData);
          break;
      }
    },
    onPrivateMessageReceived(payload) {
      const payloadData = JSON.parse(payload.body);
      if (this.privateChats[payloadData.senderName]) {
        this.privateChats[payloadData.senderName].push(payloadData);
      } else {
        this.$set(this.privateChats, payloadData.senderName, [payloadData]);
      }

      if (!this.onlineUsers.includes(payloadData.senderName)) {
        this.onlineUsers.push(payloadData.senderName);
        EventBus.$emit('updateOnlineUsers', this.onlineUsers);
        console.log("Dodaje nowego użytkownika: " + payloadData.senderName)
      }
      console.log("otrzymano private message!")
    },
    onError(err) {
      console.log(err);
    },
    handleMessage(event) {
      this.userData.message = event.target.value;
    },
    sendValue() {
      if (this.stompClient) {
        const chatMessage = {
          senderName: this.userData.username,
          message: this.userData.message,
          status: 'MESSAGE',
        };
        this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
        this.userData.message = '';
      }
    },
    sendPrivateValue() {
      if (this.stompClient) {
        const chatMessage = {
          senderName: this.userData.username,
          receiverName: this.tab,
          message: this.userData.message,
          status: 'MESSAGE',
        };

        if (this.userData.username !== this.tab) {
          if (!this.privateChats[this.tab]) {
            this.$set(this.privateChats, this.tab, []);
          }
          this.privateChats[this.tab].push(chatMessage);
        }
        this.stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
        this.userData.message = '';
      }
    },
    handleUsername(event) {
      this.userData.username = event.target.value;
    },
    registerUser() {
      this.connect();
    },
    setTab(name) {
      this.tab = name;
    },
  },
  created() {
    EventBus.$on('updatePrivateChats', (privateChats) => {
      this.privateChats = privateChats;
      console.log("Aktualizuje private chats!")
    });


    EventBus.$on('updatePublicChats', (publicChats) => {
      this.publicChats = publicChats;
      console.log("Aktualizuje public chats!")
    });


    EventBus.$on('updateOnlineUsers', (onlineUsers) => {
      this.onlineUsers = onlineUsers; // Aktualizujemy listę online users
      console.log(this.onlineUsers)
      console.log("Aktualizuje userow")
    });
  },
};
</script>

<style lang="css">
@import "assets/index.css";
</style>
