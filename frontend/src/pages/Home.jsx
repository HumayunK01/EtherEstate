import React from 'react';
import Hero from '../components/Home/Hero';
import FeaturedProperties from '../components/Home/FeaturedProperties';
import HowItWorks from '../components/Home/HowItWorks';
import Benefits from '../components/Home/Benefits';
import Testimonials from '../components/Home/Testimonials';
import Stats from '../components/Home/Stats';
import Partners from '../components/Home/Partners';
import FAQ from '../components/Home/FAQ';
import Newsletter from '../components/Home/Newsletter';
import SectionDivider from '../components/Home/SectionDivider';
import Footer from '../components/Footer';
import { useProperties } from '../hooks/useProperties';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import './Home.css';

const Home = () => {
  const { signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);
  const { properties, loading, error } = useProperties(tokenContract, marketContract);

  return (
    <>
      <div className="home-page">
        <Hero />
        <SectionDivider />
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading properties...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>No properties available. Be the first to list a property!</p>
          </div>
        ) : (
          <FeaturedProperties properties={properties} />
        )}
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <Benefits />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <Partners />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <Newsletter />
      </div>
    </>
  );
};

export default Home;
