import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

import {
    GlobalStyle,
    AbbBlogContainer,
    FormContainer,
    Label,
    InputContainer,
    AbbBlogButton,
} from './addBlogComponentStyles'
import { ErrorMessage } from '../SignUp/loginComponentStyles'
  
const AddBlog = () => {

    const [ title, setTitle ] = useState('')
    const [ content, setContent ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')   

    const navigate = useNavigate()

    const onChangeTitle = (e) =>{
        setTitle(e.target.value)
    }

    const onChangeContent = (e) =>{
        setContent(e.target.value)
    }

    const onFormSubmit = async(e) =>{
        e.preventDefault()
        const token = Cookies.get('jwt_token')
        const response = await axios.post(`https://nodejsblogmanagement-backend.onrender.com`,{title,content},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(response.data.success==='true'){
            console.log('Added Successfully')
            navigate(`/blogs`)
        }
        else{
            setErrorMessage(response.data.message)
        } 
    }

    return (
    <>
        <GlobalStyle />
        <AbbBlogContainer >
            <FormContainer onSubmit={onFormSubmit}>
                <Label htmlFor="Title">TITLE</Label>
                <InputContainer
                    placeholder="Title"
                    id="Title"
                    type="text"
                    value={title}
                    onChange={onChangeTitle}
                />
                <br />
                <Label htmlFor="Content">CONTENT</Label>
                <InputContainer
                    placeholder="Content"
                    id="Content"
                    type="text"
                    value={content}
                    onChange={onChangeContent}
                />
                <br />
                <AbbBlogButton type="submit">ADD BLOG</AbbBlogButton>
                {errorMessage && <ErrorMessage>*{typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage}</ErrorMessage>}
            </FormContainer>
        </AbbBlogContainer>
    </>
    )
}

export default AddBlog
