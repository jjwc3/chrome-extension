import { log, copyToClipboard, maxLen } from "./src/utils.mjs";
import { getConfig, setConfig, getAllConfig, setAllConfig, setLargeStorage } from "./src/config.mjs";

/********************
Fetch data from server
********************/

document.getElementById("version-current")!.innerHTML = chrome.runtime.getManifest().version;

let mujisungList:{ version:string };
fetch("https://jjwc3.github.io/ingdlc-new-mlist/list.json", {
    mode: 'no-cors'
}).then(response => response.json()).then(async function (json){
    let version;

    try{
        mujisungList = json;
        await setLargeStorage("mujisungList", mujisungList);
        version = mujisungList.version;

        document.getElementById("version-new")!.innerHTML = version;
        if (version !== document.getElementById("version-current")!.innerHTML)
            document.getElementById("notice")!.style.display = "block"; // 버전 불일치 시 알림창 표시

    }catch (e){
        log("mlist Fetch Error.");
        console.error(e);
        // log(e);
        return;
    }

    updateMujisungList();
});

/********************
Load Configs
********************/
const saveFn = async (e: Event | KeyboardEvent) => {
    let value;
    try {
        value = JSON.parse((e.target as HTMLInputElement).value);
    } catch (ex) {
        value = (e.target as HTMLInputElement).value;
    }

    await setConfig((e.target as HTMLInputElement).id, value);
    log("저장되었습니다.");
}

(async () => {
    const configElements = document.getElementsByClassName("config");

    for (let i = 0; i < configElements.length; i++){ // 저장할 HTML Element 순회
        const configElement = configElements[i];
        const data = await getConfig(configElement.id);
    
        if (configElement.tagName === "SELECT" && configElement instanceof HTMLSelectElement) {
            for (let j = 0; j < configElement.options.length; j++){  
                const optionElement = configElement.options[j];

                if(JSON.parse(optionElement.value) === data){
                    optionElement.selected = true;
                }
            }
        } else if (configElement instanceof HTMLTextAreaElement || configElement instanceof HTMLInputElement) {
            configElement.value = data;
        }

        configElement.addEventListener("change", saveFn);
        configElement.addEventListener("keyup", saveFn);
    }
})();

document.getElementById("config-reset")?.addEventListener("click", async () => {
    if (confirm("모든 설정을 초기화하시겠습니까?")) {
        alert("초기화되었습니다.")

        await chrome.storage.sync.set({ config: null });
        // location.reload();
    }
});

document.getElementById("config-save")?.addEventListener("click", async () => {
    console.log(await getAllConfig());
    const json = btoa(encodeURIComponent(await getAllConfig()));

    prompt("다음 내용을 복사하여 저장하십시오.", json)
})

document.getElementById("config-load")?.addEventListener("click", async () => {
    const json = prompt("복사한 설정을 입력하십시오.");

    if (json !== null) {
        try{
            console.log(decodeURIComponent(atob(json)));
            await setAllConfig(decodeURIComponent(atob(json)));

            alert("설정을 불러왔습니다.")
            location.reload();
        } catch (e) {
            // log(e);
            alert("설정을 불러오는 중 오류가 발생하였습니다.");
            console.error(e);
        }
    }

});

/********************
Mujisung
********************/

document.getElementById("mujisung-search")?.addEventListener("change", updateMujisungList);
document.getElementById("twitch.mujisung.custom")?.addEventListener("keyup", () => {
    updateMujisungList();
});
document.getElementById("twitch.mujisung.exception")?.addEventListener("keyup", () => {
    updateMujisungList();
});

const mujisungElement = document.getElementById("mujisung") as HTMLSelectElement;
mujisungElement.onchange = async function (){
    let v = mujisungElement.options[mujisungElement.selectedIndex].value;

    if (v.indexOf("⬛⬛⬛") === 0) return;
    await copyToClipboard(v);

    mujisungElement.selectedIndex = 0;
    (document.getElementById('mujisung-search') as HTMLInputElement).value = '';
    updateMujisungList();
}

