
// This class contains validation for player
export class ValidationMsg {
  validationMsg = {
    playerName: [
      { type: 'required', message: 'player name is required' },
    ],
    matrix: [
      { type: 'required', message: 'matrix number is require.' },
      { type: 'pattern', message: 'please enter numeric only  ' },
      { type: 'max', message: 'matrix number can not be exeeded 10' },
      { type: 'min', message: 'matrix number must be greater than 3' },
    ],
  };
}
