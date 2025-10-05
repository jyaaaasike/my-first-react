import React, { useState, useEffect, useCallback } from 'react';
import Masonry from 'react-masonry-css'; 

// --- IMAGE IMPORTS: IMPORTANT ---
// ⚠️ Replace these placeholder URLs with your actual image imports (e.g., import posterImage from '../assets/poster.png';)
// For example:
// import sketchImage from '../assets/e01f2ef8-5631-4473-87c3-96c899442dff.jpg';
// import fanArtImage from '../assets/SAMP2.JPG';
// import posterImage from '../assets/Pink and White Bold Modern Playful Y2K Coming Soon Promotion Poster (1).png';
// --------------------------------

// --- GEMINI API Configuration and Helper ---
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=';
// ⚠️ IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual key
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 

// Helper function for making resilient API calls with exponential backoff
const fetchGeminiContent = async (payload, retries = 3) => {
    if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        throw new Error("API Key is missing. Please replace 'YOUR_GEMINI_API_KEY_HERE' in the code.");
    }

    const url = `${GEMINI_API_URL}${API_KEY}`;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const errorMessage = errorBody.error?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                return text;
            } else {
                if (payload.config?.responseMimeType === "application/json") {
                    return result.candidates?.[0]?.content?.parts?.[0]?.text;
                }
                throw new Error("Gemini response lacked content.");
            }
        } catch (error) {
            if (i < retries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(error.message || "Failed to generate content after all retries.");
            }
        }
    }
};
// --- END GEMINI API Helper ---


// -------------------------------------------------------------
// --- 1. DATA (Art Pieces with categories) ---
// -------------------------------------------------------------
const artPieces = [
    { id: 1, title: "Architectural Study", category: "Sketches", description: "A detailed graphite sketch of a baroque facade, focusing on perspective and light interplay. (2024)", imageUrl: "https://placehold.co/400x550/1f2937/d1d5db?text=Sketches+I" },
    { id: 2, title: "Hero of Aethel", category: "Fan Art", description: "Digital painting depicting a character from the Aethel video game series in battle armor. (2023)", imageUrl: "https://placehold.co/400x550/374151/f3f4f6?text=Fan+Art+II" },
    { id: 3, title: "Eco-Conscious Campaign", category: "Poster Making", description: "Vector-based promotional poster for an environmental awareness campaign, using bold, contrasting colors. (2024)", imageUrl: "https://placehold.co/400x550/4b5563/e5e7eb?text=Poster+Making+I" },
    { id: 4, title: "Ocean's Foam", category: "Soap Sculpture", description: "Hand-carved soap sculpture designed to mimic the texture of crashing waves and sea foam. (2023)", imageUrl: "https://placehold.co/400x550/6b7280/9ca3af?text=Soap+Sculpture+I" },
    { id: 5, title: "Vibrant Cityscape", category: "Painting", description: "Abstract oil painting capturing the energy and neon glow of a busy metropolitan intersection at night. (2022)", imageUrl: "https://placehold.co/400x550/9ca3af/d1d5db?text=Painting+II" },
    { id: 6, title: "Portrait of Shadow", category: "Sketches", description: "Charcoal portrait study emphasizing deep shadows and dramatic lighting on the subject's face. (2021)", imageUrl: "https://placehold.co/400x550/111827/d1d5db?text=Sketches+III" },
    { id: 7, title: "Mythic Creature", category: "Fan Art", description: "Watercolour rendering of a dragon from a popular fantasy novel, focusing on scale and texture. (2023)", imageUrl: "https://placehold.co/400x550/78716c/f5f5f4?text=Fan+Art+I" },
    { id: 8, title: "Minimalist Health Ad", category: "Poster Making", description: "Clean, minimalist poster promoting mental health awareness using a simple color palette and typography. (2024)", imageUrl: "https://placehold.co/400x550/a1a1aa/f4f4f5?text=Poster+Making+III" },
];

// Derive unique categories including 'All'
const categories = ["All", ...new Set(artPieces.map(p => p.category))];


