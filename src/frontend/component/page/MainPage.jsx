import React from "react"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';  //Http 통신 라이브러리 
import Button from "../ui/Button";
import styled from "styled-components";
import PostList from  "../list/PostList"; 


const Wrapper = styled.div`
    padding : 16px; 
    width : calc(100%-32px);
    display : flex; 
    flex-direction : column; 
    align-items : center; 
    justify-content : center;
    `;

const Container = styled.div`
    width : 100%
    max-width : 720px; 
    &{
        :not(:last-child){
            margin-bottom : 16px; 
        }
    }
`; 

function MainPage(props){
   // const {} = props; 
    const navigate = useNavigate(); 
    const[posts, setPosts] = useState([]); 

  //Data read(get)
  //useEffect : 컴포넌트가 랜더링될 때 , 특정값 변경되면 side effect 실행  
  useEffect(()=>{
    axios.get('http://localhost:3000/posts')
    .then(response =>setPosts(response.data))
    .catch(error =>console.error(error));
  }, []);

    return (
        <Wrapper> 
            <h2>게시판</h2>
            <Container>
                    <PostList
                        posts ={posts}
                        onClickItem ={(item)=> {
                            navigate(`/post/${item}`);
                        }}
                        />
                         <Button 
                        title = "글 작성하기 "
                        onClick = {()=>{
                        navigate("/post-write");
                    }}>글 작성하기</Button>  
            </Container>
        </Wrapper>
    );
}

export default MainPage; 