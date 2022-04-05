import React from 'react'
import Select from './Select'
import {GrFormRefresh} from 'react-icons/gr'
function SelectToken() {
  return (
    <div className='Box' id='selectBox'>
        <div id='selectList'>
            <Select />
        </div>
        <div className='Content'>
            <h2 className='balance'>1234</h2>
            <GrFormRefresh id="refresh" size={35} color='white'/>
        </div>
    </div>
  )
}

export default SelectToken