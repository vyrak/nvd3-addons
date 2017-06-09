nv.models.stepChart = function() {
  var step = nv.models.step()
    , margin = {top: 30, right: 20, bottom: 50, left: 60}
    , width = null
    , height = null
    , color = nv.utils.defaultColor()
    , getX = function(d) { return d.x; }
    , getY = function(d) { return d.y; }
    , xAxis = nv.models.axis()
    , yAxis = nv.models.axis()
    , xScale
    , yScale
    , tooltip = nv.models.tooltip()
    , dispatch = d3.dispatch('elementClick', 'elementMouseover', 'elementMouseout', 'elementMousemove', 'renderEnd')
    , duration = 250
    , renderWatch = nv.utils.renderWatch(dispatch, duration)
    ;

  xAxis.orient('bottom').tickFormat(d3.format(',.1f'));
  yAxis.orient('left').tickPadding(5).showMaxMin(false);
  tooltip.duration(0)
    .valueFormatter(function(d, i) { return xAxis.tickFormat()(d, i); })
    .headerFormatter(function(d, i) { return yAxis.tickFormat()(d, i); });

  function chart(selection) {
    renderWatch.reset();
    renderWatch.models(step);
    renderWatch.models(xAxis);
    renderWatch.models(yAxis);

    selection.each(function(data) {
      var container = d3.select(this);
      nv.utils.initSVG(container);

      var availableWidth = nv.utils.availableWidth(width, container, margin)
        , availableHeight = nv.utils.availableHeight(height, container, margin)
        , wrap = container.selectAll('g.nv-wrap.nv-stepChart').data([data])
        , wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-stepChart')
        , gEnter = wrapEnter.append('g')
        ;

      chart.update = function() { container.transition().duration(duration).call(chart); };
      chart.container = this;

      xScale = step.xScale().domain([0, d3.sum(data, getX)]).range([0, availableWidth]);
      yScale = step.yScale().domain(data.map(getY)).rangeRoundBands([0, availableHeight]);

      //============================================================
      // Setup containers and skeleton of chart
      //------------------------------------------------------------
      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      gEnter.append('g').attr('class', 'nv-x nv-axis');
      gEnter.append('g').attr('class', 'nv-y nv-axis');
      gEnter.append('g').attr('class', 'nv-stepsWrap');

      step
        .width(availableWidth)
        .height(availableHeight)
        .color(data.map(function(d,i) { return d.color || color(d, i); }));

      wrap.select('.nv-stepsWrap').datum(function(d) { return d; }).transition().call(step);

      xAxis.scale(xScale).tickSize(-availableHeight, 0);
      wrap.select('.nv-x.nv-axis').attr('transform', 'translate(0,' + availableHeight + ')');
      wrap.select('.nv-x.nv-axis').call(xAxis);

      yAxis.scale(yScale).tickSize(-availableWidth, 0);
      wrap.select('.nv-y.nv-axis').call(yAxis);

      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------
      step.dispatch.on('elementClick.stepChart', function(e) {
        dispatch.elementClick(e);
      });
      step.dispatch.on('elementMouseover.stepChart', function(e) {
        e.value = chart.y()(e.data);
        e.series = {
          key: chart.y()(e.data),
          value: chart.x()(e.data),
          color: e.color
        };
        tooltip.data(e).hidden(false);
        dispatch.elementMouseover(e);
      });
      step.dispatch.on('elementMouseout.stepChart', function(e) {
        tooltip.hidden(true);
        dispatch.elementMouseout(e);
      });
      step.dispatch.on('elementMousemove.stepChart', function(e) {
        tooltip();
        dispatch.elementMousemove(e);
      });
    });

    renderWatch.renderEnd('step chart immediate');
    return chart;
  }

  chart.dispatch = dispatch;
  chart.step = step;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.tooltip = tooltip;

  chart.options = nv.utils.optionsFunc.bind(chart);

  chart._options = Object.create({}, {
    // simple options, just get/set the necessary values
    width: {get: function() {return width;}, set: function(_) {width=_;}},
    height: {get: function() {return height;}, set: function(_) {height=_;}},

    // options that require extra logic in the setter
    color: {get: function() {return color;}, set: function(_) {
      color = nv.utils.getColor(_);
    }},
    duration: {get: function() {return duration;}, set: function(_) {
      duration = _;
      renderWatch.reset(duration);
      step.duration(duration);
      xAxis.duration(duration);
      yAxis.duration(duration);
    }},
    margin: {get: function() {return margin;}, set: function(_) {
      margin.top    = _.top    !== undefined ? _.top    : margin.top;
      margin.right  = _.right  !== undefined ? _.right  : margin.right;
      margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
      margin.left   = _.left   !== undefined ? _.left   : margin.left;
    }}
  });

  nv.utils.inheritOptions(chart, step);
  nv.utils.initOptions(chart);

  return chart;
};
