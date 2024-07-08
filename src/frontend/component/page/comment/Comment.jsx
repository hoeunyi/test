import React from 'react'; 
import CommentList from "../../list/CommentList";
import styled from "styled-components";


import CommentWrite from './CommentWrite';

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

function Comment(props){
    const {comments} = props
    return (
<Container>
        <h2>댓글</h2>
        <CommentContainer>   
          {comments.length >0 && (
          <CommentList comments={comments} /> 
        )}
          <CommentWrite></CommentWrite>
        </CommentContainer>
      </Container>
);
}

export default Comment; 