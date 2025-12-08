import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../axios/axios";

export default function CommentPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchPost = async () => {
    const res = await API.get(`/skills/${postId}`);
    setPost(res.data);
    console.log(res);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return alert("Type something 😭");
    try{
      const data = {
        skill: postId,
        text: commentText
      }
      const response = await API.post(`/comment`, data);
      console.log(response);
    } catch(error) {
      console.log(error);
    }
    setCommentText("");
    fetchPost();
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post) return <h3>Loading…</h3>;

  return (
    <div style={styles.page}>
      <button style={styles.backtohome} onClick={() => navigate("/dashboard")}>
        ← Back to Home
      </button>

      <h2>{post.title}</h2>
      <p style={{ color: "#666" }}>{post.description}</p>
      <small style={{ color: "#888" }}>
        Posted by {post.user?.email || "Anonymous"} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>

      <hr style={{ margin: "20px 0" }} />

      <textarea
        style={styles.textarea}
        placeholder="Type your comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button style={styles.btn} onClick={handleComment}>Send</button>

      <hr style={{ margin: "20px 0" }} />

      {post.comments?.length > 0 ? (
        post.comments.map((c) => (
          <p key={c._id} style={styles.comment}>
            <strong>{c.user?.email || "User"}:</strong> {c.text}
          </p>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}


export const styles = {
  page: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "10px",
    fontFamily: "sans-serif",
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "8px",
    fontSize: "14px",
  },

  btn: {
    marginTop: "8px",
    padding: "6px 12px",
    cursor: "pointer",
  },

  comment: {
    padding: "6px 0",
    borderBottom: "1px solid #eee",
  },

  backtohome: {
    margin: "10px 0",
    cursor: "pointer",
  },
};