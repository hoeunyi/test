const express = require('express'); //웹서버 구축, API서버 구축, 미들웨어 사용, 동적 웹 페이지 제공
const multer = require('multer');  //파일 업로드를 위해 사용되는 node.js 미들웨어  
const mariadb = require('mariadb');
const bodyPaser = require('body-parser'); 
const cors = require('cors'); 
const iconv = require('iconv-lite');  //파일명 인코딩 위해 모듈 추가 

const app = express();
const port = 3000;
app.use(bodyPaser.json()); //JSON 요청 파싱 
app.use(bodyPaser.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

const pool = mariadb.createPool({
    host:'localhost',
    user:'user',
    password:'1111',
    port:'3306',
    database:'testdb', 
  }); 

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.use(express.json({extended:true}));
  app.use(express.urlencoded({extended:true})); 
  app.use(cors({
    orgin:'http://localhost:3000'
  }));
  app.use((req, res, next)=> {
    res.header("Content-Type", "application/json; charset=UTF-8"); 
    next(); 
  }); 
 

  // 게시물 목록 조회하기 
  app.get('/posts', async (req, res) => {
      //async : 함수를 비동기로 선언, 항상 프라미스를 반환 
    let conn;
    try {
       //await :  프라미스가 처리될 때까지 함수를 일시 중지되고, 해결되면 결과값 반환 
      conn = await pool.getConnection();
      const result = await conn.query("SELECT * FROM posts");
      //쿼리 결과를 json 형태로 응답 
      res.json(result);
    } catch (err) {
      console.log('error:',err);
    } finally {
      if (conn) conn.release();
    }
  });
  

//첨부파일 저장 
const storage = multer.memoryStorage(); 
const upload = multer({storage});

  // 게시물 추가하기 (첨부파일 추가)
  app.post('/posts', upload.single('files'), async (req, res) => { 
    let conn; 
    try {

      conn = await pool.getConnection(); 
      //post 요청 본문에서 title과 content 값 추출 
      const { title, content } = req.body;
      const files = req.file; 
      
      const result = await conn.query("INSERT INTO posts(title, content) VALUES (?, ?)", [title, content]);
      const postId = result.insertId; 
      //파일 저장
      if(files) {
        //파일명 인코딩 처리 
       const originalName = iconv.decode(Buffer.from(files.originalname, 'latin1'), 'utf-8');
        const query = 'INSERT INTO files(name, type, data, boardId) VALUES (?, ?, ?, ?)'; 
        await conn.query(query, [originalName, files.mimetype, files.buffer, postId]); 
      }

      res.status(201).json(); 
    } catch (err) {
      console.error('Error occurred', err); 
      res.status(500).send('Error uploading file'); 
    } finally {
      if (conn) conn.release();
    }
  });
 
// 게시물 조회하기
app.get('/post/:postId', async (req, res) => {
    let conn;
    try {
        const { postId } = req.params;
        conn = await pool.getConnection();
        const query = 'SELECT TITLE, CONTENT FROM posts WHERE ID = ?';
        const [result] = await conn.query(query, [postId]);
        
        // 각 게시물에 해당하는 댓글 조회하기 
        const query1 = 'SELECT ID, CONTENT FROM comment WHERE boardID = ?'; 
        const commentResult = await conn.query(query1,[postId]); 

        //첨부 파일 조회하기 
        const query2 = 'SELECT * FROM files WHERE boardId = ?'; 
        const fileResult = await conn.query(query2, [postId]); 
        res.json({result, commentResult, fileResult});
    } catch (err) {
        console.log('error:', err);
    } finally {
        if (conn) conn.release();
    }
});

//파일 다운로드 엔드포인트 추가 
app.get('/files/:fileId', async(req, res) => {
  let conn; 
  try {
    const {fileId} = req.params; 
    conn = await pool.getConnection(); 
    const query = 'SELECT name, type, data FROM files WHERE id = ?'; 
    const result = await conn.query(query, [fileId]); 
    
    const file = result[0] ;
    if(!file){
      console.log("no file!", error); 
      return; 
    }
    const encodedFileName = encodeURIComponent(file.name); 
    res.setHeader('Content-Disposition',`attachment; filename=${encodedFileName}`); 
    res.setHeader('Content-type', file.type); 
    res.send(file.data); 
  }catch (err){
    console.error("Error occurred: ", err);
  }finally {
    if(conn) conn.release(); 
  }
})

//게시물 삭제하기 
app.delete('/post/:postId', async(req, res) => {
    let conn;
    try {
        const { postId } = req.params;
        conn = await pool.getConnection();
        const query = 'DELETE FROM  posts WHERE ID = ?';
        const result = await conn.query(query, [postId]);

        // 쿼리 결과에서 BigInt 값을 문자열로 변환
        const response = {
            affectedRows: result.affectedRows, //변경된 행수
            warningStatus: result.warningStatus //에러 발생 
        };
        res.json(response);

    } catch (err) {
        console.log('error: ', err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release();
    }
});

//첨부파일 삭제하기 
app.delete('/files/:fileId', async(req, res)=> {
  let conn; 
  try { 
    const {fileId} = req.params; 
    conn = await pool.getConnection(); 
    const query = 'DELETE FROM files WHERE ID = ?'; 
    const result = conn.query(query, [fileId]);  
    res.json(result); 
  } catch(err){
    console.error("error: ", err); 
    res.status(500).send('Interneal Server Error'); 
  }finally {
    if(conn) conn.release
  }


})
//게시물 update 하기 
app.put('/post/:postId/update', upload.single('newFiles'), async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { postId } = req.params;
    const { title, content } = req.body;
    const newFiles = req.file; 
    console.log(title, content, newFiles); 

    if (!title || !content) {
      return res.status(400).send('Title and content cannot be empty');
    }
    const query = "UPDATE posts SET TITLE = ?, CONTENT = ? WHERE ID = ?";
    const result = await conn.query(query, [title, content, postId]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Post not found');
    }

    //파일 update 하기 ~!
    if(newFiles){
      const originalName = iconv.decode(Buffer.from(newFiles.originalname,'latin1'), 'utf-8'); 
      const query = 'INSERT INTO files(name, type, data, boardId) VALUES(?,?,?,?)'; 
      await conn.query(query, [originalName, newFiles.mimetype, newFiles.buffer, postId]); 
    }

    res.status(201).json();
    console.log("Data is updated");
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send();
  } finally {
    if (conn) conn.release();
  }
});

