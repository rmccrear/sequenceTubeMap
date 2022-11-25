import {bedRegions, pathNames, mountedFileNames} from "./data";


export const fetchAndParse = async (path) => {
  if(path.match(/getBedRegions/)) {
    return bedRegions;
  } else if (path.match(/getPathNames/)) {
    return pathNames;
  } else if (path.match(/getFilenames/)) {
    return mountedFileNames;
  }
}