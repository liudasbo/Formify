import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const data = await req.json();
    const { templateId, answers } = data;

    let form = await db.form.findFirst({
      where: {
        templateId: templateId,
        userId: userId,
      },
    });

    if (!form) {
      form = await db.form.create({
        data: {
          templateId: templateId,
          userId: userId,
          createdAt: new Date(),
        },
      });
    }

    const createdOrUpdatedAnswers = await Promise.all(
      answers.flatMap(async (answer) => {
        const question = await db.question.findUnique({
          where: { id: answer.questionId },
        });

        if (!question) {
          throw new Error(`Question with id ${answer.questionId} not found`);
        }

        const existingAnswers = await db.answer.findMany({
          where: {
            formId: form.id,
            questionId: answer.questionId,
          },
        });

        if (question.type === "shortAnswer" || question.type === "paragraph") {
          // Update or create text answers
          const textValue = Array.isArray(answer.answer)
            ? answer.answer[0]
            : answer.answer;
          const existingAnswer = existingAnswers[0];

          if (existingAnswer) {
            return db.answer.update({
              where: { id: existingAnswer.id },
              data: {
                textValue: textValue,
                intValue: null,
                optionId: null,
              },
            });
          } else {
            return db.answer.create({
              data: {
                formId: form.id,
                questionId: answer.questionId,
                textValue: textValue,
                intValue: null,
                optionId: null,
              },
            });
          }
        } else if (question.type === "positiveInteger") {
          // Update or create integer answers
          const intValue = parseInt(answer.answer, 10);
          const existingAnswer = existingAnswers[0];

          if (existingAnswer) {
            return db.answer.update({
              where: { id: existingAnswer.id },
              data: {
                textValue: null,
                intValue: intValue,
                optionId: null,
              },
            });
          } else {
            return db.answer.create({
              data: {
                formId: form.id,
                questionId: answer.questionId,
                textValue: null,
                intValue: intValue,
                optionId: null,
              },
            });
          }
        } else {
          // Update or create option answers
          const newOptionIds = Array.isArray(answer.answer)
            ? answer.answer
            : [answer.answer];

          const updatedAnswers = await Promise.all(
            newOptionIds.map(async (optionId) => {
              if (typeof optionId === "string") {
                throw new Error(`Invalid optionId value: ${optionId}`);
              }

              const existingAnswer = existingAnswers.find(
                (ea) => ea.optionId === optionId
              );

              if (existingAnswer) {
                return db.answer.update({
                  where: { id: existingAnswer.id },
                  data: {
                    textValue: null,
                    intValue: null,
                    optionId: optionId,
                  },
                });
              } else {
                return db.answer.create({
                  data: {
                    formId: form.id,
                    questionId: answer.questionId,
                    textValue: null,
                    intValue: null,
                    optionId: optionId,
                  },
                });
              }
            })
          );

          // Delete answers that are no longer selected
          const deletedAnswers = await Promise.all(
            existingAnswers
              .filter((ea) => !newOptionIds.includes(ea.optionId))
              .map((ea) => db.answer.delete({ where: { id: ea.id } }))
          );

          return [...updatedAnswers, ...deletedAnswers];
        }
      })
    );

    return NextResponse.json({
      message: "Form and answers submitted successfully!",
      form,
      createdOrUpdatedAnswers,
    });
  } catch (error) {
    console.error("Error submitting form and answers:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
