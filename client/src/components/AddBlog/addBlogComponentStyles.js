import styled, {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    body{
       box-sizing: border-box;
    }
`

export const AbbBlogContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    min-height:100vh;
    padding:20px;
    background-color:${props => (props.isDark ? '#231f20' : '#ffffff')};
`
export const FormContainer = styled.form`
    padding:20px;
    width:90%;
    display:flex;
    flex-direction:column;
    border-radius:6px;
    background-color:${props => (props.isDark ? '#000000' : '#ffffff')};
    box-shadow:0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    @media (min-width:768px){
        width:35%;
        padding:30px;
    }
`
export const Label = styled.label`
    color:${props => (props.isDark ? '#ffffff' : '#616e7c')};
    font-weight:bold;
    font-family:Roboto;
    font-size:16px;
    margin-bottom:6px;
    align-self:flex-start;
`
export const InputContainer = styled.input`
    width:95%;
    border-radius:3px;
    border:${props =>
      props.isDark ? '1.6px solid #616e7c' : '1.6px solid  #e2e8f0'};
    padding:10px;
    font-size:14px;
    background-color:transparent;
`
export const AbbBlogButton = styled.button`
    background-color: #3b82f6;
    color:#ffffff;
    padding:10px;
    border-width:0px;
    font-size:16px;
    font-family:Roboto;
    border-radius:8px;
    font-weight:bold;
    margin-top:10px;
    margin-bottom:10px;
`