google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChartBioma() {
    let total = 2759;
    let ctx = document.getElementById('grafico-rosca').getContext('2d');
    const data = {
        labels: [
          'Amazônia',
          'Cerrado',
          'Mata Atlântica',
          'Caatinga',
          'Pampa'
        ],
        datasets: [{
          label: '',
          data: [1226, 763, 379, 155, 153],
          backgroundColor: ['#df4226', '#e66650', '#e38879', '#e3aba6', '#e4d1d0'],
          hoverOffset: 4,
        }]
    };
    const config = {
        type: 'doughnut',
        data: data,
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            elements: {
                arc: {
                    borderWidth: 0
                }
            },
            animation: {
                duration: 0
            },
            responsiveAnimationDuration: 0,
            layout: {
                padding: function(context) {
                    console.log(context)
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
                        console.log(context)
                        if (context.chart.chartArea.width < 200){
                            return 'center';
                        }
                        if(context.chart.data.labels[context.dataIndex].length < 6) {
                            return 'end';
                        }
                        return 'center';
                    },
                    anchor: 'end',
                    backgroundColor: 'rgba(255,255,255,.7)',
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
    new Chart(ctx, config);
}

function drawChartEstado() {
    let total = 2759;
    let el = document.getElementById('grafico-barras')
    let ctx = el.getContext('2d');
    Chart.defaults.font.size = 9;
    Chart.defaults.font.weight = 'bold'
    const data = {
        labels: ['MT', 'RR', 'MS', 'PA', 'MA', 'RS', 'AM', 'BA', 'MG', 'RO'],
        datasets: [{
          label: '',
          data: [556, 371, 205, 202, 185, 174, 157, 149, 110, 80],
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
                duration: 0
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
    new Chart(ctx, config);
}

function drawChartDiario() {
    let total = 2759;
    let el = document.getElementById('grafico-colunas')
    let ctx = el.getContext('2d');
    Chart.defaults.font.size = 9;
    Chart.defaults.font.weight = 'bold'
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [{
          label: '',
          data: [19, 66, 29, 80, 103, 69, 65, 31, 45, 37, 147, 119, 74, 76, 52, 158, 111, 153, 145, 146, 165, 350, 113, 101, 107, 41, 40, 26, 15, 50, 26],
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
                duration: 0
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
                    display:  function(context) {
                        return context.chart.chartArea.width > 100;
                    },
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
    new Chart(ctx, config);
    let div = document.createElement("div");
    var total_focos = document.createTextNode(total);
    var label_total_focos = document.createElement("label");
    label_total_focos.appendChild(document.createTextNode("Total de focos"));
    div.appendChild(total_focos);
    div.append(label_total_focos);
    div.className = 'total-focos';
    label_total_focos.className = 'label-total-focos';
    document.getElementById("container-rosca").append(div);
}

function drawChart() {
    drawChartDiario();
    drawChartEstado();
    drawChartBioma();
}