// Populate dropdown menu
d3.json("samples.json").then((data) => {
    
    var select = document.getElementById("selDataset");
    var options = data.names;

    for (var i=0; i<options.length; i++){
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

});

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

function getData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var individual = dropdownMenu.property("value");
    // console.log(individual);

    buildBarChart(individual);
    buildBubbleChart(individual);
    displayData(individual);
    buildGaugeChart(individual);
};



// Create function to build a bar chart
function buildBarChart(individual){
    d3.json("samples.json").then((data) => {
        var selectedData = data.samples.filter(sample => sample.id === individual);
        console.log(selectedData)

        var otu_ids = selectedData.map(dataset => dataset.otu_ids);
        otu_ids = otu_ids[0].slice(0,10).reverse()
        console.log(otu_ids)

        var otu_id_labels = otu_ids.map(id => "OTU" + id);
        console.log(otu_id_labels)
        
        var sample_values = selectedData.map(dataset => dataset.sample_values);
        sample_values = sample_values[0].slice(0,10).reverse();
        console.log(sample_values)

        var otu_labels = selectedData.map(dataset => dataset.otu_labels);
        otu_labels = otu_labels[0].slice(0,10).reverse();
        console.log(otu_labels)

        
        var trace1 ={
            x: sample_values,
            y: otu_id_labels,
            text: otu_labels,
            type:"bar",
            orientation: "h"
        };

        var data = [trace1];

        
        Plotly.newPlot("bar", data);
});
}


// Create function to build a bubble chart
function buildBubbleChart(individual){
    d3.json("samples.json").then((data) => {
        var selectedData = data.samples.filter(sample => sample.id === individual);
        console.log(selectedData)

        var otu_ids = selectedData.map(dataset => dataset.otu_ids);
        otu_ids = otu_ids[0];
        console.log(otu_ids)

        var sample_values = selectedData.map(dataset => dataset.sample_values);
        sample_values = sample_values[0];
        console.log(sample_values)

        var otu_labels = selectedData.map(dataset => dataset.otu_labels);
        otu_labels = otu_labels[0];
        console.log(otu_labels)

        var trace2 ={
            x: otu_ids,
            y:sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        }

        var data = [trace2];

        var layout ={
            title:'Bubble Chart'
        };

        Plotly.newPlot("bubble", data, layout );

    })
};

// Create function to display sample metadata
function displayData(individual){
    d3.json("samples.json").then((data) => {
        var metaData = data.metadata.filter(info => info.id == individual);
        console.log(metaData)
        
        var list = d3.select("#sample-metadata");
        list.html("");
    

        Object.entries(metaData[0]).forEach(([key, value]) => {
            list.append("h6").text(`${key}: ${value}`);
            console.log(`${key}: ${value}`);
        });
        
    })};

// Create function to build a gauge chart
function buildGaugeChart(individual){
    d3.json("samples.json").then((data) => {
        var metaData = data.metadata.filter(info => info.id == individual);

        var wfreq = metaData.map(wfreqData => wfreqData.wfreq);
        wfreq = wfreq[0];
        console.log(wfreq)

            
        // Enter a level between 0 and 180
        var level = wfreq *20;
        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
            x: [0], y:[0],
            marker: {size: 16, color:'850000'},
            showlegend: false,
            name: 'Washing Freq',
            text: wfreq,
            hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5','3-4','2-3','1-2','0-1',''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:["rgba(15, 128, 0, 0.64)","rgba(15, 128, 0, 0.58)","rgba(14, 127, 0, .5)", 
                            "rgba(110, 154, 22, .5)", "rgba(170, 202, 42, .5)", "rgba(202, 209, 95, .5)", 
                            "rgba(210, 206, 145, .5)", "rgba(232, 226, 202, .5)", "rgba(232, 226, 202, 0.35)"]},
            hoverinfo: 'text',
            hole: .5,
            type: 'pie',
            showlegend: false
            }];

        var layout = {
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                color: '850000'}
                    }],
                height: 550,
                width: 550,
                xaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]}
                };
            
            
            Plotly.newPlot('gauge', data, layout);

    })};

    

function init(){
    buildBarChart("940");
    buildBubbleChart("940");
    displayData("940");
    buildGaugeChart("940");
    };

init();