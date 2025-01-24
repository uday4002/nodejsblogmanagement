import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

import {
    GlobalStyle,
    LoginContainer,
    FormContainer,
    WebsiteLogo,
    Label,
    InputContainer,
    AlignItems,
    CheckBox,
    ShowPassword,
    LoginButton,
    Span
} from './loginComponentStyles'
import { ErrorMessage } from '../SignUp/loginComponentStyles'
  
const Login = () => {

    const [ userName, setUserName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ errorMsg, setErrorMessage ] = useState('')

    const navigate = useNavigate()

    const onChangeUserName = (e) =>{
        setUserName(e.target.value)
    }

    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onChangeShowPassword = (e) =>{
        setShowPassword((prevState)=>!prevState)
    }

    const onFormSubmit = async(e) =>{
        e.preventDefault()

        const response = await axios.post('https://nodejsblogmanagement-backend.onrender.com/login',{userName,password})
        if(response.data.success==='true'){
            Cookies.set('jwt_token',response.data.token)
            navigate('/')
        }
        else{
            setErrorMessage(response.data.message)
        } 
    }

    return (
    <>
        <GlobalStyle />
        <LoginContainer >
            <FormContainer onSubmit={onFormSubmit}>
                <WebsiteLogo src="https://img.freepik.com/vector-premium/concepto-palabra-blog-formas-geometricas-color_205544-12899.jpg" alt="website logo" />
                <Label htmlFor="UserName">USERNAME</Label>
                <InputContainer
                    placeholder="Username"
                    id="UserName"
                    type="text"
                    value={userName}
                    onChange={onChangeUserName}
                    required
                />
                <br />
                <Label htmlFor="Password">PASSWORD</Label>
                <InputContainer
                    placeholder="Password"
                    id="Password"
                    type={showPassword?'text':'password'}
                    value={password}
                    onChange={onChangePassword}
                    required
                />
                <AlignItems>
                    <CheckBox type="checkbox" id="ShowPassword" onChange={onChangeShowPassword}/>
                    <ShowPassword  htmlFor="ShowPassword">Show Password</ShowPassword>
                </AlignItems>
                <br />
                <LoginButton type="submit">Login</LoginButton>
                <Span>Create a new account <Link to="/signup">SignUp</Link></Span>
                {errorMsg!=='' && <ErrorMessage>*{errorMsg}</ErrorMessage>}
            </FormContainer>
        </LoginContainer>
    </>
    )
}

export default Login
