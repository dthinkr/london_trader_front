// store.js
import { defineStore } from "pinia";
import axios from "axios";
import { useWebSocket } from "@vueuse/core";

const wsROOT = "ws://localhost:8000/trader";

export const useTraderStore = defineStore("trader", {
  state: () => ({
    extraParams: [
      {
        var_name: "totalTransactions",
        display_name: "Total Amount of Transactions (24h)",
        explanation:
          "Shows the total volume of trades executed within the last 24 hours, indicating overall market activity.",
        treatment: true,
      },
      {
        var_name: "stdDeviationLast10",
        display_name: "Standard Deviation of the Last 10 Transactions",
        explanation:
          "Represents the volatility of the market by calculating the standard deviation of the prices in the last 10 transactions.",
        treatment: false,
      },
      {
        var_name: "orderBookVolume",
        display_name: "Total Amount of Bids and Asks",
        explanation:
          "Provides a snapshot of market sentiment and liquidity by showing how many buy and sell orders are open.",
        treatment: true,
      },
      {
        var_name: "averageTransactionSize",
        display_name: "Average Transaction Size (24h)",
        explanation:
          "Calculated as the total transaction volume divided by the number of transactions over the last 24 hours.",
        treatment: false,
      },
      {
        var_name: "executedVsSubmittedRatio",
        display_name: "Executed to Submitted Orders Ratio (24h)",
        explanation:
          "Shows how many orders were filled versus placed, indicating market activity and depth.",
        treatment: false,
      },
      {
        var_name: "bidAskSpread",
        display_name: "Current Spread Between Highest Bid and Lowest Ask",
        explanation:
          "Measures the difference between the highest buy price and the lowest sell price, indicating market liquidity.",
        treatment: true,
      },
      {
        var_name: "orderBookImbalance",
        display_name: "Order Book Imbalance",
        explanation:
          "Quantifies the ratio of the total volume of bids to asks, indicating whether the market sentiment leans towards buying or selling.",
        treatment: true,
      },
    ],
    step: 1000,
    traderUuid: null,
    gameParams: {},
    messages: [],
    status: null,
    data: [],
    bidData: [],
    askData: [],
    chartData: [
      {
        name: "Bids",
        color: "blue",
        data: [[1,2]],
      },
      {
        name: "Asks",
        color: "red",
        data: [[1,2]],
      },
    ],
    history: [],
    ws: null,
    spread: null,
    shares: 0,
    cash: 0,
    current_price: null,
    myOrders: [],
    showSnackbar: false,
    snackbarText: "",
  }),
  getters: {
    ws_path: (state) => {
      return `${import.meta.env.VITE_WS_URL}trader/${state.traderUuid}`;
    },
    activeOrdersCount: (state) =>
      state.myOrders.filter((order) => order.status === "active").length,
    hasExceededMaxShortShares: (state) => {
      if (state.gameParams.max_short_shares < 0) return false;
      return (
        state.shares < 0 &&
        Math.abs(state.shares) >= state.gameParams.max_short_shares
      );
    },
    hasExceededMaxShortCash: (state) => {
      if (state.gameParams.max_short_cash < 0) return false;
      return (
        state.cash < 0 &&
        Math.abs(state.cash) >= state.gameParams.max_short_cash
      );
    },
    hasReachedMaxActiveOrders(state) {
      return this.activeOrdersCount >= state.gameParams.max_active_orders;
    },
    getSnackState(state) {
      if (
        this.hasExceededMaxShortCash ||
        this.hasExceededMaxShortShares ||
        this.hasReachedMaxActiveOrders
      ) {
        return true;
      }
      return false;
    },
  },
  actions: {
    async initializeTrader(formState) {
      console.debug("Initializing trader");
      this.traderUuid = false; // Or fetch from localStorage.getItem('traderUuid');

      if (!this.traderUuid) {
        console.debug("Apparently no traderUuid");
        const httpUrl = import.meta.env.VITE_HTTP_URL;

        try {
          // Pass formState as the payload in the POST request
          const response = await axios.post(
            `${httpUrl}trading/initiate`,
            formState
          );
          console.debug(response);
          this.traderUuid = response.data.data.trader_uuid;

          // Store the traderUuid in localStorage
          localStorage.setItem("traderUuid", this.traderUuid);

          // Store the formState in gameParams for future reference
          this.gameParams = formState;

          // Connect to WebSocket or perform other actions
          this.initializeWebSocket();
        } catch (error) {
          console.error("Error initializing trader:", error);
          // Handle error appropriately
        }
      }
    },

    handle_update(data) {
      const {
        order_book,
        history,
        spread,
        inventory,
        current_price,
        trader_orders,
      } = data;
      if (trader_orders && trader_orders.length > 0) {
        trader_orders.forEach((order) => {
          order.status = "active";
        });
      }
      if (inventory) {  
        const { shares, cash } = inventory;
        this.shares = shares;
        this.cash = cash;
      }
      if (order_book) {
        const { bids, asks } = order_book;
        this.myOrders = trader_orders;
        this.bidData = bids;
        this.askData = asks;
        this.chartData =  [
          
          {
            name: "Asks",
            color: "red",
            data: asks,
          },
          {
            name: "Bids",
            color: "blue",
            data: bids,
          }
        ]

        this.history = history;
        this.spread = spread;
       
        this.current_price = current_price;
      }
      
    },

    async initializeWebSocket() {
      const that = this;
      this.ws = useWebSocket(this.ws_path, {
        autoReconnect: true,
        onConnected: async () => {
          console.debug("Connected!");
          that.status = "connected";
        },

        onMessage: (e) => {
          const json_data = JSON.parse(this.ws.data);
          console.debug("Message received!", json_data);
          this.messages.push(json_data);

          if (json_data) {
            const newMessage = json_data;
            // Dynamically call the appropriate handler based on the message type
            const handlerName = `handle_${newMessage.type}`;
            this.handle_update(newMessage);
            console.log("Debounced update called");
            // if (this[handlerName] && typeof this[handlerName] === "function") {
            //   const debouncedUpdate = debounce(
            //     this[handlerName](newMessage),
            //     500
            //   );
            //   // Call the debounced update method with the message
            //   debouncedUpdate(message);
            // } else {
            //   console.warn(
            //     `No handler defined for message type: ${newMessage.type}`
            //   );
            // }
          }
        },
      });
    },
    async sendMessage(type, data) {
      // Use the 'send' function from the state

      if (this.ws.status === "OPEN") {
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
    },
  },
});
