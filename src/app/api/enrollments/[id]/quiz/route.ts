import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";
import { quizSubmissionSchema } from "@/lib/validators";

interface QuizOption {
  text: string;
  isCorrect: boolean;
  order?: number;
}

interface QuizQuestion {
  questionText: string;
  questionType: string;
  options: QuizOption[];
  explanation?: string;
  order?: number;
}

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = quizSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();

    const enrollment = await Enrollment.findById(params.id);
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    if (enrollment.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch quiz content
    const content = await LessonContent.findOne({
      courseId: enrollment.courseId,
      lessonId: parsed.data.lessonId,
      type: "quiz",
    }).lean();

    if (!content || !content.quizData) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    const quiz = content.quizData;
    const questions = quiz.questions as QuizQuestion[];
    let correctCount = 0;

    const results = questions.map((q: QuizQuestion, idx: number) => {
      const answer = parsed.data.answers.find(
        (a) => a.questionIndex === idx
      );
      const selectedOptions = answer?.selectedOptions || [];

      // Get indices of correct options
      const correctIndices = q.options
        .map((opt, i) => (opt.isCorrect ? i : -1))
        .filter((i) => i >= 0);

      // Check if selected options match correct options exactly
      const isCorrect =
        selectedOptions.length === correctIndices.length &&
        selectedOptions.every((s) => correctIndices.includes(s)) &&
        correctIndices.every((c) => selectedOptions.includes(c));

      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        correct: isCorrect,
        explanation: q.explanation || "",
      };
    });

    const score =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;
    const passed = score >= quiz.passingScore;

    // If passed, mark lesson as complete
    if (passed) {
      const lessonIdStr = parsed.data.lessonId;
      if (!enrollment.completedLessons.includes(lessonIdStr)) {
        enrollment.completedLessons.push(lessonIdStr);

        // Recalculate progress
        const course = await Course.findById(enrollment.courseId);
        if (course) {
          const totalLessons = course.modules.reduce(
            (acc: number, m: { lessons: unknown[] }) =>
              acc + m.lessons.length,
            0
          );
          enrollment.progress =
            totalLessons > 0
              ? Math.round(
                  (enrollment.completedLessons.length / totalLessons) * 100
                )
              : 0;

          if (
            enrollment.progress === 100 &&
            enrollment.status !== "completed"
          ) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();
          }
        }

        await enrollment.save();
      }
    }

    return NextResponse.json({
      score,
      passed,
      passingScore: quiz.passingScore,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      results,
      progress: enrollment.progress,
      enrollmentStatus: enrollment.status,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
