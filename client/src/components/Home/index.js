import { useNavigate } from 'react-router-dom'
import { AlignItems } from '../SignUp/loginComponentStyles'
import {
    HeaderContainer,
    BoxItem,
    HomeContainer,
    MainContainer,
    WebsiteHeading,
    HeadingContainer,
    WelcomeHeading,
    HeadingSpan,
    GetStartedButton,
    BlogImage
} from './homeComponentStyles'

const Home=()=>{

    const navigate = useNavigate()

    const onClickGetStarted = () =>{
        navigate('/blogs')
    }

    return(
        <MainContainer>
            <HeaderContainer>
                <BoxItem>B</BoxItem>
                <BoxItem>L</BoxItem>
                <BoxItem>O</BoxItem>
                <BoxItem>G</BoxItem>
                <WebsiteHeading>Management</WebsiteHeading>
            </HeaderContainer>
            <HomeContainer>
                <AlignItems>
                    <HeadingContainer>
                        <WelcomeHeading>Welcome to<br /><HeadingSpan> BLOG Management</HeadingSpan></WelcomeHeading>
                        <GetStartedButton onClick={onClickGetStarted}>Get Started</GetStartedButton>
                    </HeadingContainer>
                    <BlogImage src="https://media.istockphoto.com/id/626669886/photo/blogging-blog-word-coder-coding-using-laptop.jpg?b=1&s=612x612&w=0&k=20&c=8HDuXvPTUz9oS7J5vnH2CxBpKs6KM0oFqPaxTkl5Kcw=" alt="blog-image" />
                </AlignItems>
            </HomeContainer>
        </MainContainer>
    )
}

export default Home