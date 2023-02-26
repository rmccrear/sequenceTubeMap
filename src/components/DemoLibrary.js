/// DemoLibrary.js: page that shows a library of demos for different components included in this project.
/// When developing a component, you can work on it on its demo page until it
/// actually starts working, and then perfect automated tests and add it to the
/// actual application. This is compatible with the dev server's hot reloading!
///
/// To use this:
/// 1. Make your component, Whatever.js
/// 2. Make a demo file, Whatever.demo.js
/// 3. In the demo file, import your component, import Demo from 'react-demo',
///    and make the default export be a <Demo> component:
///    
///    import { Whatever } from './Whatever'
///    import { Demo, props as P } from 'react-demo'
///    export default (<Demo target={Whatever} />)
///    
/// 4. If the component needs props, pass a "props" attribute to the Demo
///    component, with the props to use. See
///    <https://github.com/rpominov/react-demo#available-demoprops>.
/// 5. If the component needs two-way binding, use "advanced mode"
///    <https://github.com/rpominov/react-demo#advanced-mode>. Make the Demo
///    tag have a body which is a function that takes "props" and "update".
///    Return your component rendered with the "props", and use "update" as if
///    it were setState to update the props.
///
/// For an example, see RegionInput.demo.js
///
/// To see your demos, run `npm run start`, and go to:
///
/// http://127.0.0.1:3001/demo
///
/// (Assuming this component is mounted there in the React router.)

import Library from 'react-demo-library'
import { SafeLink } from "./SafeLink"

// To auto-magically pick up demos, we use this magic to tell Webpack what we
// want it to grab (*.demo.js, recursively), which it can work out at bundle
// time. See
// <https://webpack.js.org/guides/dependency-management/#requirecontext>.
// Can't use constandt here, arguments *MUST* be literals for the magic to
// work.
const getFromContext = require.context('.', true, /\.demo\.js$/)

// Each demo gets an object in this array with fields:
// location: array of path components to mount at, after a hashbang
// demo: React element for the demo itself, a react-demo Demo component
// description: text about the demo, if any
// importPath: hint about where to find the component to use it
// fullWidth: boolean, true if we want to hide the demo picker
// files: array of name and content objects to show along with the demo.
// 
// Really we just need location and demo set.
let demoList = []

for (let moduleName of getFromContext.keys()) {
  // Load all the demos available.
  
  // Work out what import this should be a demo for (drop the whole extension)
  let componentFile = moduleName.replace(/\.demo\.js$/, '') 
  // Work out what this should be a demo for (drop './' and extension and split
  // path segments).
  // Last one will be the component name.
  let componentPathSegments = componentFile.replace(/^\.\//, '').split('/')
  
  // We need to fetch out the default export manually by its magic name. See
  // <https://stackoverflow.com/a/33705077>
  demoList.push({location: componentPathSegments, importPath: componentFile, demo: getFromContext(moduleName).default})
}

export const DemoLibrary = () => {
  return (
    <>
      {
        // Because the demo UI does a bunch of full-browser-size stuff we have to float our back link over it
      }
      <div style={{position: "absolute", left: "0.5em", bottom: "0.5em", zIndex: 1001}}>
        <SafeLink to="/">Back to Tube Map</SafeLink>
      </div>
      <Library demos={demoList}/>
    </>
  )
}
