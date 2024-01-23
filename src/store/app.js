// store.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useWebSocket } from '@vueuse/core';
const wsROOT = 'ws://localhost:8000/trader'
export const useTraderStore = defineStore('trader', {
  state: () => ({
    traderUuid: null,
    
    messages: [],
    status: null,
    data: [],
    bidData:[],
    askData:[],
    history: [],
    ws: null,
    spread: null,
    shares: 0,
    cash: 0,
    current_price: null,
    myOrders: [],
  }),
  getters: {
    ws_path: (state) => {
      console.debug("we are in getter", state.traderUuid)
      
      return `${import.meta.env.VITE_WS_URL}trader/${state.traderUuid}`;
    }
  },
  actions: {
    async initializeTrader() {
      console.debug('Initializing trader');
      this.traderUuid = false ;//localStorage.getItem('traderUuid');

      if (!this.traderUuid) {
        console.debug('Apparently no traderUuid');
        const httpUrl = import.meta.env.VITE_HTTP_URL;
        const response = await axios.post(`${httpUrl}traders/create`);
        console.debug(response);
        this.traderUuid = response.data.data.trader_uuid;
       
        // console.debug(this.ws_path);
        localStorage.setItem('traderUuid', this.traderUuid);

        // Connect to WebSocket or perform other actions
        this.initializeWebSocket();
      }
    },

    handle_update(data) {
      console.debug('I am in handle_update', data)
      const {order_book, history, spread, inventory, current_price, trader_orders} = data;
      const {shares, cash} = inventory;
      const {bids, asks} = order_book;
      this.myOrders = trader_orders;
      this.bidData = bids;
      this.askData = asks;
      this.history = history;
      this.spread = spread;
      this.shares = shares;
      this.cash = cash;
      this.current_price = current_price;


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
