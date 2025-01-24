// App.js
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; 
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null); 
  const [posts, setPosts] = useState([]); 
  const [newPost, setNewPost] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [isSignup, setIsSignup] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; 
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", auth.currentUser.email);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", auth.currentUser.email);
      }
      setEmail(""); 
      setPassword("");
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleAddPost = async () => {
    if (newPost.trim() === "") {
      console.log("Post content is empty");
      return; 
    }
    try {
      await addDoc(collection(db, "posts"), {
        content: newPost,
        timestamp: serverTimestamp(),
        user: user ? user.email : "Anonymous",
      });
      setNewPost("");
      console.log("Post added successfully!");
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
        maxWidth: "800px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1> Blog!!!!!! </h1>
      {!user ? (
        <form onSubmit={handleAuth} style={{ width: "100%", maxWidth: "400px" }}>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <p style={{ marginTop: "10px" }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <p>Welcome, {user.email}</p>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write a new post..."
              style={{
                width: "100%",
                height: "80px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />
            <button
              onClick={handleAddPost}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add Post
            </button>
          </div>
          <div style={{ width: "100%" }}>
            <h2>Posts</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
              }}
            >
              {posts.map((post) => (
                <li
                  key={post.id}
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p>{post.content}</p>
                  <small>
                    By {post.user} |{" "}
                    {post.timestamp
                      ? new Date(post.timestamp.toDate()).toLocaleString()
                      : "Just now"}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
