# VectorPipe Building Footprint Comparison

## Sales Demo

This sales demo was built to help Azavea sell our machine learning and application development services. By providing a concrete, visual example, it serves as a communication tool that enables potential customers to envision how machine learning could be integrated into their business. Azavea can use this demo on sales calls, in presentations, and at conversations.

## Building Footprints

Azavea sought an interesting use case for it's new VectorPipe library, and a large scale vector to vector dataset comparison was a good test case.

Microsoft made 124,885,597 footprints from all 50 U.S. states available as open data.

OpenStreetMap has 28 million building footprints in the USA. We wanted to understand where and how they differ.

We used Azavea's open source [VectorPipe](https://github.com/geotrellis/vectorpipe) and Mapbox's [tippecanoe](https://github.com/mapbox/tippecanoe) to generate a national scale vector tile layer comparing how the two datasets differ. This first pass prototype does a relatively naive centroid matching technique, so we did not capture all of the matches. A higher accuracy model is in the works"

On buildings that are in Bing but not OSM, we added a popup that enables users to easily go to the OSM map edit and add the building

## Data

-   [Open Street Map](https://www.openstreetmap.org/)
-   [Microsoft/Bing Building Footprints](https://blogs.bing.com/maps/2018-06/microsoft-releases-125-million-building-footprints-in-the-us-as-open-data)
