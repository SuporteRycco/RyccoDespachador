import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet'
import { useEffect, useState } from "react"
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { API_URL } from "../../config";
import 'leaflet/dist/leaflet.css';

function MapComponent(){
    const defaultIcon = L.icon({
        iconUrl,
        shadowUrl: iconShadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });
    const [coords, setCoords] = useState(null);
    const [radios, setRadios] = useState([]);
    const [coordRadios, setCoordRadios] = useState([])
    const token = localStorage.getItem('token');
    function MouseTracker() {
        useMapEvents({
        mousemove(e) {
            setCoords(e.latlng);
        },
        });
    }
    async function getRadiosByGroup(){
        const response = await fetch(`${API_URL}/Groups/Radios?IdGroup=1`, {
            method: "GET",
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const dados = await response.json()
        setRadios(dados.data)
        console.log(radios)
    }
    async function getLocations(){
        const list = []
        radios.forEach(radios => {
            list.push(radios.idRadio)
        });
        console.log(list)
        const response = await fetch(`${API_URL}/Radio/Locations`, {
            method: "POST",
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        });
        const dados = await response.json()
        setCoordRadios(dados.data)
        console.log(coordRadios)
    }
    useEffect(() => {
        getRadiosByGroup();
    }, []);

    useEffect(() => {
        if (radios.length > 0) {
            getLocations();
        }
    }, [radios]);


    return (
        <div className='h-[80%] ml-88 w-[72%] overflow-hidden rounded-3xl flex mt-[-22px]'>
                <MapContainer center={[-23.68595,  -46.619]} zoom={20} zoomControl={false} className='h-[82vh]  w-[100%]'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {coordRadios.map((coordR) => (

                        <Marker key={coordR.userId} position={[coordR.coordinates[1], coordR.coordinates[0]]} icon={defaultIcon}>
                            <Tooltip direction="top" offset={[0, -30]} permanent>
                                {coordR.radioName}
                            </Tooltip>
                            <Popup offset={[0, -20]} >
                                <p className='mt-0 text-[10px]'>Nome: {coordR.radioName}</p>
                                <p className='mt-0 text-[10px]'>Última atualização:  <br />{new Date(coordR.dateTime).toLocaleString("pt-BR")}</p>
                            </Popup>
                        </Marker>
                    ))}
                    <MouseTracker />
                </MapContainer>
        </div>
    )
}

export default MapComponent;