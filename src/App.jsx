import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./authentication/login.jsx";
import Register from "./authentication/register.jsx";
import Home from "./dashboard/home.jsx";
import Profile from "./dashboard/profile.jsx";
import EditPost from "./dashboard/editPost.jsx";
import CreatePost from "./dashboard/createpost.jsx";
import CommentPage from "./dashboard/addcomment.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editpost/:id" element={<EditPost />} />
          <Route path="/createpost" element={<CreatePost />}/>
          <Route path="/comment/:postId" element={<CommentPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
