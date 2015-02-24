'use strict';

var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Arc = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      labelTextFill: "black",
      valueTextFill: "white"
    };
  },

  render() {
    var props = this.props;
    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    var rotate = "rotate(" + (props.startAngle+props.endAngle)/2 * (180/Math.PI) + ")";
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 35;
    var angle  = (props.startAngle + props.endAngle) / 2;
    var x      = dist * (1.2 * Math.sin(angle));
    var y      = -dist * Math.cos(angle);
    var t = "translate(" + x + "," + y + ")";

    return (
      <g className='rd3-piechart-arc' >
        <path
          d={arc()}
          fill={props.fill}
        />
        <line
          x1="0"
          x2="0"
          y1={-radius - 2}
          y2={-radius - 26}
          stroke={props.labelTextFill}
          transform={rotate}
          style={{
            "fill": props.labelTextFill,
            "strokeWidth": 2,
          }}>
        >
        </line>
        <text
          className='rd3-piechart-label'
          transform={t}
          dy=".35em"
          style={{
            "textAnchor": "middle",
            "fill": props.labelTextFill,
            "shapeRendering": "crispEdges"
          }}>
          {props.label}
        </text>
        <text
          className='rd3-piechart-text'
          transform={"translate(" + arc.centroid() + ")"}
          dy=".35em"
          style={{
            "shapeRendering": "crispEdges",
            "textAnchor": "middle",
            "fill": props.valueTextFill
          }}>
          {props.value + "%"}
        </text>
      </g>
    );
  }
});

var DataSeries = React.createClass({

  propTypes: {
    transform: React.PropTypes.string,
    data: React.PropTypes.array,
    innerRadius: React.PropTypes.number,
    radius: React.PropTypes.number,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      innerRadius: 0,
      data: [],
      colors: d3.scale.category20c()
    };
  },

  render: function() {

    var props = this.props;

    var pie = d3.layout
      .pie()
      .sort(null);

    var arcData = pie(props.data);

    var arcs = arcData.map(function(arc, i) {
      return (
        <Arc
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          outerRadius={props.radius}
          innerRadius={props.innerRadius}
          labelTextFill={props.labelTextFill}
          valueTextFill={props.valueTextFill}
          fill={props.colors(i)}
          label={props.labels[i]}
          value={props.data[i]}
          key={i}
          width={props.width}
        />
      );
    });
    return (
      <g className="rd3-piechart-pie" transform={props.transform} >{arcs}</g>
    );
  }
});

var PieChart = exports.PieChart = React.createClass({

  getDefaultProps: function() {
    return {
      title: ''
    };
  },

  propTypes: {
    radius: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string,
    colors: React.PropTypes.func,
    title: React.PropTypes.string
  },

  render: function() {
    var props = this.props;
    var transform = "translate(" +
      (props.cx || props.width/2) + "," +
      (props.cy || props.height/2) + ")";

    var data = props.data.map( (item) => item.value );
    var labels = props.data.map( (item) => item.label );

    return (
      <Chart
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g className='rd3-piechart'>
          <DataSeries
            labelTextFill={props.labelTextFill}
            valueTextFill={props.valueTextFill}
            labels={labels}
            colors={props.colors}
            transform={transform}
            data={data}
            width={props.width}
            height={props.height}
            radius={props.radius}
            innerRadius={props.innerRadius}
          />
        </g>
      </Chart>
    );
  }

});
