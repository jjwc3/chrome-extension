import { getConfig } from './config.mts';

/*
카페 음량 자동 조절
 */
(async () => {
    const enabled = await getConfig("cafe.audioComp.enabled");
    if (!enabled) return;

    const mainFunc = async () => {
        const interval = setInterval(async () => {
            try {
                const iframeDocument = document.getElementById("cafe_main").contentDocument;
                const video = iframeDocument.querySelector("video");
                if (video === null) return;
                video.addEventListener("play", () => {
                    const finish = audioCompression(video);
                    if (finish === true) clearInterval(interval);
                })

            } catch (e) {
                console.log(e);
            }
        }, 1000);
    }

    function audioCompression(video) {
        try {
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaElementSource(video);
            const compressor = audioCtx.createDynamicsCompressor();

            // Compressor 설정
            compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
            compressor.knee.setValueAtTime(40, audioCtx.currentTime);
            compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
            compressor.attack.setValueAtTime(0, audioCtx.currentTime);
            compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

            source.connect(audioCtx.destination);
            source.disconnect(audioCtx.destination);
            source.connect(compressor);
            compressor.connect(audioCtx.destination);
            console.log("Audio Compressing");
            return true;
        } catch (e) {
            return false;
        }

    }

    const observer = new MutationObserver(() => {
        if (!(document.title === "Cafe")) mainFunc();
        observer.disconnect();
        setTimeout(() => {
            observer.observe(document.querySelector("title"), {
                childList: true,
                subtree: true,
            })
        }, 1000)
    });
    observer.observe(document.querySelector("title"), {
        childList: true,
        subtree: true,
    });
})();