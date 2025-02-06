import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import ResultsPage from './components/ResultsPage'; // Import the Results page
import Navbar from './components/Navbar'; // Separate navigation component



const App = () => {
    return (
        <Router>
            <Navbar /> {/* Navigation remains visible on all pages */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/results" element={<ResultsPage />} /> {/* Add Results page */}
            </Routes>
        </Router>
    );
};

export default App;
