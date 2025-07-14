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

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = message;
  chatHistory.appendChild(userBubble);

  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble bot typing";
  typingBubble.innerText = "🤖 Typing...";
  chatHistory.appendChild(typingBubble);

  inputField.value = "";
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    const response = await fetch("https://chatgpt-backend-lizz.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    typingBubble.remove();
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerText = "🤖 " + (data.reply || "❌ No response from server.");
    chatHistory.appendChild(botBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (err) {
    typingBubble.remove();
    const errorBubble = document.createElement("div");
    errorBubble.className = "chat-bubble bot";
    errorBubble.innerText = "❌ Server error. Please try again.";
    chatHistory.appendChild(errorBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    console.error("Frontend Error:", err);
  }
}

// Enable Enter key to send message
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
