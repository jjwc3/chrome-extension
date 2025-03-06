// chzzk-plus by kyechan99
// Modified: React+TypeScript to VanillaJS, Recomposition of Button

import { getConfig } from "./config.mts";

(async () => {
    const enabled = await getConfig("twitch.audioComp.enabled");
    if (!enabled) return;

    let audioCtx = null;
    let source = null;
    let compressor = null;
    let acActive = false;
    let video;

    setInterval(() => {
        video = document.getElementById("livePlayer");
        const btn = document.getElementById("INGDLC-BTN-COMP");

        if (btn.onclick) return;

        if (enabled === 2) btn.style.display = "block";

        btn.onclick = toggleAudioCompression;

    }, 600)

    function toggleAudioCompression() {
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
        }

        if (!acActive) {
            document.getElementById("INGDLC-BTN-COMP-IMG").style.filter = "opacity(0.5) drop-shadow(0 0 0 #7398ff) saturate(500%)";
            source.disconnect(audioCtx.destination);
            source.connect(compressor);
            compressor.connect(audioCtx.destination);
            acActive = true;
            console.log("Compressor ON");
        } else {
            document.getElementById("INGDLC-BTN-COMP-IMG").style.filter = "";
            source.disconnect(compressor);
            compressor.disconnect(audioCtx.destination);
            source.connect(audioCtx.destination);
            acActive = false;
            console.log("Compressor OFF");
        }
    }
})();