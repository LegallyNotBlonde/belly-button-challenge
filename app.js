// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Our data:", data);

    // Get the `metadata` field and add it to the cosole (to ensure all is correct)
    let metadata = data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    // add filtered result to the console
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    console.log("Filtered sample result:", result);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Clear any existing metadata and add the record to the cnosole 
    panel.html('');
    console.log("Metadata is cleared,");

    // Use d3 inside a loop to append new
    // tags for each key-value in the filtered metadata
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`); // used `UpperCase` for a nice display
      });
    } else {
      panel.append("h6").text("Metadata was not found for the selected sample.");
    }
    console.log(panel);
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Getting data for the charts:", data);

    // Get the `samples` field and add it to the console 
    let samples = data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    console.log("Filtered result to build a chart:", result);

    // Get the otu_ids, otu_labels, and sample_values and add them to the cosole to verify steps
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    console.log("otu_ids:", otu_ids);
    console.log("otu_labels:", otu_labels);
    console.log("sample_values:", sample_values);

    // Build a Bubble Chart
    let bubbleLayout = { // define layout for the bubble chart
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30 }, // this margin gives one object, 30 pixels from the top
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }, // name for x axis
      yaxis: { title: 'Sample Values'}, // name for y axis for better clarity
    };
    let bubbleData = [{ // define data for the bubble chart
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Rainbow'
      }
    }];
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    console.log("Bubble chart is built.") // add the record to the console


    // Build a Bar Chart, map the otu_ids to a list of strings for your yticks using slice and reverse
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
    }];
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 },
      xaxis: { title: 'Sample Values' }, // adding a name for x axis
      yaxis: { title: 'OTU ID' } // adding a name for y axis for better clarity of the bar chart
    };
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
    console.log("Bar plot is constructed."); // writing a confirmation to the console
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field and adding it to the console
    let sampleNames = data.names;
    console.log("Sample names:", sampleNames);

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // utilize d3 to append a new option for each sample name inside a loop
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list and include it to the console
    let firstSample = sampleNames[0];
    console.log("First sample:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  console.log("A new sample was selected:", newSample);
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
