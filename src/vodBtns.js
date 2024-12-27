// function createBtn(id) {
//     let btn = document.createElement("button");
//     btn.id = id;
//     btn.style.justifyContent = "center";
//     return btn;
// }
//
const txt = document.createElement("span");
txt.id = "INGDLC-DL-ALERT";
txt.innerHTML = "명령어 복사 완료";
txt.style.color = "#7398ff";
txt.style.fontSize = "13px";
txt.style.alignContent = "center";
txt.style.display = "none";
//
// const createLi = (id) => {
//     const li = document.createElement("li");
//     li.id = id;
//     li.style.display = "flex";
//     return li;
// }
//
// const downImg = document.createElement("img");
// downImg.id = "INGDLC-DL-IMG";
// downImg.src = chrome.runtime.getURL("../icons/download.png");
// downImg.alt = "다운로드(FFmpeg)";
// downImg.style.width = "24px";
//
// const captureImg = document.createElement("img");
// captureImg.id = "INGDLC-CAPTURE-IMG";
// captureImg.src = chrome.runtime.getURL("../icons/capture.png");
// captureImg.alt = "캡쳐";
// captureImg.style.width = "24px";
//
//
// // 다운 버튼
// setInterval(() => {
//     if (document.getElementById("INGDLC-DL-ALERT")) return;
//     if (!document.getElementsByClassName("video_edit")[0]?.className.includes("off")) return;
//
//     if (!location.href.includes("catch")) {
//
//     }
//
//     const li1 = createLi("INGDLC-DL-LI");
//     const liText = createLi("INGDLC-DL-ALERT-LI");
//     const dlButton = createBtn("INGDLC-DL", "다운로드");
//     dlButton.appendChild(downImg)
//     li1.prepend(dlButton);
//     liText.prepend(txt);
//
//     // CATCH
//     if (document.getElementsByClassName("subscribe")[0]) {
//         document.getElementsByClassName("subscribe")[0]?.before(li1);
//         li1.before(liText);
//     }
//
// }, 500);

//
setInterval(() => {
    if (location.href.includes("catch")) {
        if (document.getElementById("INGDLC-BTN-CAPTURE")) return;

        const capturebtn = document.createElement("button");
        capturebtn.id = "INGDLC-BTN-CAPTURE";
        capturebtn.type = "button";
        capturebtn.setAttribute('tip', "캡쳐하기");
        capturebtn.innerHTML = "캡쳐하기";

        const captureimg = document.createElement("img");
        captureimg.id = "INGDLC-CAPTURE-IMG";
        captureimg.src = chrome.runtime.getURL("../icons/capture.png");
        captureimg.style.width = "24px";

        const downloadbtn = document.createElement("button");
        downloadbtn.id = "INGDLC-BTN-DL";
        downloadbtn.type = "button";
        downloadbtn.setAttribute('tip', "다운로드");
        downloadbtn.innerHTML = "다운로드";

        const downloadimg = document.createElement("img");
        downloadimg.id = "INGDLC-DL-IMG";
        downloadimg.src = chrome.runtime.getURL("../icons/download.png");
        downloadimg.style.width = "24px";

        capturebtn.appendChild(captureimg);
        downloadbtn.append(downloadimg);
        document.getElementsByClassName("share")[0].before(txt);
        document.getElementsByClassName("share")[0].before(downloadbtn);
        document.getElementsByClassName("share")[0].before(capturebtn);
    } else {
        if (document.getElementById("INGDLC-BTN-CAPTURE")) return;

        const capturebtn = document.createElement("button");
        capturebtn.id = "INGDLC-BTN-CAPTURE";
        capturebtn.type = "button";
        capturebtn.setAttribute('tip', "캡쳐하기");
        capturebtn.style.justifyContent = "center";

        const captureimg = document.createElement("img");
        captureimg.id = "INGDLC-CAPTURE-IMG";
        captureimg.src = chrome.runtime.getURL("../icons/capture.png");
        captureimg.style.width = "24px";

        const captureli = document.createElement("li");
        captureli.id = "INGDLC-CAPTURE-LI";
        captureli.style.display = "flex";

        const downloadbtn = document.createElement("button");
        downloadbtn.id = "INGDLC-BTN-DL";
        downloadbtn.type = "button";
        downloadbtn.setAttribute('tip', "다운로드");
        downloadbtn.style.justifyContent = "center";

        const downloadimg = document.createElement("img");
        downloadimg.id = "INGDLC-DL-IMG";
        downloadimg.src = chrome.runtime.getURL("../icons/download.png");
        downloadimg.style.width = "24px";

        const downloadli = document.createElement("li");
        downloadli.id = "INGDLC-DL-LI";
        downloadli.style.display = "flex";

        capturebtn.appendChild(captureimg);
        captureli.appendChild(capturebtn);
        downloadbtn.appendChild(downloadimg);
        downloadli.appendChild(downloadbtn);
        downloadli.prepend(txt);

        if (document.getElementsByClassName("video_edit")[0]?.className.includes("off")) {
            document.getElementsByClassName("subscribe")[0].before(downloadli);
        }
        document.getElementsByClassName("subscribe")[0].before(captureli);
    }


}, 500);