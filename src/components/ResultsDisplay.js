import React from 'react'
import DisplayBox from './DisplayBox'
import InlineBox from './InlineBox'
function Results() {
  return (
    <div className='BigBox'>
      <label class="switch">
        <input class="switch-input" type="checkbox" />
        <span class="switch-label" data-on="On" data-off="Off"></span> 
        <span class="switch-handle"></span> 
      </label>
      <DisplayBox text={"My veJOE"}/>
      <DisplayBox text={"Total veJOE Supply"} />
      <InlineBox title={"veJOE Share"} />
      <InlineBox title={"Base APR"} />
      <InlineBox title={"Current Boosted APR"} />
      <InlineBox title={"Estimated Boosted APR"} />
    </div>
  )
}

export default Results