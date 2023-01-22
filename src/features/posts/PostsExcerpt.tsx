import React from "react";
import { Link } from "react-router-dom";

const PostsExcerpt = ({
  post,
  singlePostPage,
}: {
  post: Post;
  singlePostPage?: boolean;
}) => {
  const { id, author, createdDate, category, imgUrl, title } = post;
  return (
    <div className={`post-container ${singlePostPage ? "single-post" : ""}`}>
      <img className="post-img" alt={title} src={imgUrl} loading="lazy" />
      <h5 className="category">
        <span>in</span> {category}
      </h5>
      <h1 className="title">
        {singlePostPage ? title : <Link to={`/post/${id}`}>{title}</Link>}
      </h1>
      <h5 className="author">
        <span>by</span> {author.name}
      </h5>
      <span className="date">
        {new Intl.DateTimeFormat("en-IN", {
          dateStyle: "long",
        }).format(new Date(createdDate))}
      </span>
    </div>
  );
};

export default PostsExcerpt;
