import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SteelDiamond.css";
import "./Button.css";
import grabSound from "./sounds/grab.mp3";
import failSound from "./sounds/fail.mp3";
import bgMusic from "./sounds/background.mp3";
import winSound from "./sounds/win.mp3";

export default function SteelDiamondGame() {
  const [rounds, setRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [glassRemoved, setGlassRemoved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showKeyInstructions, setShowKeyInstructions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bgAudio, setBgAudio] = useState(null);

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
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.5;
    setBgAudio(audio);
    return () => audio.pause();
  }, []);

  useEffect(() => {
    if (gameStarted && bgAudio) {
      bgAudio.play();
    }
  }, [gameStarted, bgAudio]);

  useEffect(() => {
    if (bgAudio) {
      bgAudio.volume = isMuted ? 0 : 0.5;
    }
  }, [isMuted, bgAudio]);

  useEffect(() => {
    if (gameOver) {
      const winAudio = new Audio(winSound);
      winAudio.play();
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!glassRemoved) {
        new Audio(failSound).play();
        return;
      }
      if (event.key === "a") {
        new Audio(grabSound).play();
        setRedScore((prev) => prev + 1);
        setNextRound();
      } else if (event.key === "l") {
        new Audio(grabSound).play();
        setBlueScore((prev) => prev + 1);
        setNextRound();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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
            Quick Snatch
          </motion.h1>
          <motion.h2 className="game-title" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            "Blink and You Lose"
          </motion.h2>
          <motion.button 
            className="instructions-btn" 
            onClick={() => setShowInstructions(!showInstructions)} 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            How to Play
          </motion.button>
          {showInstructions && (
            <motion.div className="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p>🔹 The diamond is locked in a Locker.</p>
              <p>🔹 When the lock is removed, the first player to react wins.</p>
              <p>🔹 Press Key "A" for Red Player, "L" for Blue Player.</p>
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
          <motion.button 
            className="play-btn" 
            onClick={() => setGameStarted(true)} 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            Play
          </motion.button>
          <div className="button-group">
            <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🔊"}
            </button>
            <button className="info-btn" onClick={() => setShowKeyInstructions(!showKeyInstructions)}>
              ?
            </button>
          </div>
          {showKeyInstructions && (
            <motion.div className="key-instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p>Press Key "A" for Red Player, "L" for Blue Player.</p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="game-area">
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
            <motion.button 
              className="restart-btn" 
              onClick={() => { 
                setCurrentRound(0); 
                setRedScore(0); 
                setBlueScore(0); 
                setGameOver(false); 
                setGameStarted(false); 
              }} 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              Restart
            </motion.button>
          )}
          <div className="button-group">
            <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🔊"}
            </button>
            <button className="info-btn" onClick={() => setShowKeyInstructions(!showKeyInstructions)}>
              ?
            </button>
          </div>
          {showKeyInstructions && (
            <motion.div className="key-instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p>Press Key "A" for Red Player, "L" for Blue Player.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
