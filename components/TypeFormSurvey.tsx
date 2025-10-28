"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  Label,
} from "@/components/ui";
import { toast } from "sonner";
import { getVisibleQuestions, Question } from "@/lib/surveyQuestions";

const getStringValue = (val: string | string[] | undefined): string => {
  if (typeof val === "string") return val;
  return "";
};

export default function TypeFormSurvey() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const saveSurveyResponse = useMutation(api.myFunctions.saveSurveyResponse);

  const visibleQuestions = getVisibleQuestions(answers);
  const totalQuestions = visibleQuestions.length;
  const currentQuestion = visibleQuestions[currentIndex] as Question | undefined;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Check if current question has been answered
  const hasAnswer = currentQuestion
    ? answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "" && 
      (Array.isArray(answers[currentQuestion.id]) ? (answers[currentQuestion.id] as string[]).length > 0 : true)
    : false;

  // Auto-forward after answer selection
  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Auto-forward to next question after a short delay
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    const currentValues = Array.isArray(answers[questionId]) ? answers[questionId] as string[] : [];

    let newValues;
    if (checked) {
      newValues = [...currentValues, optionId];
    } else {
      newValues = currentValues.filter((v: string) => v !== optionId);
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: newValues,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await saveSurveyResponse({
        age: typeof answers.age === "string" ? answers.age : undefined,
        gender: typeof answers.gender === "string" ? answers.gender : undefined,
        shoppingPreference: typeof answers.shoppingPreference === "string" ? answers.shoppingPreference : undefined,
        onlineShoppingFrequency: typeof answers.onlineShoppingFrequency === "string" ? answers.onlineShoppingFrequency : undefined,
        findClothes: typeof answers.findClothes === "string" ? answers.findClothes : undefined,
        socialMediaShopping: typeof answers.socialMediaShopping === "string" ? answers.socialMediaShopping : undefined,
        socialMediaPlatforms: Array.isArray(answers.socialMediaPlatforms) ? answers.socialMediaPlatforms : undefined,
        clothesFit: typeof answers.clothesFit === "string" ? answers.clothesFit : undefined,
        returnsProblem: typeof answers.returnsProblem === "string" ? answers.returnsProblem : undefined,
        misSizedItems: typeof answers.misSizedItems === "string" ? answers.misSizedItems : undefined,
        trustIssues: Array.isArray(answers.trustIssues) ? answers.trustIssues : undefined,
        colorMatchingUncertainty: typeof answers.colorMatchingUncertainty === "string" ? answers.colorMatchingUncertainty : undefined,
        imageUploadWillingness: typeof answers.imageUploadWillingness === "string" ? answers.imageUploadWillingness : undefined,
        tryOnFromSocialMedia: typeof answers.tryOnFromSocialMedia === "string" ? answers.tryOnFromSocialMedia : undefined,
        tryOnUseFrequency: typeof answers.tryOnUseFrequency === "string" ? answers.tryOnUseFrequency : undefined,
        tryOnBodyType: typeof answers.tryOnBodyType === "string" ? answers.tryOnBodyType : undefined,
        tryOnConcerns: Array.isArray(answers.tryOnConcerns) ? answers.tryOnConcerns : undefined,
        speedExpectation: typeof answers.speedExpectation === "string" ? answers.speedExpectation : undefined,
        skinToneAccuracy: typeof answers.skinToneAccuracy === "string" ? answers.skinToneAccuracy : undefined,
        virtualTryOn: typeof answers.virtualTryOn === "string" ? answers.virtualTryOn : undefined,
        arRealism: typeof answers.arRealism === "string" ? answers.arRealism : undefined,
        purchaseConfidence: typeof answers.purchaseConfidence === "string" ? answers.purchaseConfidence : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });
      toast.success("Survey submitted successfully! Thank you for your feedback.");
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <Card className="w-full max-w-2xl border-slate-200 dark:border-slate-800">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <motion.div
                className="text-6xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 100 }}
              >
                ✓
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-[#4169E1] dark:text-[#6495ED] mb-2">
                  Thank You!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Your survey response has been saved successfully.
                </p>
              </motion.div>
              <motion.p
                className="text-sm text-slate-500 dark:text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your insights help us build a better product for everyone.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => {
                    setCurrentIndex(0);
                    setAnswers({});
                    setIsCompleted(false);
                  }}
                  className="bg-[#4169E1] hover:bg-[#315AC1] text-white font-semibold"
                >
                  Take Survey Again
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 120, duration: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold text-[#4169E1] dark:text-[#6495ED] mb-2">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.description && (
                    <CardDescription className="text-base">
                      {currentQuestion.description}
                    </CardDescription>
                  )}
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                {currentQuestion.type === "radio" && (
                  <RadioGroup
                    value={getStringValue(answers[currentQuestion.id])}
                    onValueChange={handleAnswer}
                  >
                    <div className="space-y-4">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#4169E1] dark:hover:border-[#6495ED] hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all"
                        >
                          <RadioGroupItem value={option.value} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="font-normal cursor-pointer text-base flex-1"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          const isChecked = (answers[currentQuestion.id] || []).includes(option.id);
                          handleCheckboxChange(option.id, !isChecked);
                        }}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#4169E1] dark:hover:border-[#6495ED] hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all"
                      >
                        <Checkbox
                          id={option.id}
                          checked={
                            (answers[currentQuestion.id] || []).includes(option.id) || false
                          }
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(option.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={option.id}
                          className="font-normal cursor-pointer text-base flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "select" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Select
                      value={getStringValue(answers[currentQuestion.id])}
                      onValueChange={handleAnswer}
                    >
                      <SelectTrigger className="w-full text-base h-12">
                        <SelectValue placeholder="Select an option..." />
                      </SelectTrigger>
                      <SelectContent>
                        {currentQuestion.options.map((option) => (
                          <SelectItem key={option.id} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between gap-4 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1"
          >
            Back
          </Button>

          {currentIndex === totalQuestions - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !hasAnswer}
              className="flex-1 bg-[#4169E1] hover:bg-[#315AC1] text-white font-semibold disabled:bg-slate-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              disabled={!hasAnswer}
              className="flex-1 bg-[#4169E1] hover:bg-[#315AC1] text-white font-semibold disabled:bg-slate-400"
            >
              Next
            </Button>
          )}
        </motion.div>

        {/* Helper Text */}
        <motion.p
          className="text-center text-sm text-slate-500 dark:text-slate-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          Questions will auto-advance after you make a selection
        </motion.p>
      </motion.div>
    </div>
  );
}
