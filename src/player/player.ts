import { positionProps, playerProps } from "../types";

export default class Player implements playerProps {
    id: string;
    position: positionProps;
    static counter: number = -1;

    constructor() {
        this.id = Player.generateId();
        this.position = { row: 0, col: 0 };
    }

    static create(): Player {
        const player = new Player();
        return player;
    }
    static resetCounter(){
        this.counter = -1
    }
    static generateId(): string {
        if (this.counter === -1) {
            this.counter = 0;
        }

        let id = "";
        let num = this.counter;
        this.counter++;

        do {
            id = String.fromCharCode((num % 26) + 65) + id;
            num = Math.floor(num / 26) - 1;
        } while (num >= 0);

        return id;
    }

    setPosition(row: number, col: number) {
        this.position = { row, col };
    }

    getNextPosition(destination: positionProps): positionProps {
        let { row, col } = this.position;
        const { row: destRow, col: destCol } = destination;
        if (row < destRow) {
            row++;
        } else if (row > destRow) {
            row--;
        }

        if (col < destCol) {
            col++;
        } else if (col > destCol) {
            col--;
        }
        return { row, col };
    }
}
