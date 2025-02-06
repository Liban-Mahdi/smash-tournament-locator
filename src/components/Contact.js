import React from 'react';

const Contact = () => {
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
                <p><strong>Contact Information:</strong></p>
                <p>
                    Twitter: <a href="https://twitter.com/tokenott" target="_blank" rel="noopener noreferrer" style={{ color: '#00aaff' }}>@tokenott</a>
                </p>
                <p>
                    Email: <a href="mailto:liban.mahdi123@gmail.com" style={{ color: '#00aaff' }}>liban.mahdi123@gmail.com</a>
                </p>
                <p>
                    GitHub: <a href="https://github.com/liban-mahdi" target="_blank" rel="noopener noreferrer" style={{ color: '#00aaff' }}>liban-mahdi</a>
                </p>
                <p>
                    Discord: <span style={{ color: '#ffffff' }}>nottoken</span>
                </p>
            </div>
        </div>
    );
};

export default Contact;

