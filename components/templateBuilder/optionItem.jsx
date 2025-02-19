"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const OptionItem = ({ option, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <GripVertical
        {...attributes}
        {...listeners}
        size={16}
        className="cursor-move"
      />
      <Checkbox disabled />
      <Input
        defaultValue={option.value}
        className="border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
      />
      <div
        onClick={() => onDelete(option.id)}
        className="cursor-pointer hover:bg-accent p-2 rounded"
      >
        <X size={16} />
      </div>
    </div>
  );
};

export default OptionItem;
