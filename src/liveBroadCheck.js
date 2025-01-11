import {getConfig} from './config.mjs';

let checkIntervalFlag = false;

setTimeout(async () => {
    if (!(await getConfig("twitch.reload.enabled"))) return;
    const userId = document.getElementById("streamerNick").dataset.bj_id;
    fetch(`https://chapi.sooplive.co.kr/api/${userId}/station`)
        .then(response => response.json())
        .then(json => {
            if (json === null || json.broad === null) {
                checkLoop(userId);
            }
        })
    const mutationFunc = (mutationList, observer) => {
        if (document.getElementById("layerAirOff")) {
            checkLoop(userId);
            observer.disconnect();
        }
    }
    const observer = new MutationObserver(mutationFunc);
    observer.observe(document.getElementById("modal"), {
        childList: true,
        subtree: true,
        attributeOldValue: true,
    })
}, 1000)

function checkLoop(uid) {
    // observer에서 중복체크가 발생해서 interval 을 한번만 실행시키기위해 플래그 체크를 합니다.
    if (checkIntervalFlag) return;
    checkIntervalFlag = true;
    console.log('방송이 시작되면 새로고침 합니다.');
    const interval = setInterval(function(){
        fetch(`https://chapi.sooplive.co.kr/api/${uid}/station`)
            .then(response => response.json())
            .then(json => {
                if (json === null || json.broad === null) {
                    return;
                }
                checkIntervalFlag = false;
                clearInterval(interval);
                window.location.href = `https://play.sooplive.co.kr/${uid}`;
            })
    },3000);
}
