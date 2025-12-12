import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker, Tooltip, Polyline } from 'react-leaflet'
import { useEffect, useState } from "react"
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { API_URL } from "../../config";
import 'leaflet/dist/leaflet.css';

function RoutesComponent({coords, setCoords}){
    var i = 0
    const defaultIcon = L.icon({
        iconUrl,
        shadowUrl: iconShadowUrl,
        iconSize: [12, 12],
        iconAnchor: [6, 12],
    });
    function onCloseClick(){
        document.getElementById("modalRoute").classList.add("hidden");
    }
    return (
        <div id='modalRoute' className='position absolute w-full h-[100vh]bg-[#151129a6] z-401 left-0 top-0'>
            <button className='bg-red-600 mr-8 mb-8 mt-4 w-[80px] h-[30px] rounded-[8px] position absolute right-0 z-402' onClick={() => {onCloseClick()}}>Fechar</button>
            <div className='flex justify-center'>
                <MapContainer center={[-23.68595,  -46.619]} zoom={20}  className='w-full h-[100vh]'>
                    <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/> 
                    <Polyline
                        positions={coords.map((coord) => [coord.coordinates[1], coord.coordinates[0]])}
                        color="red"
                    />
                    {coords.map((coord) => (
                        <CircleMarker
                            key={i++}
                            center={[coord.coordinates[1], coord.coordinates[0]]}
                            radius={1}          // controla o tamanho do ponto
                            color="blue"        // cor da borda
                            fillColor="blue"    // cor de preenchimento
                            fillOpacity={1}
                            />
                    ))}

                </MapContainer>
            </div>
        </div>
    )
}

export default RoutesComponent;