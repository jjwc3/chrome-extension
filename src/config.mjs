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
        path: {
            path: "",
            os: 0,
        },
        autoUp: {
            custom: "nanajam\n"
        },
        reload: {
            enabled: 1
        }
    },
    cafe: {
        molcom: {
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
        read: {
            enabled: 1,
            read: {}
        }
    }
}

/**
 * "json" 받아서 JSON.parse 해서 chrome.storage.sync에 저장. popup에서 '설정 불러오기'에 사용.
 * @param {string} json
 * @returns {Promise<void>}
 */
const setAllConfig = async (json) => {
    const config = JSON.parse(json);

    await chrome.storage.sync.set({ config });
}

/**
 * chrome.storage.sync에서 모든 데이터 불러와서 stringify 해서 return. popup에서 '설정 내보내기' 시 main.js에서 호출해서 base64 인코딩 후 prompt 띄움.
 * @returns {Promise<string>}
 */
const getAllConfig = async () => {
    const config = (await chrome.storage.sync.get("config"))?.config;

    return JSON.stringify(config);
}

/**
 * chrome.storage.sync에 key:value 저장(덮어쓰기). 가끔씩 pointer 오류 생기는데 무시해도 문제는 없었음.
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
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

/**
 * chrome.storage.sync에서 key에 해당하는 value 찾아서 return.
 * @param {string} key
 * @returns {Promise<*>}
 */
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

/**
 * chrome.storage.sync에 key:value 저장. chrome.storage.sync의 저장 용량 한계때문에 도배 리스트 저장·불러오기 시 사용.
 * @param {string} key
 * @param {json} value
 * @returns {Promise<void>}
 */
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

/**
 * chrome.storage.sync에서 key에 해당하는 value 찾아서 return. chrome.storage.sync의 저장 용량 한계때문에 도배 리스트 저장·불러오기 시 사용.
 * @param {string} key
 * @returns {Promise<any|null>}
 */
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


export { getConfig, setConfig, getAllConfig, setAllConfig, getLargeStorage, setLargeStorage };