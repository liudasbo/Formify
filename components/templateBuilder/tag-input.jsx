"use client";

import React, { useCallback, useState } from "react";
import { ReactTags } from "react-tag-autocomplete";
import { Input } from "../ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import * as z from "zod";
import { matchSorter } from "match-sorter";

function TagInput({ onTagsChange }) {
  // Validation
  const [error, setError] = useState("");

  const tagSchema = z.object({
    label: z
      .string()
      .min(1, "Tag can't be empty")
      .max(15, "Tag can't be longer than 15 characters")
      .refine((value) => value.trim().length > 0, {
        message: "Tag can't be just spaces",
      }),
  });

  function validateTag(tag) {
    const result = tagSchema.safeParse(tag);

    if (result.success) {
      return true;
    } else {
      setError(result.error.errors[0].message);
      return false;
    }
  }

  const [selected, setSelected] = useState([]);

  const initialSuggestions = [
    { value: 3, label: "Bananas" },
    { value: 4, label: "Mangos" },
    { value: 5, label: "Lemons" },
  ];

  const [suggestions, setSuggestions] = useState(initialSuggestions);

  function onAdd(newTag) {
    const isTagAlreadyAdded = selected.some(
      (tag) => tag.label === newTag.label
    );

    if (isTagAlreadyAdded) {
      setError("Tag has already been added");
      return;
    }

    if (selected.length >= 10) {
      setError(`You can only add up to 10 tags`);
      return;
    }

    if (validateTag(newTag)) {
      const updatedSelected = [...selected, newTag];
      setSelected(updatedSelected);
      setSuggestions(
        suggestions.filter((suggestion) => suggestion.value !== newTag.value)
      );
      onTagsChange(updatedSelected);
      setError("");
    }
  }

  const onDelete = useCallback(
    (tagIndex) => {
      const updatedSelected = selected.filter((_, i) => i !== tagIndex);
      setSelected(updatedSelected);
      onTagsChange(updatedSelected);
    },
    [selected, onTagsChange]
  );

  function CustomInput({ classNames, inputWidth, ...inputProps }) {
    return <Input style={{ width: "100%" }} {...inputProps} />;
  }

  function CustomTag({ classNames, tag, ...tagProps }) {
    return (
      <Badge type="button">
        <span className={classNames.tagName}>{tag.label}</span>
        <X size={12} {...tagProps} className="ml-1 cursor-pointer" />
      </Badge>
    );
  }

  function CustomTagList({ children, classNames, ...tagListprops }) {
    return (
      <ul className="flex gap-2 mb-2 flex-wrap" {...tagListprops}>
        {React.Children.map(children, (child) => (
          <li className={classNames.tagListItem} key={child.key}>
            {child}
          </li>
        ))}
      </ul>
    );
  }

  function CustomOption({ children, classNames, option, ...optionProps }) {
    const classes = [
      classNames.option,
      "cursor-pointer text-sm rounded-lg hover:bg-muted p-1 px-2 mt-1",
      option.active ? "is-active" : "bg-transparent ",
      option.selected ? "is-selected" : "bg-muted",
    ];

    return (
      <div className={classes.join(" ")} {...optionProps}>
        {children}
      </div>
    );
  }

  function CustomListBox({ children, classNames, ...listBoxProps }) {
    return (
      <div className="border rounded-lg p-1 shadow" {...listBoxProps}>
        {children}
      </div>
    );
  }

  function onShouldExpand(value) {
    return value.length > 0;
  }

  const [value, setValue] = useState("");

  function onInput(value) {
    setValue(value);
    if (value.length === 0) {
      setSuggestions([]);
    } else {
      const filteredSuggestions = initialSuggestions.filter((suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      const filteredOutSelected = filteredSuggestions.filter(
        (suggestion) => !selected.some((tag) => tag.value === suggestion.value)
      );
      setSuggestions(filteredOutSelected);
    }
  }

  function suggestionsTransform(value, suggestions) {
    if (value.length < 2) return [];

    return matchSorter(suggestions, value, { keys: ["label"] });
  }

  return (
    <>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <ReactTags
        suggestionsTransform={suggestionsTransform}
        labelText={false}
        selected={selected}
        allowNew={true}
        onAdd={onAdd}
        suggestions={suggestions}
        onDelete={onDelete}
        noOptionsText="No matching countries"
        renderInput={CustomInput}
        renderTag={CustomTag}
        renderTagList={CustomTagList}
        renderOption={CustomOption}
        collapseOnSelect={true}
        allowBackspace={false}
        activateFirstOption={true}
        renderListBox={CustomListBox}
        onShouldExpand={onShouldExpand}
        onInput={onInput}
      />
    </>
  );
}

export default TagInput;
