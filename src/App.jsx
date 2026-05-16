
import './style/App.css'
import AppRouter from './routes/AppRouter';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  return <AppRouter />;
}

export default App
