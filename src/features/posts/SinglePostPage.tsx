import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useAppSelector } from "../../utils/hooks";
import PostsExcerpt from "./PostsExcerpt";
import { useAppDispatch } from "./../../utils/hooks";
import { fetchPosts } from "./../../store/slice/postsSlice";

const SinglePostPage = () => {
  const { id } = useParams();
  const posts = useAppSelector((state) => state.posts.entities);
  const status = useAppSelector((state) => state.posts.status);
  const post = posts.find((post) => post.id === id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [dispatch]);

  if (status === "idle") {
    return <Loading />;
  }
  if (!post) {
    return (
      <p>
        There is no post, you can go to the <Link to="/">homepage</Link>{" "}
      </p>
    );
  }

  const { content } = post;
  return (
    <>
      <PostsExcerpt post={post} singlePostPage />
      <p>{content}</p>
    </>
  );
};

export default SinglePostPage;
