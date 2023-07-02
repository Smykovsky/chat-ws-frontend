<template>
  <div>
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
        value: '',
      }
    }
  },
  mounted() {
    this.$stompClient.onConnect = (frame) => {
      console.log("połączono!")
      this.$stompClient.subscribe('/topic/messages', this.onMessageReceived)
    }
    this.$stompClient.activate()
  },
  methods: {
    sendMessage() {
      this.$stompClient.publish({destination: "/app/chat", body: JSON.stringify(this.credentials)})
      this.credentials.value = ''
    },
    onMessageReceived(stompMessage) {

      const message = JSON.parse(stompMessage.body).value;
      this.messages.push(message);
    },
  }
}
</script>

<style>

</style>
