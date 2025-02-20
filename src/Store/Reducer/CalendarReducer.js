// store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataCalendar : []
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setDataCalendar: (state, action) => {
      state.dataCalendar = action.payload; 
    },
  }
});

export const {setDataCalendar} = calendarSlice.actions;
export default calendarSlice.reducer;
