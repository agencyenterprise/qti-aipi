// item-session-control.ts
export interface ItemSessionControl {
  maxAttempts?: number;
  showFeedback?: boolean;
  allowReview?: boolean;
  showSolution?: boolean;
  allowComment?: boolean;
  allowSkipping?: boolean;
  validateResponses?: boolean;
}

