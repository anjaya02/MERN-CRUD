import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // Store the post being edited
  const [editForm, setEditForm] = useState({ topic: '', description: '', postCategory: '' }); // Form state
  const [newPostForm, setNewPostForm] = useState({ topic: '', description: '', postCategory: '' }); // New Post Form state
  const [isAdding, setIsAdding] = useState(false); // Toggle for showing Add Post form

  // Fetch all posts
  const retrievePosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
    
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  

  // Delete a post
  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/delete/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Trigger the edit form
  const editPost = (post) => {
    setEditingPost(post._id); // Set the current post ID for editing
    setEditForm({
      topic: post.topic,
      description: post.description,
      postCategory: post.postCategory,
    }); // Pre-fill form with post data
  };

  // Handle form input changes for editing
  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle form input changes for adding a new post
  const handleNewPostInputChange = (e) => {
    setNewPostForm({ ...newPostForm, [e.target.name]: e.target.value });
  };

  // Save the updated post
  const savePost = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/update/${id}`, editForm);
      const updatedPost = response.data.post;

      // Make sure the updated post replaces the original one in the state
      setPosts(posts.map((post) => (post._id === id ? updatedPost : post)));

      setEditingPost(null); // Close the form
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const addPost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/post/save', newPostForm);
      console.log(response.data); // Check what the API returns
      setPosts([...posts, response.data.post]); // Add the new post to the list
      setNewPostForm({ topic: '', description: '', postCategory: '' }); // Reset form
      setIsAdding(false); // Close the form
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  

  useEffect(() => {
    retrievePosts();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-700 to-blue-500 min-h-screen p-10">
      <h1 className="text-white text-4xl font-extrabold mb-12 text-center">Posts</h1>

      {/* Add New Post Button */}
      {!isAdding && (
        <div className="text-center mb-8">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add New Post
          </button>
        </div>
      )}

      {/* Add New Post Form */}
      {isAdding && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
          <input
            type="text"
            name="topic"
            value={newPostForm.topic}
            onChange={handleNewPostInputChange}
            placeholder="Topic"
            className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
          />
          <textarea
            name="description"
            value={newPostForm.description}
            onChange={handleNewPostInputChange}
            placeholder="Description"
            className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            name="postCategory"
            value={newPostForm.postCategory}
            onChange={handleNewPostInputChange}
            placeholder="Category"
            className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={addPost}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2"
          >
            Add Post
          </button>
          <button
            onClick={() => setIsAdding(false)} // Cancel adding
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {posts.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <li
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-purple-100 flex flex-col justify-between"
              style={{ minHeight: '300px' }}
            >
              {editingPost === post._id ? (
                // Edit Form
                <div>
                  <input
                    type="text"
                    name="topic"
                    value={editForm.topic}
                    onChange={handleInputChange}
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    name="postCategory"
                    value={editForm.postCategory}
                    onChange={handleInputChange}
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => savePost(post._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPost(null)} // Cancel editing
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Display post content when not in editing mode
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.topic}</h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <small className="text-blue-600 font-medium">{post.postCategory}</small>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => editPost(post)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white text-center">No posts available</p>
      )}
    </div>
  );
}

export default App;