// --- 2. COMPONENTS (Modal, ArtCard, Gallery) ---
const ArtModal = ({ piece, onClose }) => {
    if (!piece) return null;

    const [critique, setCritique] = useState('');
    const [titles, setTitles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setCritique('');
        setTitles([]);
        setError(null);
    }, [piece]);

    const fetchArtCritique = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);
        setCritique('Analyzing art and generating critique...');

        const systemPrompt = "Act as a professional and thoughtful art critic. Provide a concise, 3-4 sentence critical analysis of the provided artwork description, commenting on its style, mood, and technical ambition. Do not use markdown (e.g., *bold* or lists) in the output.";
        const userQuery = `Critique this artwork: Title: "${piece.title}". Category: ${piece.category}. Description: "${piece.description}"`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const result = await fetchGeminiContent(payload);
            setCritique(result);
        } catch (err) {
            setError(err.message || "Failed to get AI critique.");
            setCritique('Critique unavailable.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAlternativeTitles = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);
        setTitles(['Generating titles...']);

        const systemPrompt = "You are a creative muse. Based on the art's details, suggest 3 highly evocative, professional, and unique alternative titles. Respond ONLY with a JSON array of strings.";
        const userQuery = `Suggest 3 alternative titles for this artwork: Title: "${piece.title}". Category: ${piece.category}. Description: "${piece.description}"`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: { "type": "STRING" }
                }
            }
        };

        try {
            const resultText = await fetchGeminiContent(payload);
            let parsedJson;
            const cleanedText = resultText.replace(/^```json\s*|s*```$/g, '').trim();

            try {
                parsedJson = JSON.parse(cleanedText);
            } catch (jsonError) {
                console.error("Failed to parse JSON string:", cleanedText, jsonError);
                throw new Error("AI returned malformed JSON.");
            }

            if (Array.isArray(parsedJson) && parsedJson.length > 0 && parsedJson.every(item => typeof item === 'string')) {
                setTitles(parsedJson);
            } else {
                setTitles(['Could not parse suggested titles.']);
            }
        } catch (err) {
            setError(err.message || "Failed to generate titles.");
            setTitles(['Title generation failed.']);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto transform scale-100 transition-transform duration-300" 
                onClick={e => e.stopPropagation()} 
            >
                <div className="md:flex">
                    <div className="md:w-1/2 p-4 flex items-center justify-center">
                        <img src={piece.imageUrl} alt={piece.title} className="w-full h-auto object-contain rounded-lg max-h-[90vh]" />
                    </div>
                    
                    <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-start overflow-y-auto max-h-[90vh]">
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">{piece.title}</h3>
                        <p className="text-sm font-medium text-indigo-600 uppercase mb-4">{piece.category}</p>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            <span className="font-semibold text-gray-900 block mb-1">Artist Description:</span>
                            {piece.description}
                        </p>
                        
                        <div className="border-t pt-4 border-gray-200 mb-6">
                            <p className="text-md font-bold text-gray-700 mb-3">AI Art Assistant (Gemini)</p>
                            
                            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 mb-4">
                                <button 
                                    onClick={fetchArtCritique} 
                                    disabled={isLoading}
                                    className="flex-1 w-full sm:w-auto px-4 py-2 border border-indigo-500 text-sm font-medium rounded-lg shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition duration-200"
                                >
                                    {isLoading && critique === 'Analyzing art and generating critique...' ? 'Analyzing...' : '✨ Get AI Critique'}
                                </button>
                                <button 
                                    onClick={fetchAlternativeTitles} 
                                    disabled={isLoading}
                                    className="flex-1 w-full sm:w-auto px-4 py-2 border border-green-500 text-sm font-medium rounded-lg shadow-sm text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50 transition duration-200"
                                >
                                    {isLoading && titles[0] === 'Generating titles...' ? 'Generating...' : '✨ Suggest New Titles'}
                                </button>
                            </div>
                            
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            {critique && critique !== 'Analyzing art and generating critique...' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">AI Critique:</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{critique}</p>
                                </div>
                            )}

                            {titles.length > 0 && titles[0] !== 'Generating titles...' && titles[0] !== 'Title generation failed.' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">Alternative Titles:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {titles.map((t, index) => (
                                            <li key={index}>{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <button onClick={onClose} className="w-full mt-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-200 transform hover:scale-[1.01]">
                            Close View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Art Card Component for use in the Masonry Grid
 */
const ArtCard = ({ piece, onOpenModal }) => {
    return (
        <div className="art-card" onClick={() => onOpenModal(piece)}>
            <img 
                src={piece.imageUrl} 
                alt={piece.title} 
                className="art-image" 
                style={{ height: `${400 + (piece.id % 3) * 50}px` }} 
            />
            <div className="art-info">
                <h4 className="text-xl font-bold">{piece.title}</h4>
                <p className="text-sm font-medium text-indigo-300">{piece.category}</p>
            </div>
        </div>
    );
};


// --- Main Gallery Component ---
const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [modalPiece, setModalPiece] = useState(null);

    // This is where the filtering happens
    const filteredPieces = activeCategory === 'All'
        ? artPieces
        : artPieces.filter(p => p.category === activeCategory);

    const openModal = useCallback((piece) => {
        setModalPiece(piece);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeModal = useCallback(() => {
        setModalPiece(null);
        document.body.style.overflow = 'auto';
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        if (modalPiece) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalPiece, closeModal]);


    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <section 
            id="gallery" 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" 
        >
            {/* Centered Title and Subtitle Block */}
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Featured Works</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Click on any piece to see its title and detailed description.
                </p>
            </div>
            
            {/* Filter Buttons Section: Centered */}
            <div className="mb-12 flex flex-wrap justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry Grid Section */}
            <div className="gallery-section pt-4"> 
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="art-grid"
                    columnClassName="art-grid-column"
                >
                    {filteredPieces.map(piece => (
                        <ArtCard key={piece.id} piece={piece} onOpenModal={openModal} />
                    ))}
                </Masonry>
            </div>
            
            <ArtModal piece={modalPiece} onClose={closeModal} />
            
            {/* Gallery-Specific CSS Styles */}
            <style jsx="true">{`
                /* --- Category Filter Button Styles --- */
                .filter-btn {
                    padding: 0.5rem 1rem;
                    margin: 0.25rem;
                    font-size: 0.875rem;
                    border-radius: 9999px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    user-select: none;
                }
                
                .filter-btn:not(.active) {
                    background-color: #e5e7eb;
                    color: #4b5563;
                }
                
                .filter-btn:not(.active):hover {
                    background-color: #d1d5db;
                }
                
                .filter-btn.active {
                    background-color: #4f46e5;
                    color: #ffffff;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
                }

                /* --- Masonry Grid Styles for Spacing --- */
                .art-grid {
                    display: flex;
                    margin-left: -2rem; 
                    width: auto;
                }

                .art-grid-column {
                    padding-left: 2rem; 
                    background-clip: padding-box;
                }
                
                @media (max-width: 768px) {
                    .art-grid {
                        margin-left: -1rem;
                    }
                    .art-grid-column {
                        padding-left: 1rem;
                    }
                }

                /* --- Art Card Styles (The Boxes) --- */
                .art-card {
                    background-color: #ffffff;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    margin-bottom: 2rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }

                .art-card:hover {
                    transform: translateY(-0.25rem) scale(1.02);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
                }

                .art-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    object-fit: cover;
                    transition: opacity 0.3s ease;
                }

                .art-card:hover .art-image {
                    opacity: 0.85;
                }
                
                /* Art Info Overlay for Title */
                .art-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
                    color: white;
                    padding: 1rem;
                    padding-top: 3rem;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                }

                .art-card:hover .art-info {
                    transform: translateY(0);
                }
            `}</style>
        </section>
    );
};

export default Gallery;