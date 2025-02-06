(async () => {

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    /**
     *
     * @param {Array} arr
     * @param {any} value
     * @returns {*[]}
     */
    function findAll(arr, value) {
        const indices = [];
        arr.forEach((element, index) => {
            if (element === value) {
                indices.push(index);
            }
        });
        return indices;
    }

    /**
     * 구글 스프레드시트에서 값을 가져와 오늘, 내일 일정을 반환함.
     * @param {number[]} date - [year, month, date]
     * @returns {Promise<string[]>}
     */
    const fetchSchedule = async (date) => {
        const url = "https://docs.google.com/spreadsheets/d/1FOZdya-n8Rv2GMBOqecv_rOA8swGGLUJE6hA_LYv6wg/export?format=csv"

        let csv = [];
        (await (await fetch(url)).text()).split("\n").forEach((t) => {
            csv.push( t.split(",") )
        })

        if (date[0] !== Number(csv[0][3]) || date[1] !== Number(csv[0][13])) return ["noMatch", "noMatch"];

        const rowDateIndex = [2, 5, 8, 11, 14, 17];
        const columnDayIndex = [3, 8, 13, 18, 23, 28, 33];

        let dateArr = [];
        let textArr = [];

        rowDateIndex.forEach((dateIndex) => {
            columnDayIndex.forEach((dayIndex) => {
                dateArr.push(csv[dateIndex][dayIndex].trim())
                textArr.push(csv[dateIndex+1][dayIndex].trim())
            })
        })
        const oneIndex = findAll(dateArr, "1");
        dateArr = dateArr.slice(oneIndex[0], oneIndex[1]);
        textArr = textArr.slice(oneIndex[0], oneIndex[1]);

        if (Number(dateArr[date[2]-1]) !== date[2]) return ["err", "err"];
        else return [textArr[date[2]-1], textArr[date[2]]]
    }

    const reload = document.getElementById("schedule-reload");
    let elementToday = document.getElementById("schedule-today");
    let elementTomorrow = document.getElementById("schedule-tomorrow");

    const update = async () => {
        let schedule = await fetchSchedule([yyyy,mm,dd]);
        schedule.forEach((value, index) => {
            if (value === "") schedule[index] = "정규방송";
        })

        if (schedule[0] === "noMatch" || schedule[0] === "err") {
            elementToday.innerHTML = "오류가 발생했습니다.";
            elementToday.style.color = "#f14343";
            elementTomorrow.innerHTML = "오류가 발생했습니다.";
            elementTomorrow.style.color = "#f14343";
        } else {
            elementToday.innerHTML = schedule[0];
            if (schedule[0].includes("휴방")) elementToday.style.color = "#f14343";
            else elementToday.style.color = "#000000";
            elementTomorrow.innerHTML = schedule[1];
            if (schedule[1].includes("휴방")) elementTomorrow.style.color = "#f14343";
            else elementTomorrow.style.color = "#000000";
        }
    }

    reload.addEventListener("click", await update);

    await update();
})()