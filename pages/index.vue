<template>
  <div>
    <div class="register">
      <input id="user-name" v-model="username">
      <button type="button" @click="registerUser">Połącz</button>
    </div>

    <input v-model="credentials.value" type="text" placeholder="Wprowadź wiadomość" />
    <button @click="sendMessage">Wyślij</button>
    <ul>
      <li v-for="(message, index) in publicChat" :key="index">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      username: '',
      credentials: {
        senderName: '',
        receiverName: '',
        value: '',
      },
      privateChats: new Map(),
      publicChat: [],
    }
  },
  mounted() {

  },
  methods: {
    connect() {
      this.$stompClient.connect({}, this.onConnected(), this.onError());
    },
    onConnected() {
      this.$stompClient.subscribe('/chatroom/public', this.onMessageReceived)
      this.$stompClient.subscribe('/user'+this.username+'/private', this.onPrivateMessageReceived)
      console.log(this.$stompClient.connected)
      this.userJoin()
    },
    onError(error) {
      console.log(error)
    },
    onMessageReceived(payload) {
      let payloadData = JSON.parse(payload.body)
      this.publicChat.push(payloadData)
      console.log(this.publicChat)
    },
    onPrivateMessageReceived(payload) {
      var payloadData = JSON.parse(payload.body)
      if (this.privateChats.get(payloadData.senderName)) {
        this.privateChats.get(payloadData.senderName).push(payloadData)
        this.privateChats.set(new Map(this.privateChats))
      } else {
        let list = []
        list.push(payloadData)
        this.privateChats.set(payloadData.senderName, list);
        this.privateChats(new Map(this.privateChats))
      }
    },
    userJoin() {
      var chatMessage = {
        senderName: this.credentials.senderName
      };
      this.$stompClient.send("/app/message",  JSON.stringify(chatMessage))
      console.log("Cześć " + this.username)
    },
    registerUser() {
      this.connect()
    },
    sendMessage() {
      // if (this.$stompClient) {
      //   var chatMessage = {
      //     senderName: this.credentials.senderName,
      //     receiverName: this.credentials.receiverName,
      //     value: this.credentials.value
      //   };
      //
      //   this.$stompClient.send("/app/message",  JSON.stringify(chatMessage))
      // }
      console.log(this.$stompClient.connected)
    }
  }
}
</script>

<style>

</style>
