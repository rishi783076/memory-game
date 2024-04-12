import React, { useState, useEffect } from "react";
import "./App.css";
interface Card {
  id: number;
  english: string;
  french: string;
  isGreen: boolean;
  isRed: boolean;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [frenchCards, setFrenchCards] = useState<Card[]>([]);
  const [selectedEnglishCard, setSelectedEnglishCard] = useState<Card | null>(null);
  const [selectedFrenchCard, setSelectedFrenchCard] = useState<Card | null>(null);
  const [markedEnglishList, setMarkedEnglishList] = useState<number[]>([]);
  const [markedFrenchList, setMarkedFrenchList] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [trigger, setTrigger] = useState("GO");
  const [textData, setTextData] = useState("");

  useEffect(() => {
    fetchCards();
    setTextData(`Welcome to Memory Game Application. Let's test our memory by playing a memory game. Please press GO button to start the game.`);
  }, []);

  useEffect(() => {
    if (selectedEnglishCard && selectedFrenchCard) {
      if (selectedEnglishCard.french === selectedFrenchCard.french) {
        setScore(score + 1);
        setCards((prevCards) => prevCards.map((c) => (c.french === selectedFrenchCard.french ? { ...c, isGreen: true } : c)));
        setFrenchCards((prevFrenchCards) => prevFrenchCards.map((c) => (c.french === selectedEnglishCard.french ? { ...c, isGreen: true } : c)));
      } else {
        setCards((prevCards) => prevCards.map((c) => (c.id === selectedEnglishCard.id ? { ...c, isRed: true } : c)));
        setFrenchCards((prevFrenchCards) => prevFrenchCards.map((c) => (c.id === selectedFrenchCard.id ? { ...c, isRed: true } : c)));
      }
      setMarkedFrenchList((prevList) => [...prevList, selectedFrenchCard.id]);
      setMarkedEnglishList((prevList) => [...prevList, selectedEnglishCard.id]);
      setSelectedEnglishCard(null);
      setSelectedFrenchCard(null);
    }
  }, [selectedEnglishCard, selectedFrenchCard]);

  const fetchCards = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/cards");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
        const data = await response.json();
        setCards(data);
        setFrenchCards(data);
    } catch (error) {
      console.log('Make sure your backend server run before running frontend server');
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleEnglishCardClick = (card: Card) => {
    if (trigger === "GRADE") setSelectedEnglishCard(card);
  };

  const handleFrenchCardClick = (card: Card) => {
    if (trigger === "GRADE") setSelectedFrenchCard(card);
  };

  const doShuffle = () => {
    if (trigger === "GO") {
      setTextData("Please Memorize English words and their corresponding French words");
      setTrigger("EMPTY");
    } else if (trigger === "EMPTY") {
      const newArray = [...frenchCards];
      const newEnglishArray = [...cards];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      for (let i = newEnglishArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newEnglishArray[i], newEnglishArray[j]] = [newEnglishArray[j], newEnglishArray[i]];
      }
      setTextData("Enjoy your learning journey!!!");
      setFrenchCards(newArray);
      setCards(newEnglishArray);
      setTrigger("GRADE");
    }
  };

  return (
    <div className="App">
      <h1><u>Memory Game Application</u></h1>
      <h3>{textData}</h3>
      <div className={trigger === "GO" ? "empty" : "tables-container"}>
        <table className="table">
          <thead>
            <tr>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr
                key={card.id}
                onClick={() => handleEnglishCardClick(card)}
                className={markedEnglishList.includes(card.id) ? "marked" : ""}
              >
                <td className={`card ${card.isGreen ? "green" : card.isRed ? "red" : ""}`}>{card.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>French</th>
            </tr>
          </thead>
          <tbody>
            {frenchCards.map((card) => (
              <tr
                key={card.id}
                onClick={() => handleFrenchCardClick(card)}
                className={markedFrenchList.includes(card.id) ? "marked" : ""}
              >
                <td className={`card ${card.isGreen ? "green" : card.isRed ? "red" : ""}`}>{card.french}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button className="shuffle" onClick={doShuffle}>{trigger === "EMPTY" ? "GRADE" : trigger}</button>
        {trigger === "GRADE" && markedEnglishList.length === cards.length && (
          <>
            <h1>Total Score:  {score}</h1>
            <button className="shuffle" onClick={() => setShowAnswers(true)}>SHOW CORRECT ANSWERS</button>
          </>
        )}
      </div>
      {showAnswers && markedEnglishList.length === cards.length && (
        <>
        <h3><u>Here's Correct list of Mapping for English to French Words!!!</u></h3>
        <div>
          {cards.map((card) => (
            <h4 key={card.id}>{card.english} - {card.french}</h4>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default App;