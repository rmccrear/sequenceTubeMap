import React, { Component } from "react";
import PropTypes from "prop-types";
import * as tubeMap from "../util/tubemap";

class TubeMap extends Component {
  componentDidMount() {
    this.createTubeMap();
    if(this.props.onTrackClick) {
      tubeMap.setEventHandler("trackClick", this.props.onTrackClick);
    } else {
      tubeMap.setEventHandler("trackClick", null); 
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.nodes !== this.props.nodes   ||
       prevProps.tracks !== this.props.tracks ||
       prevProps.reads !== this.props.reads   ||
       prevProps.region !== this.props.region
      ){
      this.createTubeMap();
    }
    if(this.props.onTrackClick) {
      tubeMap.setEventHandler("trackClick", this.props.onTrackClick);
    } else {
      tubeMap.setEventHandler("trackClick", null); 
    }
  }

  createTubeMap = () => {
    tubeMap.create({
      svgID: "#svg",
      nodes: this.props.nodes,
      tracks: this.props.tracks,
      reads: this.props.reads,
      region: this.props.region,
    });
  };

  render() {
    return <svg id="svg" alt="Rendered sequence tube map visualization" />;
  }
}

TubeMap.propTypes = {
  nodes: PropTypes.array.isRequired,
  tracks: PropTypes.array.isRequired,
  reads: PropTypes.array.isRequired,
  region: PropTypes.array.isRequired,
  onTrackClick: PropTypes.func
};

export default TubeMap;
