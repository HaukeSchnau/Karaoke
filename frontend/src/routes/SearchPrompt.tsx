import React, { useState } from "react";
import Suggestion from "../components/Suggestion";
import { useDebounce } from "../hooks/useDebounce";
import "./SearchPrompt.css";

const SearchPrompt: React.FC = () => {
  const [results, setResults] = useState([]);

  const debounce = useDebounce(async (e) => {
    const url = new URL("http://localhost:3000/api/search");
    url.search = new URLSearchParams({ q: e.target.value }).toString();
    const res = await fetch(url.toString()).then((res) => res.json());
    console.log(res);
    setResults(res);
  });

  return (
    <div className="search-prompt-root">
      <h1>Welchen Song möchtest du singen?</h1>
      <div className="search-container">
        <input
          className="search-bar"
          placeholder="Suche einen Song, Künstler oder Album..."
          onChange={debounce}
          autoFocus
        />
        {results && !!results.length && (
          <ul className="results-preview">
            {results.map((item) => (
              <Suggestion song={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPrompt;
