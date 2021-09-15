import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({
              html: data.error,
              classes: "#ff3d00 deep-orange accent-3",
            });
          } else {
            M.toast({
              html: "Post Created Successfully",
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-spm");
    data.append("cloud_name", "spm1001");
    fetch("https://api.cloudinary.com/v1_1/spm1001/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="card"
      style={{ maxWidth: "500px", margin: "30px auto", padding: "10px" }}
    >
      <div className="page-title">
        <h2 className="center">Create Post</h2>
      </div>

      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #ff3d00 deep-orange accent-3">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>

      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        type="text"
        placeholder="Post Description"
      />

      <button
        onClick={() => postDetails()}
        className="btn custom-btn waves-effect waves-light #ff3d00 deep-orange accent-3"
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
