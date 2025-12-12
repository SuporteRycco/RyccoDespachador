import {useNavigate} from 'react-router-dom'
export function ValidaLogin(tokenSalvo, navigate){
    if (tokenSalvo !== '' && typeof tokenSalvo !== 'object'){
        console.log(tokenSalvo)
        navigate('/Map')
    }
    else{
        window.alert('Usuário ou senha errados')
    }

}