import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";

import { WishList } from "./models/WishList";
import { getSnapshot } from "mobx-state-tree";

let initialState: any = {
  items: [
    {
      name: "LEGO Mindstorms EV3",
      price: 20,
      image:
        "https://images-na.ssl-images-amazon.com/images/I/71CpQw%2BufNL._SL1000_.jpg",
    },
    {
      name: "Miracles - C.S. Lewis",
      price: 12,
      image:
        "https://images-na.ssl-images-amazon.com/images/I/51a7xaMpneL._SX329_BO1,204,203,200_.jpg",
    },
  ],
};

// if (localStorage.getItem("wishlistapp")) {
//   const json: JSON = JSON.parse(localStorage.getItem("wishlistapp") || "{}");
//   if (WishList.is(json)) initialState = json;
// }

let wishList = WishList.create(initialState);

// onSnapshot(wishList, (snapshot) => {
//   localStorage.setItem("wishlistapp", JSON.stringify(snapshot));
// });

function renderApp() {
  ReactDOM.render(<App wishList={wishList} />, document.getElementById("root"));
}

//intial render of the application
renderApp();

//hot module reload
if (module.hot) {
  module.hot.accept(["./components/App"], () => {
    // new components
    renderApp();
  });
  module.hot.accept(["./models/WishList"], () => {
    // new model definitions
    const snapshot = getSnapshot(wishList);
    wishList = WishList.create(snapshot);
    renderApp();
  });
}
