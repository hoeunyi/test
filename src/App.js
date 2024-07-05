import React from 'react'; 

//페이지이동 
import MainPage from './frontend/component/page/MainPage';
import PostWritePage from './frontend/component/page/PostWritePage';
import PostViewPage from './frontend/component/page/PostViewPage';
import PostUpdatePage from './frontend/component/page/PostUpdatePage';
import JoinPage from './frontend/component/page/login/JoinPage'
import LoginPage from './frontend/component/page/login/LoginPage';

import {
  BrowserRouter, 
  Routes, 
  Route
} from "react-router-dom";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route index element= {<LoginPage/>}/> 
              <Route path ="/join" element={<JoinPage/>}/>
              <Route path="/posts" element={<MainPage/>}/>
              <Route path="/post-write" element={<PostWritePage />} />
              <Route path="/post/:postId" element={<PostViewPage/> }/>
              <Route path= "post/:postId/update" element={<PostUpdatePage/>}/>
              <Route path="/join" element = {<JoinPage/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;



