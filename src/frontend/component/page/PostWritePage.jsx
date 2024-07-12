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
  background-color: #f7f7f7;
  min-height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 15px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 15px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled(Button)`
  padding: 15px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileInput = styled.input`
  padding: 10px; 
  font-size : 16px; 
  border : 1px solid #ddd
  border-radius : 5px; 
`

function PostWritePage() {
  const navigate = useNavigate(); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [files, setFiles] = useState(null); 
  const handleFilesChange = (e) => {
    setFiles(e.target.files[0]); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 모두 입력하세요");
      return;
    }

    const formData = new FormData(); 
    formData.append('title', title); 
    formData.append('content', content); 
    if(files){
      formData.append('files', files); 
    }
    try {
      await axios.post("http://localhost:3000/posts", formData, {
        headers : {
         'Content-Type': 'multipart/form-data; charset=UTF-8;', 
        }
      }); 
      setTitle(''); 
      setContent(''); 
      setFiles(null); 
      alert("게시물 작성이 완료됐습니다.")
      navigate('/posts'); 
    }catch (error) {
      console.error(error); 
    }  
  }; 

  return (
    <FormWrapper>
      <h2>게시물 작성</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          value={title}
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          name="content"
          value={content}
          placeholder="내용을 입력하세요"
          rows="10"
          onChange={(e) => setContent(e.target.value)}
        />
        <FileInput
          type = "file"
          name = "files"
          onChange={handleFilesChange}
        />
        <SubmitButton type="submit">작성 완료</SubmitButton>
      </Form>
    </FormWrapper>
  );
}

export default PostWritePage;
