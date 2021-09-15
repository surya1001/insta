import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/allPosts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.message);
      })
      .catch((err) => console.log(err));
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId, text }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletPost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div
            className="card home-card"
            key={item._id}
            style={{ marginTop: "20px" }}
          >
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h5>{item.postedBy.name}</h5>
              {item.postedBy._id === state._id ? (
                <i
                  onClick={() => deletPost(item._id)}
                  className="material-icons"
                  style={{
                    margin: "15px",
                    cursor: "pointer",
                    color: "orangered",
                  }}
                >
                  delete
                </i>
              ) : (
                ""
              )}
            </div>

            <div className="card-img">
              <img src={item.photo} alt={item.body.split(" ")} />
            </div>
            <div className="card-content">
              <p>{item.body}</p>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons dislike-icon"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons like-icon"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <span style={{ margin: "5px" }}>{item.likes.length} likes</span>

              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input
                  type="text"
                  placeholder="Add Comment"
                  style={{ width: "80%" }}
                />
                <span>
                  <button type="submit">
                    <i
                      className="material-icons"
                      style={{
                        color: "white",
                        background: "orangered",
                        padding: "5px 10px",
                        border: "none !important",
                        outline: "none !important",
                      }}
                    >
                      send
                    </i>
                  </button>
                </span>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
