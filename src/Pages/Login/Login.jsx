import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import ImagemAnimada from '../../Components/Login/ImagemAnimada';
import { API_URL } from "../../config";

import * as funcsl from '../../Components/Login/FunctionsLoginScreen'

const Login = () => {
  const navigate = useNavigate()    
  const [textoVermelho, setTextoVermelho] = useState(false)
  const mudaCor = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setTextoVermelho(true);
    }, 2000); 
  };
    //consts para realizar a leitura e gravação do que é digitado nos campos do formulário
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  function consumirAPI(account, password){
    const url = `${API_URL}/Radio/Login`;
    const dados = {
      "account": account,
      "password": password,
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }
      return response.json()
    })
    .then(datacrua=> {
      const dados = datacrua
      localStorage.setItem('token', dados.data.token)
      localStorage.setItem('userName', dados.data.deviceName)
      localStorage.setItem('aes', dados.data.aesKey)
      navigate('/Mapa')
    })
    .catch(error => {
      console.error("Erro ao consumir a API:", error);
    })
  }

  return (
      <div className="bg-[url('src/assets/bg_login.png')] bg-cover bg-center h-screen w-screen">
        <ImagemAnimada/>

        <form id='form' className='lg:z-30 lg:space-y-8 lg:absolute lg:top-20 lg:right-40 lg:w-95 lg:pl-12 lg:p-4 bg-white border-none rounded-3xl h-110
        md:z-30 md:space-y-8 md:absolute md:top-8 md:right-12 md:w-95 md:pl-10 md:p-4'action="" 
        onSubmit={(e) => {e.preventDefault(), consumirAPI(account, password, mudaCor(e))}}>
          <h1 className='mt-11 text-[36px] text-[#3D6C85] '>Seja bem-vindo</h1>
          <svg className='absolute top-[151px] pl-1' width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0.00100708C8.05991 0.00100708 0 8.05934 0 18.0002C0 27.9411 8.05912 35.9994 18 35.9994C27.9417 35.9994 36 27.9411 36 18.0002C36 8.05934 27.9417 0.00100708 18 0.00100708ZM18 5.38298C21.2891 5.38298 23.9544 8.04906 23.9544 11.3366C23.9544 14.6249 21.2891 17.2902 18 17.2902C14.7125 17.2902 12.0472 14.6249 12.0472 11.3366C12.0472 8.04906 14.7125 5.38298 18 5.38298ZM17.996 31.2935C14.7156 31.2935 11.7111 30.0988 9.39374 28.1214C8.82922 27.6399 8.50347 26.9338 8.50347 26.193C8.50347 22.8588 11.202 20.1903 14.5369 20.1903H21.4646C24.8004 20.1903 27.4886 22.8588 27.4886 26.193C27.4886 26.9346 27.1645 27.6391 26.5991 28.1206C24.2825 30.0988 21.2773 31.2935 17.996 31.2935Z" fill="#9F9F9F"/>
          </svg>

          <div id='email' className=""><input className=' pl-9 border border-gray-400 border-opacity-60 rounded w-75 h-10' type="text" placeholder='Usuario' 
            onChange={(e)=> setAccount(e.target.value)}/>
          </div>
          <svg className='absolute top-[222px] pl-1' width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.125 13.5H27V9C27 4.0365 22.9635 0 18 0C13.0365 0 9 4.0365 9 9V13.5H7.875C6.015 13.5 4.5 15.0135 4.5 16.875V32.625C4.5 34.4865 6.015 36 7.875 36H28.125C29.985 36 31.5 34.4865 31.5 32.625V16.875C31.5 15.0135 29.985 13.5 28.125 13.5ZM12 9C12 5.691 14.691 3 18 3C21.309 3 24 5.691 24 9V13.5H12V9ZM19.5 25.083V28.5C19.5 29.328 18.8295 30 18 30C17.1705 30 16.5 29.328 16.5 28.5V25.083C15.6075 24.5625 15 23.6055 15 22.5C15 20.8455 16.3455 19.5 18 19.5C19.6545 19.5 21 20.8455 21 22.5C21 23.6055 20.3925 24.5625 19.5 25.083Z" fill="#9F9F9F"/>
          </svg>

          <div id='password' className=""><input className=' pl-9 border border-gray-400 border-opacity-60 rounded w-75 h-10'type="password" placeholder='Senha' 
            onChange={(e)=> setPassword(e.target.value)}/>
            <label className={`text-sm ${textoVermelho ? 'text-red-500' : 'hidden text-white'}`} >Usuário ou senha incorretos</label>
          </div>
          <div className="">
              <button type='submit' className=' bg-[#65AD93] active:bg-[#63c29f] active:w-31 active:h-11 text-[20px] text-white border-none rounded-md w-30 h-9.5' >Login</button>
              <a className='text-[#5F7FC9] ml-[20px] text-[15px]' href="#">Esqueceu sua senha? </a>
          </div>
        </form>
      </div>
  )
}

export default Login
