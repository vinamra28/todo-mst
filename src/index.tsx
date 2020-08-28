import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";

import { Group } from "./models/Group";
import { getSnapshot, addMiddleware } from "mobx-state-tree";

let initialState: any = {
  users: {
    a342: {
      id: "a342",
      name: "Homer",
      gender: "m",
    },
    "5fc2": {
      id: "5fc2",
      name: "Marge",
      gender: "f",
    },
    "663b": {
      id: "663b",
      name: "Bart",
      gender: "m",
    },
    "65aa": {
      id: "65aa",
      name: "Maggie",
      gender: "f",
    },
    ba32: {
      id: "ba32",
      name: "Lisa",
      gender: "f",
    },
  },
};

let group = Group.create(initialState);
/**
 * to see the working of generators
 * [action] remove
 * [action] getSuggestions
 * [flow_spawn] getSuggestions
 * [flow_resume] getSuggestions
 * [flow_return] getSuggestions
 */
addMiddleware(group, (call, next) => {
  console.log(`[${call.type}] ${call.name}`);
  return next(call);
});

function renderApp() {
  ReactDOM.render(<App group={group} />, document.getElementById("root"));
}

//intial render of the application
renderApp();

//hot module reload
if (module.hot) {
  module.hot.accept(["./components/App"], () => {
    // new components
    renderApp();
  });
  module.hot.accept(["./models/Group"], () => {
    const snapshot = getSnapshot(group);
    group = Group.create(snapshot);
    renderApp();
  });
}
