import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "./authentication/login.jsx";
import Register from "./authentication/register.jsx";
import Home from "./dashboard/home/home.jsx";
import Profile from "./dashboard/profile/profile.jsx";
import EditPost from "./dashboard/profile/editpost/editPost.jsx";
import CreatePost from "./dashboard/profile/createpost/createpost.jsx";
import CommentPage from "./dashboard/comment/addcomment.jsx";
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
          <Route path="/home" element={<Home />} />
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
