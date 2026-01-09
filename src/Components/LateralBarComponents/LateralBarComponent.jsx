import React from 'react'
import GroupsCards from './GroupsCards'
import PTTCardComponent from './PTTCardComponent'

function LateralBarComponent() {
    
  return (
    <div className='h-[456px] ml-5 w-[310px] bg-[#345E66] mt-[-456px] rounded-3xl'>

        <div id='IconsGroup' className='flex items-center justify-around'>

        </div>

        <div id='SearchGroup' className='flex justify-around mt-4 w-[310px]'>

            <input id='SelectBox' className='w-[240px] h-[32px] ml-[16px] rounded-md'>
                
            </input>

            <div id='SearchIcon' className='flex justify-center items-center ml-[-10px]'>

                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.414 24.586L22.337 19.509C23.386 17.928 24 16.035 24 14C24 8.486 19.514 4 14 4C8.486 4 4 8.486 4 14C4 19.514 8.486 24 14 24C16.035 24 17.928 23.386 19.509 22.337L24.586 27.414C25.366 28.195 26.634 28.195 27.414 27.414C28.195 26.633 28.195 25.367 27.414 24.586ZM7 14C7 10.14 10.14 7 14 7C17.86 7 21 10.14 21 14C21 17.86 17.86 21 14 21C10.14 21 7 17.86 7 14Z" fill="white"/>
                </svg>

            </div>

            

        </div>
        
        <div id='GroupCardsComponent'>
            <GroupsCards/>
        </div>


        <div id='PTTCardComponent' className=''>
            
            <PTTCardComponent/>

        </div>
      
    </div>
  )
}

export default LateralBarComponent
