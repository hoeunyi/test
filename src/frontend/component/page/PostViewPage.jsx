import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import Comment from "./comment/Comment";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin-bottom: 16px;
`;

const PostContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleText = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ContentText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
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

function PostViewPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/post/${postId}`);

        if (response.data) {
          setPost(response.data.result);
          setComments(response.data.commentResult);
        } else {
          setError(new Error("Post not found"));
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  //삭제 버튼 클릭 
  const handleDelete = async () => {
    //alert ("삭제하시겠습니까") 로직 추가 
    try {
      await axios.delete(`http://localhost:3000/post/${postId}`);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  //수정 버튼 클릭> 수정화면으로 이동 
  const handleUpdate = async () => {
    navigate(`/post/${postId}/update`)
  }

  return (
    <Wrapper>
      <Container>
        <Button onClick={() => navigate("/")}>메인화면</Button>
      </Container>
      <Container>
        <PostContainer>
          <TitleText>{post.TITLE}</TitleText>
          <ContentText>{post.CONTENT}</ContentText>
        </PostContainer>
      </Container>
      <Comment comments = {comments}/>
      <ButtonContainer>
        <RightButton onClick={handleDelete}>삭제</RightButton>
        <RightButton onClick={handleUpdate}>수정</RightButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export default PostViewPage;
