// store.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useWebSocket } from '@vueuse/core';
const wsROOT = 'ws://localhost:8000/trader'
export const useTraderStore = defineStore('trader', {
  state: () => ({
    step:1000,
    traderUuid: null,
    gameParams: {}, 
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
    showSnackbar: false,
    snackbarText: '',
  }),
  getters: {
    ws_path: (state) => {
      return `${import.meta.env.VITE_WS_URL}trader/${state.traderUuid}`;
    },
    activeOrdersCount: (state) => state.myOrders.filter(order => order.status === "active").length,
    hasExceededMaxShortShares: (state) => {
      if (state.gameParams.max_short_shares < 0) return false;
      return state.shares < 0 && Math.abs(state.shares) >= state.gameParams.max_short_shares;
    },
    hasExceededMaxShortCash: (state) => {
      if (state.gameParams.max_short_cash < 0) return false;
      return state.cash < 0 && Math.abs(state.cash) >= state.gameParams.max_short_cash;
    },
    hasReachedMaxActiveOrders (state) {return this.activeOrdersCount >= state.gameParams.max_active_orders},
    getSnackState (state) {
      if (this.hasExceededMaxShortCash||this.hasExceededMaxShortShares||this.hasReachedMaxActiveOrders) {
        return true
      }
      return false
    }

  },
  actions: {
    async initializeTrader(formState) {
      console.debug('Initializing trader');
      this.traderUuid = false; // Or fetch from localStorage.getItem('traderUuid');

      if (!this.traderUuid) {
        console.debug('Apparently no traderUuid');
        const httpUrl = import.meta.env.VITE_HTTP_URL;

        try {
          // Pass formState as the payload in the POST request
          const response = await axios.post(`${httpUrl}traders/create`, formState);
          console.debug(response);
          this.traderUuid = response.data.data.trader_uuid;
          
          // Store the traderUuid in localStorage
          localStorage.setItem('traderUuid', this.traderUuid);
          
          // Store the formState in gameParams for future reference
          this.gameParams = formState;
          
          // Connect to WebSocket or perform other actions
          this.initializeWebSocket();
        } catch (error) {
          console.error('Error initializing trader:', error);
          // Handle error appropriately
        }
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
    checkLimits() {
      if (this.hasReachedMaxActiveOrders) {
        this.snackbarText = `You are allowed to have a maximum of ${this.gameParams.max_active_orders} active orders`;
        this.showSnackbar = true;
      } else if (this.hasExceededMaxShortCash) {
        this.snackbarText = `You are not allowed to short more than ${this.gameParams.max_short_cash} cash`;
        this.showSnackbar = true;
      } else if (this.hasExceededMaxShortShares) {
        this.snackbarText = `You are not allowed to short more than ${this.gameParams.max_short_shares} shares`;
        this.showSnackbar = true;
      }
    }


  }
});
