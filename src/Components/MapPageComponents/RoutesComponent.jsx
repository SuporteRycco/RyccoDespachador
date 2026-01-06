import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker, Tooltip, Polyline } from 'react-leaflet'
import { useEffect, useState } from "react"
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { API_URL } from "../../config";
import 'leaflet/dist/leaflet.css';
import CloseButtonComponent from './CloseButtonComponent';

function RoutesComponent({coords, setCoords}){
    var i = 0
    const defaultIcon = L.icon({
        iconUrl,
        shadowUrl: iconShadowUrl,
        iconSize: [12, 12],
        iconAnchor: [6, 12],
    });
    
    return (
        <div id='modalRoute' className='position absolute w-full h-[100vh]bg-[#151129a6] z-401 left-0 top-0'>
            <CloseButtonComponent/>
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
                        <CircleMarker key={i++} center={[coord.coordinates[1], coord.coordinates[0]]}
                            radius={2} color="darkblue" fillColor="darkblue" fillOpacity={1}>
                                <Popup offset={[0, -20]}>
                                    <p className="mt-0 text-[10px]">
                                        Nome: {coord.radioName}
                                    </p>
                                    <p className="mt-0 text-[10px]">
                                        Última atualização: <br />
                                        {new Date(coord.dateTime).toLocaleString("pt-BR")}
                                    </p>
                                </Popup>
                        </CircleMarker>
                    ))}

                </MapContainer>
            </div>
        </div>
    )
}

export default RoutesComponent;