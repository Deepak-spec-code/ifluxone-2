
import React, { useEffect, useState } from 'react';
import { LANGUAGES } from '../constants';

// Extending CSSProperties to allow custom properties for 3D positioning
interface CustomCSSProperties extends React.CSSProperties {
    '--tx'?: string;
    '--ty'?: string;
    '--tz'?: string;
    '--angle'?: string;
}

const Star = ({ style }: { style: React.CSSProperties }) => (
    <div className="absolute rounded-full bg-cyan-200" style={style}></div>
);

const LanguageBurst = () => {
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [style, setStyle] = useState<CustomCSSProperties>({});

    useEffect(() => {
        setLanguage(LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)]);
        const duration = 8 + Math.random() * 4;
        const delay = Math.random() * 10;
        
        setStyle({
            '--tx': `${(Math.random() - 0.5) * 50}vw`,
            '--ty': `${(Math.random() - 0.5) * 50}vh`,
            top: `50%`,
            left: `50%`,
            animation: `fly-through ${duration}s ease-in ${delay}s infinite`,
        });
    }, []);

    return (
        <div 
            className="absolute text-white/70 text-2xl md:text-4xl font-light whitespace-nowrap opacity-0" 
            style={style}
        >
            <span>{language.text}</span>
        </div>
    );
};


const CosmicAnimation: React.FC = () => {
    const numStars = 150;

    const stars = Array.from({ length: numStars }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        const style: React.CSSProperties = {
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${duration}s linear ${delay}s infinite`,
        };
        return <Star key={`star-${i}`} style={style} />;
    });

    const languageBursts = Array.from({ length: 15 }).map((_, i) => (
        <LanguageBurst key={`lang-${i}`} />
    ));

    return (
        <div className="absolute inset-0 overflow-hidden [transform-style:preserve-3d] [perspective:1000px] blackhole-bg">
            <style>
                {`
                    @keyframes blackhole-pulse {
                        0% { background-size: 100% 100%; }
                        50% { background-size: 150% 150%; }
                        100% { background-size: 100% 100%; }
                    }

                    .blackhole-bg {
                        background-color: #000;
                        background-image: radial-gradient(circle at center, 
                            rgba(126, 34, 206, 0.5) 0%, 
                            rgba(88, 28, 135, 0.3) 25%, 
                            rgba(0,0,0,0) 60%);
                        background-position: center;
                        background-repeat: no-repeat;
                        animation: blackhole-pulse 15s ease-in-out infinite;
                    }

                    @keyframes twinkle {
                        0%, 100% { opacity: 0.4; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.1); }
                    }
                                        
                    @keyframes emerge-from-depth {
                        0% {
                            opacity: 0;
                            transform: translateZ(-1500px) scale(0.1);
                        }
                        80% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 1;
                            transform: translateZ(0) scale(1);
                        }
                    }

                    @keyframes pulse-glow {
                        0%, 100% {
                            text-shadow:
                                0 0 10px rgba(224, 76, 226, 0.8),
                                0 0 20px rgba(224, 76, 226, 0.6),
                                0 0 35px rgba(168, 85, 247, 0.4),
                                0 0 50px rgba(126, 34, 206, 0.3);
                        }
                        50% {
                            text-shadow:
                                0 0 15px rgba(224, 76, 226, 1),
                                0 0 30px rgba(224, 76, 226, 0.8),
                                0 0 55px rgba(168, 85, 247, 0.5),
                                0 0 75px rgba(126, 34, 206, 0.4);
                        }
                    }

                    .animate-emerge-from-depth {
                        animation: emerge-from-depth 4s cubic-bezier(0.23, 1, 0.32, 1) 0.5s forwards,
                                   pulse-glow 3s infinite 4.5s;
                        transform: translateZ(-1500px) scale(0.1);
                        opacity: 0;
                    }

                    @keyframes fly-through {
                        0% {
                            transform: translate3d(var(--tx), var(--ty), -1000px) scale(0.2);
                            opacity: 0;
                        }
                        20% {
                            opacity: 1;
                        }
                        100% {
                            transform: translate3d(var(--tx), var(--ty), 800px) scale(2);
                            opacity: 0;
                        }
                    }
                `}
            </style>
            {stars}
            {languageBursts}
        </div>
    );
};

export default CosmicAnimation;
