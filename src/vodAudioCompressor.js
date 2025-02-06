// chzzk-plus by kyechan99
// Modified: React+TypeScript to VanillaJS, Recomposition of Button

import { getConfig } from "./config.mjs";

(async () => {
    const enabled = await getConfig("twitch.audioComp.enabled");
    if (!enabled) return;

    let audioCtx = null;
    let source = null;
    let compressor = null;
    let acActive = false;
    let video;

    const interval = setInterval(() => {
        video = document.getElementById("video");
        if (acActive) {
            clearInterval(interval);
            return;
        }
        toggleAudioCompression();
    }, 600)

    function toggleAudioCompression() {
        try {
            if (!audioCtx) {
                audioCtx = new AudioContext();
                source = audioCtx.createMediaElementSource(video);
                compressor = audioCtx.createDynamicsCompressor();

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
                acActive = true;
            }
        } catch (e) {
            console.error(e)
        }
    }
})();