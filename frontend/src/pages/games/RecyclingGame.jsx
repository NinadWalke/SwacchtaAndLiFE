import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './RecyclingGame.css';

const WASTE_TYPES = {
  recyclable: {
    color: 'recyclable',
    label: 'Recyclable',
    items: [
      { 
        name: '🍾 Plastic Bottle', 
        emoji: '🍾',
        info: 'Plastic bottles are recyclable! They can be melted down and reformed into new bottles, containers, or even clothing fibers. Recycling one plastic bottle saves enough energy to power a light bulb for 3 hours.'
      },
      { 
        name: '📰 Newspaper', 
        emoji: '📰',
        info: 'Newspapers are highly recyclable! They can be turned into new newsprint, cardboard, or insulation. Recycling one ton of newspaper saves 17 trees and 7,000 gallons of water.'
      },
      { 
        name: '🥫 Aluminum Can', 
        emoji: '🥫',
        info: 'Aluminum cans are 100% recyclable! They can be recycled indefinitely without losing quality. Recycling aluminum saves 95% of the energy needed to make new cans from raw materials.'
      },
      { 
        name: '📦 Cardboard', 
        emoji: '📦',
        info: 'Cardboard is recyclable and biodegradable! It can be recycled 5-7 times before the fibers become too short. Recycling cardboard reduces greenhouse gas emissions by 1 ton per ton recycled.'
      }
    ]
  },
  organic: {
    color: 'organic',
    label: 'Organic',
    items: [
      { 
        name: '🍎 Apple Core', 
        emoji: '🍎',
        info: 'Apple cores are organic waste! They should be composted, not recycled. Composting organic waste creates nutrient-rich soil and reduces methane emissions from landfills.'
      },
      { 
        name: '🍌 Banana Peel', 
        emoji: '🍌',
        info: 'Banana peels are organic waste! They decompose naturally and make excellent compost. They add potassium and other nutrients to soil, helping plants grow stronger.'
      },
      { 
        name: '🥚 Eggshells', 
        emoji: '🥚',
        info: 'Eggshells are organic waste! They\'re perfect for composting and add calcium to soil. They can also deter garden pests when crushed and scattered around plants.'
      },
      { 
        name: '🍂 Leaves', 
        emoji: '🍂',
        info: 'Leaves are organic waste! They create excellent compost called "leaf mold" which improves soil structure. Never put leaves in the recycling bin - they belong in compost or yard waste.'
      }
    ]
  },
  hazardous: {
    color: 'hazardous',
    label: 'Hazardous',
    items: [
      { 
        name: '🔋 Battery', 
        emoji: '🔋',
        info: 'Batteries are hazardous waste! They contain toxic chemicals like lead, mercury, and cadmium. They must be taken to special recycling centers, never thrown in regular trash or recycling bins.'
      },
      { 
        name: '💡 Light Bulb', 
        emoji: '💡',
        info: 'Light bulbs (especially CFLs) contain hazardous materials like mercury! They need special handling and should be taken to designated drop-off locations. LED bulbs are safer but still need proper disposal.'
      },
      { 
        name: '🎨 Paint Can', 
        emoji: '🎨',
        info: 'Paint cans are hazardous waste! Wet paint contains chemicals that can contaminate soil and water. Take unused paint to household hazardous waste facilities. Dried paint cans may be recyclable in some areas.'
      },
      { 
        name: '🧴 Cleaning Product', 
        emoji: '🧴',
        info: 'Many cleaning products are hazardous waste! They contain toxic chemicals that shouldn\'t enter water systems. Check labels for disposal instructions and take to hazardous waste collection sites.'
      }
    ]
  }
};

