import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WebSocketService {
  constructor() {
    this.sock = new SockJS("/ws");
    this.stompClient = Stomp.over(this.sock);
  }

  connect(onMessageReceived) {
    this.stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      this.stompClient.subscribe("/topic/public", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
