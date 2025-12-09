import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../axios/axios';
import Postcard from '../posts/postcard';
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/my-skills');
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
      setPosts(response.data);
    } catch (error) {
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

  const Logout = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="prof-container">
      {/* Header */}
      <header className="prof-header">
        <div className="prof-header-content">
          <h1 className="prof-logo">SkillSwap</h1>
          <div className="prof-nav-actions">
            <button 
              className="prof-nav-btn prof-home-btn"
              onClick={() => navigate('/dashboard')}
            >
              <span className="btn-icon">🏠</span>
              Home
            </button>
            <button 
              className="prof-nav-btn prof-logout-btn"
              onClick={Logout}
            >
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="prof-main">
        {/* User Profile Section */}
        <section className="prof-user-section">
          <div className="prof-user-card">
            <div className="prof-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div className="prof-user-info">
              <h2 className="prof-user-name">{user?.name || "User"}</h2>
              <p className="prof-user-email">{user?.email || "No email provided"}</p>
              <div className="prof-user-stats">
                <span className="stat-item">
                  <strong>{posts.length}</strong> Posts
                </span>
                <span className="stat-item">
                  <strong>
                    {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                  </strong> Comments
                </span>
              </div>
              <p className="prof-user-joined">
                Member since {user?.joined ? new Date(user.joined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short'
                }) : "Unknown"}
              </p>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="prof-posts-section">
          <div className="prof-section-header">
            <div className="header-left">
              <h2>Your Posts</h2>
              <p className="section-subtitle">Manage and edit your shared skills</p>
            </div>
            <button 
              className="prof-create-btn"
              onClick={() => navigate('/createpost')}
            >
              <span className="btn-icon">+</span>
              Create New Post
            </button>
          </div>

          {loading ? (
            <div className="prof-loading">
              <div className="loading-spinner"></div>
              <p>Loading your posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="prof-empty-state">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Share your first skill with the community</p>
              <button 
                className="prof-create-btn"
                onClick={() => navigate('/createpost')}
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="prof-posts-grid">
              {posts.map((post) => (
                <Postcard 
                  key={post._id} 
                  post={post} 
                  getAllPosts={getAllPosts}
                  showManageActions={true} // Show edit/delete in profile
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile;