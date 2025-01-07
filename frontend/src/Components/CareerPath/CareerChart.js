import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function SankeyChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.nodes) {
      return;
    }

    const { nodes, links = [] } = data;

    // Clear SVG before redrawing
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (links.length === 0) {
      // If there are no links, only draw the nodes
      const color = d3
        .scaleOrdinal()
        .domain(nodes.map((d) => d.name))
        .range(d3.schemeTableau10.concat(d3.schemeSet3)); // Extend color range

      // Assign default x0, x1, y0, y1 values for nodes if not present
      const nodesWithDefaults = nodes.map((node, i) => ({
        ...node,
        x0: 100, // Default x position
        x1: 200, // Default x position + width
        y0: i * 40, // Default y position
        y1: i * 40 + 30, // Default height
      }));

      // Draw nodes
      svg
        .append('g')
        .selectAll('rect')
        .data(nodesWithDefaults)
        .join('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('width', 100) // Fixed width for nodes
        .attr('fill', (d) => color(d.name))
        .append('title')
        .text(
          (d) =>
            `Job title: ${d.name}\nProfessionals working in this field: ${d.value}\nSkills met: ${d.skillsTicked}\nSkills not met: ${d.skillsNotMet}\nMinimum experience required (years): ${d.experienceYears}`,
        );

      // Add labels
      svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('text')
        .data(nodesWithDefaults)
        .join('text')
        .attr('x', (d) => d.x0 + 110) // Position label to the right of the node
        .attr('y', (d) => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .text((d) => d.name);
    } else {
      // If there are links, draw the full Sankey diagram
      const color = d3
        .scaleOrdinal()
        .domain(nodes.map((d) => d.name))
        .range(d3.schemeTableau10.concat(d3.schemeSet3)); // Extend color range

      // Setup Sankey generator
      const sankeyGenerator = sankey()
        .nodeWidth(10)
        .nodePadding(20)
        .size([960, 800])
        .nodeAlign(sankeyJustify);

      const { nodes: graphNodes, links: graphLinks } = sankeyGenerator({
        nodes: nodes.map((d) => ({ ...d })),
        links: links.map((d) => ({ ...d })),
      });

      // Draw links
      svg
        .append('g')
        .selectAll('path')
        .data(graphLinks)
        .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', (d) => color(d.source.name))
        .attr('stroke-width', (d) => Math.max(1, d.width))
        .attr('stroke-opacity', 0.5)
        .style('fill', 'none')
        .append('title')
        .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

      // Draw nodes
      svg
        .append('g')
        .selectAll('rect')
        .data(graphNodes)
        .join('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('width', sankeyGenerator.nodeWidth())
        .attr('fill', (d) => color(d.name))
        .append('title')
        .text(
          (d) =>
            `Job title: ${d.name}\nProfessionals working in this field: ${d.value}\nSkills met: ${d.skillsTicked}\nSkills not met: ${d.skillsNotMet}\nMinimum experience required (years): ${d.experienceYears}`,
        );

      // Add labels
      svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('text')
        .data(graphNodes)
        .join('text')
        .attr('x', (d) => (d.x0 < 960 / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr('y', (d) => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', (d) => (d.x0 < 960 / 2 ? 'start' : 'end'))
        .text((d) => d.name);
    }
  }, [data]);

  return (
    <div
      data-cy="sankey-chart"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="info">
          Hover over the darker vertical bars representing job titles to see
          more information.
        </Alert>
        <br />
      </Stack>
      <svg ref={svgRef} width={1260} height={900} style={{ margin: '20px' }} />
      {/* Uncomment this section if you want to enable the save button */}
      {/* <Button style={{ backgroundColor: '#460f9f' }} variant="contained" color="primary" onClick={handleSaveDiagram}> */}
      {/*  <Typography variant="button">Save Diagram</Typography> */}
      {/* </Button> */}
    </div>
  );
}

export default SankeyChart;
