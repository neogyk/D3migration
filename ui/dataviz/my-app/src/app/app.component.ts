import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3Geo from 'd3-geo';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axes from  'd3-axis';
import * as d3Brush from 'd3-brush';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Map of Migration in January';

  constructor (private http:Http){

    var width = 960;
    var height = 1160;
    var migration:any;
    var color:any;

    var projection = d3Geo.geoAlbers()
                     .scale(3000).translate([width /2, height/2 ])
                     .center([30, 45])
                     .rotate([-1, 2])
                     .parallels([50, 60]);

    var path = d3Geo.geoPath().projection(projection);


    var svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

    var timeline = d3.select("body").append("svg")
                  .attr('class','timeline')
                  .style('background-color','grey')
                  .attr('width',1500).attr('height', 120);

    var brush = d3.brushX()
                  .extent([[0, 0], [1500, 200]])
                  .on("start brush end", brushMoved);

    var gBrush = timeline.append("g")
                .attr("class", "brush")
                .call(brush);



    d3.json("./assets/ukraine.json", function(error, uk) {

          svg.append("path")
              .datum(topojson.feature(uk, uk['objects']['ukrunits1']))
              .attr("d", path);

          svg.selectAll(".subunit")
              .data(topojson.feature(uk, uk['objects']['ukrunits1']).features)
              .enter()
              .append("path")
              .attr('class','region')
              .attr("d",  path)
              .on('mouseover', handleRegionSel)
              .on('mouseout', outhandleRegionSel);
        //Modification of map circle
          svg.selectAll(".subunit").append('g')
            .data(topojson.feature(uk, uk['objects']['ukrunits1']).features)
            .enter()
            .append('circle')
            .attr("r", 3.5);

        //add interactive widget for selecting region
       //
      //
    //
      //
      d3.json('./assets/migration.json', function (error, migration) {

            this.migration = migration;
            var length = migration['all'].length;
            var max = new Number(d3Array.max(migration['all']));
            this.color = d3Scale.scaleLinear<string>()
                           .domain([0, max])
                           .range(["#3b5682", '#a01e1e']);

            var x = d3Scale.scaleLinear()
                           .domain([0, max])
                           .range([0, 1500]);
            var y = d3Scale.scaleLinear()
                           .domain([0, max])
                           .range([0,  200]);


             var line = d3.line()
                          .x(function(d,i) { return x(i); })
                          .y(function(d, i) {return y(new Number(d)); });

              svg.selectAll('path').append('g').selectAll("circle")
                            .data(migration['all'])
                            .enter().append("circle").attr("r", 3.5);;

              var circle = timeline.append("g")
                            .attr("class", "circle")
                            .selectAll("circle")
                            .data(migration['all'])
                            .enter().append("circle")
                            .attr("transform", function(d) { return "translate(" + x(new Number(d)) + "," + y(new Number(d)) + ")"; })
                            .attr("r", 3.5);


            //timeline.append('path')
            //        .attr("class", "line").attr('d', line(migration['all']))
            //       .attr('stroke', 'blue');

            svg.selectAll('path').data(migration['all'])
                .attr('fill', function(d){return this.color(new Number(d)); })
                .attr('stroke','black');


            gBrush.call(brush.move, [0.3, 0.5].map(x));
        });
    });

  function brushMoved(){};
  function handleRegionSel(){
      d3.select(this).attr('fill','orange');};
  function outhandleRegionSel(d,i){
      var new_d = this.migration['all'][i];
      d3.select(this).attr('fill', function(d){return color(new Number(new_d)); })};


  }
}
