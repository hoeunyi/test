import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    padding : 16px;
    display : flex; 
    flex-direction:column; 
    align-items: flex-start; 
    justify-content : center; 
    
    &{
        :not (:last-child){
            margin-bottom : 16px; 
        }
    }
    `;

    const CommentWrapper = styled.div`
    width: calc(100% - 32px); 
    padding : 8px; 
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    justify-content : center; 
    border:1px solid grey; 
    border-radius : 8px; 
    cursor: pointer; 
    backgroud : white; 
    margin-top:20px;
    :hover {
        background : lightgrey; 
    }  
    }
    `;

    const ContentText = styled.p`
    font-size : 14px; 
    `;

    function CommentList(props){
        const {comments} = props;
            return (
            <Wrapper>
                {comments.map((comment)=>(
                    <CommentWrapper>
                         <ContentText key = {comment.ID}>{comment.CONTENT}</ContentText> 
                    </CommentWrapper>
                ))}
            </Wrapper>
        );
    }

    export default CommentList; 