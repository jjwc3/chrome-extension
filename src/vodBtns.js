const txt = document.createElement("span");
txt.id = "INGDLC-DL-ALERT";
txt.innerHTML = "명령어 복사 완료";
txt.style.color = "#7398ff";
txt.style.fontSize = "13px";
txt.style.alignContent = "center";
txt.style.display = "none";

const interval = setInterval(() => {
    if (location.href.includes("catch")) {
        if (document.getElementById("INGDLC-BTN-CAPTURE")) {
            clearInterval(interval);
            return;
        }

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
        if (document.getElementById("INGDLC-BTN-CAPTURE")) {
            clearInterval(interval);
            return;
        }

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
        downloadli.style.gap = "6px";

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