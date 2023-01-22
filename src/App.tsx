import "./App.css";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import Layout from "./components/Layout";
import PostsList from "./features/posts/PostsList";
import UsersList from "./features/users/UsersList";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SinglePostPage from "./features/posts/SinglePostPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PostsList />} />
          <Route path="post/:id" element={<SinglePostPage />} />
          {/* <Route path="add-post" element={<AddPost />} /> */}
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
