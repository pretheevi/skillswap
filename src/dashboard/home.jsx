import "./dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../axios/axios';

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [category, setCategory] = useState("");


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

  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

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
      <nav className="nav-bar">
        <h1 className="nav-logo">SkillSwap</h1>
        <ul className="nav-menu">
          <li className="nav-item">🏠 Home</li>
          <li className="nav-item" onClick={() => navigate('/profile')}>👤 Profile</li>
          <li className="nav-item">
            <div className="filter-sort-section">
              <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Filter by category</option>
                <option value="web">Web Development</option>
                <option value="design">Design</option>
                <option value="data">Data Science</option>
                <option value="mobile">Mobile Development</option>
                <option value="marketing">Digital Marketing</option>
                <option value="language">Language</option>
              </select>
              
              <select className="filter-select">
                <option value="">Sort by</option>
                <option value="rating-high">Highest rated</option>
                <option value="rating-low">Lowest rated</option>
                <option value="date-new">Newest first</option>
                <option value="date-old">Oldest first</option>
              </select>
            </div>
          </li>
        </ul>
      </nav>
      
      <main className="public-feed">
        <div className="search">
          <input type="text" placeholder="Search skills or topics..." />
          <p>🔍</p>
        </div>

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts available. Be the first to create one!</div>
        ) : (
          filteredPosts.map((post) => (
            <div className="feed-card" key={post._id}>
              <div className="post-header">
                <div className="post-user-avatar">
                  {post.user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="post-meta">
                  <div className="post-user">{post.user?.email || "Anonymous"}</div>
                  <div className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <h2 className="feed-title">{post.title}</h2>
              <p className="feed-description">{post.description}</p>
              
              <div className="post-details">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{post.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Level:</span>
                  <span className="detail-value">{post.level}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">
                    {"⭐".repeat(Math.min(Math.max(post.rating, 0), 5))}
                    {post.rating === 0 ? "No ratings yet" : ` (${post.rating})`}
                  </span>
                </div>
              </div>
              
              <div className="post-actions">
                <button className="btn like-btn">👍 Like</button>
                <button 
                  className="btn comment-btn"
                  onClick={() => toggleComments(post._id)}
                >
                  💬 {post.comments?.length || 0} Comments
                </button>
                <button 
                  className="btn"
                  onClick={() => navigate(`/comment/${post._id}`)}
                >
                  ➕ Add Comment
                </button>
              </div>
              
              {openComments[post._id] && post.comments && post.comments.length > 0 && (
                <div className="comment-section">
                  <h4 className="comment-title">Comments ({post.comments.length})</h4>
                  {post.comments.map((comment) => (
                    <div className="comment-item" key={comment._id}>
                      <div className="comment-header">
                        <div className="comment-user-avatar">
                          {comment.user?.email?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div className="comment-meta">
                          <div className="comment-user">{comment.user?.email || "User"}</div>
                          <div className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {openComments[post._id] && (!post.comments || post.comments.length === 0) && (
                <div className="no-comments">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default Home;