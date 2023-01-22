import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/configs";

const initialState: PostsState = {
  status: "idle", //  idle  |  succeeded | failed
  entities: [],
};

const postsCollectionRef = collection(db, "posts");
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkApi): Promise<Post[] | any> => {
    const { rejectWithValue } = thunkApi;
    console.log("----- **** fetch posts **** -------");
    try {
      const data = await getDocs(postsCollectionRef);
      const allPosts = data.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">),
      }));

      return allPosts as Post[];
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<PostsState["status"]>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPosts.pending, (state: PostsState, action) => {
      state.status = "idle";
    });
    builder.addCase(
      fetchPosts.fulfilled,
      (state: PostsState, action: PayloadAction<Post[]>) => {
        state.status = "succeeded";
        state.entities = action.payload;
      }
    );
    builder.addCase(fetchPosts.rejected, (state: PostsState, action) => {
      state.status = "failed";
    });
  },
});

export default postsSlice.reducer;

export const { changeStatus } = postsSlice.actions;
