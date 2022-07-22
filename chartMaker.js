var xValues = [];
var yValues = [];

var myChart = new Chart("chart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: true,
      backgroundColor: "rgba(0,0,0,1.0)",
      borderColor: "rgba(0,0,0,0.1)",
      data: yValues
    }]
  },
  options:{
    legend: {display: false},
    title:{
      display:true,
      text:"Performance vs. Generation"
    }
  }
});
