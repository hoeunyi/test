import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import FileList from "../list/FileList"; 
import { FaTrash, FaDownload } from "react-icons/fa";


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

const TitleText = styled.textarea`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  width: 97%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ContentText = styled.textarea`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  width: 97%;
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
const FileContainer = styled.div`
  display : flex; 
  alignItem :center; 
  justify-content: space-between;
  `

const FileInput = styled.input`
  margin-top: 10px; 
  padding: 10px; 
  font-size : 16px; 
  border : 1px solid #ddd
  border-radius : 5px; 
`

const Icon = styled.div`
    margin-left: 8px; 
    margin-top: 20px; 
    cursor: pointer; 
    color: #888; 
    transition: color 0.3s; 
  
    &:hover {
        color: #333; 
    }
`; 

function PostUpdatePage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({title:"", content:""});
  const [originalPost, setOriginalPost] = useState({title:"", content:""})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]); 
  const [newFiles, setNewFiles] = useState(); 
  const [fileYn, setFileYn] = useState("Y");

  const handleFilesChange = (e) =>{
    //e.target.files[0] : 사용자가 선택한 첫번째 파일을 나타내는 File 객체 
    setNewFiles(e.target.files[0]) 
  }

  //변경 전 데이터 세팅 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/post/${postId}`);
        if (response.data) {
          const fetchedPost = response.data.result;
          setPost({title:fetchedPost.TITLE, content:fetchedPost.CONTENT});
          setOriginalPost({title:fetchedPost.TITLE, content:fetchedPost.CONTENT})
          setComments(response.data.commentResult);
          setFiles(response.data.fileResult); 
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

  // 수정 완료 버튼
  const handleUpdate = async(id) => {

    //1 제목이나 내용이 없는 경우 > alert ("제목과 내용을 모두 입력하세요")
    if(post.title.trim()===""||post.content.trim()===""){
      alert("제목과 내용을 모두 입력하세요"); 
      return;
    }
    //2 수정된 내용이 없는 경우 > alert ("변경 사항이 없습니다.")
    if(post.title===originalPost.title&&post.content===originalPost.content&&!newFiles){
      alert("변경 사항이 없습니다."); 
      return;
    }

    const formData = new FormData(); 
    formData.append('title', post.title); 
    formData.append('content', post.content); 
    if(newFiles){
      formData.append('newFiles', newFiles); 
    }
    try {
      console.log("newFiles: ",  newFiles); 
      await axios.put(`http://localhost:3000/post/${postId}/update`, formData, {
        headers : {
          'Content-Type' : 'multipart/form-data', 
        }
      });
      //파일 삭제 반영 
      if(fileYn ==="N"){
        try {
          console.log("파일 진짜 삭제해 ~~"); 
          axios.delete(`http://localhost:3000/files/${id}`, { data: { id } });  
        }
        catch(err){
          console.error("delete error: ", err); 
        }
      }
      alert("수정이 성공적으로 완료됐습니다"); 
      navigate(`/post/${postId}`); 
    } catch (error) {
      console.error(error);
    }
  };

  // 취소 버튼
  const handleCancel = () => {
    navigate(`/post/${postId}`);
  };

const handleChange = (e)=> {
  const{name, value} = e.target; 
  setPost((prevPost)=>({
    ...prevPost, 
    [name]:value, 
  }));
};

    // 첨부파일 삭제 (수정완료 버튼 눌러야 최종 삭제, 안보이게만 함)
    const handleDelete = () => {
      if (window.confirm(`삭제하시겠습니까?`)) { 
          setFileYn("N");
      } 
  };

  return (
    <Wrapper>
      <Container>
        <Button onClick={() => navigate("/posts")}>메인화면</Button>
      </Container>
      <Container>
        <PostContainer>
          <TitleText
            name="title"
            defaultValue={post.title}
            onChange={handleChange}
          />
          <ContentText
            name="content"
            defaultValue={post.content}
            onChange={handleChange}
          />
        
        {files.length>0&&fileYn ==="Y"?  (
        <FileContainer>
         <FileList files={files}></FileList>
          <Icon onClick={() => handleDelete()}>
            <FaTrash />
          </Icon>
        </FileContainer>
        ) :(
        <FileContainer>
          <FileInput
          type = "file"
          name = "files"
          onChange={handleFilesChange}
        />
        </FileContainer>
        )}
        </PostContainer>
      </Container>
     
      <ButtonContainer>
        <RightButton onClick={handleCancel}>취소</RightButton>
        <RightButton onClick={()=> handleUpdate(files.id)}>수정완료</RightButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export default PostUpdatePage;
