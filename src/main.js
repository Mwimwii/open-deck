import { animate } from 'animejs';
import { fetchAndFormatCards, LIVE_CSV_URL } from './data-fetcher.js';

// Array of card data from the PDF
const cards = [
    // White (Spicy) Cards
    { category: "White (Spicy)", name: "Ladies!", description: "Ladies take a drink." },
    { category: "White (Spicy)", name: "For The Dogs", description: "Gents take a drink." },
    { category: "White (Spicy)", name: "Denim", description: "Players with denim take a drink. If no one has denim, everyone take a drink." },
    { category: "White (Spicy)", name: "Specs", description: "Players with glasses take a drink. If no one has glasses, everyone take a drink." },
    { category: "White (Spicy)", name: "Inked", description: "Players with tattoos take a drink for every tattoo. If no one has tattoo, everyone take a drink." },
    { category: "White (Spicy)", name: "Whisper", description: "Only talk in whispers for the next round. Take a drink every time you mess up." },
    { category: "White (Spicy)", name: "Rule Master", description: "Create a rule everyone must follow for the next round. For instance, you can only drink with your left hand from now on. Whoever makes a mistake takes a drink." },
    { category: "White (Spicy)", name: "Question Master", description: "Ask questions. Anyone who answers must take a drink." },
    { category: "White (Spicy)", name: "Medusa!", description: "Players put their heads down and count to 3. On 3, each player raises their head and stares directly at another player. If you lock eyes with someone, yell \"Medusa.\" The person who says it last must drink." },
    { category: "White (Spicy)", name: "Partner", description: "Choose a drinking partner for the next round. Your partner has to take a drink any time you do." },
    { category: "White (Spicy)", name: "Categories", description: "Choose a category (e.g., fruits, chocolate bar brands). Each player must name something in the category until someone can't think of one. The person that hesitates or fails takes a drink." },
    { category: "White (Spicy)", name: "Both Hands", description: "Hold your drink with two hands for the next round." },
    { category: "White (Spicy)", name: "MC", description: "Find an item to use as a microphone every time you speak for the next round." },
    { category: "White (Spicy)", name: "Rhyme Time", description: "Say a word... each player takes turns saying a word that rhymes. The person that hesitates or fails takes a drink." },
    { category: "White (Spicy)", name: "Stuffy Nose", description: "Hold your nose while talking for the next round." },

    // Orange (Mild) Cards
    { category: "Orange (Mild)", name: "Farm Animal Sounds", description: "Make a farm animal sound of the group's choosing before you speak for one round. Take a drink for every time you mess up." },
    { category: "Orange (Mild)", name: "No Hands", description: "Eat something of the group's choice without using your hands or take a shot." },
    { category: "Orange (Mild)", name: "Three's a Crowd", description: "Count backward based on the number of players, saying 'OD' instead of multiples of 3 or numbers containing 3. First player to make a mistake drinks" },
    { category: "Orange (Mild)", name: "President Elect", description: "On the count of three... everyone point to the player they would vote for as President? Everyone take a drink for the President elect. The President must take a shot." },
    { category: "Orange (Mild)", name: "Freak Friday", description: "If you could choose any player to swap lives with for a week, who would it be? Both take a drink." },
    { category: "Orange (Mild)", name: "Crank That", description: "Silently do the 'Crank That Soulja' or take a shot." },
    { category: "Orange (Mild)", name: "The Flirt", description: "On the count of three, point to the player that is the biggest flirt. The player voted for takes a drink for every vote." },
    { category: "Orange (Mild)", name: "RIP", description: "If every player were in a horror movie, on the count of three... who would die first? The player voted for takes a drink for every vote." },
    { category: "Orange (Mild)", name: "One Word", description: "Describe every player using a single word." },
    { category: "Orange (Mild)", name: "Head & Shoulders", description: "Make your ear touch your shoulder for the next round." },
    { category: "Orange (Mild)", name: "Hugs", description: "Close your eyes, let the group pick someone to hug you and guess who it is. If you guess right everyone takes a drink, if you guess wrong take a shot" },
    { category: "Orange (Mild)", name: "One Call Away", description: "Everyone put their phone on loud... next player to have their phone ring, takes a shot." },
    { category: "Orange (Mild)", name: "Freeze", description: "Let the group pose you and stay that way for 3 turns. You are excluded from the game during this time." },
    { category: "Orange (Mild)", name: "Sober No More", description: "On the count of three... everyone point to the player who is most sober. Whoever has the most votes must take a shot. If there's a tie, everyone involved in the tie must take a shot." },
    { category: "Orange (Mild)", name: "Snack Time", description: "Pick a player and tell them which snack they remind you of or take a shot." },

    // Red (Spicy Hot) Cards
    { category: "Red (Spicy Hot)", name: "Your Favourite", description: "Reveal your favourite sex position or take a shot." },
    { category: "Red (Spicy Hot)", name: "Empty Your Pockets", description: "Remove three things from your pocket or purse. If you do so successfully, every other player drinks three. If you fail, you must take three drinks." },
    { category: "Red (Spicy Hot)", name: "Switch", description: "Swap a piece of clothing with the player to your right or left for the next round or take three drinks." },
    { category: "Red (Spicy Hot)", name: "Sexy Time", description: "Name 3 songs you would add to a sex playlist." },
    { category: "Red (Spicy Hot)", name: "Who To Dial", description: "Scroll through your contacts until someone says stop. Either call that person and tell them \"I love you\" or delete their contact. If you refuse to do either, take a shot." },
    { category: "Red (Spicy Hot)", name: "P*rnstar", description: "Give yourself a pornstar name that every player must use when responding to you for the next round. For instance, \"Yes, Daddy.\" The player that messes up takes a drink each time." },
    { category: "Red (Spicy Hot)", name: "Once Upon A Text", description: "Read the last direct text message you sent out loud or take a shot." },
    { category: "Red (Spicy Hot)", name: "Kiss Kiss", description: "On the count of three... every player must point to the player they would kiss, If there's a match, both take a drink. If no matches, everyone takes a drink." },
    { category: "Red (Spicy Hot)", name: "Out of 7", description: "Ask any player to rate you out of 7 or take a shot." },
    { category: "Red (Spicy Hot)", name: "Strip", description: "Take off a piece of clothing for every time you've been sexually active this year." },
    { category: "Red (Spicy Hot)", name: "Point Them Out", description: "Whisper a question to the person to your right about the other players, they must answer the question by pointing to the player. If the player pointed to wants the answer revealed, they can do so." },
    { category: "Red (Spicy Hot)", name: "Why So Serious?", description: "Let another player draw the Joker scar on your face or take a shot." },
    { category: "Red (Spicy Hot)", name: "Most Likely", description: "On the count of three... everyone vote for the player most likely to get laid tonight. The player voted for takes a drink for every vote." },
    { category: "Red (Spicy Hot)", name: "Guess Who?", description: "Correctly guess which player has a condom on them currently or drink." },
];

