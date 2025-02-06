import React from 'react';

const About = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#282828',
            color: '#ffffff',
            padding: '20px',
            textAlign: 'center',
        }}>
            <div style={{
                maxWidth: '600px',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                border: '1px solid #444',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#121212',
            }}>
                <p>
                    My gamertag is <strong>Token</strong>, and I’ve been playing competitive Smash Bros. since 2020. 
                    I’ve been power-ranked in the top 5 in my region and am a proud member of my university's Smash club. 
                    This project is part of my journey to learn JavaScript, React, CSS, HTML, and both the Smash.gg and Google Maps API.
                </p>
                <p>
                    As a computer science student, I’m inspired by other similar websites and aim to create 
                    something meaningful for the Smash Bros. community.
                </p>
            </div>
        </div>
    );
};

export default About;
