import React from 'react'
import {GrFormRefresh} from 'react-icons/gr'
function DisplayBox({text}) {
  return (
    <div className='Box'>
        <div className='Title'>
            <h1>{text}</h1>
        </div>
        <div className='Content'>
            <h2 className='balance'>1234</h2>
            <GrFormRefresh size={35} color='white'/>
        </div>
    </div>
  )
}

export default DisplayBox