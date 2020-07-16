
/**
 * Player state representation
 */
export interface Player {

  winner: boolean;
  looser: boolean;
  tied: boolean;
  status: string;
  board: [];

}

export interface PlayerDetails{
  playername: string;
  matrix: number;
}
