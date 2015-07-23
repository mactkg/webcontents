var currentGraph;
var cache = {};
var getStats = function(type) {
  if(cache[type] != undefined) {
    return new Promise(function(resolver, error) {
      resolver(cache[type]);
    });
  }
  return qwest.get('/api/channels/stats', {type: type})
              .then(function(xhr, channels) {
                var palette = new Rickshaw.Color.Palette({scheme: 'spectrum14'});
                var result = cache[type] = channels.map(function(c) {
                  var data = {name: c[0].value.channel};
                  data.data = c.map(function(d) {
                    if(type == "weekly") {
                      return {x: d._id, y:d.value.count};
                    } else {
                      return {x: Date.parse(d._id)/1000+32400, y:d.value.count};
                    }
                  });
                  data.color = palette.color();
                  data.count = c.map(function(c) {
                    return c.value.count;
                  }).reduce(function(p, c) {
                    return p + c;
                  });
                  return data;
                }).sort(function(a, b) {
                    return a.count < b.count;
                }).slice(0, 8);
                return result;
              });
};
var updateChart = function(type) {
  getStats(type).then(function(series) {
    document.querySelector("#chart").innerHTML="";
    var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 1300,
        height: 600,
        padding: "4%",
        renderer: 'line',
        interpolation: 'linear',
        series: series
    });

    document.querySelector("#x_axis").innerHTML="";
    document.querySelector("#y_axis").innerHTML="";

    var x_axis;
    if(type == "weekly") {
      var format = function(n) {
        var a = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return a[n];
      };
      x_axis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        //orientation: 'bottom',
        element: document.getElementById('x_axis'),
        tickFormat: format

      });
    } else {
      x_axis = new Rickshaw.Graph.Axis.Time({graph: graph});
    }
    var y_axis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      orientation: 'left',
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      element: document.querySelector('#y_axis'),
    });
    
    document.querySelector("#legend").innerHTML="";
    var legend = new Rickshaw.Graph.Legend({
      element: document.querySelector('#legend'),
      graph: graph
    });
    graph.render();
  });
};

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector('#weekly').addEventListener("click", function(e) {
    document.querySelector('#hourly').classList.remove("selected");
    this.classList.add("selected");
    updateChart("weekly");
  });
  document.querySelector('#hourly').addEventListener("click", function(e) {
    document.querySelector('#weekly').classList.remove("selected");
    this.classList.add("selected");
    updateChart("hourly");
  });

  updateChart("hourly");
});
