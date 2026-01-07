import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Login from "./authentication/login.jsx";
import Register from "./authentication/register.jsx";
import Home from "./dashboard/home/home.jsx";
import Profile from "./dashboard/profile/profile.jsx";
import CreatePost from "./dashboard/createPost/CreatePost.jsx";
import EditProfile from "./dashboard/profile/editProfile/EditProfile.jsx";
import Explore from "./dashboard/explore/explore.jsx";
import Skill_MD from "./dashboard/profile/viewSkill/Skill_MD.jsx";
import ProfileView from "./profileView/ProfileView.jsx";
function App() {
  return (
    <>  
     <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePost />}/>
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/skillsm" element={<Skill_MD />} />
          <Route path="/profileView" element={<ProfileView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
