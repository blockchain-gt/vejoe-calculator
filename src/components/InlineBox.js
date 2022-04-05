import React from 'react'

function InlineBox({title}) {
  return (
    <div className='InlineContent'>
        <h3 className='InlineTitle'>{title}</h3>
        <h3 className='InlineAmount'>0.01</h3>
    </div>
  )
}

export default InlineBox