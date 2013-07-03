
function plotBarChart2 (title, div, series) {
  alert(JSON.stringify(series));
  $('#' + div).highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Stacked column chart'
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
        }
      }
    },
    legend: {
      align: 'right',
      x: -100,
      verticalAlign: 'top',
      y: 20,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.x +'</b><br/>'+
            this.series.name +': '+ this.y +'<br/>'+
            'Total: '+ this.point.stackTotal;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
        }
      }
    },
    series: [{
      name: 'John',
      data: [5, 3, 4, 7, 2]
    }, {
      name: 'Jane',
      data: [2, 2, 3, 2, 1]
    }, {
      name: 'Joe',
      data: [3, 4, 4, 2, 5]
    }]
  });
}

function plotBarChart(title, div, series){
  $('#' + div).highcharts({
    chart: {
      type: 'column'
    },
    credits:{
      enabled: false
    },
    title: {
      text: title
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
      title: {
        text: 'Hours'
      },
      min: 0
    },
    plotOptions: {
      column: {
        stacking: null
      }
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
            Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' hrs';
      }
    },

    series: series
  });
}

function plotColumnHighCharts(title, div, series){
  $('#' + div).highcharts({
    chart: {
      type: 'column'
    },
    credits:{
      enabled: false
    },
    title: {
      text: title
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      }
    },
    yAxis: {
      title: {
        text: 'Hours'
      },
      min: 0
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
          Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' hrs';
      }
    },

    series: series
  });
}



function plotPieHighCharts(title, div, data) {
  $('#' + div).highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    credits:{
      enabled: false
    },
    title: {
      text: title
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled:true,
          distance:-30,
          format:'{y} hrs.'
        },
        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Percent time spent',
      data: data
    }]
  });
}

