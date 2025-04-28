"use client";

import { Button } from "@/components/ui/button";
import type { FeedbackRecommendationsQuiz } from "@/shared/entities/FeedbackRecommendations";
import type { QuizQuestion } from "@/shared/entities/quizQuestions";
import { motion } from "framer-motion";
import { ArrowLeft, Code2 } from "lucide-react";

interface Props {
  name: string;
  description: string;
  color: string;
  questionsCollection: QuizQuestion;
  tipsCollection: FeedbackRecommendationsQuiz;
}

export const HeaderTriviaScript = ({ name, description, color }: Props) => {
  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <motion.header
        className="relative overflow-hidden bg-gray-900 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{ background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)` }}
        />
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="diagonalHatch"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke={color} strokeWidth={1} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
          </svg>
        </div>

        <div className="container mx-auto px-4">
          <div className="relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button variant="ghost" size="sm" onClick={() => history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>

              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-lg"
                  style={{ backgroundColor: color }}
                >
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold" style={{ color }}>
                  TriviaScript
                </h1>
              </div>

              <h2 className="text-xl font-semibold text-white mb-1">{name} TriviaScript</h2>
              <p className="text-gray-300 max-w-2xl">{description}</p>

              <div className="mt-4 text-sm text-gray-400">
                <p>
                  ¡Empieza a practicar y mejorar tus habilidades como desarrollador con nuestras preguntas y respuestas!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};
