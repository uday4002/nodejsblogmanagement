import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import BlogItem from '../BlogItem'
import { useNavigate } from 'react-router-dom'

import {
    BlogsHeading,
    ErrorMessage,
    ListContainer,
    BlogsContainer,
    AddBlogButton
} from './blogsComponentStyles'

const Blogs = () => {
    const [blogsData, setBlogsData] = useState([])
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = Cookies.get('jwt_token')
                const response = await axios.get('https://nodejsblogmanagement-backend.onrender.com/blogs',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success === 'true') {
                    setBlogsData(response.data.data)
                } else {
                    setError(response.data.message)
                }
            } catch (err) {
                setError('An error occurred while fetching blogs.')
                console.error(err);
            }
        }

        const fetchUserData = async() =>{
            try{
                const token = Cookies.get('jwt_token')
                const response = await axios.get('https://nodejsblogmanagement-backend.onrender.com/user',{
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

        fetchBlogs()
        fetchUserData()
    }, [])

    const isAdmin = userData.role === 'Admin'

    const clickOnAddBlogButton = () =>{
        navigate(`/blogs/add-blog`)
    }

    return (
        <BlogsContainer>
            <BlogsHeading>Blogs</BlogsHeading>
            {error && <ErrorMessage style={{color:'red'}}>{error}</ErrorMessage>} 
            {isAdmin && <AddBlogButton onClick={clickOnAddBlogButton}>ADD Blog</AddBlogButton>}
            <ListContainer>
                {blogsData.length > 0 ? (
                    blogsData.map((eachItem) => (
                        <BlogItem key={eachItem._id} info={eachItem} />
                    ))
                ) : (
                    <p>Loading</p>
                )}
            </ListContainer>
        </BlogsContainer>
    );
};

export default Blogs;
