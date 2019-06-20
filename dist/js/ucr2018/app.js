    $(function(){ 

        let margin = {top: 20, right: 20, bottom: 30, left: 40};
        let height = 250 - margin.top - margin.bottom;

        let crimeWidth = $( '#crimeWrap' ).width(),     
            width1 = crimeWidth - margin.left - margin.right;
            
        let rateWidth = $( '#rateWrap' ).width(),
            width2 = rateWidth - margin.left - margin.right;
            
        let xCrime = d3.scaleBand()
                    .range([0, width1])
                    .round(true)
                    .paddingInner(0.1)
                    .paddingOuter(0.2);
        let yCrime = d3.scaleLinear()
                        .range([height, 0]);
        
        let xRates = d3.scaleBand()
                    .range([0, width2])
                    .round(true)
                    .paddingInner(0.1)
                    .paddingOuter(0.2);
        let yRates = d3.scaleLinear()
                        .range([height, 0]);

        var crimeGraph = d3.select("#crimeSVG")
                        .attr("width", crimeWidth + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", 
                            "translate(" + margin.left + "," + margin.top + ")");

        let rateGraph = d3.select("#rateSVG")
                            .attr("width", rateWidth + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let waGraph = d3.select("#waSVG")
                            .attr("width", rateWidth + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        let usGraph = d3.select("#usSVG")
                            .attr("width", rateWidth + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                function buildCrimeGraph(){

                        d3.csv("js/ucr2018/WA0390500.csv").then(function(data) {
  
                            let incidents = $( "#crime-select" ).prop('value')
                            let rate_array = [];

                            data.forEach(function(d, i) {
                                    d[incidents] = +d[incidents];
                                    d.rate = (( +d[incidents] / +d.pop ) * 100000).toFixed(1);
                                    d.wa = wa[i][incidents]
                                    d.us = us[i][incidents]
                                    console.log(d)
                                    rate_array.push({"year": d.year, "local_rate": d.rate, "wa_rate": d.wa, "us_rate": d.us})
                                });
                                console.log(rate_array)
                                                                    
                            xCrime.domain(data.map(function(d) { return d.year; }));
                            yCrime.domain([0, d3.max(data, function(d) { return d[incidents]; })]);

                            let bars =  crimeGraph.selectAll(".bar")
                                            .data(data)
                                        .enter().append("rect")
                                            .attr("class", "bar")
                                            .attr("x", function(d) { return xCrime(d.year); })
                                            .attr("width", xCrime.bandwidth())
                                            .attr("y", function(d) { return yCrime(d[incidents]); })
                                            .attr("height", function(d) { return height - yCrime(d[incidents]); });

                            let barLabels = crimeGraph.selectAll("text")
                                                    .data(data)
                                                .enter()
                                                .append("text")
                                                    .text(function(d){
                                                        return d[incidents]
                                                        })
                                                    .attr("x", function(d) { return xCrime(d.year) + (xCrime.bandwidth()/2); }) 
                                                    .attr("y", function(d) { return yCrime(d[incidents]) + 15; })
                                                    .attr("text-anchor", "middle")
                                                    .attr('font-size', '9px')
                                                    .attr('fill', 'white')

                            let xCrimeAxis = d3.axisBottom()
                                                .scale(xCrime);
                                
                                crimeGraph.append("g")
                                        .attr("class", "x-axis axis")
                                        .attr("transform", "translate(0," + height + ")")
                                        .call(xCrimeAxis);

                                let yCrimeAxis = d3.axisLeft()
                                                    .scale(yCrime)
                                                    .ticks(5);

                                crimeGraph.append("g")
                                    .attr("class", "y-axis axis")
                                    .call(yCrimeAxis);

                                buildRateGraph(rate_array)
 
                                
                            });
                        };
                              
                            
                        function buildRateGraph(rate_array){

                            xRates.domain(rate_array.map(function(d) { return d.year; }));                            
                            yRates.domain([0, d3.max(rate_array, function(d) { return d3.max([d.local_rate, d.wa, d.us])})]);

                            let rates = rateGraph.selectAll(".rate-bar")
                                                .data(rate_array)
                                            .enter().append("rect")
                                                .attr("class","rate-bar")
                                                .attr("x", function(d) {return xRates(d.year); })
                                                .attr("y", function(d) {return yRates(d.local_rate); })
                                                .attr("width", xRates.bandwidth)
                                                .attr("height", function(d) {return height - yRates(d.local_rate); });
                            
                            let rateLabels = rateGraph.selectAll("text")
                                                    .data(rate_array)
                                                .enter()
                                                .append("text")
                                                    .text(function(d){
                                                        return d.local_rate
                                                        })
                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2); }) 
                                                    .attr("y", function(d) { return yRates(d.local_rate) + 15; })
                                                    .attr("text-anchor", "middle")
                                                    .attr('font-size', '9px')
                                                    .attr('fill', '#fff')


                            let wa_rates = waGraph.selectAll(".wa-rect")
                                                    .data(rate_array)
                                                .enter()
                                                    .append("rect")
                                                    .attr("class", "wa-bar")
                                                    .attr("x", function(d) {return xRates(d.year) })
                                                    .attr("y", function(d) {return yRates(d.wa_rate)} )
                                                    .attr("width", xRates.bandwidth())
                                                    .attr("height", function(d) {return height - yRates(d.wa_rate)});
                                                
                            let wa_rate_labels = waGraph.selectAll("text")
                                                        .data(rate_array)
                                                        .enter()
                                                .append("text")
                                                    .text(function(d){
                                                        console.log(d.wa_rate)
                                                        return d.wa_rate
                                                        })
                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2)  }) 
                                                    .attr("y", function(d) { return yRates(d.wa_rate) + 15; })
                                                    .attr("text-anchor", "middle")
                                                    .attr('font-size', '9px')
                                                    .attr('fill', '#fff');
                            
                            let us_rates = usGraph.selectAll(".us-bar")
                                                    .data(rate_array)
                                                .enter().append("rect")
                                                    .attr("class", "us-bar")
                                                    .attr("x", function(d) {return xRates(d.year)})
                                                    .attr("y", function(d) {return yRates(d.us_rate)} )
                                                    .attr("width", xRates.bandwidth())
                                                    .attr("height", function(d) {return height - yRates(d.us_rate)});

                            let us_rate_labels = usGraph.selectAll("text")
                                                        .data(rate_array)
                                                        .enter()
                                                .append("text")
                                                    .text(function(d){
                                                        console.log(d.us_rate)
                                                        return d.us_rate
                                                        })
                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2)  }) 
                                                    .attr("y", function(d) { return yRates(d.us_rate) + 15; })
                                                    .attr("text-anchor", "middle")
                                                    .attr('font-size', '9px')
                                                    .attr('fill', '#fff');
                                
                            let xRateAxis = d3.axisBottom()
                                                .scale(xRates);

                                rateGraph.append("g")
                                    .attr("class", "x-rate-axis axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xRateAxis);

                                waGraph.append("g")
                                    .attr("class", "x-rate-axis axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xRateAxis);

                                usGraph.append("g")
                                    .attr("class", "x-rate-axis axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xRateAxis);

                            let yRateAxis = d3.axisLeft()
                                                .scale(yRates)
                                                .ticks(5);

                                rateGraph.append("g")
                                    .attr("class", "y-rate-axis axis")
                                    .call(yRateAxis);

                                waGraph.append("g")
                                    .attr("class", "y-rate-axis axis")
                                    .call(yRateAxis);

                                usGraph.append("g")
                                    .attr("class", "y-rate-axis axis")
                                    .call(yRateAxis);



                        };


                                        function updateData(){

                                            let department = $( '#department-select' ).prop('value')

                                            let departmentData = "js/ucr2018/" + department + ".csv"

                                            d3.csv(departmentData).then(function(data) {

                                                incidents = $( "#crime-select" ).prop('value')

                                                data.forEach(function(d, i) {
                                                    d[incidents] = +d[incidents];
                                                    d.rate = (( +d[incidents] / +d.pop ) * 100000).toFixed(1);
                                                    d.wa = wa[i][incidents]
                                                    d.us = us[i][incidents]
                                                });

                                                yCrime.domain([0, d3.max(data, function(d) { return d[incidents]; })]);
                                                yRates.domain([0, d3.max(data, function(d) { return d3.max([+d.rate, d.wa, d.us ])} )]);

                                                bars =  crimeGraph.selectAll(".bar")
                                                                .data(data)
                                                                .transition()
                                                                .duration(500)
                                                                .attr("x", function(d) { return xCrime(d.year); })
                                                                .attr("y", function(d) { return yCrime(d[incidents]); })
                                                                .attr("height", function(d) { return height - yCrime(d[incidents]); });

                                                barLabels = crimeGraph.selectAll("text")
                                                                    .data(data)
                                                                    .transition()
                                                                    .duration(500)
                                                                    .text(function(d){
                                                                        return d[incidents]
                                                                        })
                                                                    .attr("x", function(d) { return xCrime(d.year) + (xCrime.bandwidth()/2); }) 
                                                                    .attr("y", function(d) { return yCrime(d[incidents]) + 15; })
                                                                    .attr("text-anchor", "middle")
                                                                    .attr('font-size', '9px')
                                                                    .attr('fill', 'white')

                                                rates = rateGraph.selectAll(".rate-bar")
                                                                .data(data)
                                                                .transition()
                                                                .duration(500)
                                                                .attr("x", function(d) {return xRates(d.year) })
                                                                .attr("y", function(d) {return yRates(+d.rate); })
                                                                .attr("height", function(d) {return height - yRates(+d.rate); });

                                                rateLabels = rateGraph.selectAll("text")
                                                                    .data(data)
                                                                    .transition()
                                                                    .duration(500)
                                                                    .text(function(d){
                                                                        return +d.rate
                                                                        })
                                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2); }) 
                                                                    .attr("y", function(d) { return yRates(+d.rate) + 15; })
                                                                    .attr("text-anchor", "middle")
                                                                    .attr('font-size', '9px')
                                                                    .attr('fill', 'white')

                                                wa_rates = waGraph.selectAll(".wa-bar")
                                                                .data(data)
                                                                .transition()
                                                                .duration(500)
                                                                .attr("x", function(d) {return xRates(d.year) })
                                                                .attr("y", function(d) {return yRates(d.wa); })
                                                                .attr("height", function(d) {return height - yRates(d.wa); });

                                                wa_rate_labels = waGraph.selectAll("text")
                                                                    .data(data)
                                                                    .transition()
                                                                    .duration(500)
                                                                    .text(function(d){
                                                                        return d.wa
                                                                        })
                                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2); }) 
                                                                    .attr("y", function(d) { return yRates(+d.wa) + 15; })
                                                                    .attr("text-anchor", "middle")
                                                                    .attr('font-size', '9px')
                                                                    .attr('fill', 'white')
                                                
                                                us_rates = usGraph.selectAll(".us-bar")
                                                                .data(data)
                                                                .transition()
                                                                .duration(500)
                                                                .attr("x", function(d) {return xRates(d.year) })
                                                                .attr("y", function(d) {return yRates(d.us); })
                                                                .attr("height", function(d) {return height - yRates(d.us); });

                                                us_rate_labels = usGraph.selectAll("text")
                                                                    .data(data)
                                                                    .transition()
                                                                    .duration(500)
                                                                    .text(function(d){
                                                                        console.log(d.us)
                                                                        return d.us
                                                                        })
                                                                    .attr("x", function(d) { return xRates(d.year) + (xRates.bandwidth()/2); }) 
                                                                    .attr("y", function(d) { return yRates(+d.us) + 15; })
                                                                    .attr("text-anchor", "middle")
                                                                    .attr('font-size', '9px')
                                                                    .attr('fill', 'white')
                                                
                                                yCrimeAxis = d3.axisLeft()
                                                    .scale(yCrime)
                                                    .ticks(5);
                                                    
                                                crimeGraph.select('.y-axis')
                                                        .transition()
                                                        .duration(500)
                                                        .call(yCrimeAxis);

                                                yRateAxis = d3.axisLeft()
                                                        .scale(yRates)
                                                        .ticks(5);
                                                        
                                                rateGraph.select('.y-rate-axis')
                                                        .transition()
                                                        .duration(500)
                                                        .call(yRateAxis);

                                                waGraph.select('.y-rate-axis')
                                                        .transition()
                                                        .duration(500)
                                                        .call(yRateAxis);
                                                               

                                                usGraph.select('.y-rate-axis')
                                                        .transition()
                                                        .duration(500)
                                                        .call(yRateAxis);
                                                
                                            });               
                                        };

                                            $( "#department-select").change(function(){updateData()});

                                            $( "#crime-select" ).change(function(){ updateData()});
                                            
                                            buildCrimeGraph();
            
                                    });