const params = new URLSearchParams(window.location.search),
    geoserver_image = `http://terrabrasilis.dpi.inpe.br/queimadas/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&format=image/png&bgcolor=0xaad3df&tiled=true&bbox=-65,-117,35.2,-34&width=274&height=333&crs=EPSG:4326&layers=paises,FireRisk,estados&styles=firerisk_inpe:white_fill_countries,,thin_line`;
    image_dir = "img",
    image_default = "default.png",
    parameter = params.get('ano'),
    current_date = new Date();

const el = (elements) => {
    if(typeof elements === "string") {
        elements = document.querySelectorAll(elements);
    }
    return elements.length == 1 ? elements[0] : elements;
}

const removeClass = (obj, className) => {
    const elements = el(obj);
    if(typeof elements.length !== "undefined") {
        [].forEach.call(elements, function(element) {
            element.classList.remove(className);
        });
    } else {
        elements.classList.remove(className);
    }
}

const addClass = (obj, className) => {
    const elements = el(obj);
    if(typeof elements.length !== "undefined") {
        [].forEach.call(elements, function(element) {
            element.classList.add(className);
        });
    } else {
        elements.classList.add(className);
    }
}

const HTML = (obj, value) => {
    const elements = el(obj);

    if(typeof elements.length !== "undefined") {
        [].forEach.call(elements, function(element) {
            element.innerHTML = value
        });
    } else {
        elements.innerHTML = value;
    }
    return elements;
}

const remove = (elements) => {
    elements = el(elements);
    if(typeof elements.length !== "undefined") {
        [].forEach.call(elements, function(element) {
            element.parentNode.removeChild(element);
        });
        return;
    }
    elements.parentNode.removeChild(elements);
}

const stopLoadings = () => {
    remove(".inside-loading");
}

const isLeapYear = (y) => {
    return y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)
}

const getDaysInYear = (y) => {
    y = (typeof y == 'undefined' || y < 1998) ? current_date.getFullYear() : y;
    return  isLeapYear() ? 366 : 365;
}

const getDateByDayOfYear = (days, y) => {
    days = (typeof days =="undefined")?current_date.getDayOfYear():days;
    y = (typeof y =="undefined")?current_date.getFullYear():y;
    const date = new Date(y, 0);
    return new Date(date.setDate(days));
}

Date.prototype.getDayOfYear = function() {
    const start = new Date(this.getFullYear(), 0, 0);
    return Math.floor((this - start)/(1000 * 60 * 60 * 24));
}

const fixedYear = () => {
    return typeof parameter !== "undefined" && parameter != null;
}

const lastWeek = () => {
    return (fixedYear() || showing_year >= current_date.getFullYear()) && showing_week >= total_weeks
}

const firstWeek = () => {
    return (fixedYear() || showing_year <= 1998) && showing_week <= 1
}


const controlNextPrev = () => {
    removeClass("#next, #prev", "disabled");

    if(lastWeek()){
        addClass("#next", "disabled");
    }
    if(firstWeek()) {
        addClass("#prev", "disabled");
    }
}

const loadImg = (img) => {
    img = img.target;
    const nm = img.id.split("-");
    const e = el(`#inside-load${nm[2]}${nm[1]}${nm[0]}`);

    if(typeof e === "object" && typeof e.length === "undefined") {
        let body_img = el(`#dt${nm[3]} img`);
        body_img.src = img.src;
        body_img.alt = img.alt;
        body_img.title = img.alt;
        remove(e);
    }
}

const errorImg = (img) => {
    img = img.target;
    const nm = img.id.split("-");
    el(`#dt${nm[3]} img`).src = `${image_dir}/${image_default}`;
    remove(`#inside-load${nm[2]}${nm[1]}${nm[0]}`);
}

const addLoader = (nm) => {
    let div = document.createElement("div");
    div.innerHTML = `<br>${nm[0]}/${nm[1]}/${nm[2]}`
    div.id = `inside-load${nm[2]}${nm[1]}${nm[0]}`
    div.classList.add("inside-loading", "loader")
    document.querySelector(`#dt${nm[3]}`).appendChild(div)
}

const addImage = (nm, file) => {
    let img = new Image();
    img.src = file;
    img.id = nm.join("-")
    img.alt = `${nm[0]}/${nm[1]}/${nm[2]} (${nm[3]})`

    img.onload = loadImg;
    img.onerror = errorImg;

}