const RecyclingGame = () => {
  const [binPosition, setBinPosition] = useState(50);
  const [binType, setBinType] = useState('recyclable');
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const getBinColor = () => WASTE_TYPES[binType].color;
  const getBinLabel = () => WASTE_TYPES[binType].label;

  const generateItem = useCallback(() => {
    const types = Object.keys(WASTE_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const items = WASTE_TYPES[randomType].items;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    return {
      id: Date.now() + Math.random(),
      type: randomType,
      item: randomItem,
      position: Math.random() * 80 + 10,
      top: -10
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const itemInterval = setInterval(() => {
      setFallingItems(prev => [...prev, generateItem()]);
    }, 2000);

    return () => clearInterval(itemInterval);
  }, [gameStarted, gameOver, generateItem]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const fallInterval = setInterval(() => {
      setFallingItems(prev => {
        return prev.map(item => {
          const newTop = item.top + 2;
          
          if (newTop >= 85 && newTop <= 92) {
            if (Math.abs(item.position - binPosition) < 8) {
              if (item.type === binType) {
                setScore(s => s + 10);
                return null;
              } else {
                setGameOver(true);
                setGameOverInfo({
                  correctType: item.type,
                  wrongType: binType,
                  item: item.item
                });
                return null;
              }
            }
          }
          
          if (newTop > 100) {
            return null;
          }
          
          return { ...item, top: newTop };
        }).filter(Boolean);
      });
    }, 50);

    return () => clearInterval(fallInterval);
  }, [binPosition, binType, gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;

      if (e.key === 'ArrowLeft') {
        setBinPosition(prev => Math.max(5, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setBinPosition(prev => Math.min(85, prev + 5));
      } else if (e.key === ' ') {
        e.preventDefault();
        setBinType(prev => {
          const types = Object.keys(WASTE_TYPES);
          const currentIndex = types.indexOf(prev);
          return types[(currentIndex + 1) % types.length];
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  const resetGame = () => {
    setBinPosition(50);
    setBinType('recyclable');
    setFallingItems([]);
    setScore(0);
    setGameOver(false);
    setGameOverInfo(null);
    setGameStarted(true);
  };

  return (
    <div className="game-container">
      {/* Score */}
      <div className="score-display">
        <div className="score-text">Score: {score}</div>
      </div>

      {/* Current Bin Type */}
      <div className="bin-type-display">
        <span className="bin-type-label">
          Bin: <span className={`bin-type-badge ${getBinColor()}`}>{getBinLabel()}</span>
        </span>
      </div>

      {/* Controls Help */}
      {gameStarted && !gameOver && (
        <div className="controls-help">
          <div className="controls-text">
            ← → Arrow Keys: Move | SPACE: Change Bin Type
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!gameStarted && !gameOver && (
        <div className="modal-overlay">
          <div className="start-screen">
            <h1 className="start-title">♻️ Recycling Rush</h1>
            <p className="start-description">
              Sort waste correctly! Move the bin with arrow keys and change bin type with SPACE.
            </p>
            <div className="bin-types-list">
              <div className="bin-type-item">
                <span className="bin-type-item-badge recyclable">Recyclable</span>
                <span className="bin-type-item-text">Bottles, cans, paper</span>
              </div>
              <div className="bin-type-item">
                <span className="bin-type-item-badge organic">Organic</span>
                <span className="bin-type-item-text">Food waste, peels</span>
              </div>
              <div className="bin-type-item">
                <span className="bin-type-item-badge hazardous">Hazardous</span>
                <span className="bin-type-item-text">Batteries, chemicals</span>
              </div>
            </div>
            <button onClick={resetGame} className="start-button">
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && gameOverInfo && (
        <div className="modal-overlay">
          <div className="game-over-screen">
            <h2 className="game-over-title">Game Over!</h2>
            <div className="game-over-content">
              <p className="game-over-message">
                <span style={{ fontWeight: 'bold' }}>Wrong bin!</span> You tried to collect{' '}
                <span className="game-over-emoji">{gameOverInfo.item.emoji}</span>{' '}
                {gameOverInfo.item.name} in a{' '}
                <span className={`bin-type-badge ${WASTE_TYPES[gameOverInfo.wrongType].color}`}>
                  {WASTE_TYPES[gameOverInfo.wrongType].label}
                </span>{' '}
                bin.
              </p>
              <p className="game-over-correction">
                It should go in a{' '}
                <span className={`bin-type-badge ${WASTE_TYPES[gameOverInfo.correctType].color}`} style={{ fontWeight: 'bold' }}>
                  {WASTE_TYPES[gameOverInfo.correctType].label}
                </span>{' '}
                bin!
              </p>
              <div className="game-over-info-box">
                <p className="game-over-info-text">{gameOverInfo.item.info}</p>
              </div>
            </div>
            <div className="game-over-footer">
              <p className="final-score">Final Score: {score}</p>
              <button onClick={resetGame} className="play-again-button">
                <RotateCcw size={24} />
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Falling Items */}
      {fallingItems.map(item => (
        <div
          key={item.id}
          className="falling-item"
          style={{
            left: `${item.position}%`,
            top: `${item.top}%`
          }}
        >
          {item.item.emoji}
        </div>
      ))}

      {/* Dustbin */}
      {gameStarted && (
        <div
          className="dustbin-container"
          style={{ left: `${binPosition}%` }}
        >
          <div className={`dustbin ${getBinColor()}`}>
            <div className="dustbin-icon">🗑️</div>
            <div className="dustbin-label">
              {getBinLabel()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclingGame;