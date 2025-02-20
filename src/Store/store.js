import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; 
import CalendarReducer from './Reducer/CalendarReducer'

export const store = configureStore({
  reducer: {
    calendar: CalendarReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk) // Ensure thunk is included
});
