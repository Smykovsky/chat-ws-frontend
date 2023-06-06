<template>
  <div>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        {{ message }}
      </li>
    </ul>
    <input v-model="credentials.value" type="text" placeholder="Wprowadź wiadomość" />
    <input v-model="credentials.user" type="text" placeholder="Wprowadź wiadomość" />
    <button @click="sendMessage">Wyślij</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      credentials: {
        value: '',
        user: ''
      }
    }
  },
  mounted() {
    this.$stompClient.onConnect = (frame) => {
      console.log("połączono!")
      this.$stompClient.subscribe('/topic/messages', (message) => {
        console.log(JSON.parse(message.body).value, JSON.parse(message.body).user)
      })

        // const messageToSend = {
        //   value: 'wiadomość!',
        //   user: 'Smyku'
        // }
        // const destination = '/app/chat' // Adres docelowy na serwerze
        // this.$stompClient.publish({ destination, body: JSON.stringify(messageToSend) })
        // this.messages.push(messageToSend.value)
    }

    this.$stompClient.onStompError = (frame) => {
      console.log("Błąd podczas łączenia!")
    }

    this.$stompClient.activate()
  },
  methods: {
    sendMessage() {
      this.$stompClient.publish({destination: "/app/chat", body: JSON.stringify(this.credentials)})
      this.messages.push(this.credentials.value)
      this.credentials.value = ''
      this.credentials.user = ''
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
