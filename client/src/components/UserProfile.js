import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  const { userid } = useParams();
  console.log(userid);

  useEffect(() => {
    fetch(`user/${userid}`, {
      headers: {
        Authorization: "Bearer +" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>{userid}</h1>
    </div>
  );
};

export default UserProfile;
