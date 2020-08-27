import React from "react";
import { observer } from "mobx-react";

import WishListItemView from "./WishListItemView";

const WishListView = ({ wishList }) => (
  <div className="list">
    <ul>
      {wishList.items.map((item: any, idx: any) => (
        <WishListItemView key={idx} item={item} />
      ))}
    </ul>
    Total: {wishList.totalPrice}
  </div>
);

export default observer(WishListView);
