import React from 'react'; 
import styled from 'styled-components';

//import { application } from 'express';

//페이지이동 
import MainPage from './frontend/component/page/MainPage';
import PostWritePage from './frontend/component/page/PostWritePage';
import PostViewPage from './frontend/component/page/PostViewPage';

import {
  BrowserRouter, 
  Routes, 
  Route
} from "react-router-dom";

const MainTitleText = styled.p`
  font-size : 24px; 
  font-weight : bold; 
  text-align : center;  
`;

function App(){
  return (
    <BrowserRouter>
      <MainTitleText>게시판</MainTitleText>
      <Routes>
        <Route index element= {<MainPage/>}/> 
              <Route path="/post-write" element={<PostWritePage />} />
              <Route path="/post/:postId" element={<PostViewPage/> }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;



