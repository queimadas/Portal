class panelData {
    #currentMonth;
    #currentYear;
    #dataUrl;
    #year;
    #month;
    #data;
    #dailyChart;
    #stateChart;
    #biomeChart;

    constructor() {
        const date = new Date();
        this.#currentMonth = date.getMonth();
        this.#currentYear = date.getFullYear();
        this.#dataUrl = "json/[year][month].json";
        if(!this.#hasQuerystring()) {
            this.#setMonth(this.#currentMonth);
            this.#setYear(this.#currentYear);
        }
    }

    #hasQuerystring() {
        const urlParams = new URLSearchParams(window.location.search);
        const year = urlParams.get('year');
        const month = urlParams.get('month');
        if(this.#isValidDate(month, year)) {
            this.#setMonth(month - 1);
            this.#setYear(year);
            return true;
        }
        return false;
    }

    #validNumber(value) {
        if(!isNaN(value)) {
            if(Number.isInteger(value)) {
                return true
            }
        }
        return false;
    }

    #isValidDate(month, year) {
        if(! this.#isValidYear(year)) {
            return false;
        }
        if(year == this.year) {
            return month >= 0 && month < this.#currentMonth;
        }
        return this.#isValidMonth(month);
    }
    #isValidMonth(month) {
        if(this.#validNumber(month)) {
            return month >= 0 && month < 12;
        }
        return false;
    }

    #isValidYear(value) {
        if(this.#validNumber(value)) {
            return value > 1998 && value <= this.#currentYear;
        }
        return false;
    }

    #getNumberMonth() {
        let numberMonth = this.#month + 1;
        if(numberMonth < 10) {
            numberMonth = "0" + numberMonth;
        }
        return numberMonth;        
    }

    #getLabelMonth() {
        const labelMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        let labelMonth = labelMonths[this.#month];
        return labelMonth;
    }

    #setMonth(value) {
        if(this.#isValidMonth(value)) {
            this.#month = parseInt(value);
        }
    }

    #getYear() {
        return this.#year;
    }

    #setYear(value) {
        if(this.#isValidYear(value)) {
            this.#year = parseInt(value);
        }
    }

    #setQuerystring() {
        const url = new URL(location);
        url.searchParams.set("year", this.#year);
        url.searchParams.set("month", this.#getNumberMonth());
        history.pushState({}, "", url);
    }

    #setPanelHead() {
        let el = document.querySelector("h2");
        const volume = ["Volume", this.#data.volume].join(" ");
        const number = ["Número", this.#getNumberMonth()].join(" ");
        const dt = [this.#getLabelMonth(), this.#getYear()].join(" ");
        const issn = this.#data.ISSN;

        el.innerHTML = [volume, number, dt, issn].join("&nbsp; &bull; &nbsp;")

    }

    changeCalendar(month, year) {
        if(this.#isValidDate(month, year)) {
            this.#setMonth(month - 1);
            this.#setYear(year);
            this.#fetch();
        }
    }

    #fetch() {
        fetch(this.#dataUrl.replace("[year]", this.#getYear()).replace("[month]", this.#getNumberMonth()))
            .then(response => response.json())
            .then(data => {
                this.#data = data;
                this.#setQuerystring();
                this.#setPanelHead();
                this.#drawCharts();
                this.#drawMaps();
            })
            .catch(error => {
                console.error(error);
            });
    }

    #prepareData(type) {
        const allNames = [],
            allValues = [];
        let sumValues = 0;

        if(!["biome", "state", "daily"].includes(type)) {
            console.warn("Tipo de dados não suportado");
            allNames.push["Não suportado"];
            allValues.push[0];
        } else {
            const dt = this.#data.data[type];
            dt.forEach(item => {
                if(type == "state" && allNames.length > 10) {
                    return;
                }
                if(item.value !== 0) {
                    allNames.push(item.name);
                    allValues.push(item.value);
                    sumValues += item.value;
                }
            });
        }
        return [allNames, allValues, sumValues];
    }

    #plotImage(imgFirespot, el, ctx) {
        let plotDimension = el.width;
        let plotPosition = 0;
        if(el.width > el.height) {
            plotDimension = el.height;
            plotPosition = (el.width - el.height) / 2
        }
        ctx.drawImage(imgFirespot, 0, 0, imgFirespot.width, imgFirespot.height, plotPosition, 0, plotDimension, plotDimension);
    }
    
    #drawFirespotsMap() {
        let imgFirespot = new Image();
        const el = document.getElementById('mapa-focos');
        let ctx = el.getContext('2d');

        var parent = document.getElementById("box-map-firespots");
        el.width = parent.offsetWidth;
        el.height = parent.offsetHeight;

        ctx.clearRect(0, 0, el.width, el.height);

        imgFirespot.src = "img/focos-brasil/" + this.#getNumberMonth() + "-" + this.#year + ".jpg";
        imgFirespot.onload = (e) => {

            this.#plotImage(imgFirespot, el, ctx);

            ctx.font="400 .6rem Montserrat";
            ctx.textBaseline="middle";
            ctx.textAlign = "left";
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, el.height - 30, el.width, el.height)

            ctx.fillStyle = "#000000";
            ctx.fillText("Mapa de distribuição espacial dos focos do satélite de referência", 10, el.height -20);
            ctx.fillText("(AQUA_M-T) acumulados para o Brasil.", 10, el.height -10);
        };
        imgFirespot.onerror = (e) => {
            ctx.font="600 1.5rem Montserrat";
            ctx.textBaseline="middle";
            ctx.textAlign = "center";
            ctx.fillText("Imagem indisponível", el.width/2, el.height/2);
        };
    }

    #drawQuantityFirespotsMap() {
        let imgFirespot = new Image();
        const el = document.getElementById('map-quantity-firespots');
        let ctx = el.getContext('2d');

        var parent = document.getElementById("box-map-quantity-firespots");
        el.width = parent.offsetWidth;
        el.height = parent.offsetHeight;

        ctx.clearRect(0, 0, el.width, el.height);

        imgFirespot.src = "img/focos-estados/" + this.#getNumberMonth() + "-" + this.#year + ".png";
        imgFirespot.onload = (e) => {
            this.#plotImage(imgFirespot, el, ctx);
        };
        imgFirespot.onerror = (e) => {

            ctx.font="600 1.5rem Montserrat";
            ctx.textBaseline="bottom";
            ctx.textAlign = "center";
            ctx.fillText("Imagem", el.width/2, el.height/2);
            
            ctx.textBaseline="top";
            ctx.fillText("indisponível", el.width/2, el.height/2);
        };
    }

    #drawFireriskMap() {
        let imgFirespot = new Image();
        const el = document.getElementById('map-firerisk');
        let ctx = el.getContext('2d');

        var parent = document.getElementById("box-map-firerisk");
        el.width = parent.offsetWidth;
        el.height = parent.offsetHeight;

        ctx.clearRect(0, 0, el.width, el.height);

        imgFirespot.src = "img/risco-fogo/" + this.#getNumberMonth() + "-" + this.#year + ".png";
        imgFirespot.onload = (e) => {
            this.#plotImage(imgFirespot, el, ctx);
        };
        imgFirespot.onerror = (e) => {

            ctx.font="600 1.5rem Montserrat";
            ctx.textBaseline="bottom";
            ctx.textAlign = "center";
            ctx.fillText("Imagem", el.width/2, el.height/2);
            ctx.textBaseline="top";
            ctx.fillText("indisponível", el.width/2, el.height/2);
        };
    }

    #drawBiomeChart() {
        const [names, values, sumValues] = this.#prepareData('biome');
        let total = sumValues;
        const el = document.getElementById('grafico-rosca');
        let ctx = el.getContext('2d');
        if(typeof this.#biomeChart !== "undefined"){
            this.#biomeChart.destroy();
        }
        const data = {
            labels: names,
            datasets: [{
            label: '',
            data: values,
            backgroundColor: ['#df4226', '#e66650', '#e38879', '#e3aba6', '#e4d1d0'],
            hoverOffset: 4,
            }]
        };

        const doughnutLabel = {
            id: 'doughnutLabel',
            beforeDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data } = chart;
                ctx.save();

                ctx.font="600 1rem Montserrat";
                ctx.textBaseline="middle";
                ctx.textAlign = "center";
        
                ctx.fillText(total, el.width/2, el.height/2);
        
                ctx.font="100 .7rem Bebas Neue";
                ctx.fillText("Total de Focos", el.width/2, el.height/2 + 15);

            }
        }
        const config = {
            type: 'doughnut',
            data: data,
            plugins: [ChartDataLabels, doughnutLabel],
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                animation: {
                    duration: 1000
                },
                responsiveAnimationDuration: 0,
                layout: {
                    padding: function(context) {
                        if(context.chart.width < 200) {
                            return {
                                left: 5,
                                right: 10,
                                top: 12,
                                bottom: 0
                            }                 
                        }
                        return {
                            left: 20,
                            right: 20,
                            top: 15,
                            bottom: 0
                        }
                    },
                },
                plugins: {
                    legend: false,
                    tooltip: false,
                    datalabels: {
                        display:  function(context) {
                            return context.chart.chartArea.width > 100;
                        },
                        color: '#333333',
                        align: function(context) {
                            if (context.chart.chartArea.width < 200){
                                return 'center';
                            }
                            if(context.chart.data.labels[context.dataIndex].length < 6) {
                                return 'end';
                            }
                            return 'center';
                        },
                        anchor: 'end',
                        backgroundColor: '#ffffff70',
                        borderRadius: 10,
                        textAlign: 'center',
                        font: {
                            size: 8,
                            weight: 'bold',
                        },
                        formatter: function(value, context) {
                            let label = context.chart.data.labels[context.dataIndex];
                            let text = value + ' (' + Math.round((value*100)/total) + '%)'
                            if(context.chart.chartArea.width < 200) {
                                label = label.toUpperCase().substring(0, 3);
                                text = Math.round((value*100)/total) + '%';
                            }
                            return [label.split(" "), text];
                        }
                    },
                    doughnutlabel: {
                        labels: [
                            {
                                text: total,
                                font: {
                                    size: 20,
                                    weight: 'bold',
                                },
                            },
                            {
                                text: 'total de Focos',
                            },
                        ],
                    },
                },
            }
        };

        this.#biomeChart = new Chart(ctx, config);

    }

    #drawStateChart() {
        const [names, values, sumValues] = this.#prepareData('state');
        const el = document.getElementById('grafico-barras')
        let ctx = el.getContext('2d');

        if(typeof this.#stateChart !== "undefined"){
            this.#stateChart.destroy();
        }

        Chart.defaults.font.size = 9;
        Chart.defaults.font.weight = 'bold'
        const data = {
            labels: names,
            datasets: [{
              label: '',
              data: values,
              backgroundColor: ['#df4226', '#e66650', '#e38879', '#e38879', '#e38879', '#e38879', '#e38879', '#e3aba6', '#e3aba6', '#e3aba6'],
              hoverOffset: 4,
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                animation: {
                    duration: 1000
                },
                responsiveAnimationDuration: 0,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: false,
                    tooltip: false,
                    datalabels: {
                        color: '#333333',
                        align: 'end',
                        anchor: 'end',
                        textAlign: 'center',
                        font: {
                            size: 8,
                            weight: 'bold',
                        }
                    }
                },
            }
        };

        this.#stateChart = new Chart(ctx, config);
    }

    #drawDailyChart() {
        const [names, values, sumValues] = this.#prepareData('daily');
        const el = document.getElementById('grafico-colunas')
        let ctx = el.getContext('2d');
        if(typeof this.#dailyChart !== "undefined"){
            this.#dailyChart.destroy();
        }
        Chart.defaults.font.size = 9;
        Chart.defaults.font.weight = 'bold'
        const data = {
            labels: names,
            datasets: [{
              label: '',
              data: values,
              backgroundColor: ['#df4226'],
              hoverOffset: 4,
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000
                },
                responsiveAnimationDuration: 0,
                scales: {
                    y: {
                        padding: 50,
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 17,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: false,
                    tooltip: false,
                    padding: 2,
                    datalabels: {
                        display:  function(context) {
                            return context.chart.chartArea.width > 100;
                        },
                        color: '#000000',
                        align: 'end',
                        anchor: 'end',
                        textAlign: 'center',
                        font: {
                            size: 8,
                            weight: 'bold',
                        }
                    }
                },
            }
        };
        this.#dailyChart = new Chart(ctx, config);
    }

    #drawCharts() {
        const yearsel = document.querySelector("#yearsel"),
            monthsel = document.querySelector("#monthsel");
        yearsel.innerHTML = this.#year
        monthsel.innerHTML = this.#getNumberMonth();
        this.#drawDailyChart();
        this.#drawStateChart();
        this.#drawBiomeChart();
    }

    #drawMaps() {
        this.#drawFirespotsMap();
        this.#drawQuantityFirespotsMap();
        this.#drawFireriskMap();
    }

    loadData(year, month) {
        this.#setMonth(month);
        this.#setYear(year);
        this.#fetch();
    }
};



