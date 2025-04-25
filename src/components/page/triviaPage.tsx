import type { FeedbackRecommendationsQuiz } from "@/shared/entities/FeedbackRecommendations";
import type { Question } from "@/shared/entities/questions";
import type { QuizQuestion } from "@/shared/entities/quizQuestions";
import TriviaModal from "../organisms/TriviaModal/TriviaModal";

const TriviaPage = ({ questions, tips }: { questions: QuizQuestion; tips: FeedbackRecommendationsQuiz }) => {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const genNewPositions = (length: number) => {
    const newPositions: number[] = [];
    while (newPositions.length < length) {
      const position = getRandomInt(length);
      const encontrado = newPositions.find((item) => item === position);

      if (!encontrado && encontrado !== 0) {
        newPositions.push(position);
      }
    }

    return newPositions;
  };

  const mixQuestions = (quiz: Question[]): Question[] => {
    return quiz.map((question) => {
      const answer = question.options[question.correctAnswer];
      const sortAnswer = new Array(question.options.length);

      const positions = genNewPositions(question.options.length);

      for (let i = 0; i < question.options.length; i++) {
        sortAnswer[i] = question.options[positions[i]];
      }

      return { ...question, options: sortAnswer, correctAnswer: sortAnswer.findIndex((item) => item === answer) };
    });
  };

  return (
    <div className="flex w-full p-9 gap-4 ">
      {questions &&
        tips &&
        Object.entries(questions).map(([key, value]) => (
          <TriviaModal user="Anderson Castaño" title={key} questions={mixQuestions(value)} tips={tips[key]} />
        ))}
    </div>
  );
};

export default TriviaPage;
