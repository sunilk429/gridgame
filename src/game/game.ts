import { playerProps, positionProps } from "../types";

export default class Game {
    static nextId = 1;
    id: number;
    rows: number;
    cols: number;
    players: playerProps[];
    destination: positionProps;
    grid: string[][];
    turn: number;
    isProgress: "pending" | "ended";
    gametimer: any;

    static create(rows: number, cols: number): Game {
        return new Game(rows, cols);
    }

    constructor(rows: number, cols: number) {
        console.log(rows, cols)
        this.id = Game.nextId++;
        this.rows = rows;
        this.cols = cols;
        this.players = [];
        this.destination = { row: 0, col: 0 };
        this.grid = [];
        this.turn = 0;
        this.isProgress = "pending";
        this.initializeGrid();
        this.gametimer = null;
    }

    initializeGrid() {
        this.grid = Array.from({ length: this.rows }, () =>
            Array(this.cols).fill("_")
        );
        this.destination = {
            row: Math.floor(Math.random() * this.rows),
            col: Math.floor(Math.random() * this.cols),
        };
        this.grid[this.destination.row][this.destination.col] = "x";
    }

    addPlayer(player: playerProps) {
        if (this.isProgress === "ended") return;
        this.players.push(player);

        const emptySpots = this.getEmptySpots();
        if (emptySpots.length === 0) {
            throw new Error("No empty slots available");
        }
        const randomSpot =
            emptySpots[Math.floor(Math.random() * emptySpots.length)];
        this.grid[randomSpot.row][randomSpot.col] = player.id;
        player.setPosition(randomSpot.row, randomSpot.col);
        if (this.isProgress === "pending") {
            console.log(`Player ${player.id} has joined the game`);
            this.displayGrid();
        }
    }

    getEmptySpots(): positionProps[] {
        const emptySpots: positionProps[] = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === "_") {
                    emptySpots.push({ row, col });
                }
            }
        }
        return emptySpots;
    }

    movePlayers() {
        for (const player of this.players) {
            player.position = player.getNextPosition(this.destination);
        }
    }

    handlePlayerCollisions(): playerProps[][] {
        const positionMap = this.groupbySamePosition();
        const collidedPlayers: playerProps[][] = [];
        for (const players of positionMap.values()) {
            if (players.length > 1) {
                collidedPlayers.push(players);
                for (const player of players) {
                    this.eliminatePlayer(player);
                }
            }
        }
        return collidedPlayers;
    }

    groupbySamePosition(): Map<string, playerProps[]> {
        const positionMap = new Map<string, playerProps[]>();
        for (const player of this.players) {
            const playerPos = `${player.position?.row},${player.position?.col}`;
            if (positionMap.has(playerPos)) {
                positionMap.get(playerPos)!.push(player);
            } else {
                positionMap.set(playerPos, [player]);
            }
        }
        return positionMap;
    }

    eliminatePlayer(player: playerProps) {
        this.players = this.players.filter((p) => p !== player);
    }

    checkForWinner(): string | null {
        for (const player of this.players) {
            if (
                player.position?.row === this.destination.row &&
                player.position?.col === this.destination.col
            ) {
                return player.id;
            }
        }
        return null;
    }

    updateGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = "_";
            }
        }
        this.grid[this.destination.row][this.destination.col] = "x";
        for (const player of this.players) {
            this.grid[player.position.row][player.position?.col] = player.id;
        }
    }

    displayGrid() {
        if (this.turn !== 0) {
            console.log(`Game ${this.id} Turn ${this.turn}:`);
        }
        for (let row = 0; row < this.rows; row++) {
            console.log(this.grid[row].join(" "));
        }
        console.log("");
    }

    displayEliminatedPlayers(collidedPlayers: playerProps[][]) {
        for (const players of collidedPlayers) {
            console.log(
                `Players ${players.map((p) => p.id).join(", ")} have collided!`
            );
        }
    }
    update() {
        this.movePlayers();
        this.turn++;
        this.handlePlayerCollisions();
        this.updateGrid();
        if (this.players.length === 0) {
            this.isProgress = "ended";
            return;
        }
        const winner = this.checkForWinner();
        if (winner) {
            this.isProgress = "ended";
            return;
        }
    }
}
