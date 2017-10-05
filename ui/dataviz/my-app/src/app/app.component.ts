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
                  .attr('width',1500).attr('height', 200);

    var brush = d3.brushX()
                  .extent([[0, 0], [200, 200]])
                  .on("start brush end", function () {

                  });

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
              .attr("d",  path);


    });

    d3.json('./assets/migration.json', function (error, migration) {

            var length = migration['all'].length;
            var max = new Number(d3Array.max(migration['all']));
            var color = d3Scale.scaleLinear<string>()
                           .domain([0, max])
                           .range(["#A0522D", '#F08080']);

            var x = d3Scale.scaleLinear()
                           .domain([0, length])
                           .range([0, 1500]);
            var y = d3Scale.scaleLinear()
                           .domain([0, max])
                           .range([0,  200]);


             var line = d3.line()
                          .x(function(d,i) { return x(i); })
                          .y(function(d, i) {return y(new Number(d)); });

            gBrush.call(brush.move, [0.3, 0.5].map(x));

            timeline.append('path')
                    .attr("class", "line").attr('d', line(migration['all']))
                    .attr('stroke', 'blue');

            svg.selectAll('path').data(migration['all'])
                .attr('stroke', function(d){return color(new Number(d)); });

        });


  }
}
