import { datetime } from './utils.mjs';
import { getConfig, setConfig } from './config.mjs';

(async () => {

    const enabled = await getConfig("twitch.controller.enabled");
    let checkLawEnabled = await getConfig("twitch.checkLawAlert.enabled");
    const upBj = (await getConfig("twitch.autoUp.custom")).split("\n");

    if (!enabled) return;

    let video;
    
    // 캡쳐 버튼 활성화
    setInterval(() => {
        const btn = document.getElementById("INGDLC-BTN-CAPTURE");
        
        if (btn.onclick) return;

        if (enabled === 2) btn.style.display = "block";

        btn.onclick = capture;

        video = document.getElementsByTagName("video")[0];
    }, 600);

    const checkLaw = () => {
        if (checkLawEnabled) {
            return confirm("설정한 화질대로 캡쳐됩니다. 최대화질로 설정 후 캡쳐해주세요.\n\nBJ·저작권자의 동의 없이 녹화된 영상 및 캡쳐 이미지를 공유하는 경우, 그 책임은 전적으로 사용자에게 있습니다.\n\n이를 이해하고 동의하십니까?\n\n이 창은 최초 동의 후 나타나지 않습니다.");
        } else {
            return true;
        }
    }

    // 캡쳐
    async function capture() {
        const parentQ = document.getElementsByClassName("btn_quality_mode")[0];
        let h = parseInt(parentQ.children[0].innerHTML);
        let w = h*16/9;

        const canvas = document.createElement('canvas');

        canvas.width = w;
        canvas.height = h;

        let ctx = canvas.getContext('2d');
        ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

        let url = canvas.toDataURL('image/png');
        const a = document.createElement("a")
        a.href = url

        if (!checkLaw()) return;

        a.download = `[잉친쓰 DLC] 캡쳐 ${datetime()}.png`
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url);
        
        checkLawEnabled = 0;
        await setConfig("twitch.checkLawAlert.enabled", checkLawEnabled);
    }

    // AfreecaTV 자동 UP
    let afreecaUp = setInterval(() => {
        let bj = location.href.split("/")[3];
        if (!upBj.includes(bj)) clearInterval(afreecaUp);
        let dom = document.getElementsByClassName("up_recommend")[0].firstElementChild;
        dom.click();
        if (dom.className === 'on') clearInterval(afreecaUp);
    }, 1000);

    // 자정 넘어가면 자동 UP
    const today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    let time = hour*3600 + min*60 + sec;
    console.log(time);
    setTimeout(() => {
        let afreecaUp = setInterval(() => {
            let bj = location.href.split("/")[3];
            if (!upBj.includes(bj)) clearInterval(afreecaUp);
            let dom = document.getElementsByClassName("up_recommend")[0].firstElementChild;
            if (upBj.includes(bj)) dom.click();
            if (dom.className === 'on') clearInterval(afreecaUp);
        }, 1000);
    }, (86400-time)*1000+2000);
    

    // 채팅창 광고 제거
    const chatAd = document.getElementById("chat_ad");
    setTimeout(() => {
        chatAd.remove();
    }, 500);
    
})();
