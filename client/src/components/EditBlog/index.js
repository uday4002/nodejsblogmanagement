import { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

import {
    GlobalStyle,
    EditContainer,
    FormContainer,
    Label,
    InputContainer,
    UpdateButton,
} from './editBlogComponentStyles'
import { ErrorMessage } from '../SignUp/loginComponentStyles'
  
const EditBlog = () => {

    const [ title, setTitle ] = useState('')
    const [ content, setContent ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')   

    const {id} = useParams()

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/blogs/${id}`)
                if (response.data.success === 'true') {
                    const fetchedBlog = response.data.data
                    setTitle(fetchedBlog.title)
                    setContent(fetchedBlog.content)
                } else {
                    setErrorMessage(response.data.message || "An unexpected error occurred.")
                }
            } catch (err) {
                setErrorMessage(err.response?.data?.message || err.message || 'An error occurred while fetching blog details.')
            }
        }
        fetchBlogDetails()
    }, [id])
    

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
        const response = await axios.put(`http://localhost:3001/blogs/${id}`,{title,content},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(response.data.success==='true'){
            console.log('Eddited Successfully')
            navigate(`/blogs/${id}`)
        }
        else{
            setErrorMessage(response.data.message)
        } 
    }

    return (
    <>
        <GlobalStyle />
        <EditContainer >
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
                <UpdateButton type="submit">Update</UpdateButton>
                {errorMessage && <ErrorMessage>*{typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage}</ErrorMessage>}
            </FormContainer>
        </EditContainer>
    </>
    )
}

export default EditBlog
