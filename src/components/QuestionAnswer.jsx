import React from "react";
import Answer from "./Answer";

function QuestionAnswer({ item, index }) {
  if (item.type === "q") {
    return (
      <div
        className="flex justify-end"
        key={`q-${index}`}
      >
        <li
          className="text-right p-2 dark:bg-zinc-700 bg-red-100 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl max-w-lg break-words"
          key={`q-li-${index}`}
        >
          <Answer ans={item.text} totalResult={1} index={index} type={item.type} />
        </li>
      </div>
    );
  } else if (item.type === "a" && Array.isArray(item.text)) {
    return (
      <div key={`a-${index}`} className="max-w-lg break-words">
        {item.text.map((ansItem, ansIndex) => (
          <li
            className="text-left p-2 dark:text-zinc-300 text-zinc-700"
            key={`a-li-${ansIndex}`}
          >
            <Answer
              ans={ansItem}
              totalResult={item.text.length}
              index={ansIndex}
              type={item.type}
            />
          </li>
        ))}
      </div>
    );
  }

  return null;
}

export default QuestionAnswer;
