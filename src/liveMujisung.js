import { copyToClipboard } from './utils.mjs';
import { getConfig, getLargeStorage } from './config.mjs';

(async () => {

    const enabled = await getConfig("twitch.mujisung.enabled");


    if (!enabled) return;

    // 도배 버튼 클릭 시 창 띄우기
    setInterval(() => {
        const btn = document.getElementById("INGDLC-BTN-MUJISUNG");
    
        if (btn.onclick) return;

        if (enabled === 2) btn.style.display = "block";

        btn.onclick = mujisung;

        const div = document.getElementById("INGDLC-MUJISUNG");

        div.style.flexDirection = "column";

        const input = document.createElement("input");
        input.type = "text"
        input.id = "INGDLC-MUJISUNG-INPUT";
        input.placeholder = "검색 후 엔터 눌러 복사";
        input.autocomplete = "off";
        input.style.padding = "5px";
        input.style.width = "97%";
        input.style.border = "0";
        input.style.borderRadius = "5px";
        input.style.background = "#CCC";
        input.style.marginBottom = "5px";
        input.style.outline = "0";

        input.onkeyup = search;

        div.append(input);

        const mujisungListDiv = document.createElement("div");
        mujisungListDiv.id = "INGDLC-MUJISUNG-LIST";
        mujisungListDiv.style.overflowY = "auto";
        mujisungListDiv.style.height = "150px";
        div.append(mujisungListDiv);

        setInterval(updateList, 1000);
    }, 600);

    const search = async (e) => {
        await updateList();

        const div = document.getElementById("INGDLC-MUJISUNG-LIST");

        if (e.keyCode === 13 && div.children.length) {
            document.getElementById("INGDLC-MUJISUNG-LIST").children[0].click();
        }
    }

    const updateList = async () => {
        if (!document.getElementById("INGDLC-MUJISUNG-INPUT")) return;

        let mujisungList = await getLargeStorage("mujisungList");
        // console.log(mujisungList);

        if (!mujisungList) mujisungList = ["INGDLC 팝업창을 실행하면 도배 리스트를 서버에서 불러옵니다."];
    
        const mujisungCustomList = (await getConfig("twitch.mujisung.custom")).split("\n");
        let exceptionList = [];
        const exceptionTest = (await getConfig("twitch.mujisung.exception")).split("\n");
        exceptionTest.forEach((e) => {
            if (e.length >= 1) {
                exceptionList.push(e.trim());
            }
        });

        const keyword = document.getElementById('INGDLC-MUJISUNG-INPUT').value;
        const div = document.getElementById("INGDLC-MUJISUNG-LIST");

        div.innerHTML = '';

        const createBox = (text) => {
            const box = document.createElement("div");
            box.style.padding = "2px 5px";
            box.style.borderBottom = "1px solid #CCC";
            box.style.color = "#CCC";
            box.style.cursor = "pointer";
            box.style.fontSize = "12px";
            box.style.overflow = "hidden";
            box.style.textOverflow = "ellipsis";
            box.style.whiteSpace = "nowrap";

            box.onclick = function () { 
                const v = this.innerHTML;

                if (v.indexOf("⬛⬛⬛") === 0) return;

                copyToClipboard(v.substring(v.indexOf(', ')+2));

                mujisung();
            }

            box.onmouseover = function () {
                this.style.background = "#333";
            }

            box.onmouseleave = function () {
                this.style.background = "transparent";
            }

            box.innerHTML = text;

            div.append(box);

            return box;
        }

        // 채팅에서 도배 가져오기
        if (!keyword) {
            const regex = /([\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/;
            const chatLog = [];
            const shortLog = [];
            const allChats = document.getElementsByClassName("msg");
            
            for (let i = 0; i < allChats.length; i++) {
                const chat = allChats[i].innerHTML;
                const short = chat.substr(0, 15);
                function chatPush() {
                    chatLog.push(chat);
                    shortLog.push(short);
                }

                if (chat.length >= 50 && regex.test(chat)) {
                    if (shortLog.includes(short)) continue;
                    if (exceptionList.length <= 1) chatPush();
                    else {
                        exceptionList.forEach(function(e) {
                            if (!chat.includes(e)) chatPush();
                        })
                    }
                    
                }
            }

            for (let i = chatLog.length - 1; i >= Math.max(0, chatLog.length - 3); i--) {
                const box = createBox(chatLog[i]);

                box.style.color = "#FFF";
                box.style.paddingLeft = "15px";
            }
        }
        
        const mujisungCustomList2 = [];
        mujisungCustomList.forEach(v => {
            const trim = v.trim();

            if (trim.length) {
                mujisungCustomList2.push(trim);
            }
        });
    

        if (mujisungCustomList2.length) {
            mujisungCustomList2.unshift("⬛⬛⬛ 사용자 설정 도배목록")
            mujisungCustomList2.forEach(v => {
                if (v.includes(keyword)) {
                    createBox(v);
                }
            });
        }
        Object.entries(mujisungList).forEach((i) => {
            if (i[0] === '0') {
                createBox(i[1]);
                return;
            }
            if (i[0] === 'version') return;
            if (i[0].includes(keyword)) createBox(`⬛⬛⬛${i[0]}`);
            Object.entries(i[1]).forEach((j) => {
                j[1].forEach((k) => {
                    if (j[0].toUpperCase().includes(keyword.toUpperCase()) || k.toUpperCase().includes(keyword.toUpperCase())) createBox(`${j[0]}, ${k}`);
                })
            })

        })
    }

    const mujisung = async () => {
        const el = document.getElementById("INGDLC-MUJISUNG");
        const chat_area = document.getElementById("chat_area");

        if (el.style.display === "none") {
            document.getElementById("INGDLC-MUJISUNG-INPUT").value = "";
            el.style.display = "flex";
            chat_area.style.top = "226px";

            await updateList();
            setTimeout(() => {
                document.getElementById("INGDLC-MUJISUNG-INPUT").focus();
            }, 300)
        } else {
            el.style.display = "none";
            chat_area.style.top = "40px";

            document.getElementsByClassName("write_area")[0].focus();
        }

    }
})();