const generateWeekData = () => {
    controlNextPrev();

    let start_day = (showing_week == 1 && first_weekday_of_year > 0) ? (7 - first_weekday_of_year) - 7 : (showing_week * 7 - (7 + first_weekday_of_year));
    let total_days = 7;

    if(first_weekday_of_year == 6) {
        start_day = (showing_week == 1) ? 0 : ((showing_week + 1) * 7 - (7 + first_weekday_of_year));
        if(showing_week == 1) {
            total_days++;
        }
    }

    const imgs = el(".data img");

    [].forEach.call(imgs, function(element) {
        element.src = `${image_dir}/${image_default}`;
    });
    
    HTML(".data .dt", "");

    for(let i=0;i<total_days;i++){
        day = start_day + i;

        dt = getDateByDayOfYear(day,showing_year);

        if(dt.getFullYear() != showing_year) {
            continue;
        }

        const d = `0${dt.getDate()}`.slice(-2),
            m = `0${dt.getMonth() + 1}`.slice(-2),
            weekday = dt.getDay(),
            y = dt.getFullYear();

        let file = `${geoserver_image}&time=${y}-${m}-${d}&ano=${y}&mes=${m}&dia=${d}`
        if((y == current_date.getFullYear() && day > current_date.getDayOfYear() - 1) || y > current_date.getFullYear()) {
            label_day_show = (day>getDaysInYear(showing_year)?day-getDaysInYear(showing_year):(day<1?getDaysInYear(showing_year-1)+day:day))
            HTML(`#dt${weekday} .dt`, `${d}/${m}/${y} <b>(${label_day_show})</b>`);
            file = `${image_dir}/${image_default}`
        }

        addLoader([d,m,y,weekday]);
        addImage([d,m,y,weekday], file);

        label_day_show = (day>getDaysInYear(showing_year) ? day-getDaysInYear(showing_year) : (day < 1 ? getDaysInYear(showing_year - 1) + day : day))
        HTML(`#dt${weekday} .dt`, `${d}/${m}/${y} <b>(${label_day_show})</b>`);
    }

    HTML("#week", showing_week);
    HTML("#year", showing_year);
    refreshWeeks();
}

const refreshWeeks = () => {
    HTML("#listWeeks", "");
    for(let i=1;i<=total_weeks;i++){
        let li = document.createElement("li")
        li.value = i
        li.innerHTML = i;

        if(i == showing_week){
            li.classList.add("sel");
        }
        document.querySelector("#listWeeks").appendChild(li);
    }
}

const showWeeksList = () => {
    const list_weeks = el("#listWeeks");
    if(list_weeks.classList.contains("hidden")){
        list_weeks.classList.remove("hidden")        
    }else{
        list_weeks.classList.add("hidden")
    }
}

const nextClick = () => {
    if(lastWeek()) {return;
    }
    stopLoadings();
    showing_week += 1;
    if(showing_week > total_weeks){
        showing_year++;
        dt = getDateByDayOfYear(0, showing_year);
        first_weekday_of_year = dt.getDay();
        total_weeks = parseInt((((first_weekday_of_year+1)+getDaysInYear(showing_year))/7)+1);
        showing_week = 1;
    }
    generateWeekData();
}

const prevClick = () => {
    if(firstWeek()) {return;}

    stopLoadings();
    showing_week -= 1;
    if(showing_week < 1){
        showing_year--;
        dt = getDateByDayOfYear(0, showing_year);
        first_weekday_of_year = dt.getDay();
        total_weeks = parseInt((((first_weekday_of_year+1)+getDaysInYear(showing_year))/7)+1);
        showing_week = total_weeks;
    }
    generateWeekData();
}

document.addEventListener('click', function(event) {
    event.preventDefault();

    if (event.target.matches('#next')) {
        nextClick()
    } 
    
    if(event.target.matches('#week')) {
        showWeeksList();
    }
    
    if(event.target.matches('#listWeeks li')) {
        showWeeksList();
        stopLoadings();
        showing_week = event.target.value;
        generateWeekData();
    }

    if(event.target.matches('#prev')) {
        prevClick();
    }
}, false);

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        if(typeof showing_week === 'undefined' || (typeof showing_year === "number" && showing_year != current_date.getFullYear())){showing_week = 1;}
        generateWeekData();
    }
  };

let showing_year = (typeof parameter === "string" && parseInt(parameter) !== NaN) ? parseInt(parameter) : current_date.getFullYear(),
    dt = getDateByDayOfYear(0, showing_year),
    total_weeks = (dt.getDay() + getDaysInYear(showing_year)) / 7,
    showing_week = (current_date.getDayOfYear() + dt.getDay()) / 7,
    first_weekday_of_year = dt.getDay();


total_weeks = parseInt(total_weeks+(total_weeks>parseInt(total_weeks)?1:0));
showing_week = parseInt(showing_week+(showing_week>parseInt(showing_week)?1:0));
showing_year = showing_year < 1998 ? 1998 : (showing_year > current_date.getFullYear() ? current_date.getFullYear() : showing_year);