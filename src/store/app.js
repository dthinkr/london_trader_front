// store.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useWebSocket } from '@vueuse/core';
const wsROOT = 'ws://localhost:8000/trader'
export const useTraderStore = defineStore('trader', {
  state: () => ({
    traderUuid: null,
    ws_path: null,
    messages: [],
    status: null,
    data: [],
    ws: null,

  }),
  actions: {
    async initializeTrader() {
      console.debug('Initializing trader')
      // Check local storage for existing UUID
      this.traderUuid = false //localStorage.getItem('traderUuid');

      if (!this.traderUuid) {
        console.debug('apparently no traderUuid')
        // If not found, create a new trader
        const response = await axios.post('http://localhost:8000/traders/create');
        console.debug(response)
        this.traderUuid = response.data.data.trader_uuid;
        this.ws_path = wsROOT + '/' + this.traderUuid;
        console.debug(this.ws_path)
        console.debug('-------------------')
        localStorage.setItem('traderUuid', this.traderUuid);

        // Connect to WebSocket or perform other actions
      }
      if (this.ws_path) {
        console.debug('I am going to initialize websocket');
        this.initializeWebSocket();
      }
    },
    async initializeWebSocket() {
      const that = this;
      this.ws =  useWebSocket(this.ws_path, {
        autoReconnect: true,
        onConnected: async () => {
          console.debug("Connected!");
          that.status = 'connected';
          
          
        },

        onMessage: (e) => {
          
          const json_data = JSON.parse(this.ws.data);
          console.debug("Message received!", json_data);
          this.messages.push(json_data);
          
          
          if (json_data ) {
            const newMessage = json_data;
            // Dynamically call the appropriate handler based on the message type
            const handlerName = `handle_${newMessage.type}`;
            if (this[handlerName] && typeof this[handlerName] === 'function') {
              this[handlerName](newMessage);
            } else {
              console.warn(`No handler defined for message type: ${newMessage.type}`);
            }
          }
        },
      })
      
        
      await this.ws.send (JSON.stringify({ type: 'subscribe', data: { channel: 'trader' } }));
        
    },
    async sendMessage(type, data) {
      // Use the 'send' function from the state
      
      if (this.ws.status === 'OPEN') {
        this.ws.send(JSON.stringify({ type, data }));
      }
    },


  }
});
