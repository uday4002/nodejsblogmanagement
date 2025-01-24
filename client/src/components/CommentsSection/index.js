import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const CommentsSection = ({ blogId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState("");

  // Fetch comments for the blog
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://nodejsblogmanagement-backend.onrender.com/${blogId}/comments`);
        setComments(response.data.data); // Use the 'data' key from response
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again.");
      }
    };

     const fetchUserData = async() =>{
          try{
              const token = Cookies.get('jwt_token')
              const response = await axios.get('https://nodejsblogmanagement-backend.onrender.com/user',{
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              })
              if (response.data.success === 'true') {
                  setUserData(response.data.data)
              } else {
                  setError(response.data.message)
              }
          }catch (err) {
              setError('An error occurred while fetching blogs.')
              console.error(err);
          }
      }
    fetchUserData();
    fetchComments();
  }, [blogId]);

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://nodejsblogmanagement-backend.onrender.com/${blogId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, response.data.comment]); // Add new comment
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    setLoading(true);
   try {
      const response = await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if(response.data.success==='true'){
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      }else{
        alert(response.data.message)
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Comment"}
        </button>
      </form>

      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id} style={{ marginTop: "15px" }}>
              <p>{comment.content}</p>
              <small>By: {userData.name}</small>
              {token && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                  disabled={loading}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentsSection;
