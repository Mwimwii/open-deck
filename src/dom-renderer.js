// dom-renderer.js

import { animate } from 'animejs';
import { incrementCardIndex, renderCards } from './game-logic.js';
// --- Card Element Creation ---

/**
 * Creates a new card DOM element based on card data.
 * @param {Object} cardData 
 * @returns {HTMLElement}
 */
export function createCardElement(cardData) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    let categoryClass = '';
    console.log(cardData.category)
    if (cardData.category.toLowerCase().includes('white')) {
        console.log(cardData.category)
        categoryClass = 'card-white';
    } else if (cardData.category.toLowerCase().includes('mustard')) {
        categoryClass = 'card-mustard';
    } else if (cardData.category.toLowerCase().includes('blue')) {
        categoryClass = 'card-blue';
    } else if (cardData.category.toLowerCase().includes('orange')) {
        categoryClass = 'card-orange';
    } else if (cardData.category.toLowerCase().includes('red')) {
        categoryClass = 'card-red';
    }
    console.log(categoryClass)
    cardElement.classList.add(categoryClass);

    cardElement.innerHTML = `
        <div class="card-content flex flex-col items-center">
            <div class="card-logo-container mb-6">
                <img src="/logo.jpg" class="card-logo"/>
            </div>
            <div class="card-name text-center text-xl font-semibold mb-3 sm:text-2xl md:text-3xl">${cardData.name}</div>
            <p class="card-description text-center text-base text-gray-600 sm:text-lg md:text-xl">${cardData.description}</p>
        </div>
    `;
    return cardElement;
}

// --- Swipe Logic ---

// NOTE: This function requires access to mutable state (cardIndex) which is handled 
// by importing the game-logic's functions.
export function setupSwipe(card) {
    console.log("Swiping setup for card: ", card);
    let startX, startY, isDragging = false;
    let currentX = 0, currentY = 0;

    const onStart = (x, y) => {
        startX = x;
        startY = y;
        isDragging = true;
    };

    const onMove = (x, y) => {
        if (!isDragging) return;
        const deltaX = x - startX;
        const deltaY = y - startY;
        const rotation = deltaX / 10;

        const swipeStrength = Math.min(1, Math.abs(deltaX) / 200);
        card.style.opacity = 1 - swipeStrength;
        card.style.filter = `blur(${swipeStrength * 5}px)`;
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;

        const nextCard = card.nextSibling;
        if (nextCard) {
            nextCard.style.filter = `blur(${Math.max(0, 5 - swipeStrength * 5)}px)`;
            nextCard.style.transform = `scale(${Math.min(1, 0.95 + swipeStrength * 0.05)})`;
        }
        currentX = x;
        currentY = y;
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        const deltaX = currentX - startX;

        // Perform swipe validation based on threshold
        if (Math.abs(deltaX) > 100) {
            incrementCardIndex(); // Assuming card index is updated here
            animate(card, {
                translateX: deltaX > 0 ? '200%' : '-200%',
                translateY: 0,
                rotate: deltaX / 10,
                opacity: 0,
                duration: 300,
                easing: 'easeInOutQuad',
                complete: () => {
                    renderCards(); // Render new cards from game logic
                }
            });
        } else {
            // Revert card to original position if swipe is insufficient
            animate(card, {
                translateX: 0,
                translateY: 0,
                rotate: 0,
                opacity: 1,
                filter: 'none',
                duration: 300,
                easing: 'easeOutElastic(1, .5)',
                complete: () => {
                    const nextCard = card.nextSibling;
                    if (nextCard) {
                        animate(nextCard, {
                            scale: 0.95,
                            filter: 'blur(5px)',
                            duration: 300,
                            easing: 'easeInOutQuad'
                        });
                    }
                }
            });
        }
    };

    // Mouse Event Listeners
    card.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Ensure it's a left mouse click
            onStart(e.clientX, e.clientY);
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            onMove(e.clientX, e.clientY);
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            onEnd();
        }
    });

    // Touch Event Listeners
    card.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        onStart(touch.clientX, touch.clientY);
    });
    card.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
    });
    card.addEventListener('touchend', onEnd);
}



// --- Modal Handlers ---

const rulesModal = document.getElementById('rulesModal');
const closeButton = document.getElementById('closeButton');

export function showRules() {
    rulesModal.classList.add('show');
}

export function closeRules() {
    rulesModal.classList.remove('show');
}
closeButton.addEventListener('click', closeRules);

// --- PWA/Utility Handlers ---

const downloadButton = document.getElementById('downloadButton');
const downloadCount = document.getElementById('downloadCount');

export async function updateDownloadCounter() {
    // ... (content of your updateDownloadCounter function) ...
}

export async function fetchDownloadCount() {
    // ... (content of your fetchDownloadCount function) ...
}

export function triggerPWAInstallation() {
    // ... (content of your triggerPWAInstallation function) ...
}