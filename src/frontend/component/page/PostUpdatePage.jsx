import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import Comment from "./comment";

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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TitleText = styled.input`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ContentText = styled.textarea`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  width: 100%;
  height: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
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

function PostUpdatePage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, settUpdatedContent] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //기존 게시물을 읽어옴 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/post/${postId}`);
        console.log('response:', response.data);
        if (response.data) {
          setPost(response.data.result);
          setComments(response.data.commentResult);
          setTitle(response.data.result.title);
          setContent(response.data.result.content);
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

  //수정 완료 버튼 
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/post/${postId}/update`, {
        updatedTitle,
        updatedContent,
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  //취소 버튼 
  const handleCancel = async()=>{
    navigate(`/post/${postId}`);
  }
  
  return (
    <Wrapper>
      <Container>
        <Button onClick={() => navigate("/")}>메인화면</Button>
      </Container>

      <Container>
        <PostContainer>
          <TitleText 
            name = "title"
            defaultValue={title}
            value={title} 
            onChange={(e) => setUpdatedTitle(e.target.value)} 
            //placeholder="제목을 입력하세요" 
          />
          <ContentText 
            name ="content"
            defaultValue={content}
            value={content} 
            onChange={(e) => settUpdatedContent(e.target.value)} 
            //placeholder="내용을 입력하세요" 
          />
        </PostContainer>
      </Container>

      <Comment comments={comments} />
      <ButtonContainer>
        <RightButton onClick={handleCancel}>취소</RightButton>
        <RightButton onClick={handleUpdate}>수정완료</RightButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export default PostUpdatePage;