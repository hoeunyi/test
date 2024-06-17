import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import RightButton from "../ui/RightButton";

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

  & {
    :not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const PostContainer = styled.div`
  padding: 8px 16px;
  border: 1px solid grey;
  border-radius: 8px;
  height : 500px;
`;

const TitleText = styled.p`
  font-size: 28px;
  font-weight: 500;
  margin-bottom : 16px;
  padding-bottom: 16px; 
  border-bottom : 2px solid gray;
`;

const ContentText = styled.p`
  font-size: 20px;
  line-height: 32px;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
    width : 100%; 
    max-width : 720px; 
    display : flex;
`; 

function PostViewPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //fetchPost 함수는 비동기 함수로서, 지정된 URL에서 데이터를 가져오는 역할
        // async 키워드를 사용하여 비동기 함수로 정의됨
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/post/${postId}`);
                console.log('response:', response.data); 

                if (response.data) {
                    setPost(response.data);
                } else {
                    setError(new Error("Post not found"));
                }
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                //데이터 로드가 시작될 때 true로 설정되고, 데이터 로드가 완료되거나 에러가 발생하면 false로 설정
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

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/post/${postId}`);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <Wrapper>
            <Container>
                <Button
                    onClick={() => {
                        navigate("/")
                    }}>뒤로가기</Button>
                <PostContainer>
                    <TitleText>{post.TITLE}</TitleText>
                    <ContentText>{post.CONTENT}</ContentText>
                </PostContainer>

                </Container>
                <ButtonContainer>
                <RightButton
                    onClick={handleDelete}
                >삭제하기</RightButton>
                </ButtonContainer>
          
        </Wrapper>
    );
}

export default PostViewPage;
