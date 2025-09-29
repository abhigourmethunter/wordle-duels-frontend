export enum LetterResultColour {
  YELLOW = "YELLOW",
  GREEN = "GREEN", 
  GREY = "GREY"
}

export interface GuessResult {
  resultType: string;
  guess: string;
  result: [LetterResultColour, LetterResultColour, LetterResultColour, LetterResultColour, LetterResultColour];
}