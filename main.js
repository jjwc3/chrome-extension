import { log, copyToClipboard, maxLen } from "./src/utils.mjs";
import { getConfig, setConfig, getAllConfig, setAllConfig, setLargeStorage } from "./src/config.mjs";

/********************
Fetch data from server
********************/
document.getElementById("version-current").innerHTML = chrome.runtime.getManifest().version

fetch("https://cafe.daum.net/_c21_/bbs_read?grpid=1YV3j&fldid=pr4o&page=1&prev_page=null&firstbbsdepth=null&lastbbsdepth=null&contentval=00Eqbzzzzzzzzzzzzzzzzzzzzzzzzz&selectyn=Y", {
    mode: 'no-cors'
}).then(response => response.text()).then(async function (text){
    let version;

    try{
        text = text.split("\n");
        let capture = false;

        for (let i = 0; i < text.length; i++){
            let txt = text[i].trim();
    
            if (txt == "@NANAJAM_BEGIN") capture = true;
            else if (txt == "@NANAJAM_END") break;
            else if (capture){
                mujisungList.push(txt);
            }
        }

        await setLargeStorage("mujisungList", mujisungList);

        for (let i = 0; i < text.length; i++){
            let txt = text[i].trim();
    
            if (txt == "@NANAJAM_VERSION") capture = true;
            else if (txt == "@NANAJAM_VERSION_END") break;
            else if (capture){
                version = txt;
            }
        }

    }catch (e){
        log("잉친쓰 로그인 후 도배툴 업데이트가 진행됩니다.");
        log(e);
        return;
    }
    
    updateMujisungList();
});

/********************
Load Configs
********************/
const saveFn = async (e) => {
    log("저장되었습니다.")

    let value;
    try {
        value = JSON.parse(e.target.value);
    } catch (ex) {
        value = e.target.value;
    }

    await setConfig(e.target.id, value);
}

(async () => {
    const configElements = document.getElementsByClassName("config");
    for (let i = 0; i < configElements.length; i++){
        const configElement = configElements[i];
        const data = await getConfig(configElement.id);
    
        if (configElement.tagName == "SELECT") {
            for (let j = 0; j < configElement.options.length; j++){  
                const optionElement = configElement.options[j];

                if(JSON.parse(optionElement.value) == data){
                    optionElement.selected = true;
                }
            }
        } else {
            configElement.value = data;
        }

        configElement.addEventListener("change", saveFn);
        configElement.addEventListener("keyup", saveFn);
    }
})();

document.getElementById("config-reset").addEventListener("click", () => {
    if (confirm("모든 설정을 초기화하시겠습니까?")) {
        alert("초기화되었습니다.")

        chrome.storage.sync.set({ config: null });
        location.reload();
    }
});

document.getElementById("config-save").addEventListener("click", async () => {
    const json = btoa(unescape(encodeURIComponent(await getAllConfig()))); 

    prompt("다음 내용을 복사하여 저장하십시오.", json)
})

document.getElementById("config-load").addEventListener("click", async () => {
    const json = prompt("복사한 설정을 입력하십시오.");

    try{
        await setAllConfig(decodeURIComponent(escape(atob(json))));

        alert("설정을 불러왔습니다.")
        location.reload();
    } catch (e) {
        log(e);
        alert("설정을 불러오는 중 오류가 발생하였습니다.");
    }
});

/********************
Mujisung
********************/
let mujisungList = [];

document.getElementById("mujisung-search").addEventListener("change", updateMujisungList);
document.getElementById("twitch.mujisung.custom").addEventListener("keyup", (e) => {
    updateMujisungList();
});

document.getElementById("mujisung").onchange = function (){
    let v = document.getElementById("mujisung").options[document.getElementById("mujisung").selectedIndex].value;

    if (v.indexOf("⬛⬛⬛") === 0) return;

    copyToClipboard(v);

    document.getElementById("mujisung").selectedIndex = 0;
    document.getElementById('mujisung-search').value = '';
    updateMujisungList();
}

function updateMujisungList(){
    let keyword = document.getElementById('mujisung-search').value;

    document.getElementById('mujisung').innerHTML = '';
    document.getElementById('mujisung').options.add(
        new Option('도배 리스트', '도배 리스트', false)
    );

    document.getElementById('mujisung').options.add(
        new Option('⬛⬛⬛ 사용자 설정 도배목록', '⬛⬛⬛ 사용자 설정 도배목록', false)
    );
    
    document.getElementById("twitch.mujisung.custom").value.split("\n").forEach(option => {
        if (option.includes(keyword)) {
            document.getElementById('mujisung').options.add(
                new Option(maxLen(option), option, false)
            )
        }
    });

    document.getElementById('mujisung').options.add(
        new Option('', '', false)
    );

    mujisungList.forEach(option => {
        if (option.includes(keyword) || option.length < 2 || option.includes('⬛⬛⬛')) {
            document.getElementById('mujisung').options.add(
                new Option(maxLen(option), option, false)
            )
        }
    });
}

/********************
Save Path
********************/
document.getElementById("pathSave").addEventListener("click", async () => {
    let firstPath = document.getElementById("pathInput").value;
    if (firstPath.includes('\\') && firstPath[firstPath.length-1] != '\\') {
        firstPath = firstPath+'\\';
    }
    if (firstPath.includes('/') && firstPath[firstPath.length-1] != '/') {
        firstPath += '/';
    }

    await setConfig("twitch.path",firstPath);
    console.log(await getConfig("twitch.path"));
})