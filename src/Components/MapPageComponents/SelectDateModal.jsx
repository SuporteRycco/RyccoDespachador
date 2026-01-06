import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR"; // importa locale
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ptBR", ptBR);
import { useEffect, useState } from "react";
import { API_URL } from "../../config";


function SelectDateModal({radioId, setCoords}){
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [intervalo, setIntervalo] = useState(5)
    const token = localStorage.getItem('token');

    async function getLocations(){
        const formatStart = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}T${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
        const formatEnd = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
        const obj = {
            "radioId": radioId,
            "startDate": formatStart,
            "endDate": formatEnd,
            "intervalo": intervalo
        }
        const response = await fetch(`${API_URL}/Radio/Routes`, {
            method: "POST",
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const dados = await response.json()
        setCoords(dados.data)
    }

    function onSearchClick(){
        document.getElementById("modalRoute").classList.remove("hidden");
        getLocations()
    }

    return(
        <div>
            <button command="show-modal" commandfor="dialog" className="rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20">Open dialog</button>
            <el-dialog>
                <dialog id="dialog" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                    <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                    <div tabindex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                        <el-dialog-panel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 id="dialog-title" className="text-base font-semibold text-white">Selecione as datas de busca</h3>
                                        <div className="w-[430px]">
                                            <br />
                                            <p className="text-sm text-gray-400 text-center">Data de ínicio</p>
                                            <div className="m-auto text-center">
                                                <DatePicker className="mt-2 pr-2 pl-2 rounded-[8px]"
                                                    selected={startDate}
                                                    onChange={(date) => {
                                                        setStartDate(date)
                                                        setEndDate(date)
                                                    }}
                                                    showTimeSelect
                                                    dateFormat="dd/MM/yyyy HH:mm"
                                                    locale="ptBR"
                                                    timeCaption="Hora"
                                                />
                                            </div>
                                            <br />
                                            <br />
                                            <p className="text-sm text-center text-gray-400">Data de final</p>
                                            <div className="text-center">
                                                <DatePicker className="mt-2 pr-2 pl-2 rounded-[8px]"
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                    showTimeSelect
                                                    dateFormat="dd/MM/yyyy HH:mm"
                                                    locale="ptBR"
                                                    timeCaption="Hora"
                                                    filterDate={(date) => {
                                                        const day = date.getDate();
                                                        const month = date.getMonth() + 1;
                                                        return day === startDate.getDate() && month === startDate.getMonth()+1;
                                                    }}
                                                />  
                                            </div>
                                            <br />
                                            <p className="text-sm text-center text-gray-400">Intervalo</p>
                                            <div className="text-center">
                                                <select className="mt-2 pr-2 pl-2 rounded-[8px] bg-white" onChange={(event) => {setIntervalo(event.target.value)}}>
                                                    <option value="5">5 Segundos</option>
                                                    <option value="10">10 Segundos</option>
                                                    <option value="15">15 Segundos</option>
                                                    <option value="20">20 Segundos</option>
                                                    <option value="30">30 Segundos</option>
                                                    <option value="60">1 Minuto</option>
                                                    <option value="300">5 Minutos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" command="close" commandfor="dialog" className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400 sm:ml-3 sm:w-auto" onClick={() => {onSearchClick()}}>Buscar</button>
                                <button type="button" command="close" commandfor="dialog" className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                        </el-dialog-panel>
                    </div>
                </dialog>
            </el-dialog>
        </div>
    )
}

export default SelectDateModal
