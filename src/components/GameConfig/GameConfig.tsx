import React, { useState } from "react";

const GameConfig = ({ setGameSettings }) => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [players, setPlayers] = useState(2);
  const handleStart = () => {
    setGameSettings({ rows: rows, cols: cols, players: players });
  };
  return (
    <div>
      <div className="flex flex-col">
        <div>
          <label htmlFor="row">row</label>
          <input
            type="number"
            id="row"
            value={rows}
            onChange={(e) => setRows(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="col">col</label>
          <input
            type="number"
            id="col"
            value={cols}
            onChange={(e) => setCols(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="players">players</label>
          <input
            type="number"
            id="players"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={handleStart}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default GameConfig;
