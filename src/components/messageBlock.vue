<template>
  <v-card     height="100%"
      elevation="3" >
    <v-card-title class="cardtitle">Message Board</v-card-title>
    <v-card-text style="height: 300px; overflow-y: auto" ref="messageContainer">
      <v-container>
        <div id="goto-container-example">
          <!-- Dynamically set refs for each message element -->
          <div 
          class="message animate__animated animate__heartBeat"
          v-for="(message, index) in messages" :key="index" :ref="setRef" :id="`message_${index}`">
            {{ message }}
          </div>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useGoTo } from "vuetify";
const goTo = useGoTo();
const messages = ref([]);
const messageRefs = ref([]);

// Function to collect refs
const setRef = (el) => {
  if (el) {
    messageRefs.value.push(el);
  }
};

const addMessage = async () => {
  messages.value.push(`Message ${messages.value.length + 1}`);
  await nextTick();
  scrollToLastMessage();
};

const scrollToLastMessage = () => {
  const lastMessageElement = messageRefs.value.at(-1); // Get the last message element
  if (lastMessageElement) {
    lastMessageElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

onMounted(() => {
 
 
  addMessage();
  setInterval(addMessage, 1000); // Adjust the interval as needed
});
</script>
<style scoped>
.cardtitle {
  font-size: 20px;
  font-weight: bold;
  background: navy;
  color: white;
}
</style>
<style scoped>
.message {
  background-color: #f0f4c3; /* Soft green background for received messages */
  border: 1px solid #dce775; /* Light green border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
  border-radius: 12px; /* Rounded corners for the bubble look */
  padding: 8px 12px; /* Comfortable spacing inside the bubble */
  max-width: 80%; /* Max width to prevent overly wide messages */
  margin: 8px 0; /* Spacing between messages */
  word-wrap: break-word; /* Ensure long words don't overflow */
  display: block; /* Block display to stack messages vertically */
  position: relative; /* For potential pseudo-elements or positioning */
  left: 0; /* Align messages to the left */
  margin-right: auto; /* Ensures margin is applied correctly for alignment */
  font-size: 0.95rem; /* Adjust font size as needed */
}
</style>
