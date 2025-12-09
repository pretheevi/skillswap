import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import "./postcard.css";

function Postcard({post, showManageActions, showPostUserDetails}) {
  const navigate = useNavigate();
  const [expandedComments, setExpandedComments] = useState({});

  // Delete API
  const deletePost = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
    try {
      const response = await API.delete(`/skills/${_id}`);
      if (response.status === 200) {
        getAllPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComments = (postId) => {
  setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <article className="prof-post-card" key={post._id}>
      {showPostUserDetails && <div className="post-user-details">
        <div className="post-user-avatar">
          {post.user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="post-meta">
          <div className="post-user">{post.user?.email || "Anonymous"}</div>
          <div className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>}

      {/* Post Header */}
      <div className="post-header">
        <div className="post-category">{post.category}</div>
        <div className="post-date">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
        
        <div className="post-meta">
          <span className="meta-item">
            <span className="meta-label">Level:</span>
            <span className="meta-value">{post.level}</span>
          </span>
          <span className="meta-item">
            <span className="meta-label">Rating:</span>
            <span className="meta-value">
              {"⭐".repeat(Math.min(Math.max(post.rating, 0), 5))}
              {post.rating > 0 && ` (${post.rating})`}
            </span>
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        { showManageActions ? (
        <>
          <button 
            className="action-btn edit-btn"
            onClick={() => navigate(`/editpost/${post._id}`, { state: { post } })}
          >
            Edit
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => deletePost(post._id)}
          >
            Delete
          </button>
          <button 
            className="action-btn comments-btn"
            onClick={() => toggleComments(post._id)}
          >
            {post.comments?.length || 0} Comments
          </button>
        </>
        ) : (
        <>
          <button className="action-btn like-btn">
            👍 Like
          </button>
          <button 
            className="action-btn comments-btn"
            onClick={() => toggleComments(post._id)}
          >
            💬 {post.comments?.length || 0} Comments
          </button>
          <button 
            className="action-btn add-comment-btn"
            onClick={() => navigate(`/comment/${post._id}`)}
          >
            ➕ Add Comment
          </button>
        </>
        )}

      </div>

      {/* Comments Section */}
      {expandedComments[post._id] && (
        <div className="comments-section expanded">
          <h4 className="comments-title">
            Comments ({post.comments?.length || 0})
          </h4>
          
          {post.comments && post.comments.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment, index) => (
                <div className="comment-item" key={index}>
                  <div className="comment-header">
                    <div className="comment-avatar">
                      {comment.user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="comment-info">
                      <span className="comment-user">
                        {comment.user?.email || "Anonymous"}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default Postcard;