import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { BlogContent, BlogTitle } from '../BlogItem/blogComponentStyles'
import { BlogDetailsMainContainer, BlogDetailsContainer, AlignTitleDelete, AlignItems} from './blogDetailsComponentStyles'
import { FaTrash,FaEdit } from "react-icons/fa"
import CommentSection from '../CommentsSection'

const BlogDetails = () =>{

    const [ userData, setUserData ] = useState('')
    const [ error, setError ] = useState(null)
    const [ blogData, setBlogData ] = useState('')

    const {id} = useParams()
    const navigate = useNavigate()
    
    useEffect(()=>{
        const fetchUserData = async() =>{
            try{
                const token = Cookies.get('jwt_token')
                const response = await axios.get('http://localhost:3001/user',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success === 'true') {
                    setUserData(response.data.data)
                } else {
                    setError(response.data.message)
                }
            }catch (err) {
                setError('An error occurred while fetching blogs.')
                console.error(err);
            }
        }

        const fetchBlogDetails = async () => {    
            try {
                const response = await axios.get(`http://localhost:3001/blogs/${id}`)
        
                if (response.data.success === 'true') {
                    setBlogData(response.data.data)
                } else {
                    setError(response.data.message)
                }
            } catch (err) {
                setError('An error occurred while fetching blog details.')
                console.error(err)
            }
        }

        fetchUserData()
        fetchBlogDetails()
    },[id])

    const isAdmin = userData.role === 'Admin'

    const token = Cookies.get('jwt_token')

    const clickOnDeleteIcon = async() =>{
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?')
        if (!confirmDelete) return
        try{
            const response = await axios.delete(`http://localhost:3001/blogs/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(response.data.success==='true'){
                console.log('blog delete successfully')
                navigate('/blogs')
            }
        }catch(error){
            console.log(`failed to delete blog ${error}`)
        }
    }

    const clickOnEditIcon = () =>{
        navigate(`/blogs/${id}/edit`)
    }
    
    return(
        <BlogDetailsMainContainer>
            {error && <p style={{color:'red'}}>{error}</p>}
            <BlogDetailsContainer>
                {isAdmin?
                <AlignTitleDelete>
                    <BlogTitle>{blogData.title}</BlogTitle>
                    <AlignItems>
                        <FaTrash style={{marginRight:"25px",fontSize:"22px"}} onClick={clickOnDeleteIcon}/>
                        <FaEdit style={{marginRight:"25px",fontSize:"22px"}} onClick={clickOnEditIcon}/>
                    </AlignItems>
                </AlignTitleDelete>
                :
                <BlogTitle>{blogData.title}</BlogTitle>}
                <BlogContent>{blogData.content}</BlogContent>
                <CommentSection blogId={id} token={token} />
            </BlogDetailsContainer>
        </BlogDetailsMainContainer>
    )
}

export default BlogDetails