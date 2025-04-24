import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Property Investor',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'This platform has revolutionized how I invest in real estate. The transparency of blockchain gives me confidence in every transaction.',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'First-time Homebuyer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'As someone new to property buying, the simplicity and security of this platform made the process stress-free and enjoyable.',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Property Developer',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      quote: 'Listing properties on the blockchain has opened up a global market for my developments. The future of real estate is here.',
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      role: 'Real Estate Agent',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      quote: 'This platform has transformed my business. My clients love the speed and security of blockchain transactions.',
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <p className="testimonials-subtitle">
          Hear from people who have transformed their real estate experience with blockchain
        </p>
      </div>
      
      <div className="testimonials-carousel">
        <div className="testimonials-container" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
