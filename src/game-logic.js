// game-logic.js

import { animate } from 'animejs';
import { createCardElement, setupSwipe } from './dom-renderer.js';
import { cards } from './main.js'; // Import the loaded card data

// --- Game State (Exported for read-only access by other modules) ---
export let shuffledCards = [];
export let cardIndex = 0;

const cardStack = document.getElementById('cardStack');
const gameContainer = document.getElementById('gameContainer');
const startScreen = document.getElementById('startScreen');

// --- Mutator Functions (Setters) ---
// These are the ONLY ways to change cardIndex
export function incrementCardIndex() {
    cardIndex++;
}

export function resetCardIndex() {
    cardIndex = 0;
}

// --- Helper Functions ---

export function updateCardCounter() {
    const remainingCards = shuffledCards.length - cardIndex;
    if (remainingCards <= 0) {
        // You can keep the empty check here
    }
}

function showThankYouMessage() {
    // Create a thank you message element
    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = 'thankYouMessage';
    thankYouMessage.innerHTML = `
        <div class="text-center p-6 rounded-xl max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 text-black">Thanks for Playing!</h2>
            <p class="mb-4 text-black">You've gone through all the cards. Want to play again?</p>
            <button id="playAgainButton" class="px-6 py-3 rounded-full text-lg font-bold text-black border-2 border-black">
                Play Again
            </button>
        </div>
    `;
    thankYouMessage.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-10');
    
    // Add to the game container
    gameContainer.appendChild(thankYouMessage);
    
    // Add event listener to the play again button
    document.getElementById('playAgainButton').addEventListener('click', () => {
        // Remove the thank you message
        thankYouMessage.remove();
        // Reset and restart the game
        resetGame();
    });
}

// --- Core Game Functions ---

// Shuffle cards and transition to game view
export function startGame() {
    if (cards.length === 0) {
        console.error("Card data not yet loaded. Cannot start game.");
        return;
    }
    
    animate(startScreen, {
        opacity: 0,
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
            startScreen.style.display = 'none';
            gameContainer.style.display = 'flex';
            
            animate(gameContainer, {
                opacity: 1,
                duration: 500,
                easing: 'easeInOutQuad'
            });
            
            // Initialize the game
            shuffledCards = [...cards].sort(() => Math.random() - 0.5);
            resetCardIndex(); // Use the setter
            cardStack.innerHTML = '';
            renderCards();
        }
    });
}

// Function to reset and restart the game
export function resetGame() {
    resetCardIndex(); // Use the setter
    shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    cardStack.innerHTML = '';
    renderCards();
}

// Render the current and next card on the stack
export function renderCards() {
    cardStack.innerHTML = '';
    
    const existingThankYou = document.getElementById('thankYouMessage');
    if (existingThankYou) {
        existingThankYou.remove();
    }
    
    if (cardIndex < shuffledCards.length) {
        if (cardIndex + 1 < shuffledCards.length) {
            const nextCardData = shuffledCards[cardIndex + 1];
            const nextCard = createCardElement(nextCardData);
            nextCard.style.zIndex = -1;
            nextCard.style.transform = 'scale(0.95)';
            nextCard.style.filter = 'blur(5px)';
            cardStack.appendChild(nextCard);
        }

        const currentCardData = shuffledCards[cardIndex];
        const currentCard = createCardElement(currentCardData);
        currentCard.style.zIndex = 0;
        setupSwipe(currentCard);
        cardStack.appendChild(currentCard);
    } else {
        showThankYouMessage();
    }
    updateCardCounter();
}