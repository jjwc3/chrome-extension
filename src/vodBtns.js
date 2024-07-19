function createBtn(id, text) {
    let btn = document.createElement("button");
    btn.id = id;
    btn.innerHTML = `[${text}]`;
    btn.style.color = "#707173";
    btn.style.fontSize = "13px";
    return btn;
}

const txt = document.createElement("span");
txt.id = "INGDLC-DL-ALERT";
txt.innerHTML = "명령어 복사 완료";
txt.style.color = "#7398ff";
txt.style.fontSize = "13px";
txt.style.display = "none";

const createLi = (id) => {
    const li = document.createElement("li");
    li.id = id;
    li.style.position = "relative";
    li.style.float = "left";
    li.style.color = "#000";
    li.style.zIndex = "99";
    li.style.marginLeft = "13px";

    return li;
}


// 다운 버튼
setInterval(() => {
    if (document.getElementById("INGDLC-DL-ALERT")) return;

    if (document.getElementsByClassName("video_edit")[0]) return;

    

    const li1 = createLi("INGDLC-DL-LI");
    const liText = createLi("INGDLC-DL-ALERT-LI");

    li1.prepend(createBtn("INGDLC-DL", "다운로드"));
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

    licap.prepend(createBtn("INGDLC-CAPTURE", "캡쳐"));

    if (document.getElementsByClassName("subscribe")[0]) {
        document.getElementsByClassName("subscribe")[0]?.before(licap);
    }

}, 500);