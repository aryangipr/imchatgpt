function handleContactPopup() {
  document.getElementById("contactModal").style.display = "flex";
}

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
}

function contactBy(method) {
  if (method === 'email') {
    window.location.href = "mailto:chatgpt.with.attitude@gmail.com";
  } else if (method === 'phone') {
    alert("Call us at: 9060507697");
  } else if (method === 'whatsapp') {
    window.open("https://wa.me/919060507697", "_blank");
  }
  closeContactModal();
}

async function sendMessageToBackend() {
  const inputField = document.getElementById("chatInput");
  const chatHistory = document.getElementById("chatHistory");
  const message = inputField.value.trim();

  if (!message) return;

  // Show user message
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = message;
  chatHistory.appendChild(userBubble);

  // Show typing...
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble bot typing";
  typingBubble.innerText = "🤖 Typing...";
  chatHistory.appendChild(typingBubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  inputField.value = "";

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Remove typing bubble
    typingBubble.remove();

    // Show bot reply
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerText = "🤖 " + (data.reply || "Sorry, I didn’t understand that.");
    chatHistory.appendChild(botBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (err) {
    typingBubble.remove();
    const errorBubble = document.createElement("div");
    errorBubble.className = "chat-bubble bot";
    errorBubble.innerText = "❌ Error connecting to server.";
    chatHistory.appendChild(errorBubble);
  }
}

// Enable Enter key to send
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("chatInput");
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessageToBackend();
      }
    });
  }
});
