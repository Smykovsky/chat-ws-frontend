import Vue from "vue";
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const sock = new SockJS('http://localhost:8080/ws')
const stompClient = Stomp.over(sock)

Vue.prototype.$stompClient = stompClient

