import React from 'react';
import { render, fireEvent, waitFor }  from '@testing-library/react';
import {screen} from '@testing-library/react';

import TubeMap from './TubeMap';
import * as tubeMap from '../util/tubemap';
import * as exampleData from '../util/demo-data';

let data;
let onTrackClick;

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

let vg = JSON.parse(exampleData.k3138);
let nodes = tubeMap.vgExtractNodes(vg);
let tracks = tubeMap.vgExtractTracks(vg);
let reads = tubeMap.vgExtractReads(
  nodes,
  tracks,
  readsFromStringToArray(exampleData.demoReads)
);


describe('TubeMap test', () => {
    beforeEach(()=>{
        data = {
            nodes: [],
            tracks: exampleData.inputTracks2,
            reads: exampleData.demoReads,
            region: []
        }

        onTrackClick = jest.fn();
    })
    it('It loads a tube map', async () => {
        // tubemap.js requires the tube map to be wrapped in a div with id tubeMapSVG
        // and to have legendDiv in the document.
        render(
        <div>
            <div id="legendDiv">
            </div>
            <div id="tubeMapContainer">
              <div id="tubeMapSVG">
                <TubeMap
                  nodes={nodes}
                  tracks={tracks}
                  reads={reads}
                  region={data.region}
                  onTrackClick={onTrackClick}
                />
              </div>
            </div>
        </div>);
        expect(document.querySelector("[trackID='0']")).not.toBeNull();
        expect(document.querySelector("[trackID='1']")).not.toBeNull();
        expect(document.querySelector("[trackID='2']")).not.toBeNull();
        expect(document.querySelector("[trackID='3']")).not.toBeNull();
        expect(document.querySelector("[trackID='4']")).not.toBeNull();
    });
});