import { copyToClipboard, maxLen } from './utils.mjs';
import { getConfig, getLargeStorage } from './config.mjs';

(async () => {

    const enabled = await getConfig("twitch.mujisung.enabled");

    if (!enabled) return;

    setInterval(() => {
        const btn = document.getElementById("INGDLC-BTN-MUJISUNG");
    
        if (btn.onclick) return;

        if (enabled == 2) btn.style.display = "block";

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

        if (e.keyCode == 13 && div.children.length) {
            document.getElementById("INGDLC-MUJISUNG-LIST").children[0].click();
        }
    }

    const updateList = async () => {
        if (!document.getElementById("INGDLC-MUJISUNG-INPUT")) return;

        let mujisungList = await getLargeStorage("mujisungList");;

        if (!mujisungList) mujisungList = ["크롬에서 잉친쓰 DLC 실행하시면 도배 리스트를 서버에서 불러옵니다."];
    
        const mujisungCustomList = (await getConfig("twitch.mujisung.custom")).split("\n");

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

                copyToClipboard(maxLen(v));

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
    
        mujisungList.forEach(v => {
            if (v.includes(keyword)) {
                createBox(v);
            }
        });
    }

    const mujisung = async () => {
        const el = document.getElementById("INGDLC-MUJISUNG");
        const chat_area = document.getElementById("chat_area");

        if (el.style.display == "none") {
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