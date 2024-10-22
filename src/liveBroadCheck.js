let checkIntervalFlag = false;
/**
setTimeout( () => {

    let node = document.getElementsByTagName("body")[0];
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    function windowFunc() {
        window.postMessage({type:"DLC_PAGE", key:window.szBjId}, "*");
    }
    script.text = `(${windowFunc.toString()})();`;;
    node.appendChild(script);

    window.addEventListener("message", (e) => {
        if (e.source !== window) return;
        if (e.data.type && e.data.type === "DLC_PAGE") {
            console.log(e.data.key)
        }
    });

    const userId = document.getElementById("streamerNick").dataset.bj_id;
    console.log(userId)
    const notBroading = document.getElementsByClassName("depend_item")[0].style.cssText;
    if(notBroading.includes("display: none")){
        checkLoop(userId);
    }
    const broadOffTarget = document.getElementsByClassName("depend_item")[0];
    const observer = new MutationObserver(mutations => {
        mutations.forEach(function(mutation) {
            // 스타일 속성의 변경을 확인
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                console.log(1)
                // 스타일 속성이 변경된 요소
                let targetElement = mutation.target;
                // 변경된 스타일 속성 가져오기
                let newStyle = targetElement.style.cssText;
                // 방종을 하면 layerAirOff 요소에 "display: block" 이 추가됩니다.
                if (newStyle.includes('display: none')) {
                    checkLoop(userId);
                }
            }
        });
    })
    // 감시할 대상 요소 및 구성 옵션
    const config = { attributes: true, attributeFilter: ['style'], subtree: false };
    // 감시 시작
    observer.observe(broadOffTarget, config);
},3000)
*/

setTimeout(() => {
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
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = 'json'
    const interval = setInterval(function(){
        // xhr.open("GET", `https://chapi.sooplive.co.kr/api/${userId}/station`)
        // xhr.send();
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

    // xhr.onreadystatechange = ()=>{
    //     if(xhr.response === null || xhr.response.broad === null) {
    //         return
    //     }
    //     checkIntervalFlag = false;
    //     clearInterval(interval)
    //     window.location.href = `https://play.sooplive.co.kr/${userId}/`;
    // }
}
