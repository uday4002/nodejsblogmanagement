import { Link } from 'react-router-dom'

import {
    BlogContainer,
    BlogTitle,
    BlogContent,
} from './blogComponentStyles'

const Blog = (props) => {
    const {info} =props

    return(
        <Link to={`/blogs/${info._id}`} style={{textDecoration:'none'}}>
            <BlogContainer>
                <BlogTitle>{info.title}</BlogTitle>
                <BlogContent>{info.content}</BlogContent>
            </BlogContainer>
        </Link>
    )
}

export default Blog