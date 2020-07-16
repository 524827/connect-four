import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

import { PlayerRole } from '../shared/enums/player-role.enum';
import { SocketService } from 'src/app/services/socket.service';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public board = [];
  public winner = false;
  public looser = false;
  public tied = false;
  public status: string;
  public playerValue = PlayerRole;
  public isDisabled: boolean;
  @ViewChild('boardEl')
  boardEl: ElementRef;


  constructor(
    private renderer: Renderer2,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {


    /**
     * get updated status and board details from service
     */
    this.socketService.updateSubject.subscribe((res: Player) => {
      console.log(res);
      this.status = res.status;
      this.board = res.board;
      if (res.looser) {
        this.looser = true;
      }
      if (res.winner){
      this.winner = true;
      }
      if (res.tied) {
        this.tied = true;
      }
    });
   // get waiting status from subject
    this.socketService.waitingSubject.subscribe((res: string) => {
      this.status = res;
    });
  }

  /**
   * Method for add dynamic hover class to view
   * @param row - row
   * @param col - col
   * @param enable - enable
   */
  onCellHover(row: number, col: number, enable: boolean) {
    if (!this.isDisabled) {
      this.highlightColumn(col, enable);
    }
  }

  /**
   * Method for remove hover effect class from view
   * @param row - row
   * @param col - col
   */
  private clearHoverState(row: number, col: number) {

    // disable all hover styling and behaviors
    this.highlightColumn(col, false);
  }

  /**
   * Method for add highlighting column
   * @param colIndex - column
   * @param enable - enable/disable option
   */
  private highlightColumn(colIndex: number, enable: boolean) {
    const selectorClassName = `.td-col${colIndex}`;
    const highlightClassName = 'highlight';
    const list = this.boardEl.nativeElement.querySelectorAll(selectorClassName);
    for (let i = 0; i < list.length; i++) {
      const el = list.item(i);

      if (enable) {
        this.renderer.addClass(el, highlightClassName);
      } else {
        this.renderer.removeClass(el, highlightClassName);
      }
    }
  }

  /**
   *
   * @param row - row
   * @param col - column
   */
  onCellClick(row: number, col: number) {
    this.socketService.handleMove(col);
    this.clearHoverState(row, col);
  }
}
