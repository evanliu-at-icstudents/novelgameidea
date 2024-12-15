import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0); // Total cookies
  const [clickValue, setClickValue] = useState(1); // Cookies per manual click
  const [mouseCookies, setMouseCookies] = useState(0); // Cookies gained from user clicks
  const [allCookies, setAllCookies] = useState(0); // Total cookies gained from all sources
  const [totalCPS, setTotalCPS] = useState(0);
  const [baseClickValue, setBaseClickValue] = useState(1);
  const [cpcModifier, setCpcModifier] = useState(0);

  // State for all buildings
  const [buildings, setBuildings] = useState({
    Cursor: {
      basePrice: 15,
      multiplier: 1.15,
      increment: 0.1, // CPS per Cursor
      count: 0,
    },
    Grandma: {
      basePrice: 100,
      multiplier: 1.15,
      increment: 1, // CPS per Grandma
      count: 0,
    },
    Farm: {
      basePrice: 1100,
      multiplier: 1.15,
      increment: 8, // CPS per Farm
      count: 0,
    },
    Mine: {
      basePrice: 12000,
      multiplier: 1.15,
      increment: 47, // CPS per Mine
      count: 0,
    }
  });

  // State for one-time upgrades
  // State for one-time upgrades
  const [upgrades, setUpgrades] = useState([
    // Cursor upgrades
    {
      id: 'ReinforcedIndexFinger',
      name: 'Reinforced index finger',
      basePrice: 100,
      unlockCondition: (state) => state.buildings.Cursor.count >= 1, // Unlock after 10 Cursors
      effect: (state) => {
        state.setBaseClickValue((prev) => prev * 2); // Double cookies per click
        state.applyGlobalCPSMultiplier('Cursor', 2); // Double Cursor CPS
      },
      description: `The mouse and cursors are twice as efficient.
"prod prod"`
    },
    {
      id: 'CarpalTunnelPreventionCream',
      name: 'Carpal tunnel prevention cream',
      basePrice: 500,
      unlockCondition: (state) => state.buildings.Cursor.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.setBaseClickValue((prev) => prev * 2); // Double cookies per click
        state.applyGlobalCPSMultiplier('Cursor', 2); // Double Cursor CPS
      },
      description: `The mouse and cursors are twice as efficient.
"it... it hurts to click..."`
    },
    {
      id: 'Ambidextrous',
      name: 'Ambidextrous',
      basePrice: 10000,
      unlockCondition: (state) => state.buildings.Cursor.count >= 10, // Unlock after 25 Cursors
      effect: (state) => {
        state.setBaseClickValue((prev) => prev * 2); // Double cookies per click
        state.applyGlobalCPSMultiplier('Cursor', 2); // Double Cursor CPS
      },
      description: `The mouse and cursors are twice as efficient.
"Look ma, both hands!"`
    },
    // Grandma upgrades
    {
      id: 'ForwardsFromGrandma',
      name: 'Forwards from grandma',
      basePrice: 1000,
      unlockCondition: (state) => state.buildings.Grandma.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Grandma', 2); // Double Cursor CPS
      },
      description: `Grandmas are twice as efficient.
"RE:RE:thought you'd get a kick out of this ;))"`
    },
    {
      id: 'SteelPlatedRollingPins',
      name: 'Steel-plated rolling pins',
      basePrice: 5000,
      unlockCondition: (state) => state.buildings.Grandma.count >= 5, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Grandma', 2); // Double Cursor CPS
      },
      description: `Grandmas are twice as efficient.
"Just what you kneaded."`
    },
    {
      id: 'LubricatedDentures',
      name: 'Lubricated dentures',
      basePrice: 50000,
      unlockCondition: (state) => state.buildings.Grandma.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Grandma', 2); // Double Cursor CPS
      },
      description: `Grandmas are twice as efficient.
"squish"`
    },
    // Farm upgrades
    {
      id: 'CheapHoes',
      name: 'Cheap Hoes',
      basePrice: 11000,
      unlockCondition: (state) => state.buildings.Farm.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Farm', 2); // Double Cursor CPS
      },
      description: `Farms are twice as efficient.
"Rake in the dough!"`
    },
    {
      id: 'Fertilizer',
      name: 'Fertilizer',
      basePrice: 55000,
      unlockCondition: (state) => state.buildings.Farm.count >= 5, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Farm', 2); // Double Cursor CPS
      },
      description: `Farms are twice as efficient.
"It's chocolate, I swear."`
    },
    // Mine upgrades
    {
      id: 'SugarGas',
      name: 'Sugar gas',
      basePrice: 120000,
      unlockCondition: (state) => state.buildings.Mine.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Mine', 2); // Double Cursor CPS
      },
      description: `Mines are twice as efficient.
"A pink, volatile gas, found in the depths of some chocolate caves."`
    },
    {
      id: 'Megadrill',
      name: 'Megadrill',
      basePrice: 600000,
      unlockCondition: (state) => state.buildings.Mine.count >= 5, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Mine', 2); // Double Cursor CPS
      },
      description: `Mines are twice as efficient.
"You're in deep."`
    },
    //Clicking upgrades
    {
      id: 'PlasticMouse',
      name: 'Plastic Mouse',
      basePrice: 50000,
      unlockCondition: (state) => state.mouseCookies >= 1000,
      effect: (state, setCpcModifier) => {
        setCpcModifier(0.01);
      },
      description: `Clicking gains +1% of your CpS.
"Slightly squeaky."`
    }
  ]);

  const [hoverText, setHoverText] = useState(''); // State for hover text

  const applyGlobalCPSMultiplier = (buildingType, multiplier) => {
    setBuildings((prevBuildings) => ({
      ...prevBuildings,
      [buildingType]: {
        ...prevBuildings[buildingType],
        increment: prevBuildings[buildingType].increment * multiplier,
      },
    }));
  };

  const calculateTotalCPS = () => {
    return Object.values(buildings).reduce(
      (total, building) => total + building.increment * building.count,
      0
    );
  };

  useEffect(() => {
    setTotalCPS(calculateTotalCPS());
  }, [buildings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.round((prev + totalCPS) * 10) / 10);
      setAllCookies((prev) => Math.round((prev + totalCPS) * 10) / 10);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalCPS]);

  useEffect(() => {
    setClickValue((prev) => baseClickValue + totalCPS * cpcModifier);
  }, [totalCPS, baseClickValue, cpcModifier]);

  useEffect(() => {
    // Update the title of the tab dynamically based on the cookies count
    document.title = `Cookies: ${count.toFixed(1)}`;
  }, [count]); // Runs every time the `count` changes

  const click = () => {
    setCount((prev) => Math.round((prev + clickValue) * 10) / 10);
    setMouseCookies((prev) => Math.round((prev + clickValue) * 10) / 10);
    setAllCookies((prev) => Math.round((prev + clickValue) * 10) / 10);
  };

  const buyBuilding = (type) => {
    const building = buildings[type];
    const currentPrice = Math.ceil(building.basePrice * building.multiplier ** building.count);

    if (count >= currentPrice) {
      setCount((prev) => prev - currentPrice);
      setBuildings((prevBuildings) => ({
        ...prevBuildings,
        [type]: {
          ...prevBuildings[type],
          count: prevBuildings[type].count + 1,
        },
      }));
    }
  };

  const buyUpgrade = (upgradeId) => {
    const upgrade = upgrades.find((up) => up.id === upgradeId);

    if (count >= upgrade.basePrice) {
      setCount((prev) => prev - upgrade.basePrice);
      upgrade.effect({ setClickValue, applyGlobalCPSMultiplier, buildings, setBaseClickValue}, setCpcModifier);
      setUpgrades((prevUpgrades) => prevUpgrades.filter((up) => up.id !== upgradeId));
    }
  };

  const availableUpgrades = upgrades.filter((upgrade) =>
    upgrade.unlockCondition({ buildings, count , mouseCookies})
  );

  return (
    <div className="app">
      <h1>Novel Game Idea</h1>
      <div className="stats">
        <p>Cookies: {count.toFixed(1)}</p>
        <p>Cookies per Click: {clickValue.toFixed(1)}</p>
        <p>Cookies gained by Clicking: {mouseCookies.toFixed(1)}</p>
        <p>Cookies per Second: {totalCPS.toFixed(1)}</p>
        <p>Net Cookies: {allCookies.toFixed(1)}</p>
      </div>
      <button onClick={click} className="click-button green glow-button">Click</button>

      <div className="upgrades">
        <h2>Upgrades</h2>
        {availableUpgrades.length > 0 ? (
          availableUpgrades.map((upgrade) => (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade.id)}
              onMouseEnter={() => setHoverText(upgrade.description)}
              onMouseLeave={() => setHoverText('')}
              className="upgrade-button click-button blue"
            >
              Buy {upgrade.name} ({upgrade.basePrice} cookies)
            </button>
          ))
        ) : (
          <p>No upgrades available yet!</p>
        )}
      </div>

      <div className="buildings">
        <h2>Buildings</h2>
        {Object.entries(buildings).map(([key, building]) => (
          <button
            key={key}
            onClick={() => buyBuilding(key)}
            onMouseEnter={() => setHoverText(
              `Cost: ${Math.ceil(building.basePrice * building.multiplier ** building.count)} cookies, Owned: ${building.count}, CPS: ${building.increment}, TotalCPS: ${building.increment * building.count}
              , Percentage of Total CPS: ${(building.increment * building.count / totalCPS * 100).toFixed(2)}%`  
            )}
            onMouseLeave={() => setHoverText('')}
            className="building-button"
          >
            Buy {key} ({Math.ceil(building.basePrice * building.multiplier ** building.count)} cookies) 
            - Owned: {building.count}
          </button>
        ))}
      </div>

      <div className="hover-bar">
        <p>{hoverText || 'Hover over an upgrade or building for more info!'}</p>
      </div>
    </div>
  );
}

export default App;
