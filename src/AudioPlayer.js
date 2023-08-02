import React from 'react';
import { Audio } from 'react-loader-spinner'

const AudioPlayer = ({ src }) => {
    if (!src) return <Audio
        height="50"
        width="50"
        radius="9"
        color="purple"
        ariaLabel="loading"
        wrapperStyle={{ textAlign: 'center', margin: 'auto' }}
    />

    return (
        <div>
            <audio controls>
                <source src={src} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default AudioPlayer;