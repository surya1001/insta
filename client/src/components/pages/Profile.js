import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <div
        className="flex z-depth-3"
        style={{
          maxWidth: "700px",
          margin: "10px auto",
          padding: "10px",
        }}
      >
        <div style={{ width: "50%", textAlign: "center", marginRight: "30px" }}>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGR1bW15JTIwcHJvZmlsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ width: "50%", padding: "0 15px" }}>
          <h4 style={{ fontWeight: "500", textTransform: "capitalize" }}>
            {state ? state.name : "loading"}
          </h4>
          <div
            className="flex"
            style={{
              marginTop: "-10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div className="profile-count center">
              <div className="count">40</div>
              <div className="post-type">Posts</div>
            </div>
            <div className="profile-count center">
              <div className="count">965</div>
              <div className="post-type">Followers</div>
            </div>
            <div className="profile-count center">
              <div className="count">999</div>
              <div className="post-type">Followings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return (
            <>
              <img src={item.photo} key={item._id} className="gallery-item" />
            </>
          );
        })}

        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGR1bW15JTIwcHJvZmlsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          className="gallery-item"
          alt=""
        />
      </div>
    </div>
  );
};

export default Profile;
