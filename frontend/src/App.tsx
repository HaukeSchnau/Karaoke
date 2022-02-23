import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchPrompt from "./routes/SearchPrompt";
import SongView from "./routes/SongView";

const App: React.FC = () => {
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
};

export default App;
