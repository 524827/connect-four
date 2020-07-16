import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { PlayerDetails } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: any;
  public updateSubject = new Subject();
  public waitingSubject = new Subject();
  constructor() {
    this.socket = io.connect('http://localhost:3000');

    /** event for wait until other user connect */
    this.socket.on('waiting', (data: string) => {
      this.waitingSubject.next(data);
    });

      /** event for get updated board from server */
    this.socket.on('update', (gameState: object) => {
      this.updateSubject.next(gameState);
    });
  }


/**
 * Method for handle move
 * @param column - colunm number
 */
  handleMove(column: number) {
    this.socket.emit('move', column);
  }

  /**
   * Method for join room for playing game
   * @param playerDetails - {}
   */
  joinRoom(playerDetails: PlayerDetails) {
    this.socket.emit('join', playerDetails);
  }
}