// Dynamic cards loaded from CSV (will be populated on app init)
let dynamicCards = [];
let isLoadingCards = false;

let shuffledCards = [];
let cardIndex = 0;
const cardStack = document.getElementById('cardStack');
const resetButton = document.getElementById('resetButton');
const rulesButton = document.getElementById('rulesButton');
const rulesModal = document.getElementById('rulesModal');
const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');
const logoImage = document.getElementById('logoImage');
const closeButton = document.getElementById('closeButton');
const downloadButton = document.getElementById('downloadButton');
const downloadCount = document.getElementById('downloadCount');

// Function to show/hide the rules modal
function showRules() {
    rulesModal.classList.add('show');
}

function closeRules() {
    rulesModal.classList.remove('show');
}

// Function to update download counter via API (only when online)
async function updateDownloadCounter() {
    // Only update if online
    if (!navigator.onLine) {
        console.log("Offline: Skipping download counter update");
        return;
    }
    
    try {
        const response = await fetch('/api/download-counter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            downloadCount.textContent = data.count;
            // Cache the count in localStorage
            localStorage.setItem('downloadCount', data.count);
        } else {
            console.error("Failed to update download counter");
        }
    } catch (error) {
        console.error("Error updating download counter:", error);
    }
}

// Function to fetch current download count via API (with localStorage fallback)
async function fetchDownloadCount() {
    // Try to get from localStorage first
    const cachedCount = localStorage.getItem('downloadCount');
    if (cachedCount) {
        downloadCount.textContent = cachedCount;
    }
    
    // Only fetch from API if online
    if (!navigator.onLine) {
        console.log("Offline: Using cached download count");
        return;
    }
    
    try {
        const response = await fetch('/api/download-counter');
        
        if (response.ok) {
            const data = await response.json();
            downloadCount.textContent = data.count;
            // Cache the count in localStorage
            localStorage.setItem('downloadCount', data.count);
        } else {
            console.error("Failed to fetch download counter");
        }
    } catch (error) {
        console.error("Error fetching download counter:", error);
    }
}

