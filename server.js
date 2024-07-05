const express = require('express'); //웹서버 구축, API서버 구축, 미들웨어 사용, 동적 웹 페이지 제공 
const mariadb = require('mariadb');
const bodyPaser = require('body-parser'); 
const cors = require('cors'); 
const multer = require('multer');  //파일 업로드를 위해 사용되는 node.js의 미들웨어 

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

  //첨부파일 업로드 
  const storage = multer.diskStorage({
    destination : (req, file, cb) => {
      cb(null, 'uploads/'); 
    }, 
      filename : (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
  });

  const upload = multer({storage}); 
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.use(express.json());
  app.use(express.urlencoded({extended:true})); 
   app.use(cors({
    orgin:'http://localhost:3000'
  }));

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
  
  // 게시물 추가하기 (첨부파일 추가 )
  app.post('/posts', upload.single('file'), async (req, res) => { 
    let conn; 
    try {
      conn = await pool.getConnection(); 
      //post 요청 본문에서 title과 content 값 추출 
      const { title, content } = req.body;
      //첨부 파일 
      const file = req.files; 

      
      console.log('Received data:', title, "/", content);
      const result = await conn.query("INSERT INTO posts(title, content) VALUES (?, ?)", [title, content]);
      res.status(201).json(); 
      console.log('Received data is inserted!');
    } catch (err) {
      res.status(500).json(); 
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
        res.json({result, commentResult});
    } catch (err) {
        console.log('error:', err);
    } finally {
        if (conn) conn.release();
    }
});

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

//게시물 update 하기 
app.put('/post/:postId/update', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send('Title and content cannot be empty');
    }
    const query = "UPDATE posts SET TITLE = ?, CONTENT = ? WHERE ID = ?";
    const result = await conn.query(query, [title, content, postId]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Post not found');
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