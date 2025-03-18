import { getConfig } from "./config.mts";

(async () => {
    const rawBlockList = await getConfig("twitch.blockUser.list") || "";
    const blockList = rawBlockList
        .split("\n")
        .map(t => t.trim())
        .filter(Boolean); // 빈 줄 제거

    const blockGrade = Number(await getConfig("twitch.blockGrade.enabled"));

    function hideElement(targetElement) {
        const grandparent = targetElement.closest("div")?.parentElement?.parentElement;
        if (grandparent) {
            grandparent.style.display = "none";
        }
    }

    function shouldBlockIndividual(el) {
        const userNick = el.getAttribute("user_nick");
        return blockList.includes(userNick);
    }

    function shouldBlockGun(el) {
        return el.getAttribute("grade") === "user";
    }

    function shouldBlockFan(el) {
        return el.getAttribute("grade") === "fan";
    }

    const blockHandlers = [];

    if (blockList.length > 0) blockHandlers.push(shouldBlockIndividual);
    if (blockGrade >= 1) blockHandlers.push(shouldBlockGun);
    if (blockGrade >= 2) blockHandlers.push(shouldBlockFan);

    function processNode(node) {
        const targetElement = node.querySelector?.('[user_nick]') ||
            (node.hasAttribute?.("user_nick") ? node : null);

        if (targetElement) {
            for (const handler of blockHandlers) {
                if (handler(targetElement)) {
                    hideElement(targetElement);
                    break;
                }
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    processNode(node);
                }
            });
        });
    });

    const chatArea = document.getElementById("chat_area");
    if (chatArea) {
        observer.observe(chatArea, { childList: true, subtree: true });
    }
})();












// import { getConfig } from "./config.mts";
//
//
// (async () => {
//     const blockList = (await getConfig("twitch.blockUser.list")).split("\n");
//     blockList.forEach((t, index) => {
//         blockList[index] = t.trim();
//     })
//
//     const blockGrade = await getConfig("twitch.blockGrade.enabled");
//
//     const dontAllowIndividual = (targetElement) => {
//         let userNick = targetElement.getAttribute("user_nick");
//         if (blockList.includes(userNick)) {
//             let grandparent = targetElement.closest("div")?.parentElement?.parentElement;
//             if (grandparent) {
//                 grandparent.style.display = "none";
//             }
//         }
//     }
//
//     const dontAllowGun = (targetElement) => {
//         const userGrade = targetElement.getAttribute("grade");
//         if (userGrade === "user") {
//             let grandparent = targetElement.closest("div")?.parentElement?.parentElement;
//             if (grandparent) {
//                 grandparent.style.display = "none";
//             }
//         }
//     }
//
//     // grade="manager"
//     const dontAllowFan = (targetElement) => { // 비구독자 중 팬인 사람 차단
//         const userGrade = targetElement.getAttribute("grade");
//         if (userGrade === "fan") {
//             let grandparent = targetElement.closest("div")?.parentElement?.parentElement;
//             if (grandparent) {
//                 grandparent.style.display = "none";
//             }
//         }
//     }
//
//
//
//     let mainFunc;
//
//     if (blockList.length === 0) {
//         if (blockGrade === 0) {
//             mainFunc = (node) => {return node}
//         } else if (blockGrade === 1) {
//             mainFunc = (node) => { dontAllowGun(node); }
//         } else {
//             mainFunc = (node) => { dontAllowGun(node); dontAllowFan(node); }
//         }
//     } else {
//         if (blockGrade === 0) {
//             mainFunc = (node) => { dontAllowIndividual(node) }
//         } else if (blockGrade === 1) {
//             mainFunc = (node) => { dontAllowIndividual(node); dontAllowGun(node); }
//         } else {
//             mainFunc = (node) => { dontAllowIndividual(node); dontAllowGun(node); dontAllowFan(node); }
//         }
//     }
//
//     const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             mutation.addedNodes.forEach((node) => {
//                 if (node.nodeType === 1) {
//                     let targetElement = node.querySelector('[user_nick]') ||
//                         (node.hasAttribute("user_nick") ? node : null);
//                     if (targetElement) mainFunc(targetElement);
//                 }
//             });
//         });
//     });
//
//     // body 전체 감시 (새로운 요소가 추가될 때 감지)
//     observer.observe(document.getElementById("chat_area"), { childList: true, subtree: true });
//
//
//
//
// })()