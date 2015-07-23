///*
document.addEventListener("DOMContentLoaded", function(event) {
  var palette = new Rickshaw.Color.Palette({scheme: 'munin'});

  var getStats = function(type) {
    return qwest.get('/api/channels/stats', {type: type})
                .then(function(xhr, channels) {
                  return channels.map(function(c) {
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
                    console.log(data.count);
                    return data;
                  }).sort(function(a, b) {
                      return a.count < b.count;
                  }).slice(0, 8);
                });
  };
  getStats("hourly").then(function(series) {
    console.log(series);
    var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 1300,
        height: 600,
        renderer: 'line',
        series: series
    });

    var x_axis = new Rickshaw.Graph.Axis.Time({graph: graph});
    var y_axis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      orientation: 'left',
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      element: document.querySelector('#y_axis'),
    });

    var legend = new Rickshaw.Graph.Legend({
      element: document.querySelector('#legend'),
      graph: graph
    });
    graph.render();
  }, function(err) {
    console.log(err);
  });
});
//*/
/*
document.addEventListener("DOMContentLoaded", function(event) {
  var graph = new Rickshaw.Graph({
    element: document.querySelector('#chart'),
    series: [
      {
        color: 'steelblue',
        data: [ { x: 0, y: 23}, { x: 1, y: 15 }, { x: 2, y: 79 } ]
      }, {
        color: 'lightblue',
        data: [ { x: 0, y: 30}, { x: 1, y: 20 }, { x: 2, y: 64 } ]
      }
    ]
  });

  graph.render();
});
*/
