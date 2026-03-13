import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  const videos = Array(12).fill({
    title: "Membangun Aplikasi Profesional dengan React & CSS",
    author: "Gemini Developer",
    views: "1.2jt x ditonton",
    time: "2 jam yang lalu",
    thumbnail: "https://via.placeholder.com/320x180/282828/ffffff?text=Video+Thumbnail"
  });

  return (
    <div className="container">
      {/* --- Header / Navbar --- */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="menu-icon">☰</div>
          <div className="logo">YouTube<sup>ID</sup></div>
        </div>
        <div className="nav-center">
          <input type="text" placeholder="Telusuri" className="search-bar" />
          <button className="search-btn">🔍</button>
        </div>
        <div className="nav-right">
          <div className="nav-icons">🔔</div>
          <div className="user-avatar">G</div>
        </div>
      </nav>

      <div className="main-layout">
        {/* --- Sidebar --- */}
        <aside className="sidebar">
          <div className="sidebar-item active">🏠 Beranda</div>
          <div className="sidebar-item">🎬 Shorts</div>
          <div className="sidebar-item">📺 Subskripsi</div>
          <hr />
          <div className="sidebar-item">📚 Koleksi</div>
          <div className="sidebar-item">🕒 Histori</div>
        </aside>

        {/* --- Video Grid --- */}
        <main className="content">
          <div className="video-grid">
            {videos.map((video, index) => (
              <div key={index} className="video-card">
                <img src={video.thumbnail} alt="thumb" className="thumbnail" />
                <div className="video-info">
                  <div className="channel-icon"></div>
                  <div className="video-text">
                    <h4 className="video-title">{video.title}</h4>
                    <p className="video-meta">{video.author}</p>
                    <p className="video-meta">{video.views} • {video.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
