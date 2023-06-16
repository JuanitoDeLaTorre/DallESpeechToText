// const { Configuration, OpenAIApi } = require("openai");
// import { writeFileSync } from "fs";

// import openai from "https://cdn.jsdelivr.net/npm/openai@3.3.0/dist/index.min.js";

const button = document.querySelector("#generateButton");
button.addEventListener("click", () => {
  console.log("swag");
});

document.querySelector("#generateButton").addEventListener("click", () => {
  console.log($("#prompt").innerText);
  console.log("swag");
});

// require("dotenv").config();

// const configuration = new Configuration({
//   apiKey: "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",
// });

// const api = new OpenAIApi(configuration);

// const prompt = "a boat floating on a sea of stars";

// const result = await api.createImage({
//   prompt: prompt,
//   n: 1,
//   size: "256x256",
// });

// const url = result.data.data[0].url;
// console.log(url);

// const imgResult = await fetch(url);
// const blob = await imgResult.blob();
// const buffer = Buffer.from(await blob.arrayBuffer());

// writeFileSync("./imgs/firstTest.png", buffer);

const textBox = document.querySelector(".outputBox");
const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;

let p = document.createElement("p");
let promptBox = document.querySelector("#prompt");

p.classList.add("text");
let compare = [];
let started = false;
let promptString = "";

recognition.addEventListener("result", (e) => {
  let text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;
  textBox.appendChild(p);

  if (started) {
    promptString += p.innerText.split(" ")[p.innerText.split(" ").length - 1];
  }
  console.log(promptString);

  compare.push(p.innerText.split(" ")[p.innerText.split(" ").length - 1]);

  console.log(compare);
  if (compare.includes("start")) {
    started = true;
    textBox.style.backgroundColor = "rgb(90, 193, 90)";
    compare = [];

    console.log(compare);
  }
  if (compare.includes("stop")) {
    textBox.style.backgroundColor = "rgb(170, 73, 73)";
    textBox.style.animation = "none";

    // promptBox.value = compare.join(" ");
    promptBox.value = p.innerText
      .split(" ")
      .slice(
        p.innerText.split(" ").indexOf("start") + 1,
        p.innerText.split(" ").indexOf("stop")
      )
      .join(" ");

    compare = [];
    console.log(compare);
    recognition.stop();
  }
  if (compare.includes("pause")) {
    textBox.style.backgroundColor = "rgb(230, 196, 104)";
    compare = [];
    // text = "";
    // textBox.innerHTML = "";
  }

  if (compare.includes("spin")) {
    textBox.style.animation = "spin 2s infinite";
    setTimeout(() => {
      textBox.style.animation = "none";
    }, 2000);
    compare = [];
    // text = "";
    // textBox.innerHTML = "";
  }

  if (compare.includes("glow")) {
    textBox.style.animation = "glow 2s ease-in-out infinite";
    // textBox.style.boxShadow = "0px 0px 30px white";
    compare = [];
    // text = "";
    // textBox.innerHTML = "";
  }
});

recognition.start();

// recognition.onspeechend(() => {
//   console.log("stopped");
// });
