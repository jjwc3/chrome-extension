function createBtn(id) {
    let btn = document.createElement("button");
    btn.id = id;
    btn.style.justifyContent = "center";
    return btn;
}

const txt = document.createElement("span");
txt.id = "INGDLC-DL-ALERT";
txt.innerHTML = "명령어 복사 완료";
txt.style.color = "#7398ff";
txt.style.fontSize = "13px";
txt.style.alignContent = "center";
txt.style.display = "none";

const createLi = (id) => {
    const li = document.createElement("li");
    li.id = id;
    li.style.display = "flex";
    return li;
}

const downImg = document.createElement("img");
downImg.id = "INGDLC-DL-IMG";
downImg.src = chrome.runtime.getURL("../icons/download.png");
downImg.alt = "다운로드(FFmpeg)";
downImg.style.width = "24px";

const captureImg = document.createElement("img");
captureImg.id = "INGDLC-CAPTURE-IMG";
captureImg.src = chrome.runtime.getURL("../icons/capture.png");
captureImg.alt = "캡쳐";
captureImg.style.width = "24px";


// 다운 버튼
setInterval(() => {
    if (document.getElementById("INGDLC-DL-ALERT")) return;

    if (!document.getElementsByClassName("video_edit")[0]?.className.includes("off")) return;

    

    const li1 = createLi("INGDLC-DL-LI");
    const liText = createLi("INGDLC-DL-ALERT-LI");
    const dlButton = createBtn("INGDLC-DL", "다운로드");
    dlButton.appendChild(downImg)
    li1.prepend(dlButton);
    liText.prepend(txt);

    // CATCH
    if (document.getElementsByClassName("subscribe")[0]) {
        document.getElementsByClassName("subscribe")[0]?.before(li1);
        li1.before(liText);
    }

}, 500);

// 캡쳐 버튼
setInterval(() => {
    if (document.getElementById("INGDLC-CAPTURE")) return;

    const licap = createLi("INGDLC-CAPTURE-LI");
    const capButton = createBtn("INGDLC-CAPTURE", "캡쳐");
    capButton.appendChild(captureImg);
    licap.prepend(capButton);

    if (document.getElementsByClassName("subscribe")[0]) {
        document.getElementsByClassName("subscribe")[0]?.before(licap);
    }

}, 500);