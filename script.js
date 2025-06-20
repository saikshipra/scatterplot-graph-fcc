const width = 960;
const height = 600;
const padding = 60;

const svg = d3.select("svg");

d3.json("data.json").then(data => {
  data.forEach(d => {
    d.Time = new Date(`1970-01-01T00:${d.Time}`);
  });

  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Time))
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("transform", `translate(0,${height - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${padding},0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  const tooltip = d3.select("#tooltip");

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 6)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time.toISOString())
    .attr("fill", d => d.Doping ? "red" : "green")
    .on("mouseover", function(e, d) {
      tooltip.style("opacity", 1)
        .attr("data-year", d.Year)
        .html(`${d.Name} (${d.Nationality})<br>Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>${d.Doping}`)
        .style("left", (e.pageX + 10) + "px")
        .style("top", (e.pageY - 20) + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Legend
  const legend = svg.append("g").attr("id", "legend");

  legend.append("rect")
    .attr("x", width - 200)
    .attr("y", 150)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", "red");

  legend.append("text")
    .attr("x", width - 170)
    .attr("y", 165)
    .text("With Doping Allegations");

  legend.append("rect")
    .attr("x", width - 200)
    .attr("y", 180)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", "green");

  legend.append("text")
    .attr("x", width - 170)
    .attr("y", 195)
    .text("No Doping Allegations");
});
