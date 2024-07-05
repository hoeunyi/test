import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fc;
  min-height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
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

const StyledButton = styled(Button)`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

`;
const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledLink = styled(Link)`
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate(); 
  const [error, setError] = useState(''); 

  //로그인 
  const handleLogin = async (e) => {
    e.preventDefault(); 
    if(!id ||! pw){
        alert("아이디와 비밀번호를 입력해주세요"); 
        return; 
    } 
    try{
       const response= await axios.post("http://localhost:3000/log", {
            id, 
            pw
        })
        if(response.data.success){
            setId(''); 
            setPw(''); 
            navigate('/posts'); 
        } else {
            setError(response.data.message); 
        }
    }catch(error){
        setError("아이디 또는 비밀번호를 잘못 입력했습니다.")
    }
   
}; 

  return (
    <Wrapper>
      <h2>로그인</h2>
      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          name="id"
          value={id}
          placeholder="아이디"
          autoComplete="off"
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          type="password"
          name="pw"
          value={pw}
          placeholder="비밀번호"
          autoComplete="off"
          onChange={(e) => setPw(e.target.value)}
        />
        <StyledButton type ="submit"> 로그인</StyledButton>
        {error &&<p style={{color:'red'}}>{error}</p>}
        <LinkContainer>
        <StyledLink to="/join">회원가입</StyledLink>
        </LinkContainer>
      </Form>
    </Wrapper>
  );
}

export default LoginPage;
