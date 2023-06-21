// const { Configuration, OpenAIApi } = require("openai");
// import { writeFileSync } from "fs";
import OPEN_AI_KEY from "./api_keys.js";
import PEXELS_API_KEY from "./api_keys.js";
import API_KEYS from "./api_keys.js";

// import openai from "https://cdn.jsdelivr.net/npm/openai@3.3.0/dist/index.min.js";

document
  .querySelector("#generateButton")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    generateImage();
  });

let sample_url =
  "https://i0.wp.com/boingboing.net/wp-content/uploads/2022/06/Screen-Shot-2022-06-15-at-9.34.25-AM.jpg?fit=1238%2C918&ssl=1";

// require("dotenv").config();

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

async function generateImage() {
  let prompt = document.querySelector("#prompt").value;

  let formattedPrompt = prompt.replace(/ /g, "+");

  fetch(
    "https://pixabay.com/api/?key=" +
      API_KEYS.PIXABAY_API_KEY +
      "&q=" +
      formattedPrompt +
      "&image_type=photo"
  )
    .then((res) => res.json())
    .then((data) => {
      data.hits.forEach((pic) => {
        let newPic = document.createElement("img");
        newPic.src = pic.largeImageURL;

        let aTag = document.createElement("a");
        aTag.classList.add("resultImageAtag");
        aTag.href = pic.pageURL;
        aTag.setAttribute("target", "_blank");

        let picContainer = document.createElement("div");
        picContainer.setAttribute("id", "resultImage");
        picContainer.style.backgroundImage = "url(" + pic.largeImageURL + ")";
        aTag.appendChild(picContainer);

        document.querySelector("#imageBox").appendChild(aTag);
      });
    });
}

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
let searchPerformed = false; // Flag variable to track if search action has been performed

recognition.addEventListener("result", (e) => {
  let text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;
  textBox.appendChild(p);

  compare.push(p.innerText.split(" ")[p.innerText.split(" ").length - 1]);

  if (compare.includes("start")) {
    textBox.style.backgroundColor = "rgb(90, 193, 90)";
    compare = [];
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

    let newImg = document.createElement("img");
    // async () => {
    //   await generateImage(promptBox.value).then((url) => {
    //     newImg.src = url;
    //     newImg.classList.add("img");
    //     textBox.appendChild(newImg);
    //   });
    // };

    // console.log(generateImage(promptBox.value));

    compare = [];
    // recognition.stop();
  }
  if (compare.includes("pause")) {
    textBox.style.backgroundColor = "rgb(230, 196, 104)";
    compare = [];
  }

  if (compare.includes("spin")) {
    textBox.style.animation = "spin 2s infinite";
    setTimeout(() => {
      textBox.style.animation = "none";
    }, 2000);
    compare = [];
  }

  if (compare.includes("glow")) {
    textBox.style.animation = "glow 2s ease-in-out infinite";
    compare = [];
  }

  if (compare.includes("search") && !searchPerformed) {
    searchPerformed = true;

    generateImage();

    compare = [];
  }
});

document.querySelector("#stop").addEventListener("click", () => {
  recognition.stop();
});

document.querySelector("#start").addEventListener("click", () => {
  recognition.start();
});

document.addEventListener("click", async (e) => {
  if (e.target.id === "resultImage") {
    let prompt = document.querySelector("#prompt").value;
    let imgURL = e.target.style.backgroundImage.match(/url\("([^"]+)"\)/)[1];
    // console.log(e.target.style.backgroundImage.match(/url\("([^"]+)"\)/)[1]);

    fetch(imgURL)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);

        // Set the filename for the download
        downloadLink.download = prompt + ".jpg";

        // Programmatically click the download link to initiate the download
        downloadLink.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(downloadLink.href);
      })
      .catch((error) => {
        console.error("Error downloading the image:", error);
      });
  }
});