function updateMujisungList(){
    let keyword = (document.getElementById('mujisung-search') as HTMLInputElement).value;

    mujisungElement.innerHTML = '';
    mujisungElement.options.add(
        new Option('도배 리스트', '도배 리스트', false)
    );

    mujisungElement.options.add(
        new Option('⬛⬛⬛ 사용자 설정 도배목록', '⬛⬛⬛ 사용자 설정 도배목록', false)
    );

    (document.getElementById("twitch.mujisung.custom") as HTMLTextAreaElement).value.split("\n").forEach(option => {
        if (option.includes(keyword)) {
            mujisungElement.options.add(
                new Option(maxLen(option), option, false)
            )
        }
    });

    mujisungElement.options.add(
        new Option('', '', false)
    );

    // 도배 리스트 성능 개선, 코드 간결화로 다음 코드 주석 처리

    // mujisungList.forEach(option => {
    //     if (option.includes(keyword) || option.length < 2 || option.includes('⬛⬛⬛')) {
    //         document.getElementById('mujisung').options.add(
    //             new Option(maxLen(option), option, false)
    //         )
    //     }
    // });
    // let mujisungValues = Object.values(mujisungList);
    // console.log(mujisungValues);
    // for (let i of mujisungValues) {
    //     if (typeof i == "string") continue;
    //     let pair = Object.entries(i);

    // }
    // console.table(mujisungList);
    // 이름, 내용
    // for (let bigKey in mujisungList) {
    //     if (bigKey === "version") continue;
    //
    //     const bigValue = mujisungList[bigKey];
    //     for (let smallKey in bigValue) { // smallKey == Name
    //         const smallValue = bigValue[smallKey]; // list
    //         smallValue.forEach((text) => {
    //             testList.push(`${smallKey}, ${text}`)
    //             document.getElementById('mujisung').options.add(
    //                 new Option(`${smallKey}, ${text}`, text, false)
    //             )
    //         })
    //     }
    // }
    //
    // let mujisungPair = Object.entries(mujisungList);
    // for (let i = 0; i < mujisungPair.length; i++) {
    //     if (typeof mujisungPair[i][1] == "string") continue;
    //     let mujisungPairSecond = Object.entries(mujisungPair[i][1]);
    //     for (let j = 0; j < mujisungPairSecond.length; j++) {
    //         mujisungPairSecond[j][1].forEach(t => {
    //             if (mujisungPairSecond[j][0].includes(keyword) || t.includes(keyword) || t.length < 2 || t.includes('⬛⬛⬛')) {
    //                 // console.log(`${mujisungPairSecond[j][0]}, ${t}`);
    //                 testtest.push(`${mujisungPairSecond[j][0]}, ${t}`);
    //                 document.getElementById('mujisung').options.add(
    //                     new Option(`${mujisungPairSecond[j][0]}, ${t}`, t, false)
    //                 )
    //             }
    //         })
    //     }
    // }
    Object.entries(mujisungList).forEach(([bigKey, bigValue]) => {
        if (bigKey === "version" || typeof bigValue !== "object") return;
        Object.entries(bigValue).forEach(([smallKey, smallValue]) => {
            const options = (smallValue as [string]).map(text => {
                return new Option(`${smallKey}, ${text}`, text, false);
            });
            options.forEach(option => mujisungElement.options.add(option));
        });
    });

}

/********************
Save Path
********************/
// 기존 코드 작동 방식과 동일하게 HTML 수정 후 불필요
// document.getElementById("pathSave").addEventListener("click", async () => {
//     document.getElementById("pathSaveComplete").style.display = 'block';
//     let firstPath = document.getElementById("pathInput").value;
//     if (firstPath.includes('\\') && firstPath[firstPath.length-1] !== '\\') {
//         firstPath = firstPath+'\\';
//     }
//     if (firstPath.includes('/') && firstPath[firstPath.length-1] !== '/') {
//         firstPath += '/';
//     }
//
//     await setConfig("twitch.path",firstPath);
//     console.log(await getConfig("twitch.path"));
//     setTimeout(() => {
//         document.getElementById("pathSaveComplete").style.display = 'none';
//     }, 2000)
// })