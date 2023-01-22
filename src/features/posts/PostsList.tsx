import React, { useState, useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { useAppSelector, useAppDispatch } from "./../../utils/hooks";
import Loading from "./../../components/Loading";
import { fetchPosts } from "./../../store/slice/postsSlice";

const itemPerPage = 6;
const PostsList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [user, setUser] = useState("all");
  const [users, setUsers] = useState(["all"]);
  const [sort, setSort] = useState("latest");
  let [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Post[]>([]);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.entities);
  const status = useAppSelector((state) => state.posts.status);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPosts(
      [...posts].sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      )
    );

    const users = [...posts]
      .map((el) => el.author.name)
      .filter((el, i, a) => a.indexOf(el) === i);
    setUsers(["all", ...users]);
  }, [posts]);

  useEffect(() => {
    let sortedPosts = [...posts].filter((post) => {
      let catCondition = category === "all" ? true : post.category === category;
      let userCondition = user === "all" ? true : post.author.name === user;

      return (
        post.title.toLowerCase().includes(search.toLowerCase()) &&
        catCondition &&
        userCondition
      );
    });

    if (sort === "a-z") {
      sortedPosts = sortedPosts.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
    } else if (sort === "z-a") {
      sortedPosts = sortedPosts.sort((a, b) =>
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      );
    } else if (sort === "latest") {
      sortedPosts = sortedPosts.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    }

    setCurrentPage(1);

    setFilteredPosts(sortedPosts);
  }, [sort, search, category, user]);

  useEffect(() => {
    const newItems = filteredPosts.slice(
      (currentPage - 1) * itemPerPage,
      itemPerPage * currentPage
    );
    setItems(newItems);
  }, [filteredPosts, currentPage]);

  return (
    <div>
      {status === "idle" ? (
        <Loading />
      ) : status === "succeeded" ? (
        <>
          <div className="filters-wrapper">
            <div className="filter">
              <label htmlFor="category">title</label>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                type="search"
                placeholder="Search By Post Title"
              />
            </div>
            <div className="filter">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="tech">Tech</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <div className="filter">
              <label htmlFor="user">User</label>

              <select
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="sort">Sort</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="" disabled>
                  Choose an option
                </option>
                <option value="latest">Latest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
          <div className="posts-wrapper">
            {items.map((post) => (
              <PostsExcerpt key={post.id} post={post} />
            ))}
          </div>
          <div className="pagination-wrapper">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              style={{ marginRight: "20px" }}
            >
              prev
            </button>

            <button
              disabled={
                currentPage === Math.ceil(filteredPosts.length / itemPerPage) ||
                items.length === 0
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              next
            </button>
          </div>
        </>
      ) : (
        <p>error</p>
      )}
    </div>
  );
};

export default PostsList;
