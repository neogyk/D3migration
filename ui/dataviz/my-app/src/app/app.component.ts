import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3Geo from 'd3-geo';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axes from  'd3-axis';

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


    d3.json("./assets/ukraine.json", function(error, uk) {
      svg.append("path")
      .datum(topojson.feature(uk, uk['objects']['ukrunits1']))
      .attr("d", path);

      svg.selectAll(".subunit")
           .data(topojson.feature(uk, uk['objects']['ukrunits1']).features)
           .enter().append("path")
           .attr('stroke',"black")
           .attr("d",  path);
      d3.json('./assets/migration.json', function (error, migration) {
        var color = d3Scale.scaleLinear<string>()
                           .domain([0, new Number(d3Array.max(migration['all']))])
                           .range(['#F08080',"#A0522D"]);

        /*
        var _color = d3Scale.scaleLinear()
                           .domain([0,
                                    d3Array.max(migration['all'])])
                           .range([0,
                                   d3Array.max(migration['all'])]);
         */

        console.log('Migration', migration);
        svg.selectAll('path').data(migration['all'])
          .attr('fill', function(d){return color(new Number(d)); });

        //svg.append("g").call(d3Axes.axisLeft(_color));
      })

    });



  }
}
