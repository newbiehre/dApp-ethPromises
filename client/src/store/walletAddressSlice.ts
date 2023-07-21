import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface WalletAddressState {
  value: string;
}

const initialState: WalletAddressState = {
  value: "",
};

export const walletAddressSlice = createSlice({
  name: "walletAddress",
  initialState,
  reducers: {
    initalize: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initalize } = walletAddressSlice.actions;

export const selectWalletAddress = (state: RootState) =>
  state.walletAddress.value;

export default walletAddressSlice.reducer;
