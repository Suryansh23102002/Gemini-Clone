import { useEffect, useRef, useState } from "react";
import "./App.css";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

const fullUrl = import.meta.env.VITE_FULL_URL;

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState("dark");

  const askQuestion = async () => {
    const query = question.trim() || selectedHistory.trim();
    if (!query) return;

    // Update history without duplicates and limit 20
    const formatted = query.charAt(0).toUpperCase() + query.slice(1);
    let newHistory = [
      formatted,
      ...recentHistory.filter((h) => h !== formatted),
    ];
    newHistory = newHistory.slice(0, 20);

    localStorage.setItem("history", JSON.stringify(newHistory));
    setRecentHistory(newHistory);

    const payload = {
      contents: [
        {
          parts: [{ text: query }],
        },
      ],
    };

    try {
      setLoader(true);

      if (!fullUrl) {
        alert("API URL is not set. Please check your environment variables.");
        setLoader(false);
        return;
      }

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("API returned status:", response.status, response.statusText);
        alert(`API Error: ${response.status} ${response.statusText}`);
        setLoader(false);
        return;
      }

      const data = await response.json();

      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid API response structure");
      }

      let dataString = data.candidates[0].content.parts[0].text;
      dataString = dataString
        .split("* ")
        .map((item) => item.trim())
        .filter(Boolean);

      setResult((prev) => [
        ...prev,
        { type: "q", text: query },
        { type: "a", text: dataString },
      ]);

      setQuestion("");
      setSelectedHistory("");

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("API error:", err);
      alert("Failed to get a response. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className="grid grid-cols-5 h-screen text-center">
        <select
          onChange={(e) => setDarkMode(e.target.value)}
          value={darkMode}
          className="fixed bottom-0 dark:bg-zinc-800 bg-red-100 dark:text-white p-5"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />

        <main className="col-span-4 p-10 flex flex-col">
          <h1 className="text-5xl leading-snug bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 mb-6">
            Hello User, Ask me Anything
          </h1>

          <div
            ref={scrollToAns}
            className="container flex-1 overflow-y-auto mb-4 scrollbar-hide"
          >
            <ul className="dark:text-zinc-300 text-zinc-700 space-y-3">
              {result.map((item, idx) => (
                <QuestionAnswer
                  key={`${item.type}-${idx}`}
                  item={item}
                  index={idx}
                />
              ))}
            </ul>
          </div>

          {loader && (
            <div role="status" className="mb-2">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {/* Your original search input UI */}
          <div className="dark:bg-zinc-800 bg-red-100 pr-5 p-1 w-1/2 dark:text-white m-auto rounded-4xl border border-zinc-700 flex h-16">
            <input
              type="text"
              value={question}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything"
              className="w-full h-full p-3 outline-none"
            />
            <button onClick={askQuestion}>Ask</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
