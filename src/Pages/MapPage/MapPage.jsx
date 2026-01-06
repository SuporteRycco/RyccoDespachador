import { useEffect, useState } from "react";
import MapComponent from "../../Components/MapPageComponents/MapComponent"
import RoutesComponent from '../../Components/MapPageComponents/RoutesComponent';

import SelectDateModal from "../../Components/MapPageComponents/SelectDateModal";
import SocketExample from "../../Components/Websocket";

// registra com um nome simples

function MapPage(){
    const token = localStorage.getItem('token');
    const [coord, setCoord] = useState([])
    const radioId = 24
    useEffect(() => {
        document.getElementById("modalRoute").classList.add("hidden");
    }, [])
    return (
        <div className="w-full h-full overflow-y-hidden">
            <SocketExample/>
            <SelectDateModal radioId={radioId} setCoords={setCoord}/>
            <div className="flex">
                <div className=''>
                    <RoutesComponent coords={coord} setCoords={setCoord}/>
                </div>
                <MapComponent/>
            </div>
        </div>
    )
}

export default MapPage;