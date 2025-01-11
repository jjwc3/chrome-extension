import { getConfig } from './config.mjs';

/*
카페 접속 중 방송 중일 경우 우측 상단에 버튼 생성
 */
(async () => {
    const enabled = await getConfig("cafe.twitchalert.enabled");
    if (!enabled) return;
    
    const NANAJAM_LINK = "https://chapi.sooplive.co.kr/api/nanajam/station";
    let onair;

    setTimeout(() => {
        onair = document.createElement("div");
        onair.style.position = "fixed";
        onair.style.top = "5px";
        onair.style.right = "20px";
        onair.style.padding = "5px";
        onair.style.backgroundColor = "#fee2e2";
        onair.style.color = "#7f1d1d"
        onair.style.opacity = "0.6"
        onair.style.fontWeight = "700";
        onair.style.lineHeight = "1.0";
        onair.style.cursor = "pointer";
        onair.style.display = "none";
        onair.style.borderRadius = "5px";

        onair.innerHTML = "● ON AIR";
        onair.onclick = () => {
            window.open("https://play.sooplive.co.kr/nanajam");
        }

        document.body.appendChild(onair);

        NANAJAM_CHECK();

    }, 1000);

    /*
    방송 중인지 확인, 방송 중일 경우 버튼 보이기, 1분 간격으로 버튼 깜박이기
     */
    function NANAJAM_CHECK(){
        fetch(NANAJAM_LINK).then(response => response.json()).then(res => {
            if (res.broad == null) {
                // console.log('OFFAIR');
                setTimeout(NANAJAM_CHECK, 10000);
            } else {
                // console.log('ONAIR');
                onair.style.display = "block";

                for (let i = 0; i < 5; i++) {
                    setTimeout(() => { onair.style.opacity = "0.1"; }, 300 + 600 * i);
                    setTimeout(() => { onair.style.opacity = "0.6"; }, 600 + 600 * i);
                }

                setTimeout(NANAJAM_CHECK, 60000);
            }
        })
    }
})();