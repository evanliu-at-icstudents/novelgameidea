import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0); // Total cookies
  const [clickValue, setClickValue] = useState(0); // Cookies per manual click
  const [mouseCookies, setMouseCookies] = useState(0); // Cookies gained from user clicks
  const [allCookies, setAllCookies] = useState(0); // Total cookies gained from all sources
  const [totalCPS, setTotalCPS] = useState(0);
  const [baseClickValue, setBaseClickValue] = useState(1);
  const [cpcModifier, setCpcModifier] = useState(0);
  const [baseCursorCPS, setBaseCursorCPS] = useState(0.1);
  const [nonCursorGain, setNonCursorGain] = useState(0);

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
    },
    Factory: {
      basePrice: 130000,
      multiplier: 1.15,
      increment: 260, // CPS per Factory
      count: 0,
    },
    Bank: {
      basePrice: 1400000,
      multiplier: 1.15,
      increment: 1400, // CPS per Bank
      count: 0,
    }
  });

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
        state.setBaseCursorCPS((prev) => prev * 2); // Double Cursor CPS
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
        state.setBaseCursorCPS((prev) => prev * 2); // Double Cursor CPS
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
        state.setBaseCursorCPS((prev) => prev * 2); // Double Cursor CPS
      },
      description: `The mouse and cursors are twice as efficient.
"Look ma, both hands!"`
    },
    {
      id: 'ThousandFingers',
      name: 'Thousand fingers',
      basePrice: 100000,
      unlockCondition: (state) => state.buildings.Cursor.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.setNonCursorGain(0.1);
      },
      description: `The mouse and cursors gain +0.1 cookies for each non-cursor object owned.
"clickity"`
    },
    {
      id: 'MillionFingers',
      name: 'Million fingers',
      basePrice: 10000000,
      unlockCondition: (state) => state.buildings.Cursor.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.setNonCursorGain(0.5);
      },
      description: `Multiplies the gain from Thousand fingers by 5.
"clickityclickity"`
    },
    {
      id: 'BillionFingers',
      name: 'Billion fingers',
      basePrice: 100000000,
      unlockCondition: (state) => state.buildings.Cursor.count >= 100, // Unlock after 25 Cursors
      effect: (state) => {
        state.setNonCursorGain(5);
      },
      description: `Multiplies the gain from Thousand fingers by 10.
"clickityclickityclickity"`
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
    {
      id: 'PruneJuice',
      name: 'Prune juice',
      basePrice: 5000000,
      unlockCondition: (state) => state.buildings.Grandma.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Grandma', 2); // Double Cursor CPS
      },
      description: `Grandmas are twice as efficient.
"Gets me going."`
    },
    {
      id: 'DoubleThickGlasses',
      name: 'Double-thick glasses',
      basePrice: 500000000,
      unlockCondition: (state) => state.buildings.Grandma.count >= 100, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Grandma', 2); // Double Cursor CPS
      },
      description: `Grandmas are twice as efficient.
"Oh... so THAT's what I've been baking."`
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
    {
      id: 'CookieTrees',
      name: 'Cookie Trees',
      basePrice: 550000,
      unlockCondition: (state) => state.buildings.Farm.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Farm', 2); // Double Cursor CPS
      },
      description: `Farms are twice as efficient.
"A relative of the breadfruit."`
    },
    {
      id: 'GeneticallyModifiedCookies',
      name: 'Genetically Modified Cookies',
      basePrice: 55000000,
      unlockCondition: (state) => state.buildings.Farm.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Farm', 2); // Double Cursor CPS
      },
      description: `Farms are twice as efficient.
"All-natural mutations."`
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
    {
      id: 'Ultradrill',
      name: 'Ultradrill',
      basePrice: 6000000,
      unlockCondition: (state) => state.buildings.Mine.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Mine', 2); // Double Cursor CPS
      },
      description: `Mines are twice as efficient.
"Finally caved in?"`
    },
    {
      id: 'Ultimadrill',
      name: 'Ultimadrill',
      basePrice: 600000000,
      unlockCondition: (state) => state.buildings.Mine.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Mine', 2); // Double Cursor CPS
      },
      description: `Mines are twice as efficient.
"Pierce the heavens, etc."`
    },
    // Factory upgrades
    {
      id: 'SturdierConveyorBelts',
      name: 'Sturdier conveyor belts',
      basePrice: 1300000,
      unlockCondition: (state) => state.buildings.Factory.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Factory', 2); // Double Cursor CPS
      },
      description: `Factories are twice as efficient.
"You're going places."`
    },
    {
      id: 'ChildLabor',
      name: 'Child labor',
      basePrice: 6500000,
      unlockCondition: (state) => state.buildings.Factory.count >= 5, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Factory', 2); // Double Cursor CPS
      },
      description: `Factories are twice as efficient.
"Cheaper, healthier workforce."`
    },
    {
      id: 'Sweatshop',
      name: 'Sweatshop',
      basePrice: 65000000,
      unlockCondition: (state) => state.buildings.Factory.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Factory', 2); // Double Cursor CPS
      },
      description: `Factories are twice as efficient.
"Slackers will be terminated."`
    },
    {
      id: 'RadiumReactor',
      name: 'Radium reactor',
      basePrice: 6500000000,
      unlockCondition: (state) => state.buildings.Factory.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Factory', 2); // Double Cursor CPS
      },
      description: `Factories are twice as efficient.
"Gives your cookies a healthy glow."`
    },
    // Bank upgrades
    {
      id: 'TallerTellers',
      name: 'Taller tellers',
      basePrice: 14000000,
      unlockCondition: (state) => state.buildings.Bank.count >= 1, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Bank', 2); // Double Cursor CPS
      },
      description: `Banks are twice as efficient.
"Able to process a higher amount of transactions. Careful though, as taller tellers tell tall tales."`
    },
    {
      id: 'ScissorResistantCreditCards',
      name: 'Scissor-resistant credit cards',
      basePrice: 70000000,
      unlockCondition: (state) => state.buildings.Bank.count >= 5, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Bank', 2); // Double Cursor CPS
      },
      description: `Banks are twice as efficient.
"For those truly valued customers."`
    },
    {
      id: 'AcidProofVaults',
      name: 'Acid-proof vaults',
      basePrice: 700000000,
      unlockCondition: (state) => state.buildings.Bank.count >= 25, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Bank', 2); // Double Cursor CPS
      },
      description: `	Banks are twice as efficient.
"You know what they say : better safe than sorry."`
    },
    {
      id: 'ChocolateCoins',
      name: 'Chocolate coins',
      basePrice: 70000000000,
      unlockCondition: (state) => state.buildings.Bank.count >= 50, // Unlock after 25 Cursors
      effect: (state) => {
        state.applyGlobalCPSMultiplier('Bank', 2); // Double Cursor CPS
      },
      description: `Banks are twice as efficient.
"This revolutionary currency is much easier to melt from and into ingots - and tastes much better, for a change."`
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
    },
    {
      id: 'IronMouse',
      name: 'Iron Mouse',
      basePrice: 5000000,
      unlockCondition: (state) => state.mouseCookies >= 100000,
      effect: (state, setCpcModifier) => {
        setCpcModifier(0.02);
      },
      description: `Clicking gains +1% of your CpS.
"Click like it's 1,349!"`
    },
    {
      id: 'TitaniumMouse',
      name: 'Titanium Mouse',
      basePrice: 500000000,
      unlockCondition: (state) => state.mouseCookies >= 10000000,
      effect: (state, setCpcModifier) => {
        setCpcModifier(0.03);
      },
      description: `Clicking gains +1% of your CpS.
"Heavy, but powerful."`
    },
    {
      id: 'AdamantiumMouse',
      name: 'Adamantium Mouse',
      basePrice: 50000000000,
      unlockCondition: (state) => state.mouseCookies >= 1000000000,
      effect: (state, setCpcModifier) => {
        setCpcModifier(0.04);
      },
      description: `Clicking gains +1% of your CpS.
"You could cut diamond with these.`
    },
    {
      id: 'UnobtainiumMouse',
      name: 'Unobtainium Mouse',
      basePrice: 5000000000000,
      unlockCondition: (state) => state.mouseCookies >= 100000000000,
      effect: (state, setCpcModifier) => {
        setCpcModifier(0.05);
      },
      description: `Clicking gains +1% of your CpS.
"These nice mice should suffice."	`
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
    // Update the title of the tab dynamically based on the cookies count
    document.title = `Cookies: ${shortNumbers(count.toFixed(1))}`;
  }, [count]); // Runs every time the `count` changes
  
  useEffect(() => {
    const nonCursorBuildings = Object.values(buildings).reduce((total, building) => total + building.count, 0) - buildings.Cursor.count;
    setBuildings((prevBuildings) => ({
      ...prevBuildings,
      Cursor: {
        ...prevBuildings.Cursor,
        increment: baseCursorCPS + nonCursorGain * nonCursorBuildings,
      },
    }))
    setClickValue(baseClickValue + nonCursorGain * nonCursorBuildings + totalCPS * cpcModifier);
  }, [Object.values(buildings).reduce((total, building) => total + building.count, 0), nonCursorGain, totalCPS, baseClickValue, cpcModifier]);

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
  const shortNumbers = (num) => {
    if (num < 1000) {
      return num;
    } else if (num < 1000000) {
      return (num / 1000).toFixed(1) + 'K';
    } else if (num < 1000000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num < 1000000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num < 1000000000000000) {
      return (num / 1000000000000).toFixed(1) + 'T';
    } else {
      return (num / 1000000000000000).toFixed(1) + 'Qa';
    } 
  };
  const buyUpgrade = (upgradeId) => {
    const upgrade = upgrades.find((up) => up.id === upgradeId);

    if (count >= upgrade.basePrice) {
      setCount((prev) => prev - upgrade.basePrice);
      upgrade.effect({ setClickValue, applyGlobalCPSMultiplier, buildings, setBaseClickValue, setBaseCursorCPS, setNonCursorGain}, setCpcModifier);
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
        <p>Cookies: {shortNumbers(count.toFixed(1))}</p>
        <p>Cookies per Click: {shortNumbers(clickValue.toFixed(1))}</p>
        <p>Cookies gained by Clicking: {shortNumbers(mouseCookies.toFixed(1))}</p>
        <p>Cookies per Second: {shortNumbers(totalCPS.toFixed(1))}</p>
        <p>Net Cookies: {shortNumbers(allCookies.toFixed(1))}</p>
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
              Buy {upgrade.name} ({shortNumbers(upgrade.basePrice)} cookies)
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
              `Cost: ${shortNumbers(Math.ceil(building.basePrice * building.multiplier ** building.count))} cookies, Owned: ${building.count}, CPS: ${shortNumbers((building.increment).toFixed(1))}, TotalCPS: ${shortNumbers((building.increment * building.count).toFixed(1))}
              , Percentage of Total CPS: ${(building.increment * building.count / totalCPS * 100).toFixed(2)}%`  
            )}
            onMouseLeave={() => setHoverText('')}
            className="building-button"
          >
            Buy {key} ({shortNumbers(Math.ceil(building.basePrice * building.multiplier ** building.count))} cookies) 
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
