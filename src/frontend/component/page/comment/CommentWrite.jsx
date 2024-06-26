import React, {useState} from 'react'; 
import {useParams} from "react-router-dom"; 
import styled from "styled-components";
import axios from "axios";

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const RightButton = styled.button`
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function CommentWrite(){
  const [comment, setComment] = useState('');
  const {postId} = useParams(); 

  //작성 버튼 
  const handleSubmit = async()=> {
    if(!comment){
      alert("내용을 입력하세요");
      return; 
    }
    try {
      await axios.post(`http://localhost:3000/post/${postId}`, {
        comment,
        postId, 
      }
    ); 
      console.log(comment,"is successfully posted");
      setComment('');
      window.location.reload(); 
    }catch(error){
      console.error(error);
    }
  }

    return (
    <InputContainer>
            <Input
              name ="comment"
              value = {comment} 
              placeholder="댓글을 입력하세요" 
              onChange ={(e)=> setComment(e.target.value)}
            />
            <RightButton onClick={handleSubmit}>작성</RightButton>
          </InputContainer>
    );

}
export default CommentWrite; 