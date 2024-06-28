import React from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
  const CommentContainer = styled.div`
    width: 100%;
    max-width: 800px;
    //margin-top: 5px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
  `;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentText = styled.div`
    flex-grow: 1;
    font-size: 16px;
    margin-right: 8px;
  `;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin-left: 8px;
  cursor: pointer;
  color: #888;
  transition: color 0.3s;

  &:hover {
    color: #333;
  }
`;

const EditInput = styled.input`
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

    function CommentList(props){
        const {comments:initialComments} = props;
        const {postId} = useParams; 
        const [comments, setComments] = useState(initialComments);

        
        //댓글 삭제 
        const handleDelete = async(id) => {
         // alert("댓글을 삭제하겠습니까?"); //삭제 확인 로직 추가 
            try {
              console.log("id: " , id);
              await axios.delete(`http://localhost:3000/post/${postId}/comments`, {data : {id}}); 
              window.location.reload(); 
            }catch(error){
              console.error(error); 
            }
        }

        //댓글 수정 버튼> 수정 가능 상태로 전환  
        const enableEditMode = (id) => {
          setComments(comments.map((comment)=>comment.id ===id ? {...comment, isEditing: true}: comment));
        } 

            return (
            <Wrapper>
                <CommentContainer>
                {comments.map((comment, index)=>(
                    <CommentItem key={index}>
                      {comment.isEditing? (
                        <>
                        <EditInput
                         value ={comment.CONTENT}
                          onChange={(e)=>setComments(comments.map((c)=>
                          c.id===comment.id? {...c, content: e.target.value}: c
                        ))}
                          />
                         </>

                      ))}
                         <CommentText>{comment.CONTENT}</CommentText> 
                         <IconContainer>
                         <Icon onClick={()=>enableEditMode(comment.ID)}><FaEdit/></Icon>
                         <Icon onClick={()=>handleDelete(comment.ID)}><FaTrash/></Icon>
                       </IconContainer>
                       </CommentItem>
                ))}
                </CommentContainer>
            </Wrapper>
        );
    }

    export default CommentList; 