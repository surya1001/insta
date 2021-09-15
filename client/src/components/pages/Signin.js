import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginClick = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "#ff3d00 deep-orange accent-3",
          });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          dispatch({ type: "USER", payload: data.user });

          M.toast({
            html: "Signed In Success",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2 className="page-title">Signin Page</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />

          <button
            onClick={() => loginClick()}
            className="btn custom-btn waves-effect waves-light #ff3d00 deep-orange accent-3"
          >
            Signin
          </button>
          <h6>
            Don't have an account?&nbsp;
            <Link to="/signup" className="alt-link">
              Signup
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Signin;