/**
 * Initialize cards by fetching from CSV
 * Falls back to hardcoded cards if fetch fails
 * Caches cards in localStorage for offline use
 */
async function initializeCards() {
    if (isLoadingCards) return;
    isLoadingCards = true;
    
    // Try to load from localStorage cache first
    const cachedCards = localStorage.getItem('openDeckCards');
    if (cachedCards) {
        try {
            dynamicCards = JSON.parse(cachedCards);
            console.log('Loaded cards from cache:', dynamicCards.length);
        } catch (e) {
            console.error('Failed to parse cached cards:', e);
        }
    }
    
    // Only fetch from CSV if online
    if (navigator.onLine) {
        try {
            console.log('Fetching cards from CSV...');
            const fetchedCards = await fetchAndFormatCards(LIVE_CSV_URL);
            
            if (fetchedCards && fetchedCards.length > 0) {
                dynamicCards = fetchedCards;
                // Cache the fetched cards
                localStorage.setItem('openDeckCards', JSON.stringify(fetchedCards));
                console.log('Successfully loaded cards from CSV:', fetchedCards.length);
            } else {
                console.warn('No cards fetched from CSV, using fallback');
                // Use cached cards or fallback to hardcoded
                if (dynamicCards.length === 0) {
                    dynamicCards = [...cards];
                }
            }
        } catch (error) {
            console.error('Error fetching cards from CSV:', error);
            // Use cached cards or fallback to hardcoded
            if (dynamicCards.length === 0) {
                dynamicCards = [...cards];
                console.log('Using hardcoded fallback cards');
            }
        }
    } else {
        console.log('Offline: Using cached or hardcoded cards');
        // Use cached cards or fallback to hardcoded
        if (dynamicCards.length === 0) {
            dynamicCards = [...cards];
        }
    }
    
    isLoadingCards = false;
}

// Function to trigger PWA installation
function triggerPWAInstallation() {
    // Check if the browser supports the beforeinstallprompt event
    if ('beforeinstallprompt' in window) {
        // Show the download button
        downloadButton.style.display = 'block';
        
        // Add event listener to the download button
        downloadButton.addEventListener('click', () => {
            // Update download counter
            updateDownloadCounter();
            
            // Trigger the installation prompt
            window.dispatchEvent(new CustomEvent('beforeinstallprompt'));
        });
    }
}

// Shuffle cards and create the initial stack
function startGame() {
    // Add animation to the start screen when transitioning to game
    animate(startScreen, {
        opacity: 0,
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
            startScreen.style.display = 'none';
            gameContainer.style.display = 'flex';
            
            // Animate the game container appearing
            gameContainer.style.opacity = 0;
            animate(gameContainer, {
                opacity: 1,
                duration: 500,
                easing: 'easeInOutQuad'
            });
            
            // Initialize the game with dynamic cards
            const cardsToUse = dynamicCards.length > 0 ? dynamicCards : cards;
            shuffledCards = [...cardsToUse].sort(() => Math.random() - 0.5);
            cardIndex = 0;
            cardStack.innerHTML = '';
            renderCards();
        }
    });
}

