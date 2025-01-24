import styled from 'styled-components'

export const BlogsHeading = styled.h1`
    color:#000000;
    font-size:45px;
    font-style:italic;
    font-weight:bold;
`
export const ErrorMessage = styled.p`
    color:red;
    font-family:Roboto;
    font-size:22px;
`
export const ListContainer = styled.ul`
    padding:0px;
    margin:0px;
`
export const BlogsContainer = styled.div`
    padding:20px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`
export const AddBlogButton = styled.button`
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
    align-self:flex-end;
`