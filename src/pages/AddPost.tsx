import { addDoc, collection } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../firebase/configs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./../firebase/configs";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { changeStatus } from "../store/slice/postsSlice";

const AddPost = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("lifestyle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const userName = useAppSelector((state) => state.auth.userName);
  const userId = useAppSelector((state) => state.auth.userID);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const postsCollectionRef = collection(db, "posts");
  const addPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName?.trim() && !content?.trim()) {
      return;
    }

    await addDoc(postsCollectionRef, {
      title,
      content,
      author: {
        name: userName,
        id: userId,
      },
      createdDate: new Date().toISOString(),
      imgUrl,
      category,
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    setUploadProgress(0);

    toast.success("Product uploaded successfully.");
    navigate("/posts");
    dispatch(changeStatus("idle"));
  };

  const uploadImageHandler = () => {
    uploadInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${nanoid()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          toast.success("Image uploaded successfully.");
        });
      }
    );
  };

  return (
    <div className="add-post-wrapper">
      <form onSubmit={addPostHandler}>
        <div className="input-wrapper">
          <label htmlFor="category">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="lifestyle">Lifestyle</option>
            <option value="tech">Tech</option>
            <option value="travel">Travel</option>
          </select>
        </div>
        <div className="input-wrapper upload-input-wrapper">
          <label htmlFor="image">Post Image</label>
          <button
            type="button"
            className="img-wrapper"
            onClick={uploadImageHandler}
          >
            <FaCloudUploadAlt />
          </button>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="upload-input"
            ref={uploadInputRef}
            required
            onChange={handleImageChange}
          />
          {uploadProgress === 0 ? null : (
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress < 100
                  ? `Uploading ${uploadProgress}`
                  : `Upload Complete ${uploadProgress}%`}
              </div>
            </div>
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="content">Content</label>
          <textarea
            id="Content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Content"
            required
          />
        </div>
        <button>Add Post</button>
      </form>
    </div>
  );
};

export default AddPost;
