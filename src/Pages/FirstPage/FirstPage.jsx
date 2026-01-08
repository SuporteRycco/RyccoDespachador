import React from 'react'
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent'
import MapComponent from "../../Components/MapPageComponents/MapComponent"
import LateralBarComponent from '../../Components/LateralBarComponents/LateralBarComponent'

function FirstPage() {
  return (
    <div className="">
        
        <div>
          
            <HeaderComponent/>
            <MapComponent/>
            <LateralBarComponent/>
        
        </div>
      
    </div>
  )
}

export default FirstPage
