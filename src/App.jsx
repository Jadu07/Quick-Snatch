import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SteelDiamond.css";
import "./Button.css"

export default function SteelDiamondGame() {
  const [rounds, setRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [glassRemoved, setGlassRemoved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (currentRound >= rounds) {
      setGameOver(true);
    }
  }, [currentRound, rounds]);

  useEffect(() => {
    if (!gameOver && gameStarted) {
      const timer = setTimeout(() => setGlassRemoved(true), Math.random() * 3000 + 2000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, gameOver, gameStarted]);

  useEffect(() => {
    if (glassRemoved) {
      const handleKeyPress = (event) => {
        if (event.key === "a") {
          setRedScore((prev) => prev + 1);
          setNextRound();
        } else if (event.key === "l") {
          setBlueScore((prev) => prev + 1);
          setNextRound();
        }
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [glassRemoved]);

  const setNextRound = () => {
    setGlassRemoved(false);
    setCurrentRound((prev) => prev + 1);
  };

  return (
    <div className="container dark-mode">
      {!gameStarted ? (
        <div className="menu">
          <motion.h1 className="game-title" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          Quick Heist
          </motion.h1>
          <motion.h2 className="game-title" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          "Blink and You Lose"
          </motion.h2>
          <motion.button className="instructions-btn" onClick={() => setShowInstructions(!showInstructions)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            How to Play
          </motion.button>
          {showInstructions && (
            <motion.div className="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p>🔹 The diamond is locked in a glass box.</p>
              <p>🔹 When the glass is removed, the first player to react wins.</p>
              <p>🔹 "A" for Red Player, "L" for Blue Player.</p>
              <p>🔹 The game continues for the selected number of rounds.</p>
              <p>🔹 The player with the most diamonds at the end wins!</p>
            </motion.div>
          )}
          <label htmlFor="rounds">Select Rounds:</label>
          <select id="rounds" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value))}>
            {[3, 5, 7, 10].map((num) => (
              <option key={num} value={num} className="under-select">{num}</option>
            ))}
          </select>
          <motion.button className="play-btn" onClick={() => setGameStarted(true)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Play
          </motion.button>
        </div>
      ) : (
        <div className="game-area">
          {/* Title Removed from Here */}
          
          {/* Scoreboard with Color-Coded Boxes */}
          <div className="scoreboard">
            <div className="player-score red-score">{redScore}</div>
            <div className="player-score blue-score">{blueScore}</div>
          </div>

          {!gameOver ? (
            <div className="game-box">
              <motion.div
                className={`diamond ${glassRemoved ? "unlocked" : "locked"}`}
                animate={{ scale: glassRemoved ? 1.3 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {glassRemoved ? "💎" : "🔒"}
              </motion.div>
              <p className="rounds">Round: {currentRound + 1} / {rounds}</p>
            </div>
          ) : (
            <motion.div
              className={`result ${redScore > blueScore ? "red-wins" : blueScore > redScore ? "blue-wins" : "tie"}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {redScore > blueScore ? "🏆 Red Won! 🏆" : blueScore > redScore ? "🏆 Blue Won! 🏆" : "🤝 It's a Tie!"}
            </motion.div>
          )}

          {gameOver && (
            <motion.button className="restart-btn" onClick={() => { 
              setCurrentRound(0); 
              setRedScore(0); 
              setBlueScore(0); 
              setGameOver(false); 
              setGameStarted(false); 
            }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              Restart
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
