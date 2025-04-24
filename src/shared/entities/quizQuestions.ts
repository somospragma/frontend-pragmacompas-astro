import type { Question } from "./questions";

export interface QuizQuestion {
  [key: string]: Question[];
}