function generatePDF() {
    let doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: "landscape",
        putOnlyUsedFonts:true
    });
    document.querySelector('.btn-group').style.display = 'none';
    doc.html(
         document.body,
         {
            callback: function (doc) {
                document.querySelector('.btn-group').style.display = "";
                doc.output("dataurlnewwindow");
            },
            fontFaces: [
                {
                    family:'Bebas Neue',
                    src: [{url:'fonts/BebasNeue-Regular.ttf', format:'truetype'}]
                },
                {
                    family:'Montserrat',
                    src: [{url:'fonts/Montserrat-Regular.ttf', format:'truetype'}, {url:'fonts/Montserrat-Bold.ttf', format:'truetype'}]
                }
            ],
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                // logging: true,
                imageTimeout: 40000,
                // w: 841.89,
                // h: 595.28,
                x: 0,
                y:0,
                scale:.15
            }
        }
    );
    // doc.save("two-by-four.pdf");
}

let panel = new panelData();

document.querySelector("#btn-next").addEventListener("click", () => {
    const monthsel = document.querySelector("#monthsel").innerHTML,
        yearsel = document.querySelector("#yearsel").innerHTML
    panel.changeCalendar(parseInt(monthsel) + 1, parseInt(yearsel));
})

document.querySelector("#btn-prev").addEventListener("click", () => {
    const monthsel = document.querySelector("#monthsel").innerHTML,
        yearsel = document.querySelector("#yearsel").innerHTML
    panel.changeCalendar(parseInt(monthsel) - 1, parseInt(yearsel));

})

window.onload = function() {
    panel.loadData();
};