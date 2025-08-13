import React from "react";

function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem, e) => {
    e.stopPropagation();
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    localStorage.setItem("history", JSON.stringify(history));
    setRecentHistory(history);
  };

  return (
    <aside className="col-span-1 dark:bg-zinc-800 bg-red-100 pt-3 flex flex-col h-full">
      <div className="flex justify-between items-center px-5 mb-2">
        <h1 className="text-xl dark:text-white text-zinc-800">Recent Search</h1>
        <button
          onClick={clearHistory}
          className="cursor-pointer p-1 rounded hover:bg-zinc-700"
          aria-label="Clear All History"
          title="Clear All History"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            width="20px"
            fill="#e3e3e3"
            viewBox="0 -960 960 960"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </div>

      <ul className="flex-1 overflow-auto px-5 space-y-1 scrollbar-hide">
        {recentHistory.length === 0 && (
          <p className="text-center dark:text-zinc-400 text-zinc-600 mt-10 select-none">
            No recent searches
          </p>
        )}
        {recentHistory.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center cursor-pointer truncate dark:text-zinc-400 text-zinc-700 hover:bg-red-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 rounded px-2 py-1"
            onClick={() => setSelectedHistory(item)}
            title={item}
          >
            <span className="truncate">{item}</span>
            <button
              onClick={(e) => clearSelectedHistory(item, e)}
              className="p-1 ml-3 rounded hover:bg-zinc-900 bg-zinc-700"
              aria-label={`Delete ${item} from history`}
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                width="20px"
                fill="#e3e3e3"
                viewBox="0 -960 960 960"
              >
                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default RecentSearch;
