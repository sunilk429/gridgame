import React, { useCallback, useEffect, useRef, useState } from "react";
import Game from "./game/game";
import Player from "./player/player";
import "./App.css";

const App: React.FC = () => {
  const [initialPlayers, setInitialPlayers] = useState<number>(2);
  const [rows, setRows] = useState<number>(8);
  const [cols, setCols] = useState<number>(12);
  const [players, setPlayers] = useState<number>(2);
  const [start, setStart] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameInstance, setGameInstance] = useState<Game | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [turn, setTurn] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(5); // in seconds

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const getLatestState = useCallback(() => ({
    gameInstance,
    winner,
  }), [gameInstance, winner]);

  const updateGame = useCallback(() => {
    const { gameInstance, winner } = getLatestState();
    if (gameInstance && winner === null && !isPaused) {
      gameInstance.update();
      setGrid(gameInstance.grid);
      setTurn(gameInstance.turn);
      
      if (gameInstance.isProgress === "ended") {
        const gameWinner = gameInstance.checkForWinner();
        if (gameWinner) {
          setWinner(gameWinner);
          console.log(`Player ${gameWinner} has won the game!`);
        } else {
          console.log("All players have left, Game over!");
        }
      }
      setRemainingTime(5);
      startTimeRef.current = Date.now();
      intervalRef.current = window.setTimeout(updateGame, 5000);
    }
  }, [getLatestState, isPaused]);

  useEffect(() => {
    if (start && winner === null && !isPaused) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setTimeout(updateGame, remainingTime * 1000);

      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    }
  }, [start, winner, isPaused,updateGame, remainingTime]);

  const handlePause = () => {
    if (intervalRef.current && startTimeRef.current) {
      clearTimeout(intervalRef.current);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setRemainingTime((prevTime) => prevTime - elapsed);
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStart = () => {
    const newGame = Game.create(rows, cols);
    for (let i = 0; i < players; i++) {
      newGame.addPlayer(Player.create());
    }
    setInitialPlayers(players);
    setGameInstance(newGame);
    setGrid(newGame.grid);
    setStart(true);
    setRemainingTime(5);
  };

  const handleAddPlayer = () => {
    if (gameInstance && winner === null) {
      const newPlayer = Player.create();
      gameInstance.addPlayer(newPlayer);
      setPlayers((prevPlayers) => prevPlayers + 1);
      setGrid([...gameInstance.grid]);
    }
  };

  const reset = () => {
    console.log("reset");
    setRows(rows);
    setCols(cols);
    setPlayers(initialPlayers);
    Player.resetCounter();
    setGameInstance(null);
    setGrid([]);
    setTurn(0);
    setWinner(null);
    setRemainingTime(5);
    console.log("rows", rows, "cols", cols, "players", players);
  };

  const handleRestart = () => {
    reset();
    handleStart();
  };

  const handleExit = () => {
    reset();
    setStart(false);
  };

  return (
    <div className="App">
      {!start ? (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold">Grid Game</h1>
          <label className="flex flex-col">
            Rows:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="border p-2"
            />
          </label>
          <label className="flex flex-col">
            Columns:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
              className="border p-2"
            />
          </label>
          <label className="flex flex-col">
            Players:
            <input
              type="number"
              value={players}
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              className="border p-2"
            />
          </label>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="bg-red-500 text-white p-2 rounded"
            >
              Restart
            </button>
            <button
              onClick={handleExit}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Exit
            </button>
          </div>
          <div className="flex gap-4">
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="bg-green-500 text-white p-2 rounded"
              >
                Resume
              </button>
            )}
          </div>
          <button
            onClick={handleAddPlayer}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Player
          </button>

          <h2 className="text-xl">Turn: {turn}</h2>
          <div className="grid gap-1">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`w-10 h-10 border flex items-center justify-center ${
                      cell === "x"
                        ? "bg-yellow-300"
                        : cell !== "_"
                        ? "bg-blue-300"
                        : "bg-white"
                    }`}
                  >
                    {cell === "_" ? " " : cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {winner && (
            <h2 className="text-xl font-bold">
              Player {winner} has won the game!
            </h2>
          )}
        </div>
      )}
    </div>
  );
}

export default App;