//댓글 추가하기 
app.post('/post/:postId', async (req, res)=> {
  let conn; 
  try {
    conn = await pool.getConnection();
    const {comment, postId,}  = req.body;  
    
    const query = "INSERT INTO comment(content, boardId) VALUES (?, ?)"
    await conn.query(query, [comment, postId]); 
    res.status(201).json(); 
    console.log('Received commentData is inserted!');
  }catch (err){
    console.log("error: ", err); 
  }finally {
    if(conn) conn.release(); 
  }
})

//댓글 삭제하기 
app.delete('/post/:postId/comments', async(req, res)=> {
  let conn; 
  try {
    conn = await pool.getConnection(); 
    const {id} =req.body;
    const query = "DELETE FROM comment where ID = ?"
    await conn.query(query, [id]); 
    res.status(201).json(); 
  }catch (err){
    console.log("error:", err); 
  }finally {
    if(conn) conn.release(); 
  }
})

//댓글 수정하기 
app.put('/post/:postId/comments', async(req,res)=>{
  let conn; 
  try {
    conn = await pool.getConnection(); 
    const {id, content} = req.body;
    const query = "UPDATE comment SET CONTENT =? WHERE ID =?" 
    await conn.query(query, [content, id]); 
    res.status(201).json(); 
    console.log("data is successfully updated");
  }catch (err){
    console.log("error:", err); 
  }finally {
    if(conn) conn.release(); 
  }
})

//회원가입
app.post('/members', async(req, res)=>{
  let conn; 
  try {
    conn = await pool.getConnection(); 
    const {id, pw, userName, userBirth, phoneNumber} = req.body;
    const query = "INSERT MEMBERS(id, pw, userName, userBirth, phoneNumber) VALUES (?, ?, ?, ?, ?)"; 
    await conn.query(query, [id, pw, userName, userBirth, phoneNumber]); 
    res.status(201).json(); 
    console.log("member is inserted to MemberDB"); 
  }catch(err){
    console.log("error", err); 
  }finally {
    if(conn) conn.release(); 
  }
})

//아이디 중복 검사 
app.get("/members", async(req, res)=> {
  let conn ;
  try {
    conn = await pool.getConnection(); 
    const {id} = req.query;  

    if(!id){
      return res.status(400).json({success:false, message:"아이디를 입력해주세요"});
    }
    const query = "SELECT * FROM members WHERE id = ?"
    const rows = await conn.query(query, [id]); 

    if(rows.length>0){
      res.status(200).json({success:false, message:"duplicate id"}); 
    }else{
      res.status(200).json({success:true, message: "able id"}); 
    }
  }catch(err){
    res.status(500).json({success:false, message: "서버오류가 발행했습니다. "}); 
  }finally {
    if(conn) conn.release();
  }
})


//로그인 
app.post('/log', async(req, res)=> {
  let conn; 
  try {
    conn = await pool.getConnection(); 
    const {id, pw} = req.body; 

    const query1 = "SELECT * FROM members WHERE id =? AND pw = ? "
    const rows  =await conn.query(query1, [id, pw]); 

    //회원정보가 일치할 때 
    if(rows.length>0){
      const query2 = "INSERT log(id, pw) value (?,?)";  //로그에 저장함 
      await conn.query(query2, [id, pw]); 
      res.status(201).json({success:true, message: 'login successful'}); 
    } 
    //회원정보가 일치하지 않을 때 
    else{
      res.status(401).json({success:false, message: 'Invalid credentials'}); 
    }
  }catch(err) {
    console.log("error: ", err); 
    res.status(500).json({success:false, message: 'server error'}); 
  }finally {
    if (conn) conn.release(); 
  }
}); 