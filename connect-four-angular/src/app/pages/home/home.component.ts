import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { BoardComponent } from '../board/board.component';
import { SocketService } from 'src/app/services/socket.service';
import { ValidationMsg } from 'src/app/models/validation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public playerForm: FormGroup;
  public validationMessages: any;

  constructor(
    private socketService: SocketService,
    private formBuilder: FormBuilder
  ) {
    this.validationMessages = new ValidationMsg().validationMsg;
  }

  ngOnInit(): void {
    this.playerForm = this.formBuilder.group({
      playerName: ['', Validators.required],
      matrix: [
        '',
        Validators.compose([
          Validators.pattern('[0-9]+'),
          Validators.required,
          Validators.min(4),
          Validators.max(10),
        ]),
      ],
    });
  }

  /**
   * Method for get player name and dynamic matrix
   * @param playerDetails - {}
   */
  gameDetails(playerDetails) {
    const player = {
      playername: playerDetails.value.playerName,
      matrix: playerDetails.value.matrix,
    };
    // console.log(player);
    this.socketService.joinRoom(player);
  }
}