// Update the card counter text and handle empty deck
function updateCardCounter() {
    const remainingCards = shuffledCards.length - cardIndex;
    if (remainingCards <= 0) {
        // Show a thank you message
        showThankYouMessage();
    }
}

// Function to show a thank you message when the deck is empty
function showThankYouMessage() {
    // Create a thank you message element
    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = 'thankYouMessage';
    thankYouMessage.innerHTML = `
        <div class="text-center p-6 bg-white rounded-xl max-w-md mx-auto shadow-xl">
            <h2 class="text-2xl font-bold mb-4 text-black">Thanks for Playing!</h2>
            <p class="mb-6 text-black">You've gone through all the cards. What would you like to do?</p>
            <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center">
                <button id="goBackButton" class="px-6 py-3 rounded-full text-lg font-bold text-white bg-black border-2 border-black">
                    Go Back
                </button>
                <button id="startOverButton" class="px-6 py-3 rounded-full text-lg font-bold text-black border-2 border-black">
                    Start Over
                </button>
            </div>
        </div>
    `;
    thankYouMessage.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-10', 'bg-black', 'bg-opacity-50');
    
    // Add to the game container
    gameContainer.appendChild(thankYouMessage);
    
    // Add event listener to the go back button
    document.getElementById('goBackButton').addEventListener('click', () => {
        // Remove the thank you message
        thankYouMessage.remove();
        // Go back to the start screen
        gameContainer.style.display = 'none';
        startScreen.style.display = 'flex';
        
        // Animate the start screen appearing
        animate(startScreen, {
            opacity: [0, 1],
            duration: 500,
            easing: 'easeInOutQuad'
        });
    });
    
    // Add event listener to the start over button
    document.getElementById('startOverButton').addEventListener('click', () => {
        // Remove the thank you message
        thankYouMessage.remove();
        // Reset and restart the game
        resetGame();
    });
}

// Function to reset and restart the game
function resetGame() {
    // Reset the card index
    cardIndex = 0;
    
    // Shuffle the cards again using dynamic cards
    const cardsToUse = dynamicCards.length > 0 ? dynamicCards : cards;
    shuffledCards = [...cardsToUse].sort(() => Math.random() - 0.5);
    
    // Clear the card stack
    cardStack.innerHTML = '';
    
    // Render the new cards
    renderCards();
}

// Render the current and next card on the stack
function renderCards() {
    cardStack.innerHTML = '';
    
    // Remove any existing thank you message
    const existingThankYou = document.getElementById('thankYouMessage');
    if (existingThankYou) {
        existingThankYou.remove();
    }
    
    if (cardIndex < shuffledCards.length) {
        // Show the next card in the stack
        if (cardIndex + 1 < shuffledCards.length) {
            const nextCardData = shuffledCards[cardIndex + 1];
            const nextCard = createCardElement(nextCardData);
            nextCard.style.zIndex = -1;
            nextCard.style.transform = 'scale(0.95)';
            nextCard.style.filter = 'blur(5px)';
            cardStack.appendChild(nextCard);
        }

        // Show the current card
        const currentCardData = shuffledCards[cardIndex];
        const currentCard = createCardElement(currentCardData);
        currentCard.style.zIndex = 0;
        setupSwipe(currentCard);
        cardStack.appendChild(currentCard);
    } else {
        // Show thank you message when deck is empty
        showThankYouMessage();
    }
    updateCardCounter();
}

// Create a new card element with content
function createCardElement(cardData) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    // Add a class for the border color based on the category
    let categoryClass = '';
    if (cardData.category.includes('White')) {
        categoryClass = 'card-white';
    } else if (cardData.category.includes('Orange')) {
        categoryClass = 'card-orange';
    } else if (cardData.category.includes('Mustard')) {
        categoryClass = 'card-mustard';
    } else if (cardData.category.includes('Red')) {
        categoryClass = 'card-red';
    } else if (cardData.category.includes('Blue')) {
        categoryClass = 'card-blue';
    } else {
        // Default to white if no known category is found
        categoryClass = 'card-white';
    }
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

