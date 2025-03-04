"use client";

import React, { useEffect, useState } from "react";
import QuestionItem from "./questionItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";

const QuestionList = ({ questions, setQuestions }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, items[oldIndex]);

        return newItems;
      });
    }
  };

  const handleDelete = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };

  const handleAdd = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: uuidv4(),
        title: "Untitled question",
        options: [],
        type: "checkBoxes",
        required: false,
        isNew: true,
      },
    ]);
  };
  const updateTitle = (id, newTitle) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    );
  };

  const updateRequired = (id, isRequired) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, required: isRequired } : q
      )
    );
  };

  const updateType = (id, newType) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id
          ? {
              ...q,
              type: newType,
              options:
                newType === "checkBoxes" || newType === "multipleChoice"
                  ? q.options
                  : [],
            }
          : q
      )
    );
  };

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={questions}>
          {questions.map((question) => (
            <QuestionItem
              key={question.id}
              onDelete={handleDelete}
              question={question}
              setQuestions={setQuestions}
              updateTitle={updateTitle}
              updateRequired={updateRequired}
              updateType={updateType}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="mx-auto">
        <Button onClick={handleAdd} type="button" variant="secondary">
          Add Question
        </Button>
      </div>
    </>
  );
};

export default QuestionList;
