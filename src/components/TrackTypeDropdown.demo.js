import Demo, {props as P} from 'react-demo'
// See https://github.com/rpominov/react-demo for how to make a demo

import TrackTypeDropdown from "./TrackTypeDropdown";

// We want to two-way-bind the demo region prop so we use advanced mode and pass the render function.
export default (<Demo
  props={{
    id: P.string('theDropdown'),
    inputId: P.string('theTextBox'),
    className: P.string('someCSSClass'),
    value: P.choices(['graph', 'haplotype', 'read']),
  }}
>
  {
    (props, update) => {
      // We need to render the component under test using the props in props, and
      // call update when the component wants to adjust the props.
      return <TrackTypeDropdown {...props} onChange={(fakeEvent) => {
        // Bind new value back up to value.
        // Remember: we get a fake event object with a "target" that has an "id" and a "value"
        update({value: fakeEvent.target.value})
      }}/>
    }
  }
</Demo>)