// Handle swiping logic with Anime.js
function setupSwipe(card) {
    let startX, startY, isDragging = false;
    let currentX = 0, currentY = 0;

    const onMove = (x, y) => {
        const deltaX = x - startX;
        const deltaY = y - startY;
        const rotation = deltaX / 10;
        
        // Calculate opacity and blur based on swipe distance
        const swipeStrength = Math.min(1, Math.abs(deltaX) / 200);
        
        // Smoothly update the current card's style
        card.style.opacity = 1 - swipeStrength;
        card.style.filter = `blur(${swipeStrength * 5}px)`;
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        // Apply un-blur and zoom to the next card
        const nextCard = card.nextSibling;
        if (nextCard) {
            nextCard.style.filter = `blur(${Math.max(0, 5 - swipeStrength * 5)}px)`;
            nextCard.style.transform = `scale(${Math.min(1, 0.95 + swipeStrength * 0.05)})`;
        }

        currentX = x;
        currentY = y;
    };

    const onEnd = () => {
        isDragging = false;
        
        const deltaX = currentX - startX;
        
        // If swipe is significant, remove the card
        if (Math.abs(deltaX) > 100) {
            cardIndex++;
            // Animate the card flying out with Anime.js
            animate(card, {
                translateX: deltaX > 0 ? '200%' : '-200%',
                translateY: 0,
                rotate: deltaX/10,
                opacity: 0,
                duration: 300,
                easing: 'easeInOutQuad',
                complete: () => {
                    renderCards();
                }
            });
        } else {
            // Snap back to original position with Anime.js
            animate(card, {
                translateX: 0,
                translateY: 0,
                rotate: 0,
                opacity: 1,
                filter: 'none',
                duration: 300,
                easing: 'easeOutElastic(1, .5)',
                complete: () => {
                    // Reset the next card as well
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

    // Mouse events
    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        // Disable CSS transition during active drag
        card.style.transition = 'none';
        const nextCard = card.nextSibling;
        if (nextCard) {
            nextCard.style.transition = 'none';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        onMove(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) onEnd();
    });

    // Touch events for mobile
    card.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        // Disable CSS transition during active drag
        card.style.transition = 'none';
        const nextCard = card.nextSibling;
        if (nextCard) {
            nextCard.style.transition = 'none';
        }
    });

    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
    });

    card.addEventListener('touchend', () => {
        if (isDragging) onEnd();
    });
}

// Event listeners for buttons
rulesButton.addEventListener('click', showRules);
resetButton.addEventListener('click', resetGame);
closeButton.addEventListener('click', closeRules);

// Start button listener to hide the start screen and show the game
startButton.addEventListener('click', startGame);

// Add animation to the logo on the start screen
window.addEventListener('load', async () => {
    // Initialize cards from CSV (this is async but we don't need to wait for it)
    initializeCards();
    
    // Animate the logo appearing
    animate(logoImage, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Add a subtle pulse animation to the start button
    animate(startButton, {
        scale: [1, 1.05, 1],
        duration: 2000,
        loop: true,
        easing: 'easeInOutQuad'
    });
    
    // Fetch download counter on load
    fetchDownloadCount();
    
    // Trigger PWA installation after a delay
    setTimeout(triggerPWAInstallation, 1000);
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log("App is online");
    // Fetch the latest download count when coming online
    fetchDownloadCount();
});

window.addEventListener('offline', () => {
    console.log("App is offline");
    // Continue working offline
});

// Handle the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default browser prompt
    e.preventDefault();
    
    // Show our custom download button
    downloadButton.style.display = 'block';
    
    // When the download button is clicked, show the browser's install prompt
    downloadButton.addEventListener('click', () => {
        // Update download counter
        updateDownloadCounter();
        
        // Show the browser's install prompt
        e.prompt();
        
        // Wait for the user to respond to the prompt
        e.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Hide the download button after the prompt is shown
            downloadButton.style.display = 'none';
        });
    });
});