import { useEffect, useState } from "react";
import { checkHeading, replaceHeading } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const Answer = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (typeof ans === "string" && checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeading(ans));
    }
  }, [ans]);

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          style={dark}
          PreTag="div"
          children={String(children).replace(/\n$/, "")}
        />
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  if (index === 0 && totalResult > 1) {
    return <span className="pt-2 block text-lg text-white">{answer}</span>;
  }
  if (heading) {
    return <span className="pt-2 block text-lg text-white">{answer}</span>;
  }

  return (
    <span className={type === "q" ? "pl-1" : "pl-5"}>
      <ReactMarkdown components={components}>{answer}</ReactMarkdown>
    </span>
  );
};

export default Answer;
