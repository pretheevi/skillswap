// CreatePost.jsx
import React, { useState } from "react";
import API from "../axios/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const initialState = {
    title: "",
    description: "",
    category: "web",
    level: "beginner",
  };
  const [formData, setFormData] = useState(initialState);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    console.log("Cancelled");
    setFormData(initialState);
    navigate('/profile')
  };

  const handleSave = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?._id) return alert("User not found!");

  const postData = { ...formData, user: user._id };

  try {
    const res = await API.post("/skills", postData);
    console.log("Post created:", res.data);
    setFormData(initialState);
    navigate('/profile')
  } catch (err) {
    console.error(err);
    alert("Error creating post!");
  }
};


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Post</h2>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        style={styles.input}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={styles.textarea}
      />
      <div style={styles.row}>
        <select name="category" value={formData.category} onChange={handleChange} style={styles.select}>
          <option value="web">Web</option>
          <option value="design">Design</option>
          <option value="data">Data</option>
          <option value="mobile">Mobile</option>
          <option value="marketing">Marketing</option>
          <option value="language">Language</option>
        </select>
        <select name="level" value={formData.level} onChange={handleChange} style={styles.select}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div style={styles.buttonRow}>
        <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
        <button  
          style={{...styles.saveBtn, opacity: !formData.title.trim() ? 0.5 : 1, cursor: !formData.title.trim() ? "not-allowed" : "pointer"}} 
          disabled={!formData.title.trim()} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

// createPostStyles.js
export const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: { textAlign: "center", fontSize: "1.5rem", fontWeight: "600" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" },
  select: { flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" },
  row: { display: "flex", gap: "10px" },
  buttonRow: { display: "flex", gap: "10px" },
  saveBtn: {
    flex: 1,
    padding: "10px",
    background: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    opacity: 1,
  },
  cancelBtn: { flex: 1, padding: "10px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};
