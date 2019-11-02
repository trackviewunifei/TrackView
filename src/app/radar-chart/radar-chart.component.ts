import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})

export class RadarChartComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  
  @Input()
  query: string;

  @Input()
  private colors:string[] = [];

  @Input()
  private data:any[] = [];

  constructor() { }

  ngOnChanges() {
    this.createChart();
  }

  createChart():void{
    if(!this.data)
      return;

    const diameter = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = Math.min(900, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);
    var data = this.data;
    /*var data = [
      { name: 'Página 1',
        axes: [
          {axis: 'Conversão', value: 42},
          {axis: 'Acessos', value: 20},
          {axis: 'Total Valor Gasto', value: 60},
          {axis: 'Tempo', value: 26},
          {axis: 'Não conversões', value: 35}
        ],
       color: '#26AF32'
      },
      { name: 'Página 2',
        axes: [
          {axis: 'Conversão', value: 24},
          {axis: 'Acessos', value: 36},
          {axis: 'Total Valor Gasto', value: 25},
          {axis: 'Tempo', value: 45},
          {axis: 'Não conversões', value: 44}
        ],
       color: '#762712'
      },
      { name: 'Página 3',
        axes: [
          {axis: 'Conversão', value: 50},
          {axis: 'Acessos', value: 30},
          {axis: 'Total Valor Gasto', value: 28},
          {axis: 'Tempo', value: 15},
          {axis: 'Não conversões', value: 55}
        ],
       color: '#2a2fd4'
      }
    ];*/
    
    var radarChartOptions2 = {
      w: 280,
      h: 220,
      margin: margin,
      maxValue: 7,
      levels: 5,
      roundStrokes: false,
      color: d3.scaleOrdinal().range([this.colors[0], this.colors[1], this.colors[2]]),
      format: '.0f',
      legend: { title: 'Grupos', translateX: 100, translateY: 40 },
      unit: ''
    };
    // Draw the chart, get a reference the created svg element :
    let svg_radar2 = this.RadarChart(".radarChart2", data, radarChartOptions2);
  }

  max = Math.max;
  sin = Math.sin;
  cos = Math.cos;
  HALF_PI = Math.PI / 2;

  RadarChart = function RadarChart(parent_selector, data, options) {
    const wrap = (text, width) => {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }//wrap

    const cfg = {
      w: 600,				//Width of the circle
      h: 600,				//Height of the circle
      margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
      levels: 3,				//How many levels or inner circles should there be drawn
      maxValue: 0, 			//What is the value that the biggest circle will represent
      labelFactor: 1.30, 	//How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 70, 		//The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, 	//The opacity of the area of the blob
      dotRadius: 4, 			//The size of the colored circles of each blog
      opacityCircles: 0.1, 	//The opacity of the circles of each blob
      strokeWidth: 2, 		//The width of the stroke around each blob
      roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
      format: '.2%',
      unit: '',
      legend: false
    };

    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
      }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    // var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    let maxValue = 0;
    for (let j=0; j < data.length; j++) {
      for (let i = 0; i < data[j].axes.length; i++) {
        data[j].axes[i]['id'] = data[j].name;
        if (data[j].axes[i]['value'] > maxValue) {
          maxValue = data[j].axes[i]['value'];
        }
      }
    }
    maxValue = this.max(cfg.maxValue, maxValue);

    const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
      Format = d3.format(cfg.format),			 	//Formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////
    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove();

    const parent = d3.select(element);

    //Remove whatever chart with the same id/class was present before
    parent.select("svg").remove();

    //Initiate the radar chart SVG
    let svg = parent.append("svg")
        .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar");

    //Append a g element
    let g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    let filter = g.append('defs').append('filter').attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    let axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", d => radius / cfg.levels * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", d => -d * radius / cfg.levels)
      .attr("dy", "0.4em")
      .style("font-size", 14)
      .attr("fill", "gray")
      .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(maxValue *1.1) * this.cos(angleSlice * i - this.HALF_PI))
      .attr("y2", (d, i) => rScale(maxValue* 1.1) * this.sin(angleSlice * i - this.HALF_PI))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", 14)
      .style("fill", "gray")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * this.cos(angleSlice * i - this.HALF_PI))
      .attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * this.sin(angleSlice * i - this.HALF_PI)-10)
      // @ts-ignore
      .text(d => d)
      .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
   
    const radarLine = d3.radialLine()
      .curve(d3.curveLinearClosed)
      // @ts-ignore
      .radius(d => rScale(d.value))
      .angle((d,i) => i * angleSlice);

    if(cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed)
    }

    //Create a wrapper for the blobs
    const blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      // @ts-ignore
      .attr("d", d => radarLine(d.axes))
      // @ts-ignore
      .style("fill", (d,i) => cfg.color(i))
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function(d, i) {
        //Dim all blobs
        parent.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);
      })
      .on('mouseout', () => {
        //Bring back all blobs
        parent.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      // @ts-ignore
      .attr("d", function(d,i) { return radarLine(d.axes); })
      .style("stroke-width", cfg.strokeWidth + "px")
      // @ts-ignore
      .style("stroke", (d,i) => cfg.color(i))
      .style("fill", "none")
      .style("filter" , "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
    // @ts-ignore
      .data(d => d.axes)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      // @ts-ignore
      .attr("cx", (d,i) => rScale(d.value) * this.cos(angleSlice * i - this.HALF_PI))
      // @ts-ignore
      .attr("cy", (d,i) => rScale(d.value) * this.sin(angleSlice * i - this.HALF_PI))
      // @ts-ignore
      .style("fill", (d) => cfg.color(d.id))
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
    // @ts-ignore
      .data(d => d.axes)
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 1.5)
      // @ts-ignore
      .attr("cx", (d,i) => rScale(d.value) * this.cos(angleSlice*i - this.HALF_PI))
      // @ts-ignore
      .attr("cy", (d,i) => rScale(d.value) * this.sin(angleSlice*i - this.HALF_PI))
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function(d,i) {
        tooltip
          .attr('x', this.cx.baseVal.value - 10)
          .attr('y', this.cy.baseVal.value - 10)
          .transition()
          .style('display', 'block')
          // @ts-ignore
          .text(Format(d.value) + cfg.unit);
      })
      .on("mouseout", function(){
        tooltip.transition()
          .style('display', 'none').text('');
      });

    const tooltip = g.append("text")
      .attr("class", "tooltip")
      .attr('x', 0)
      .attr('y', 0)
      .style("font-size", 14)
      .style('display', 'none')
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em");

    if (cfg.legend !== false && typeof cfg.legend === "object") {
      let legendZone = svg.append('g');
      let names = data.map(el => el.name);
      // @ts-ignore
      if (cfg.legend.title) {
        let title = legendZone.append("text")
          .attr("class", "title")
          // @ts-ignore
          .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
          .attr("x", cfg.w - 70)
          .attr("y", 10)
          .attr("font-size", 14)
          .attr("fill", "gray")
          // @ts-ignore
          .text(cfg.legend.title);
      }
      let legend = legendZone.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        // @ts-ignore
        .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
      // Create rectangles markers
      legend.selectAll('rect')
        .data(names)
        .enter()
        .append("rect")
        .attr("x", cfg.w - 65)
        .attr("y", (d,i) => i * 20)
        .attr("width", 10)
        .attr("height", 10)
        // @ts-ignore
        .style("fill", (d,i) => cfg.color(i));
      // Create labels
      legend.selectAll('text')
        .data(names)
        .enter()
        .append("text")
        .attr("x", cfg.w - 52)
        .attr("y", (d,i) => i * 20 + 9)
        .attr("font-size", 14)
        .attr("fill", "#737373")
        // @ts-ignore
        .text(d => d);
    }
    return svg;
}

}
