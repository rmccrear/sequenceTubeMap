import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TubeMapContainer from "./TubeMapContainer";

import config from "../config.json";
import { dataOriginTypes } from "../enums";

import * as fetchAndParseModule from "../fetchAndParse";


// Tests functionality without server
jest.mock("../fetchAndParse");

let apiUrl, dataOrigin, viewTarget, visOptions;

apiUrl = "";
viewTarget = {};
dataOrigin = dataOriginTypes.EXAMPLE_6;

// default visOptions
visOptions = {
  removeRedundantNodes: true,
  compressedView: false,
  transparentNodes: false,
  showReads: true,
  showSoftClips: true,
  colorReadsByMappingQuality: false,
  colorSchemes: [
            {...config.defaultHaplotypeColorPalette},
            {...config.defaultHaplotypeColorPalette},
            {...config.defaultReadColorPalette},
            {...config.defaultReadColorPalette}],
  mappingQualityCutoff: 0,
};

beforeEach(() => {
  jest.resetAllMocks();

  render(
    <div>
      <TubeMapContainer
        viewTarget={viewTarget}
        dataOrigin={dataOrigin}
        apiUrl={apiUrl}
        visOptions={visOptions}
      />
      <div id="legendDiv" data-testid="legendDiv"></div>
    </div>
  );
});

describe("TubeMapContainer", () => {
  test("TubeMapContainer loads a tubemap", () => {
        // All the tracks are loaded and rendered in the SVG.
        expect(document.querySelector("[trackID='0']")).not.toBeNull();
        expect(document.querySelector("[trackID='1']")).not.toBeNull();
        expect(document.querySelector("[trackID='2']")).not.toBeNull();
        expect(document.querySelector("[trackID='3']")).not.toBeNull();
        expect(document.querySelector("[trackID='4']")).not.toBeNull();
  });
  test("Clicking a track will create a popup with the title", async () => {
    // All the tracks are loaded and rendered in the SVG.
    // Click Track 0
    let track0 = document.querySelector("[trackID='0']");
    await fireEvent.click(track0);

    let title = track0.querySelector("title");
    let titleText = title.textContent;

    // Use ID rather than ByRole since role of tooltip might be confused with another tooltip
    // This popper is specifically for allowing copy/paste while other tooltips may just activate on mouseover
    let popperElm = document.querySelector("#track-info-popper");
    expect(popperElm.textContent).toBe(titleText);
  });

  test("Click away will make popup disappear", async () => {
    let track0 = document.querySelector("[trackID='0']");
    await fireEvent.click(track0);
    let title = track0.querySelector("title");
    let titleText = title.textContent;

    let popperElm = document.getElementById("track-info-popper");
    expect(popperElm.textContent).toBe(titleText);

    // click away from popper
    let svgElm = screen.getByTestId("legendDiv");
    await fireEvent.click(svgElm);

    // the popper won't be found anymore
    waitFor(() => expect(document.getElementById("track-info-popper")).toBe(null));
  });

});