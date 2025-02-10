(async () => {
    // TODO: 이거, 카페 Audio Compressor 고치기


    console.log(1);
    const blockList = ["씨삼C3"];

    const observer = new MutationObserver((mutations) => {
        console.log(2);
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 요소 노드인지 확인
                    let targetElement = node.querySelector('[user_nick]') ||
                        (node.hasAttribute("user_nick") ? node : null);

                    if (targetElement) {
                        let userNick = targetElement.getAttribute("user_nick");
                        if (blockList.includes(userNick)) {
                            let grandparent = targetElement.closest("div")?.parentElement?.parentElement;
                            if (grandparent) {
                                grandparent.style.display = "none";
                            }
                        }

                    }
                }
            });
        });
    });

    // body 전체 감시 (새로운 요소가 추가될 때 감지)
    observer.observe(document.getElementById("chat_area"), { childList: true, subtree: true });




})()