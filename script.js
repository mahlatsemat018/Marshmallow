// script.js (ES module) - paste into your script.js file

// ---- Firebase imports (CDN modular) ----
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ---- Your Firebase config (from you) ----
const firebaseConfig = {
  apiKey: "AIzaSyAT2dIQafqa42lU-9zcShe2FuiI7UBN_MM",
  authDomain: "marshmallow-chat.firebaseapp.com",
  projectId: "marshmallow-chat",
  storageBucket: "marshmallow-chat.firebasestorage.app",
  messagingSenderId: "25708689708",
  appId: "1:25708689708:web:9aeb0efc180a404724d489"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------------------
// Password gate (simple client-side gate)
// -------------------------------
const SITE_PASSWORD = "Marshmallow2025"; // keep this secret between you two
const entered = prompt("Enter password to access Marshmallow:");
if (entered !== SITE_PASSWORD) {
  alert("Wrong password — access denied.");
  // redirect away
  window.location.href = "about:blank";
}

// -------------------------------
// DOM references
// -------------------------------
const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const senderSelect = document.getElementById("sender-select");
const memoriesBtn = document.getElementById("memories-btn");
const memoriesSection = document.getElementById("memories-section");
const memoriesContainer = document.getElementById("memories-container");

// -------------------------------
// Send message function
// -------------------------------
async function sendMessageToFirestore(sender, text) {
  if (!text || !text.trim()) return;
  try {
    await addDoc(collection(db, "messages"), {
      sender,
      text,
      createdAt: serverTimestamp()
    });
    // clear input
    messageInput.value = "";
  } catch (err) {
    console.error("Send error:", err);
    alert("Failed to send — check console.");
  }
}

// Send button handler
sendButton.addEventListener("click", () => {
  const sender = senderSelect.value;
  const text = messageInput.value;
  sendMessageToFirestore(sender, text);
});

// allow Enter key to send
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendButton.click();
  }
});

// -------------------------------
// Real-time listener: render messages
// -------------------------------
const messagesQuery = query(
  collection(db, "messages"),
  orderBy("createdAt")
);

onSnapshot(messagesQuery, (snapshot) => {
  // clear and render in order
  messageContainer.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    renderMessage(data);
  });

  // autoscroll to bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

function renderMessage(data) {
  const div = document.createElement("div");
  div.classList.add("message");
  // left or right
  if (data.sender === "Mahlatse") div.classList.add("left");
  else div.classList.add("right");

  const spanText = document.createElement("span");
  spanText.textContent = data.text || "";
  div.appendChild(spanText);

  const timeSpan = document.createElement("span");
  timeSpan.className = "time";
  if (data.createdAt && data.createdAt.toDate) {
    timeSpan.textContent = " " + data.createdAt.toDate().toLocaleTimeString();
  } else {
    timeSpan.textContent = " ";
  }
  div.appendChild(timeSpan);

  messageContainer.appendChild(div);
}

// -------------------------------
// Background slideshow explicit list
// -------------------------------
const backgroundImages = [
  "Marshmallow/pic1.jpeg",
  "Marshmallow/pic2.jpeg",
  "Marshmallow/pic3.jpeg",
  "Marshmallow/pic4.jpeg",
  "Marshmallow/pic5.jpeg",
  "Marshmallow/pic6.jpeg",
  "Marshmallow/pic7.jpeg",
  "Marshmallow/pic8.jpeg",
  "Marshmallow/pic9.jpeg",
  "Marshmallow/pic10.jpeg",
  "Marshmallow/pic11.jpeg"
];

let currentBgIndex = 0;

function changeBackground() {
  const src = backgroundImages[currentBgIndex];
  // preload to avoid flash
  const img = new Image();
  img.src = src;
  img.onload = () => {
    document.body.style.backgroundImage = `url('${src}')`;
  };
  img.onerror = () => {
    console.warn("Background missing:", src);
  };
  currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
}

setInterval(changeBackground, 10000); // 10s
changeBackground();

// -------------------------------
// Memories: show images & videos from Memories/ folder
// -------------------------------
function showMemories() {
  // toggle
  if (memoriesSection.style.display === "block") {
    memoriesSection.style.display = "none";
    return;
  }
  memoriesSection.style.display = "block";

  // if not loaded yet, try to load a bunch of files
  if (memoriesContainer.children.length === 0) {
    // We'll try a reasonable range (change if you have more)
    for (let i = 1; i <= 50; i++) {
      // images
      const img = document.createElement("img");
      img.src = `Memories/photo${i}.jpeg`;
      img.alt = `photo${i}`;
      img.onerror = function() { this.remove(); };
      memoriesContainer.appendChild(img);

      // videos
      const vid = document.createElement("video");
      vid.src = `Memories/video${i}.mp4`;
      vid.controls = true;
      vid.onerror = function() { this.remove(); };
      memoriesContainer.appendChild(vid);
    }
  }

  // scroll into view
  memoriesSection.scrollIntoView({ behavior: "smooth" });
}

// also expose to window for inline onclick
window.showMemories = showMemories;










