import { datetime, copyToClipboardOne } from "./utils.mjs";
import { getConfig, setConfig } from './config.mjs';

(async () => {
    let checkLawEnabled = await getConfig("twitch.checkLawAlert.enabled");

    const checkLaw = () => {
        if (checkLawEnabled) {
            return confirm("설정한 화질대로 캡쳐됩니다. 최대화질로 설정 후 캡쳐해주세요.\n\nBJ·저작권자의 동의 없이 녹화된 영상 및 캡쳐 이미지를 공유하는 경우, 그 책임은 전적으로 사용자에게 있습니다.\n\n이를 이해하고 동의하십니까?\n\n이 창은 최초 동의 후 나타나지 않습니다.");
        } else {
            return true;
        }
    }

    // const distinguishElement = document.getElementsByClassName("video_edit")[0];

    // if (distinguishElement) {
    //     clearInterval(buttonClick);
    //     console.log(distinguishElement);
    // } else {
    //     const buttonClick = setInterval(() => {
    //         const btn = document.getElementById("INGDLC-DL");
            
    //         if (btn.onclick) return;
    
    //         btn.onclick = download;
    
    //     }, 600);
    // }


    
    const buttonClick = setInterval(() => {
        const btn = document.getElementById("INGDLC-DL");
        if (document.getElementsByClassName("video_edit")[0]) clearInterval(buttonClick);        
        if (btn.onclick) return;

        btn.onclick = download;

    }, 600);
    
    
    // m3u8 URL Service Worker 로부터 받아오기
    let m3u8Url;
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.url) {
                m3u8Url = request.url;
                setTimeout(() => {
                    document.getElementById("INGDLC-DL").style.color = '#147bb7';
                }, 300);
            }
        }
    );

    // const reader = new FileReader();
    // const regex = /[^0-9]/g;

    // FFmpeg 명령어 복사
    async function download() {
        // console.log(document.getElementsByClassName("video_edit")[0]);
        const dlAlert = document.getElementById("INGDLC-DL-ALERT");
        console.log(datetime());
        console.log(m3u8Url);
        // fetch(m3u8Url)
        //     .then(response => response.text())
        //     .then(data => {
        //         let tsArray = [];
        //         console.log(data);
        //         let dataArray = data.split("\n");
        //         let result = Number(dataArray[dataArray.length-3].replace(regex, ""));
        //         let beforeTs = m3u8Url.substring(0,m3u8Url.length-13);
        //         for (let i=0; i<=result; i++) {
        //             tsArray.push(`${beforeTs}seg-${i}.ts`)
        //         }
        //         console.log(tsArray);
                
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        let path = await getConfig("twitch.path");
        console.log(path);
        let ffmpegCommand = `ffmpeg -i "${m3u8Url}" -c copy "${path}${datetime()}.mp4"`
        if (!checkLaw()) return;
        copyToClipboardOne(ffmpegCommand);
        document.getElementById("INGDLC-DL").style.color = "#707173";
        
        dlAlert.style.display = "block";
        setTimeout(function(){dlAlert.style.display = "none"},3000);

        checkLawEnabled = 0;
        await setConfig("twitch.checkLawAlert.enabled", checkLawEnabled);
    }
    
})();
