import { createSlice } from '@reduxjs/toolkit';

const loader = createSlice({
    name: 'loader',
    initialState: {
        loader: false,
    },
    reducers: {
        loaderStart(values, action) {
            values.loader = true;

        },
        loaderStop(values, action) {
            values.loader = false;

        }
    }
})

export const LoaderAction = loader.actions;

export default loader;