// data-fetcher.js

export const LIVE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2qf99dmx0PuBpaxViBDDqfX9TIkgQWKSXy_5rXy0W_H6YakgJImGcSY9mWlcU4ahGRXhVCZaG71VW/pub?gid=1633077755&single=true&output=csv"

// Labels for the category based on Card Type
const categoryLabels = {
    'Blue': 'Blue',
    'White': 'White (Spicy)',
    'Mustard': 'Orange (Mild)', 
    'Orange': 'Orange (Mild)',
    'Red': 'Red (Spicy Hot)'
};

/**
 * Fetches a CSV file, parses it, and transforms it into a structured array of card objects.
 * @param {string} url The URL of the published CSV file.
 * @returns {Promise<Array<Object>>} A promise that resolves to the array of card objects.
 */
export async function fetchAndFormatCards(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/);
        const cardsArray = [];

        for (let i = 1; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '') continue;

            const values = line.match(/(?:\"[^\"]*\"|[^,])+/g) || [];
            if (values.length < 3) continue; 

            let [cardType, cardName, description] = values.map(val => {
                if (!val) return '';
                val = val.trim();
                
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1);
                }
                
                // Character cleaning
                val = val.replace(/â€¦/g, '...');
                val = val.replace(/â€™/g, "'");
                val = val.replace(/\s/g, ' ').trim(); 
                
                return val;
            });
            
            if (cardName === '' && (description === '' || !isNaN(Number(description)))) {
                 continue;
            }

            if (cardType && cardName) {
                const category = categoryLabels[cardType] || `${cardType} (Unknown)`;

                cardsArray.push({
                    category,
                    name: cardName,
                    description
                });
            }
        }

        // console.log(cardsArray)
        return cardsArray;


    } catch (error) {
        console.error('Failed to fetch or parse CSV:', error);
        return [];
    }
}