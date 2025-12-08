import React, { useEffect, useState } from 'react';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import API from '../axios/axios';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({name: "", email: ""});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async () => {
    try{
      setLoading(true);
      const response = await API.get('/my-skills');
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
      setPosts(response.data);
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = JSON.stringify(localStorage.getItem('token'));
    if (!token) {
      navigate('/');
      return;
    }
    getAllPosts();
  }, []);

  const deletePost = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
    try{
      const response = await API.delete(`/skills/${_id}`);
      if(response.status === 200){
        getAllPosts();
      }
    } catch(error) {
      console.log(error);
    }
  }

  const Logout = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="prof-container">
      <div className="prof-top-bar">
        <h1 className="prof-logo">SkillSwap</h1>
        <div className="prof-nav-buttons">
          <p className="prof-home-btn" onClick={() => navigate('/dashboard')}>🏠 Home</p>
          <button className="prof-logout-btn" onClick={Logout}>Logout</button>
        </div>
      </div>
      
      <main className="prof-content">
        <div className="prof-user-card">
          <div className="prof-user-header">
            <div className="prof-user-logo">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div className="prof-user-details">
              <h2 className="prof-user-name">{user?.name || "User"}</h2>
              <p className="prof-user-email">{user?.email || "No email provided"}</p>
              <p className="prof-user-bio">{user?.bio || "No bio yet"}</p>
              <p className="prof-user-joined">
                Joined: {user?.joined ? new Date(user.joined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Unknown"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="prof-section-header">
          <h3>Your Posts</h3>
          <button className="prof-create-post-btn" onClick={() => navigate('/createpost')}>+ Create New Post</button>
        </div>
        
        {loading ? (
          <div className="prof-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="prof-no-posts">No posts yet. Create your first post!</div>
        ) : (
          <div className="prof-posts-container">
            {posts.map((post) => (
              <div className="prof-feed-card" key={post._id}>
                <div className="prof-post-meta">
                  <div className="prof-post-date">
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h2 className="prof-feed-title">{post.title}</h2>
                <p className="prof-feed-description">{post.description}</p>
                
                <div className="prof-post-details">
                  <div className="prof-detail-item">
                    <span className="prof-detail-label">Category:</span>
                    <span className="prof-detail-value">{post.category}</span>
                  </div>
                  <div className="prof-detail-item">
                    <span className="prof-detail-label">Level:</span>
                    <span className="prof-detail-value">{post.level}</span>
                  </div>
                  <div className="prof-detail-item">
                    <span className="prof-detail-label">Rating:</span>
                    <span className="prof-detail-value">
                      {"⭐".repeat(Math.min(Math.max(post.rating, 0), 5))}
                      {post.rating === 0 ? "No ratings yet" : ` (${post.rating})`}
                    </span>
                  </div>
                </div>
                
                <div className="prof-action-btns">
                  <button 
                    className="prof-btn prof-edit-btn" 
                    onClick={() => navigate(`/editpost/${post._id}`, { state: { post } })}
                  >
                    Edit
                  </button>
                  <button 
                    className="prof-btn prof-delete-btn" 
                    onClick={() => deletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
                
                {post.comments && post.comments.length > 0 ? (
                  <div className="prof-comment-section">
                    <div className="prof-comments">
                      <div>
                        <p>{post.comments[0].user?.email || "User"}</p>
                        <p>{new Date(post.comments[0].createdAt).toLocaleDateString()}</p>
                      </div>
                      <p>{post.comments[0].text || "Comment"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="prof-no-comments">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;