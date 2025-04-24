export type Recommendation = {
  title: string;
  description: string;
  resources: {
    name: string;
    url: string;
  }[];
};

export type FeedbackRecommendations = {
  excellent: Recommendation;
  good: Recommendation;
  better: Recommendation;
  low: Recommendation;
};

export interface FeedbackRecommendationsQuiz {
  [key: string]: FeedbackRecommendations;
}
