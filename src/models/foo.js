nv.models.foo = function() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0}
    , width = null
    , height = null
    , color = nv.utils.defaultColor()
    , dispatch = d3.dispatch('renderEnd')
    , duration = 250
    , renderWatch = nv.utils.renderWatch(dispatch, duration)
    ;

  function chart(selection) {
    renderWatch.reset();

    selection.each(function(data) {
      var container = d3.select(this);
      nv.utils.initSVG(container);

      //draw svg elements

      //configure events that can be dispatched
    });

    renderWatch.renderEnd('foo immediate');
    return chart;
  }

  chart.dispatch = dispatch;

  chart.options = nv.utils.optionsFunc.bind(chart);

  chart._options = Object.create({}, {
    // simple options, just get/set the necessary values
    width: {get: function() {return width;}, set: function(_) {width=_;}},
    height: {get: function() {return height;}, set: function(_) {height=_;}},

    // options that require extra logic in the setter
    color: {get: function() {return color;}, set: function(_) {
      color = nv.utils.getColor(_);
    }},
    margin: {get: function() {return margin;}, set: function(_) {
      margin.top    = _.top    !== undefined ? _.top    : margin.top;
      margin.right  = _.right  !== undefined ? _.right  : margin.right;
      margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
      margin.left   = _.left   !== undefined ? _.left   : margin.left;
    }}
  });

  nv.utils.initOptions(chart);

  return chart;
};
