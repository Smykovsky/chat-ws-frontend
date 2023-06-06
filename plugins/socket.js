import Vue from "vue";
import { Client } from "@stomp/stompjs";


export default ({ app }) => {
  const socket = new WebSocket('ws://localhost:8080/chat')
  const stompClient = new Client()

  stompClient.webSocketFactory = () => socket

  // stompClient.onConnect = (frame) => {
  //   console.log("połączono!")
  //   stompClient.subscribe('/topic/messages', (message) => {
  //     console.log('Otrzymano wiadomość!', message.body)
  //   })
  //
  //   const messageToSend = {
  //     value: 'wiadomość!',
  //     user: 'Smyku'
  //   }
  //   const destination = '/app/chat' // Adres docelowy na serwerze
  //   stompClient.publish({ destination, body: JSON.stringify(messageToSend) })
  //
  // }
  // // Opcjonalnie, dodaj obsługę zdarzenia błędu
  // stompClient.onStompError = (frame) => {
  //   console.error('Błąd STOMP:', frame)
  // }
  //
  //
  //
  //
  // // Połącz się z serwerem STOMP
  // stompClient.activate()


  // // Obsługa zdarzenia połączenia
  // socket.onopen = (data) => {
  //   console.log('Połączono z serwerem WebSocket')
  //   console.log(data)
  //
  //   const subscriptionMessage = {
  //     commad: 'subscribe',
  //     destination: '/topic/messages'
  //   }
  //   socket.send(JSON.stringify(subscriptionMessage))
  //   // Tutaj możesz wykonać dodatkowe czynności po nawiązaniu połączenia
  // }
  //
  // // Obsługa zdarzenia otrzymania wiadomości
  // socket.onmessage = (event) => {
  //   const message = event.data
  //   console.log('Otrzymano wiadomość:', message)
  //   // Tutaj możesz obsłużyć otrzymaną wiadomość
  // }
  //
  // // Opcjonalnie, dodaj obsługę zdarzenia błędu
  // socket.onerror = (error) => {
  //   console.error('Błąd WebSocket:', error)
  // }
  //
  // // Opcjonalnie, dodaj obsługę zdarzenia zamknięcia połączenia
  // socket.onclose = (event) => {
  //   console.log('Zamknięto połączenie WebSocket:', event)
  // }
  //
  // // Opcjonalnie, dodaj obsługę innych zdarzeń WebSocket
  //
  // // Dodaj event listener, aby zamknąć połączenie przed zamknięciem aplikacji
  // app.beforeUnmount(() => {
  //   socket.close()
  // })

  // Dodaj instancję WebSocket do obiektu Vue
  Vue.prototype.$stompClient = stompClient
}
