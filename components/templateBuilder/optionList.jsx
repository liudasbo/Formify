"use client";

import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import OptionItem from "./optionItem";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const OptionList = ({ question, setQuestions }) => {
  const { id: questionId, options } = question;

  const handleUpdateOptions = (newOptions) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, options: newOptions } : q
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex((item) => item.id === active.id);
      const newIndex = options.findIndex((item) => item.id === over.id);

      const newOptions = [...options];
      newOptions.splice(oldIndex, 1);
      newOptions.splice(newIndex, 0, options[oldIndex]);

      handleUpdateOptions(newOptions);
    }
  };

  const handleAdd = () => {
    const newOption = {
      id: options.length + 1,
      value: "Untitled option",
    };

    handleUpdateOptions([...options, newOption]);
  };

  const handleDeleteOption = (optionId) => {
    console.log("delete option", optionId);
    const newOptions = options.filter((option) => option.id !== optionId);
    handleUpdateOptions(newOptions);
  };

  const handleUpdateOptionValue = (optionId, newValue) => {
    const newOptions = options.map((option) =>
      option.id === optionId ? { ...option, value: newValue } : option
    );
    handleUpdateOptions(newOptions);
  };

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={options}>
          {options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              onDelete={handleDeleteOption}
              onUpdateValue={handleUpdateOptionValue}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex">
        <p
          onClick={handleAdd}
          className="text-sm text-muted-foreground border-b border-transparent hover:border-muted-foreground hover:border-b px-2 cursor-pointer"
        >
          Add option
        </p>
      </div>
    </>
  );
};

export default OptionList;
