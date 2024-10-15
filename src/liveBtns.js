setInterval(() => {
    if (document.getElementById("INGDLC-MUJISUNG-LI")) return;

    // 잘라내기, 복사, 붙여넣기 금지 해제
    document.addEventListener("cut", event => event.stopPropagation(), true);
    document.addEventListener("copy", event => event.stopPropagation(), true);
    document.addEventListener("paste", event => event.stopPropagation(), true);

    function createBtn(id, text) {
        let btn = document.createElement("button");
        btn.id = id;
        btn.innerHTML = `[${text}]`;
        btn.style.color = "#707173";
        btn.style.display = 'none';
        return btn;
    }
    const chatbox = document.getElementById("chatbox")

    const createDiv = (id) => {
        const div = document.createElement("div");

        div.id = id;
        div.style.display = "none";
        div.style.backgroundColor = "#777";
        div.style.borderRadius = "5px";
        div.style.padding = "5px";
        div.style.marginTop = "5px";
        div.style.color = "#FFF";
        div.style.justifyContent = "space-around";
        div.style.position = "relative";
        div.style.zIndex = "99";
        div.style.top = "auto";
        div.style.bottom = chatbox.style.height; 
        

        return div;
    }

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

    const li1 = createLi("INGDLC-MUJISUNG-LI");
    const li2 = createLi("INGDLC-CAPTURE-LI");

    li1.prepend(createBtn("INGDLC-BTN-MUJISUNG", "도배"));
    li2.prepend(createBtn("INGDLC-BTN-CAPTURE", "캡쳐"));


    document.body.onkeydown = (e) => {
        if (!e.altKey) return;

        if (e.keyCode === 77) document.getElementById("INGDLC-BTN-MUJISUNG").click();
        if (e.keyCode === 67) document.getElementById("INGDLC-BTN-CAPTURE").click();
    }

    document.getElementsByClassName("game_point")[0]?.after(li2);
    document.getElementsByClassName("game_point")[0]?.after(li1);


    document.getElementById("chat_area")?.before(createDiv("INGDLC-MUJISUNG"));
}, 500);