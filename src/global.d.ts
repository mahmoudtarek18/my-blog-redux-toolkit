type Post = {
  id: string;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: string;
  createdDate: string;
  imgUrl: string;
  category: string;
};

type AuthState = {
  email: string | null;
  userName: string | null;
  userID: string | null;
};

type PostsState = {
  status: "idle" | "succeeded" | "failed";
  entities: Post[];
};

type AppState = {
  auth: AuthState;
  posts: PostsState;
};
