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

  mounted() {
    this.$socket.$on('message', this.onMessage);
  },
  methods: {
    onMessage(message) {
      this.messages.push(message)
    },
    sendMessage() {
      this.$socket.$emit('message', this.messageToSend)
      this.messageToSend = '';
      console.log("to jest event message")
    }
  }
}
</script>

<style>

</style>
