import eating from "./eating";
import running from "./running";
import gifs from "./gifs";
import tippy from 'tippy.js';
import FileSaver from "file-saver";
import ProgressBar from "progressbar.js";

let progressbar;
let blob;
let blobURL;
const ids = {
  "running": [{ "start": 10, "end": 15, "id": "subtitle01" }],
  "eating": [
    { "start": 1, "end": 4, "id": "subtitle01" },
    { "start": 5, "end": 9, "id": "subtitle02" }
  ]
}

const renderProgressBar = (container) => {
  container.classList.add("converting");
  progressbar = new ProgressBar.SemiCircle(container, {
    strokeWidth: 3,
    color: "black",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: null,
    color: "black",
    text: {
      value: "0%",
      alignToBottom: false
    },
  });
};

const setProgressBar = (progress) => {
  if (progressbar) {
    progressbar.set(progress);
    progressbar.setText(`${parseInt(progress*100)}%`);
  }
};

const getSubtitle = (gifName, index) => {
  let id;
  for(let i = 0; i < ids[gifName].length; i++){
    if(index >= ids[gifName][i].start && index <= ids[gifName][i].end){
      id = ids[gifName][i].id;
      break;
    }
  }
  
  if (!!id) {
    const subtitle = document.getElementById(id);
    return subtitle.value || subtitle.placeholder;
  } else {
    return null;
  }
};

const fillSubtitle = (context, subtitle, scale, imgWidth, imgHeight) => {
  if (!!subtitle) {
    context.font = `${28*scale}px Arial`;
    context.textAlign = "center";
    context.shadowColor = "black";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 2 * scale;
    context.lineWidth = 3 * scale;
    context.fillStyle = "black";
    context.strokeText(subtitle, imgWidth / 2, imgHeight - (20 * scale));
    context.fillStyle = "#d4d4d4";
    context.shadowBlur = 0;
    context.fillText(subtitle, imgWidth / 2, imgHeight - (20 * scale));
  }
};

const fillImage = (context, image, scale, posX, posY, deg, width, height) => {
  const rad = deg * Math.PI/180;
  const x = posX * scale;
  const y = posY * scale;
  const originX = width * scale / 2;
  const originY = height * scale / 2;
  context.save();
  context.translate(x+originX, y+originY);
  context.rotate(rad);
  context.translate(-originX, -originY);
  context.drawImage(image, 0, 0, width * scale, height * scale);
  context.restore();
};


const convertGif = (encoder, container, rate, scale, renderBtn, downloadBtn, gifName) => {
  
  const canvas = document.createElement("canvas");
  const image = document.querySelector("#image-container img");
  const imgWidth = Math.round(image.width * scale);
  const imgHeight = Math.round(image.height * scale);

  canvas.setAttribute("width", imgWidth);
  canvas.setAttribute("height", imgHeight);
  const context = canvas.getContext("2d");

  encoder.setRepeat(0);
  encoder.setDelay(100 * rate);
  encoder.setSize(imgWidth, imgHeight);
  encoder.setQuality(20);
  encoder.start();

  let index = 0;

  const addFrame = (callback) => {
    const img = new Image();
    img.src = gifs[gifName][index];
    img.onload = () => {
      setProgressBar(index/gifs[gifName].length);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
        fillSubtitle(context, getSubtitle(gifName, index), scale, imgWidth, imgHeight);
        encoder.addFrame(context);
        index += rate;
        callback();
    };
  };

  const checkFinish = () => {
    if (index < gifs[gifName].length) {
      addFrame(checkFinish);
    } else {
      encoder.finish();

      const img = document.createElement("img");
      // TODO:
      // some browser does not support base64 encoded images with large size.
      // ... at least it doesnt work on my ipad
      //img.setAttribute("src", `data:image/gif;base64,${btoa(encoder.stream().getData())}`);
      const data = new Uint8Array(encoder.stream().bin);
      blob = new Blob([data], { type: "image/gif" });
      blobURL && window.URL.revokeObjectURL(blobURL);
      blobURL = URL.createObjectURL(blob);

      img.setAttribute("src", blobURL);
      img.setAttribute("alt", "瀏覽器不支援此圖片檔案大小，請調整運算設定");
      img.setAttribute("style", "width: " + image.width + "px; height: " + image.height + "px;");
      container.classList.remove("converting");
      container.innerHTML = "";
      container.appendChild(img);

      renderBtn.disabled = false;
      downloadBtn.disabled = false;
    }
  }

  addFrame(checkFinish);
};

const estimateSize = () => {
  const rateInput = document.querySelector(".options-container input[name=rate]:checked");
  const scaleInput = document.querySelector(".options-container input[name=scale]:checked");
  const fileSizeInput = document.getElementById("file-size");

  const rate = (rateInput.value || 1)-0;
  const scale = scaleInput.value || "1";
  const base = scale === "1" ? 19 : (scale === "0.7" ? 10.7 : (scale === "0.5" ? 6.3 : 0));

  const filesize = parseInt(base*10 / rate) / 10;
  fileSizeInput.value = `~${filesize}MB`;
};

const getSelectedGif = () => {
  return document.querySelectorAll("#gif-select option:checked")[0].value;
};

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.getElementById("image-container");
  const renderBtn = document.getElementById("render-button");
  const downloadBtn = document.getElementById("download-button");
  const rateInputs = document.querySelectorAll(".options-container input[name=rate]");
  const scaleInputs = document.querySelectorAll(".options-container input[name=scale]");
  const highRateInput = document.getElementById("high-rate");
  const scale70Input = document.getElementById("scale-70");

  downloadBtn.disabled = true;
  highRateInput.checked = true;
  scale70Input.checked = true;

  estimateSize();

  [...rateInputs].forEach((input) => input.addEventListener("change", estimateSize));
  [...scaleInputs].forEach((input) => input.addEventListener("change", estimateSize));

  renderBtn.addEventListener("click", (e) => {
    const rateInput = document.querySelector(".options-container input[name=rate]:checked");
    const scaleInput = document.querySelector(".options-container input[name=scale]:checked");
    renderBtn.disabled = true;
    renderProgressBar(container);
    const gifName = getSelectedGif();
    convertGif(new GIFEncoder(), container, (rateInput.value || 1)-0, (scaleInput.value || 1)-0, renderBtn, downloadBtn, gifName);
  });
  downloadBtn.addEventListener("click", (e) => {
    if (!!blob) {
      const gifName = getSelectedGif();
      FileSaver.saveAs(blob,  gifName + ".gif");
    }
  });

  tippy("#subtitle-container, .options-container", {
    placement: "left",
    arrow: true,
    size: "small",
    distance: 20,
  });
});
