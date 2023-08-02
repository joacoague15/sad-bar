import React, { useState } from 'react';
import './App.css';
import AudioPlayer from "./AudioPlayer";
import Modal from 'react-modal';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [src, setSrc] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [openAPIkey, setOpenAPIkey] = useState('');
    const [elevenLabsAPIkey, setElevenLabsAPIkey] = useState('');

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const SCARED_MAN_VOICE_ID = 'cDjJAybWQZVCaPe3ef3A';

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() !== '') {
            generateResponse();
            setInput('');
        }
    };

    const headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsAPIkey,
    }

    const generateNewVoiceResponse = (textToGenerateSpeech) => {
        fetch(`https://api.elevenlabs.io/v1/text-to-speech/${SCARED_MAN_VOICE_ID}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "text": textToGenerateSpeech,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0,
                }
            })
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                setSrc([...src, url]);
                // const a = document.createElement('a');
                // a.style.display = 'none';
                // a.href = url;
                // a.download = 'output.mp3';
                // document.body.appendChild(a);
                // a.click();
                // window.URL.revokeObjectURL(url);
            })
            .catch((error) => console.error('Error:', error));
    }

    // openai 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
    // elevenLabs d838abf7e913404cb99dd99d3cf4dd5e

    const generateResponse = () => {
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAPIkey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "system", "content": "You are a young adult having a drink in a futuristic bar. You are sad, depressed because of something that happen that is a secret. Make your responses sad and melancholic. You dont want to talk. Remember that you are a young adult in a futuristic bar, not an AI. Do not respond the questions as *Looks up with a half-hearted smile* , just answer."}, {"role": "user", "content": `${input}`}],
                max_tokens: 250,
                n: 1,
                stop: null,
                temperature: 1,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages([...messages, { text: input, sender: data.choices[0].message.content }])
                generateNewVoiceResponse(data.choices[0].message.content);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="App">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '50%', // You can set a specific width if you want
                        padding: '20px',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Optional: adds a dark overlay behind the modal
                    }
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <input
                        type="text"
                        style={{ textAlign: 'center', marginBottom: 20 }}
                        value={openAPIkey}
                        onChange={e => setOpenAPIkey(e.target.value)}
                        placeholder="openAI API key"
                    />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <input
                        type="text"
                        value={elevenLabsAPIkey}
                        onChange={e => setElevenLabsAPIkey(e.target.value)}
                        placeholder="ElevenLabs API key"
                    />
                </div>
                <button onClick={() => setModalIsOpen(false)} className="cyber-button" type="button">Done</button>
            </Modal>
            <div className="chat-container">
                <div className="image-side">
                </div>
                <div className="chat-side">
                    <div className="messages">
                        {messages.map((message, index) => (
                            <div className={`message ${message.sender}`} key={index}>
                                <div className="message-text">{message.text}</div>
                                <div className="message-sender">{message.sender}</div>
                                {src && <AudioPlayer src={src[index]} />}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button className="cyber-button" type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;