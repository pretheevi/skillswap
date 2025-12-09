import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../axios/axios';
import Navbar from "../navigation/navbar.jsx";
import Postcard from "../posts/postcard.jsx";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/skills');
      setPosts(response.data);
      console.log(response.data);
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/');
      return;
    }
    getAllPosts();
  }, []);

  const filteredPosts = category ? posts.filter(post => post.category === category) : posts;

  return (
    <div className="bg-container">
      {/* Navigation section */}
      <Navbar 
        category={category} 
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Home feed of all users */}
      <main className="public-feed">
        {/* Search Bar */}
        <div className="search">
          <input type="text" placeholder="Search skills or topics..." />
          <button className="search-button" aria-label="Search">
            <span role="img" aria-label="search">🔍</span>
          </button>
        </div>

        {/* Response loading conditions */}
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts available. Be the first to create one!</div>
        ) : (
          <div className="prof-posts-grid">
              {filteredPosts.map((post) => (
                <Postcard 
                  key={post._id} 
                  post={post} 
                  getAllPosts={getAllPosts}
                  showManageActions={false} // hide edit/delete in profile
                  showPostUserDetails={true}
                />
              ))}
            </div>
        )}
      </main>
    </div>
  );
}

export default Home;