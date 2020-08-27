import React, { Component } from "react";
import { observer } from "mobx-react";
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree";

import WishListItemEdit from "./WishListItemEdit";

class WishListItemView extends Component {
  props: any;
  state: any;
  constructor(props: any) {
    super(props);
    this.props = props;
    this.state = { isEditing: false };
  }
  render(): any {
    const { item } = this.props;
    return this.state.isEditing ? (
      this.renderEditable()
    ) : (
      <li className="item">
        {item.image && <img src={item.image} />}
        <h3>{item.name}</h3>
        <span>{item.price}</span>
        <span>
          <button onClick={this.onToggleEdit}>✏️ </button>
          <button onClick={item.remove}>✖️</button>
        </span>
      </li>
    );
  }
  renderEditable() {
    return (
      <li className="item">
        <WishListItemEdit item={this.state.clone} />
        <button onClick={this.onSaveEdit}>💾</button>
        <button onClick={this.onCancelEdit}>✖️</button>
      </li>
    );
  }
  onToggleEdit = () => {
    //clone to create a full, deep clone of any model instance
    this.setState({ isEditing: true, clone: clone(this.props.item) });
  };
  onCancelEdit = () => {
    this.setState({ isEditing: false });
  };
  onSaveEdit = () => {
    //applySnapshot to update the state of a model instance given a snapshot.
    applySnapshot(this.props.item, getSnapshot(this.state.clone));
    this.setState({ isEditing: false, clone: null });
  };
}

export default observer(WishListItemView);
