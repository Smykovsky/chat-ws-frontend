<template>
  <div>
    <div class="register">
      <input id="user-name" v-model="credentials.username">
      <button type="button" @click="registerUser">Połącz</button>
    </div>

    <input v-model="credentials.value" type="text" placeholder="Wprowadź wiadomość" />
    <button @click="sendMessage">Wyślij</button>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
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
      credentials: {
        username: '',
        senderName: '',
        receiverName: '',
        value: '',
      },
      privateChats: new Map(),
      publicChat: [],
    }
  },
  mounted() {
    this.$stompClient.onConn(this.onMessageReceived, this.onPrivateMessageReceived, this.credentials.username);

    this.$stompClient.connect()

  },
  methods: {
    sendMessage() {
      this.$stompClient.publish({destination: "/app/chat", body: JSON.stringify(this.credentials)})
      this.credentials.value = ''
    },
    onMessageReceived(stompMessage) {
      const message = JSON.parse(stompMessage.body).value;
      this.messages.push(message);
      console.log(message)
    },
    connect() {
      console.log(this.$stompClient)
    },
    registerUser() {
      this.connect();
    },
    userJoin() {
      var chatMessage = {
        senderName: this.credentials.username
      };
      this.$stompClient.send("/app/chat", {}, JSON.stringify(chatMessage))

    },
    onPrivateMessageReceived(payload) {
        var payloadData = JSON.parse(payload.body);
        if (this.privateChats.get(payloadData.senderName)){
          this.privateChats.get(payloadData.senderName).push(payloadData);
          this.privateChats.set(new Map(this.privateChats));
        } else {
          let list = [];
          list.push(payloadData);
          this.privateChats.set(payloadData.senderName, list);
          this.privateChats.set(new Map(this.privateChats));
        }
    }


  }
}
</script>

<style>

</style>
