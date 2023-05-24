import React from 'react';
import { render, fireEvent }  from '@testing-library/react';

import TubeMap from './TubeMap';
import * as tubeMap from '../util/tubemap';
import * as exampleData from '../util/demo-data';

let data;
let onTrackClick;

// Prepare mock data from Example 6.
const readsFromStringToArray = (readsString) => {
    const lines = readsString.split("\n");
    const result = [];
    lines.forEach((line) => {
      if (line.length > 0) {
        result.push(JSON.parse(line));
      }
    });
    return result;
};

let vg6 = JSON.parse(exampleData.k3138);
let ex6nodes = tubeMap.vgExtractNodes(vg6)
let ex6tracks = tubeMap.vgExtractTracks(vg6)
let ex6 = {
  nodes: ex6nodes,
  tracks: ex6tracks,
  reads:tubeMap.vgExtractReads(
    ex6nodes,
    ex6tracks,
    readsFromStringToArray(exampleData.demoReads),
  ),
  region: [] 
}

describe('TubeMap test', () => {
    beforeEach(()=>{
        data = ex6;
        onTrackClick = jest.fn();

        render(
          // tubemap.js requires the tube map to be wrapped 
          // in a div with id tubeMapSVG
          // and to have a div with legendDiv in the document.
          <div>
              <div id="legendDiv">
              </div>
              <div id="tubeMapContainer">
                <div id="tubeMapSVG">
                  <TubeMap
                    nodes={data.nodes}
                    tracks={data.tracks}
                    reads={data.reads}
                    region={data.region}
                    onTrackClick={onTrackClick}
                  />
                </div>
              </div>
          </div>);
    });

    it('It loads a tube map', async () => {
        // All the tracks are loaded and rendered in the SVG.
        expect(document.querySelector("[trackID='0']")).not.toBeNull();
        expect(document.querySelector("[trackID='1']")).not.toBeNull();
        expect(document.querySelector("[trackID='2']")).not.toBeNull();
        expect(document.querySelector("[trackID='3']")).not.toBeNull();
        expect(document.querySelector("[trackID='4']")).not.toBeNull();
    });

    it('It calls callback on track click', async () => {
      // Click Track 0
      let track0 = document.querySelector("[trackID='0']");
      await fireEvent.click(track0);

      // Expect callback to be called with
      // Title, TrackID, target element
      expect(onTrackClick).toBeCalledTimes(1);
      expect(onTrackClick).toBeCalledWith("gi|157734152:29694183-29697368", "0", track0);
    });
});
