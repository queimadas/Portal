google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawDonutChart() {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Amazônia',     1226],
        ['Cerrado',      763],
        ['Mata Atlântica',  379],
        ['Caatinga', 155],
        ['Pampa',    153]
    ]);

    var options = {
        'width':'100%',
        'height':'100%',
        pieHole: 0.68,
        backgroundColor: 'transparent',
        legend: {position: 'labeled'},
        chartArea:{left:'0',top:'20%',width:'100%',height:'70%'},
        slices: [{color: '#df4226'}, {color: '#e66650'}, {color: '#e38879'}, {color: '#e3aba6'}, {color: '#e4d1d0'}],
        pieSliceBorderColor: "transparent",
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('grafico-rosca'));
    chart.draw(data, options);
}


function drawColumnChart() {
    var data = google.visualization.arrayToDataTable([
        ["Estado", "Total", { role: "style" } ],
        ["1", 19, "color: #df4226"],
        ["2", 66, "color: #df4226"],
        ["3", 29, "color: #df4226"],
        ["4", 80, "color: #df4226"],
        ["5", 103, "color: #df4226"],
        ["6", 69, "color: #df4226"],
        ["7", 65, "color: #df4226"],
        ["8", 31, "color: #df4226"],
        ["9", 45, "color: #df4226"],
        ["10", 37, "color: #df4226"],
        ["11", 147, "color: #df4226"],
        ["12", 119, "color: #df4226"],
        ["13", 74, "color: #df4226"],
        ["14", 76, "color: #df4226"],
        ["15", 52, "color: #df4226"],
        ["16", 158, "color: #df4226"],
        ["17", 111, "color: #df4226"],
        ["18", 153, "color: #df4226"],
        ["19", 145, "color: #df4226"],
        ["20", 146, "color: #df4226"],
        ["21", 165, "color: #df4226"],
        ["22", 350, "color: #df4226"],
        ["23", 113, "color: #df4226"],
        ["24", 101, "color: #df4226"],
        ["25", 107, "color: #df4226"],
        ["26", 41, "color: #df4226"],
        ["27", 40, "color: #df4226"],
        ["28", 26, "color: #df4226"],
        ["29", 15, "color: #df4226"],
        ["30", 50, "color: #df4226"],
        ["31", 26, "color: #df4226"]
    ]);

    var options = {
        'width':'100%',
        'height':'100%',
        backgroundColor: 'transparent',
        legend: {position: 'none'},
        chartArea:{left:'3%',top:'20%',width:'94%',height:'70%'},
        pieSliceText: "labeled",
        tooltip: {
            trigger: "none"
        },
        hAxis : { 
            textStyle : {
                fontSize: 9,
                bold: true,
                fontWeight: "900",
                color: "#df4226"
            }
        },
        vAxis: {
            textStyle : {
                fontSize: 9,
                bold: true,
                fontWeight: "900",
                color: "#df4226"
            }
        },
        annotations: {
            alwaysOutside: true,
            stemColor : 'none',
            textStyle: {
                fontSize: 9,
                bold: true,
                auraColor: 'none',
                color: '#333333'
            }
        }
    };

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var chart = new google.visualization.ColumnChart(document.getElementById('grafico-colunas'));
    chart.draw(view, options);
}

function drawBarChart() {
    var data = google.visualization.arrayToDataTable([
        ["Estado", "Total", { role: "style" } ],
        ["MT", 556, "color: #df4226"],
        ["RR", 371, "color: #e66650"],
        ["MS", 205, "color: #e38879"],
        ["PA", 202, "color: #e38879"],
        ["MA", 185, "color: #e38879"],
        ["RS", 174, "color: #e38879"],
        ["AM", 157, "color: #e38879"],
        ["BA", 149, "color: #e3aba6"],
        ["MG", 110, "color: #e3aba6"],
        ["RO", 80, "color: #e3aba6"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        'width':'100%',
        'height':'100%',
        chartArea:{left:'7%',top:'10%',width:'85%',height:'80%'},
        backgroundColor: 'transparent',
        legend: {position: 'none'},
        tooltip: {
            trigger: "none"
        },
        annotations: {
            alwaysOutside: true,
            stemColor : 'none',
            textStyle: {
                fontSize: 9,
                bold: true,
                auraColor: 'none',
                color: '#333'
            }
        },
        hAxis: {
            viewWindowMode: 'explicit',
            gridlines: {
                count: 10,
            },
            textStyle : {
                fontSize: 9,
                bold: true,
                fontWeight: "900",
                color: "#333"
            }
        },
        vAxis: {
            textStyle : {
                fontSize: 9,
                bold: true,
                fontWeight: "900",
                color: "#333"
            }
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById('grafico-barras'));
    chart.draw(view, options);
}


function drawChart() {
    drawColumnChart();
    drawBarChart();
    drawDonutChart();
}