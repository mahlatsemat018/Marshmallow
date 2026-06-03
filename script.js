import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const msgBox = document.getElementById("message-container");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-button");
const sender = document.getElementById("sender-select");
const typing = document.getElementById("typing-indicator");

// SEND MESSAGE
async function sendMessage() {
  if (!input.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    sender: sender.value,
    text: input.value,
    createdAt: serverTimestamp()
  });

  input.value = "";
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// REALTIME CHAT
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, (snap) => {
  msgBox.innerHTML = "";

  snap.forEach(doc => {
    const data = doc.data();

    const div = document.createElement("div");
    div.classList.add("message");

    div.classList.add(
      data.sender === "Mahlatse" ? "left" : "right"
    );

    div.textContent = data.text;
    msgBox.appendChild(div);
  });

  // auto scroll like WhatsApp
  msgBox.scrollTop = msgBox.scrollHeight;
});

// SIMPLE TYPING INDICATOR (local demo)
input.addEventListener("input", () => {
  if (input.value.length > 0) {
    typing.textContent = sender.value + " is typing...";
  } else {
    typing.textContent = "";
  }
});

// BACKGROUND SLIDESHOW
const images = [
  "Marshmallow/pic1.jpeg",
  "Marshmallow/pic2.jpeg",
  "Marshmallow/pic3.jpeg"
];

let i = 0;

setInterval(() => {
  document.body.style.backgroundImage = `url('${images[i]}')`;
  i = (i + 1) % images.length;
}, 8000);

// MEMORIES
window.showMemories = function () {
  const sec = document.getElementById("memories-section");
  sec.style.display = sec.style.display === "block" ? "none" : "block";
};










