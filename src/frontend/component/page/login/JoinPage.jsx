import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);s
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  background-color: #f7f9fc;
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
  flex: 1;
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

const IdInputContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
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
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

const InlineButton = styled(Button)`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function JoinPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); 
  const [idCheckYn, setIdCheckYn] = useState('FALSE'); 
  //아이디 중복 검사 
  const idCheck =async(e)=>{
    e.preventDefault(); 
    if(!id){
        alert("아이디를 입력해주세요"); 
        return;
    }
    try {
      const response = await axios.get("http://localhost:3000/members", {params :{id:id}});
      console.log("success: " , response.data.success); 
      if(response.data.success){
        alert("사용 가능한 아이디입니다"); 
        setIdCheckYn('TRUE');
    }else{
      alert("이미 존재하는 아이디입니다");
    }
    }catch (error){
      console.error(error);
      alert("서버 에러가 발생했습니다");  
    }
    }
  

  const handleSubmit = async (e) => {
    if(idCheckYn!=='TRUE'){
      alert("아이디 중복 확인이 필요합니다"); 
      e.preventDefault();
      return; 
    }else if(!pw||!userName||!userBirth||!phoneNumber){
      alert("입력되지 않은 값이 있습니다."); 
      e.preventDefault();
      return; 
    }
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/members", {
        id,
        pw,
        userName,
        userBirth,
        phoneNumber
      });
    } catch (error) {
      console.log("error:", error);
    }
    alert('회원가입이 완료됐습니다. 로그인 화면으로 이동합니다.'); 
    setId('');
    setPw('');
    setUserName('');
    setUserBirth('');
    setPhoneNumber('');
    navigate('/'); 
  }

  return (
    <Wrapper>
      <h2>회원가입</h2>
      <Form onSubmit={handleSubmit}>
        <IdInputContainer>
          <Input
            type="text"
            name="id"
            value={id}
            placeholder="아이디"
            onChange={(e) => setId(e.target.value)}
          />
          <InlineButton onClick = {idCheck}>중복확인</InlineButton>
        </IdInputContainer>
        <Input
          type="password"
          name="pw"
          value={pw}
          placeholder="비밀번호"
          autoComplete="off"
          onChange={(e) => setPw(e.target.value)}
        />
        <Input
          type="text"
          name="userName"
          value={userName}
          placeholder="이름"
          autoComplete="off"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          type="date"
          name="userBirth"
          value={userBirth}
          placeholder="생년월일"
          autoComplete="off"
          onChange={(e) => setUserBirth(e.target.value)}
        />
        <Input
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          placeholder="휴대폰 번호"
          autoComplete="off"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <StyledButton type="submit">회원가입</StyledButton>
      </Form>
    </Wrapper>
  );
}

export default JoinPage;
