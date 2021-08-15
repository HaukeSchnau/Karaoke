import React, { useState } from "react";
import "./App.css";
import SearchPrompt from "./SearchPrompt";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SongView from "./SongView";

function App() {
  return (
    <Router>
      <div className="root" id="app-root">
        <div className="container">
          <Switch>
            <Route path="/" exact>
              <SearchPrompt />
            </Route>
            <Route path="/song/:id">
              <SongView />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
