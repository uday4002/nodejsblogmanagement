import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import {
    GlobalStyle,
    SignUpContainer,
    FormContainer,
    WebsiteLogo,
    Label,
    InputContainer,
    AlignItems,
    CheckBox,
    ShowPassword,
    SignUpButton,
    Span,
    VerifyEmailContainer,
    VerifyButton,
    ErrorMessage,
} from './loginComponentStyles'
  
const SignUp = () => {

    const [ name, setName ] = useState('')
    const [ userName, setUserName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ isFormSubmit, setIsFormSubmit ] = useState(false)
    const [ otp, setOtp ] = useState('')
    const [ isEmailVerified, setIsEmailVarified ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState('')

    const navigate = useNavigate()

    const onChangeName = (e) =>{
        setName(e.target.value)
    }

    const onChangeUserName = (e) =>{
        setUserName(e.target.value)
    }

    const onChangeEmail = (e) =>{
        setEmail(e.target.value)
    }

    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onChangeShowPassword = (e) =>{
        setShowPassword((prevState)=>!prevState)
    }

    const onFormSubmit = async(e) =>{
        e.preventDefault()
        const response = await axios.post('http://localhost:3001/signup', {name,userName,email,password})
        if(response.data.success==='true'){
            Cookies.set('jwt_token',response.data.token)
            setIsFormSubmit(true)
        }
        else{
            setErrorMsg(response.data.message)
        }
    }

    const onChangeOtp = (e) =>{
        setOtp(e.target.value)
    }

    const VerifyEmail = async(e) =>{
        e.preventDefault()
        try{
            const response = await axios.post('http://localhost:3001/verify-email',{email,otp})
            if(response.data.success==='true'){
                setIsEmailVarified(true)
                navigate('/')
            }
            else{
                console.log(response.data)
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
    <>
        <GlobalStyle />
        {!isFormSubmit?
            <SignUpContainer>
                <FormContainer onSubmit={onFormSubmit}>
                    <WebsiteLogo src="https://img.freepik.com/vector-premium/concepto-palabra-blog-formas-geometricas-color_205544-12899.jpg" alt="website logo" />
                    <Label htmlFor="Name">NAME</Label>
                    <InputContainer
                        placeholder="Name"
                        id="Name"
                        type="text"
                        value={name}
                        onChange={onChangeName}
                        required
                    />
                    <br />
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
                    <Label htmlFor="Email">Email</Label>
                    <InputContainer
                        placeholder="Email"
                        id="Email"
                        type="email"
                        value={email}
                        onChange={onChangeEmail}
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
                    <SignUpButton type="submit">Sign Up</SignUpButton>
                    <Span>if already an account? <Link to="/login">Login</Link></Span>
                    {errorMsg!=='' && <ErrorMessage>*{errorMsg}</ErrorMessage>}
                </FormContainer>
            </SignUpContainer>
            :
            <VerifyEmailContainer>
                {!isEmailVerified?
                    <FormContainer onSubmit={VerifyEmail}>
                        <Label htmlFor="OTP">Enter OTP sent to your mail</Label>
                        <InputContainer
                            placeholder="OTP"
                            id="OTP"
                            type="text"
                            value={otp}
                            onChange={onChangeOtp}
                            required
                        />
                        <VerifyButton type="submit">Verify</VerifyButton>
                    </FormContainer>
                    :
                    <p>Emai Verified</p>
                }
            </VerifyEmailContainer>
        }
    </>
    )
}

export default SignUp
