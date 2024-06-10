// src/types.ts
export interface positionProps {
    row: number;
    col: number;
}

export interface playerProps {
    id: string;
    position: positionProps;
    setPosition(row: number, col: number): void;
    getNextPosition(destination: positionProps): positionProps;
}

export interface GameSettingsProps {
    rows: number;
    cols: number;
    players: number;
  }
