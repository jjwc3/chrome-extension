const interval = setInterval(() => {
    if (document.getElementById("INGDLC-MUJISUNG-LI")) {
        clearInterval(interval);
        return;
    }

    // 잘라내기, 복사, 붙여넣기 금지 해제
    document.addEventListener("cut", event => event.stopPropagation(), true);
    document.addEventListener("copy", event => event.stopPropagation(), true);
    document.addEventListener("paste", event => event.stopPropagation(), true);

    function createBtn(id, image) {
        let btn = document.createElement("button");
        btn.id = id;
        btn.style.display = 'none';
        let img = document.createElement("img");
        img.id = `${id}-IMG`;
        img.src = chrome.runtime.getURL(`../icons/${image}.png`);
        img.style.width = "32px";
        btn.appendChild(img);
        return btn;
    }
    const chatbox = document.getElementById("chatbox")

    // 도배창
    const createModal = (id) => {
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
        return li;
    }

    const li1 = createLi("INGDLC-MUJISUNG-LI");
    const li2 = createLi("INGDLC-CAPTURE-LI");
    const li3 = createLi("INGDLC-COMP-LI");

    li1.prepend(createBtn("INGDLC-BTN-MUJISUNG", "mujisung"));
    li2.prepend(createBtn("INGDLC-BTN-CAPTURE", "capture"));
    li3.prepend(createBtn("INGDLC-BTN-COMP", "audio"));


    document.body.onkeydown = (e) => {
        if (!e.altKey) return;

        if (e.key === 'm') document.getElementById("INGDLC-BTN-MUJISUNG").click();
        if (e.key === 'c') document.getElementById("INGDLC-BTN-CAPTURE").click();
        if (e.key === 'a') document.getElementById("INGDLC-BTN-COMP").click();
    }

    document.getElementsByClassName("game_point")[0]?.after(li3);
    document.getElementsByClassName("game_point")[0]?.after(li2);
    document.getElementsByClassName("game_point")[0]?.after(li1);


    document.getElementById("chat_area")?.before(createModal("INGDLC-MUJISUNG"));
}, 500);