import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Button from '../ui/Button';

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

function PostWritePage() {
  const navigate = useNavigate(); 
  const[title,setTitle] = useState('');
  const[content, setContent] = useState(''); 
 
  const handleSubmit = async(e)=> {
    e.preventDefault(); //페이지 리로드 방지
    try {
       await axios.post("http://localhost:3000/posts", {
        title, 
        content,  
      }); 
      console.log("title: ", title, "content: ", content); 
      setTitle(''); 
      setContent(''); 
      navigate('/');
    } catch(error) {
      console.error(error); 
    }
  }; 
  return (
    <FormWrapper>
      <h2>글 작성하기</h2>
      <Form onSubmit ={handleSubmit} >
        <Input
          type="text"
          name="title"
          value={title}
          placeholder="Title"
          onChange ={(e)=> setTitle(e.target.value)}
        />
        <TextArea
          name="content"
          value={content}
          placeholder="Content"
          rows="10"
          onChange={(e)=>setContent(e.target.value)}
        />
        <Button type="submit">작성 완료</Button>
      </Form>
    </FormWrapper>
  );

}
export default PostWritePage;