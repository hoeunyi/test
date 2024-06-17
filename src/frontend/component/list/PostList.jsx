import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const BoardTable = styled.table`
  border-collapse: collapse;
  width: 1000px;
  max-width: 1000px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #007BFF;
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
`;

const TableCellId = styled(TableCell)`
  width: 50px;
  text-align:center;
`;

const TableCellContent = styled(TableCell)`
  width: 950px;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;



function PostList(props) {
    const { posts, onClickItem } = props;

  return (
    <Wrapper>
      <BoardTable>
        <thead>
          <tr>
            <TableHeader>NO</TableHeader>
            <TableHeader>제목</TableHeader>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <TableRow key={post.id} onClick={() => onClickItem(post.id)}>
              <TableCellId>{index+1}</TableCellId>
              <TableCellContent>{post.title}</TableCellContent>
            </TableRow>
          ))}
        </tbody>
      </BoardTable>
    </Wrapper>
  );
}

export default PostList;