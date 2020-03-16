import React, { Component } from "react";

import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import { createBrowserHistory } from "history";
const hist = createBrowserHistory();

export default class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      status: 0
    };
    this.changeStatus = this.changeStatus.bind(this);
  }
  changeStatus(value) {
    this.setState({
      status: value
    });
    console.log(value);
  }
  componentDidMount() {
    this.setState({
      status: 0
    });
  }
  render() {
    return (
      <div>
        {this.state.status === 0 && (
          <MyProfile changeStatus={this.changeStatus}></MyProfile>
        )}
        {this.state.status === 1 && (
          <EditProfile changeStatus={this.changeStatus}></EditProfile>
        )}
        {/* <BrowserRouter>
          <Route path="/admin/myprofile" exact component={MyProfile}></Route>
          <Route path="/admin/myprofile/edit" exact component={EditProfile} />
        </BrowserRouter> */}
      </div>
    );
  }
}
