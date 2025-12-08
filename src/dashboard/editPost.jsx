import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../axios/axios";

export default function EditPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { post } = location.state; 
  const [formData, setFormData] = useState({
    title: post?.title || "",
    description: post?.description || "",
    category: post?.category || "web",
    level: post?.level || "beginner",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving post:", formData);
    try{
      const respons = await API.put(`/skills/${post._id}`, formData);
      if(respons.status === 200) {
        setFormData(prev => {
          prev.title = "",
          prev.description = "",
          prev.level = "",
          prev.category = ""
        });
      }
      navigate("/profile");
      console.log(respons);
    } catch(error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    console.log("Cancelled edit");
    navigate('/profile')
  };

  useEffect(() => {
    console.log(post)
  })

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Post</h2>
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
        <button style={styles.saveBtn} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

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
  saveBtn: { flex: 1, padding: "10px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "10px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};
