// 기본 설정
const defaultConfig = {
    twitch: {
        boxer: {
            enabled: 1,
        },
        pip: {
            enabled: 2,
        },
        mujisung: {
            enabled: 2,
            custom: "⬛⬛⬛도배 리스트\n⬛⬛⬛리스트 추가는 확장 프로그램에서",
            exception: "규칙\n채팅금지\n가능입니다\n푸숑"
        },
        controller: {
            enabled: 2,
        },
        checkLawAlert: {
            enabled: 1,
        },
        path: "",
        autoUp: {
            custom: "nanajam\n"
        },
    },
    cafe: {
        molcom: {
            enabled: 1,
        },
        cheering: {
            enabled: 1,
        },
        twitchalert: {
            enabled: 1,
        },
        alert: {
            articleId: 1,
            commId: 1,
            enabled: 3,
            volume: 50,
            image: "icon",
            title: "INGDLC",
            body: "방장 알림",
            latest: 0,
        },
    }
}

const getAllConfig = async () => {
    const config = (await chrome.storage.sync.get("config"))?.config;

    return JSON.stringify(config);
}

const setAllConfig = async (json) => {
    const config = JSON.parse(json);

    await chrome.storage.sync.set({ config });
}

const getConfig = async (key) => {
    const subKeys = key.split(".");
    let pointer = (await chrome.storage.sync.get("config"))?.config;
    let defaultPointer = defaultConfig;

    subKeys.forEach(subKey => {
        if (pointer == null || pointer[subKey] === undefined) pointer = defaultPointer[subKey];
        else pointer = pointer[subKey];

        defaultPointer = defaultPointer[subKey];
    });

    return pointer;
}

const setConfig = async (key, value) => {
    const config = (await chrome.storage.sync.get("config"))?.config;
    const subKeys = key.split(".");

    const newConfig = config ? config : {};
    let pointer = newConfig;

    for (let i = 0; i < subKeys.length - 1; i++){
        const subKey = subKeys[i];

        if (pointer[subKey] === undefined) pointer[subKey] = {};

        pointer = pointer[subKey];
    }

    pointer[subKeys[subKeys.length - 1]] = value;

    await chrome.storage.sync.set({ config: newConfig });
}

const getLargeStorage = async (key) => {
    try{
        const chunkCount = parseInt((await chrome.storage.sync.get(key + "0"))[key + "0"]);
        let json = "";
    
        for (let i = 1; i <= chunkCount; i++){
            const k = key + String(i);
            json += (await chrome.storage.sync.get(k))[k];
        }
    
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

const setLargeStorage = async (key, value) => {
    const json = JSON.stringify(value);
    const chunkSize = chrome.storage.sync.QUOTA_BYTES_PER_ITEM / 4;

    const chunkCount = Math.ceil(json.length / chunkSize);
    
    await chrome.storage.sync.set({ [key + "0"]: chunkCount });
    
    for (let i = 1; i <= chunkCount; i++){
        const chunk = json.substr((i - 1) * chunkSize, chunkSize);
        await chrome.storage.sync.set({ [key + String(i)]: chunk });
    }
}


export { getConfig, setConfig, getAllConfig, setAllConfig, getLargeStorage, setLargeStorage };