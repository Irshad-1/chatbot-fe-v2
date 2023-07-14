import { configureStore } from "@reduxjs/toolkit";


import loader from "./Loader";


const store = configureStore({
    reducer: {
        loader: loader.reducer,
    },
});

export default store;
