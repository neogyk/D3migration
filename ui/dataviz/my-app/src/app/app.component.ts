import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3Geo from 'd3-geo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor (private http:Http){

    var width = 960;
    var height = 1160;

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json("./assets/ukraine.json", function(error, uk) {

                    console.log(uk);
                }
            );

    d3.json("./assets/ukraine.json", function(error, uk) {
      svg.append("path")
      .datum(topojson.feature(uk, uk['objects']['ukrunits1']))
      .attr("d", d3Geo.geoPath().projection(
        d3Geo.geoAlbers().scale(3000).translate([width /2, height/2 ])
             .center([30, 45])
             .rotate([-1, 2])
             .parallels([50, 60])
      ));
      //.attr("class", function(d) { return "ukrunits1 " + d.id; })

      svg.selectAll(".subunit")
           .data(topojson.feature(uk, uk['objects']['ukrunits1']).features)
           .enter().append("path")
            .attr('fill','blue')
            .dattr("d",  d3Geo.geoPath().projection(
            d3Geo.geoAlbers().scale(3000)
             .translate([width /2, height/2 ])
             .center([30, 45])
             .rotate([-1, 2])
             .parallels([50, 60])
      ));
      var path = d3Geo.geoPath().projection(
        d3Geo.geoAlbers().scale(6000)
             .translate([width /2, height/2 ])
             .center([0, 55.4])
             .rotate([4.4, 0])
             .parallels([50, 60]));

      var projection = d3.geoAlbers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(6000)
            .translate([width / 2, height / 2]);
      /*
      svg.append("path")
      .datum(topojson.mesh(uk, uk['objects']['ukrunits1'], function(a, b) { return a !== b && a.id !== "IRL"; }))
      .attr("d", path)
      .attr("class", "subunit-boundary");

      svg.append("path")
        .datum(topojson.feature(uk, uk['objects']['places']))
        .attr("d", path)
        .attr("class", "place");

      svg.selectAll(".place-label")
        .data(topojson.feature(uk, uk['objects']['places']).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });
      */

    //svg.selectAll(".place-label")
    //.attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
    //.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });

    });



  }
}
