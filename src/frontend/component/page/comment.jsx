import CommentList from "../list/CommentList";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin-bottom: 16px;
`;

const CommentContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

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

function Comment(props){
    const {comments} = props
return (
<Container>
        <h2>댓글</h2>
        <CommentContainer>
          <CommentList comments={comments} />
          <InputContainer>
            <Input placeholder="댓글을 입력하세요" />
            <RightButton>작성</RightButton>
          </InputContainer>
        </CommentContainer>
      </Container>
);
}

export default Comment; 