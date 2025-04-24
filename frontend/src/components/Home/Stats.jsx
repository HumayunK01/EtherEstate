import React, { useState, useEffect } from 'react';
import './Stats.css';

const Stats = () => {
  const [animatedStats, setAnimatedStats] = useState({
    transactions: 0,
    volume: 0,
    users: 0,
    properties: 0
  });

  const finalStats = {
    transactions: 1250,
    volume: 5.8,
    users: 850,
    properties: 320
  };

  useEffect(() => {
    const animationDuration = 2000; // 2 seconds
    const frameDuration = 16; // ~60fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setAnimatedStats({
        transactions: Math.floor(progress * finalStats.transactions),
        volume: parseFloat((progress * finalStats.volume).toFixed(1)),
        users: Math.floor(progress * finalStats.users),
        properties: Math.floor(progress * finalStats.properties)
      });
      
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="stats-section">
      <div className="stats-overlay"></div>
      <div className="stats-content">
        <h2 className="stats-title">Our Impact in Numbers</h2>
        <p className="stats-subtitle">
          Transforming the real estate industry with blockchain technology
        </p>
        
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{animatedStats.transactions.toLocaleString()}</div>
            <div className="stat-label">Transactions</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">${animatedStats.volume.toLocaleString()}M+</div>
            <div className="stat-label">Transaction Volume</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">{animatedStats.users.toLocaleString()}</div>
            <div className="stat-label">Active Users</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">{animatedStats.properties.toLocaleString()}</div>
            <div className="stat-label">Properties Listed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
