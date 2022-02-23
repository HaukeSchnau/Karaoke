import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./SearchPrompt.css";
import { Song } from "./types";

function SearchPrompt() {
  const timeoutHandle = useRef(0);
  const [results, setResults] = useState([]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timeoutHandle.current) clearTimeout(timeoutHandle.current);

    const handle = setTimeout(async () => {
      const url = new URL("http://localhost:3000/api/search");
      url.search = new URLSearchParams({ q: e.target.value }).toString();
      const res = await fetch(url.toString()).then((res) => res.json());
      console.log(res);
      setResults(res);
    }, 1000);
    timeoutHandle.current = handle;
  }

  function renderItem(item: Song) {
    const img = item.images.sort((a, b) => b.width - a.width)[0];

    return (
      <li className="preview-song">
        <Link to={`/song/${item.id}`}>
          <img src={img.url} />
          <div className="title">{item.name}</div>
          <div className="artist">{item.artists[0]}</div>
        </Link>
      </li>
    );
  }

  return (
    <div className="search-prompt-root">
      <h1>Welchen Song möchtest du singen?</h1>
      <div className="search-container">
        <input
          className="search-bar"
          placeholder="Suche einen Song, Künstler oder Album..."
          onChange={onChange}
          autoFocus
        />
        {results && !!results.length && (
          <ul className="results-preview">{results.map(renderItem)}</ul>
        )}
      </div>
    </div>
  );
}

export default SearchPrompt;
