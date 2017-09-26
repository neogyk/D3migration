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

    d3.json("./assets/uk.json", function(error, uk) {

                    console.log(uk);
                }
            );

    d3.json("./assets/uk.json", function(error, uk) {
      svg.append("path")
      .datum(topojson.feature(uk, uk['objects']['subunits']))
      .attr("d", d3Geo.geoPath().projection(
        d3Geo.geoAlbers().scale(6000)
             .translate([width /2, height/2 ])
             .center([0, 55.4])
             .rotate([4.4, 0])
             .parallels([50, 60])
      ));

        svg.selectAll(".subunit")
           .data(topojson.feature(uk, uk['objects']['subunits']).features)
           .enter().append("path")
           .attr("class", function(d) { return "subunit " + d.id; })
           .attr('fill','red')
           .attr("d",  d3Geo.geoPath().projection(
            d3Geo.geoAlbers().scale(6000)
             .translate([width /2, height/2 ])
             .center([0, 55.4])
             .rotate([4.4, 0])
             .parallels([50, 60])
      ));

    });



  }
}
