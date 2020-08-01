function init() {
  let selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let resultM = resultArray[0];
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    PANEL.append("h6").text('Age: ' +resultM.age);
    PANEL.append("h6").text('BBType: ' +resultM.bbtype);
    PANEL.append("h6").text('Ethnicity: ' +resultM.ethnicity);
    PANEL.append("h6").text('Gender: ' +resultM.gender);
    PANEL.append("h6").text('ID: ' +resultM.id);
    PANEL.append("h6").text('Location: ' +resultM.location);
    PANEL.append("h6").text('W.Freq: ' +resultM.wfreq);
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let otuLabels = result.otu_labels.slice(0,10);
    let xaxis = result.sample_values.slice(0,10);
    let ym = result.otu_ids.slice(0,10);
    let yaxis = ym.map((item) => {
      return ('OTU ' + item);
    });

    let trace1 = {
      x: xaxis,
      y: yaxis,
      type: "bar",
      orientation: 'h',
      text: otuLabels,
      marker: {
        color: ym,
        colorscale: 'Jet'
        },
      //descending on the bar graph
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
    };
    let data1 = [trace1];
    let layout = {
        title: "Individual's top 10 Bacterial Species",
        xaxis: { title: "Count"},
        yaxis: { title: "Bacteria ID"}
      };
      Plotly.newPlot("bar", data1, layout);

    //bubble chart below
    let trace2 = {
      x: ym,
      y: xaxis,
      mode: 'markers',
      marker: {
        size: xaxis,
        color: ym,
        colorscale: 'Jet'
        },
      text: otuLabels,
      type: 'scatter'
    };
    let data2 = [trace2];
    let layout2 = {
      title: "Individual's top 10 Bacterial Species",
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Value"}
    };
    Plotly.newPlot("bubble", data2, layout2);

    // gauge chart below
    d3.json("samples.json").then((data) => {
       let metadata = data.metadata;
       let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
       let result = resultArray[0];
       let wash = result.wfreq;
       let trace3 = [{
      		domain: { x: [0, 1], y: [0, 1] },
      		value: wash,
      		title: { text: "Weekly Wash Frequency" },
      		type: "indicator",
      		mode: "gauge+number"
       }];
       let layout3 = {width: 600, height: 500, margin: { t: 0, b: 0 } };
       Plotly.newPlot('gauge', trace3, layout3);
    });
  });
}


init();
//loading script call 940 as default
optionChanged(940);
