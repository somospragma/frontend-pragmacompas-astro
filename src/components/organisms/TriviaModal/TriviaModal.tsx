"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/Dialog/Dialog";
import { Button } from "@/components/ui/button";
import type { Question } from "@/shared/entities/questions";
import type { Recommendation, FeedbackRecommendations } from "@/shared/entities/FeedbackRecommendations";
import { StorageKey } from "@/shared/utils/enums/storageKey";
import { localStore } from "@/shared/utils/helpers/localStore";
import { cn } from "@/shared/utils/style";
import html2canvas from "html2canvas";
import { CheckCircle, Download, Trophy, XCircle, BookOpen, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

export default function TriviaGame({
  questions,
  tips,
  title,
  user,
}: {
  questions: Question[];
  tips: FeedbackRecommendations;
  title: string;
  user: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Referencia al contenedor de resultados para capturar la imagen
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameOver(false);
  };

  // Recomendaciones basadas en la puntuación
  const getRecommendations = (): Recommendation => {
    const scorePercentage = score / questions.length;

    if (scorePercentage === 1) {
      return tips.excellent;
    } else if (scorePercentage >= 0.75) {
      return tips.good;
    } else if (scorePercentage >= 0.5) {
      return tips.better;
    } else {
      return tips.low;
    }
  };

  // Función para descargar la imagen de resultados
  const downloadResultsAsImage = async () => {
    if (!resultsRef.current) return;

    try {
      setIsDownloading(true);

      // Capturar el contenido como imagen
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: "#1a1a24",
        scale: 2, // Mayor calidad
        logging: false,
        useCORS: true, // Para imágenes externas
      });

      // Convertir a URL de datos
      const imageUrl = canvas.toDataURL("image/png");

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.download = `trivia-results-${new Date().getTime()}.png`;
      link.href = imageUrl;
      link.click();
      localStore.setStorage(StorageKey.triviaResults, {}); // Guardar en localStorage
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Función para determinar el color del trofeo según la puntuación
  const getTrophyColor = () => {
    if (score === questions.length) {
      return "text-yellow-400"; // Oro - puntuación perfecta
    } else if (score >= questions.length * 0.75) {
      return "text-gray-300"; // Plata - 75% o más
    } else if (score >= questions.length * 0.5) {
      return "text-amber-700"; // Bronce - 50% o más
    } else {
      return "text-purple-600"; // Otro color - menos del 50%
    }
  };

  // Función para obtener el texto del trofeo
  const getTrophyText = () => {
    if (score === questions.length) {
      return "🏆 Trofeo de Oro";
    } else if (score >= questions.length * 0.75) {
      return "🥈 Trofeo de Plata";
    } else if (score >= questions.length * 0.5) {
      return "🥉 Trofeo de Bronce";
    } else {
      return "💜 Trofeo de Participación";
    }
  };

  const recommendations = getRecommendations();
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            role="button"
            className={`w-[190px] h-[100px] mx-auto bg-[#6366F1] rounded-[10px] relative z-[1] hover:scale-110 transition-transform`}
          >
            <div className="flex items-center p-[9px]">
              <div className="px-1">
                <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#ff605c]"></span>
              </div>
              <div className="px-1">
                <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#ffbd44]"></span>
              </div>
              <div className="px-1">
                <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#00ca4e]"></span>
              </div>
            </div>
            <div className="py-1 px-4">{title}</div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] bg-[#121218] border-purple-800 text-white">
          {/* Decorative circles */}
          <div className="absolute -z-10 inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-purple-900/20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-purple-900/20 translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute top-1/4 right-10 w-20 h-20 rounded-full bg-purple-900/20"></div>
            <div className="absolute bottom-1/3 left-10 w-24 h-24 rounded-full bg-purple-900/20"></div>
          </div>

          <DialogHeader>
            <DialogTitle className="flex justify-between items-center relative mt-3 ">
              <div className=" text-2xl font-bold text-purple-400">Mundo Pragma</div>
              <div className="text-yellow-400 font-mono font-bold">{title}</div>
            </DialogTitle>
            <DialogDescription className="text-gray-400">TriviaScript para Fronteños</DialogDescription>
          </DialogHeader>

          {!gameOver ? (
            <div className="mt-4 space-y-4">
              {/* Progress and score */}
              <div className="flex justify-between items-center">
                <div className="text-gray-300">
                  Pregunta {currentQuestion + 1}/{questions.length}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>{score}</span>
                </div>
              </div>

              {/* Question */}
              <div className="p-4 rounded-lg bg-[#1a1a24] border border-purple-900">
                <h3 className="text-lg font-medium text-white">{questions[currentQuestion].question}</h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                    className={cn(
                      "p-4 rounded-lg text-left font-medium transition-all",
                      "bg-purple-600 hover:bg-purple-700", // Todos los botones del mismo color morado
                      selectedOption === index &&
                        isAnswered &&
                        (index === questions[currentQuestion].correctAnswer
                          ? "ring-2 ring-green-500"
                          : "ring-2 ring-red-500"),
                      isAnswered && index === questions[currentQuestion].correctAnswer && "ring-2 ring-green-500",
                      isAnswered && "opacity-80"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      {isAnswered && index === questions[currentQuestion].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-300" />
                      )}
                      {isAnswered && selectedOption === index && index !== questions[currentQuestion].correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Next button */}
              {isAnswered && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleNextQuestion} className="bg-purple-600 hover:bg-purple-700 text-white">
                    {currentQuestion < questions.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Contenedor de resultados con referencia para capturar */}
              <div
                ref={resultsRef}
                className="relative p-6 rounded-lg bg-[#1a1a24] border border-purple-900 overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute top-4 left-4 text-9xl font-bold text-purple-900/20 select-none">{score}</div>

                {/* Challenge header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="text-2xl font-bold text-white"></div>
                  <div className="text-yellow-400 font-mono font-bold">{title}</div>
                </div>

                {/* User info */}
                <div className="flex items-center gap-6 mb-6 relative z-10">
                  <div className="w-20 h-20 rounded-md overflow-hidden border-2 border-purple-500 bg-purple-800/50 flex items-center justify-center">
                    <Trophy className={`h-12 w-12 ${getTrophyColor()}`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{user}</h3>
                    <div className="flex mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`text-2xl ${i < Math.ceil((score / questions.length) * 5) ? "text-yellow-400" : "text-gray-600"}`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-300">{getTrophyText()}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                  <div className="bg-[#121218] rounded-md p-3 flex items-center justify-between">
                    <div className="text-gray-400 text-xl">★</div>
                    <div className="text-white font-mono">
                      {score}/{questions.length}
                    </div>
                  </div>
                  <div className="bg-[#121218] rounded-md p-3 flex items-center justify-between">
                    <div className="text-gray-400 text-xl">🏆</div>
                    <div className="text-white font-mono">{Math.round((score / questions.length) * 100)}%</div>
                  </div>
                  <div className="bg-[#121218] rounded-md p-3 flex items-center justify-between">
                    <div className="text-gray-400 text-xl">🎯</div>
                    <div className="text-white font-mono">
                      {score === questions.length
                        ? "¡Perfecto!"
                        : score >= questions.length / 2
                          ? "¡Bien!"
                          : "Intenta de nuevo"}
                    </div>
                  </div>
                </div>

                {/* Recommendations section */}
                {showRecommendations && (
                  <div className="mb-6 relative z-10">
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-800">
                      <h4 className="text-lg font-bold text-purple-300 mb-2 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {recommendations.title}
                      </h4>
                      <p className="text-gray-300 mb-3 text-sm">{recommendations.description}</p>
                      <div className="space-y-2">
                        {recommendations.resources.length > 0 &&
                          recommendations.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {resource.name}
                            </a>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-purple-800 pt-4 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-50 rounded-full p-2 pb-1">
                      <img src="/Logo_By.svg" alt="Logo by Pragma" />
                    </div>
                    <div className="text-purple-400 font-bold">Mundo Pragma</div>
                  </div>
                  <div className="text-purple-300 font-bold">TriviaScript</div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {showRecommendations ? "Ocultar Consejos" : "Ver Consejos"}
                  </span>
                </Button>
                <Button
                  onClick={downloadResultsAsImage}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Descargando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Descargar
                    </span>
                  )}
                </Button>
                <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Jugar de Nuevo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
