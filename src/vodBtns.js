setInterval(() => {
    if (document.getElementById("INGDLC-DL-LI")) return;

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
    txt.style.color = "#147bb7";
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

    const li1 = createLi("INGDLC-DL-LI");
    const liText = createLi("INGDLC-DL-ALERT-LI");

    li1.prepend(createBtn("INGDLC-DL", "다운로드"));
    liText.prepend(txt);

    // CATCH
    if (document.getElementsByClassName("util_wrap")[0]) {
        document.getElementsByClassName("share")[0]?.before(li1);
        document.getElementsByClassName("view")[0]?.after(txt);
    }
    // VOD/CLIP
    else {
        document.getElementsByClassName("subscribe")[0]?.before(li1);
        li1.before(liText);
    }

}, 500);