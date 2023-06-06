<template>
  <div>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        {{ message }}
      </li>
    </ul>
    <input v-model="messageToSend" type="text" placeholder="Wprowadź wiadomość" />
    <button @click="sendMessage">Wyślij</button>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  data() {
    return {
      messages: [],
      messageToSend: ''
    }
  },
  methods: {
    mounted() {
      this.$socket.onopen('message', () => {
        console.log("wysłano")
      })
    },
    sendMessage() {
      this.$socket.emit('message', this.messageToSend)
      this.messageToSend = '';
      console.log("to jest event message")
    }
  }

  // mounted() {
  //   this.connection = new WebSocket("ws://localhost:8080/chat")
  //
  //   this.connection.onopen = function (event) {
  //     console.log(event)
  //     console.log("succes")
  //   }
  //
  //   this.connection.onmessage = function (event) {
  //     console.log(event)
  //     this.messages.push(event.data)
  //   }
  // },
  // methods: {
  //   sendMessage(message) {
  //     this.connection.send(message);
  //   }
  // }
}
</script>

<style>

</style>
