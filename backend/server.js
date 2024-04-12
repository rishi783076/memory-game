const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// This is api endpoint which will be called when home page loads
app.get('/api/cards', (req, res) => {
  const cards = generateCards();
  res.json(cards);
});

// Mapping of English words to their respective French words
const words = [
  { id: 1, english: 'Forest', french: 'Foret' },
  { id: 2, english: 'Sibling', french: 'Frere et soeur' },
  { id: 3, english: 'Cereal', french: 'Cereale' },
  { id: 4, english: 'Desk', french: 'Bereau' },
  { id: 5, english: 'Camel', french: 'Chameau' },
  { id: 6, english: 'Butter', french: 'Beurre' },
  { id: 7, english: 'Bicycle', french: 'Velo' },
  { id: 8, english: 'Railroad', french: 'Chemin de fer' },
  { id: 9, english: 'Folder', french: 'dossier' },
  { id: 10, english: 'Weekly', french: 'Hebdomadaire' },
  { id: 11, english: 'Hungry', french: 'Faim' },
  { id: 12, english: 'Limestone', french: 'Calcaire' },
  
  // Add more words as needed
];

function generateCards() {
  // This function will generate cards
  const pairs = words.map(word => ({ ...word, isGreen: false ,isRed:false}));
  
  return pairs.map((pair, index) => ({ ...pair, id: index }));
}

// Default PORT value used in application
const PORT = 8000;

// Application will start listening for incoming HTTP requests on above PORT value
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
