import { Component, effect, signal, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { Route, Router } from '@angular/router';
import { GuessResult, LetterResultColour } from '../../models/guess-result';

interface GuessLetter {
  char: string;
  color: LetterResultColour;
}

interface Guess {
  guessWord: string;
  letters: GuessLetter[];
}

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-component.html',
  styleUrls: ['./game-component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  myElo = input.required<number>();
  gameStarted = signal<boolean>(false);
  turn = signal<boolean>(false);
  pastGuesses = signal<Guess[]>([]);
  currentGuess = signal<string>('');
  gameMessage = signal<string>('');
  gameEnded = signal<boolean>(false);
  private messageSubscription: Subscription | undefined;

  constructor(private webSocket: WebSocketService, private router: Router) { }

  ngOnInit(): void {
    this.messageSubscription = this.webSocket.getMessages().subscribe(
      (message: any) => {
        this.handleMessage(message);
      }
    );
    this.webSocket.sendMessage({ type: 'START_GAME', message: "" });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.endGame();
  }

  submitGuess(): void {
    const guess = this.currentGuess();
    if (guess.length !== 5) {
      this.gameMessage.set('Guess must be 5 letters.');
      return;
    }
    this.webSocket.sendMessage({ type: 'GUESS', message: this.currentGuess() });
    this.currentGuess.set('');
  }

  resignGame(): void {
    if (confirm('Are you sure you want to resign?')) {
      this.webSocket.sendMessage({ type: 'RESIGN', message: '' });
      this.gameMessage.set('You have resigned the game.');
    }
  }

  endGame(): void {
    this.webSocket.close();
    this.gameMessage.set('Connection closed.');
    this.router.navigateByUrl('/home');
  }

  private handleMessage(message: any): void {
    var guessResult: GuessResult | any;
    var guess: Guess;

    console.log(message.type, ": ", message.message);
    switch (message.type) {
      case 'GUESS_RESPONSE':
        guessResult = JSON.parse(message.message) as GuessResult;
        var resultType = guessResult.resultType
        if (resultType == 'NOT_IN_WORD_BANK') {
          this.gameMessage.set('Not in word bank!');
          return;
        } else if (resultType == 'ALREADY_GUESSED') {
          this.gameMessage.set('You already guessed that word!');
          return;
        }
        guess = {
          guessWord: guessResult.guess,
          letters: guessResult.guess.split('').map((char: any, index: string | number) => ({
            char: char,
            color: guessResult.result[index]
          }))
        };
        this.pastGuesses.update(guesses => [...guesses, guess]);
        this.gameMessage.set(message.resultMessage || '');
        this.turn.set(false);
        break;

      case 'GAME_OVER':
        this.gameMessage.set(message.message || 'Game over!');
        this.gameEnded.set(true);
        break;

      case 'OPPONENT_GUESS_UPDATE':
        guessResult = JSON.parse(message.message) as GuessResult;
        guess = {
          guessWord: guessResult.guess,
          letters: guessResult.guess.split('').map((char: any, index: string | number) => ({
            char: char,
            color: guessResult.result[index]
          }))
        };
        this.pastGuesses.update(guesses => [...guesses, guess]);
        this.gameMessage.set(message.resultMessage || '');
        this.turn.set(true);
        break;

      case 'ERROR':
        this.gameMessage.set(message.message || 'An error occurred');
        break;

      case 'UPDATE':
        console.log(message);
        switch (message.message) {
          case 'Game Started!':
            this.gameStarted.set(true);
            break;
          case 'Your Turn!':
            this.turn.set(true);
            break;
        }
        this.gameMessage.set(message.message || 'Game over!');
        break;
        
      default:
        console.log('Unknown message type:', message);
    }
  }
}