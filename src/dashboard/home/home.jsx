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
      <Navbar />
      <main className="home-main bg-neutral-950">
        {loading ? (
          <div className="loading text-primary">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts available. Be the first to create one!</div>
        ) : (
          <div className="post-wrapper w-full">
              {filteredPosts.map((post) => (
                <Postcard 
                  key={post.skill_id}
                  post={post} 
                  profilePost={false}
                />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;