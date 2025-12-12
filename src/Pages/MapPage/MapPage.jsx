import { useEffect, useState } from "react";
import MapComponent from "../../Components/MapPageComponents/MapComponent"
import RoutesComponent from '../../Components/MapPageComponents/RoutesComponent';

import SelectDateModal from "../../Components/MapPageComponents/SelectDateModal";

// registra com um nome simples

function MapPage(){
    const token = localStorage.getItem('token');
    const [coord, setCoord] = useState([])
    
    useEffect(() => {
        document.getElementById("modalRoute").classList.add("hidden");
    }, [])
    return (
        <div className="w-full h-full overflow-y-hidden">
            <SelectDateModal coords={coord} setCoords={setCoord}/>
            <div className="flex">
                <button className='bg-amber-200 w-[80px] h-[80px]' onClick={() => {}}>Rotas</button>
                <div className=''>
                    <RoutesComponent coords={coord} setCoords={setCoord}/>
                </div>
                <MapComponent/>
            </div>
        </div>
    )
}

export default MapPage;