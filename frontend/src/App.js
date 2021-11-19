import './App.css';
import { BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute'
import { createContext, useState, useEffect } from 'react';

export const HomeContext = createContext(null);

function App() {
  useEffect( () => {
    const getData = async () => {
      if (localStorage["Token"]) {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": localStorage["Token"]
          }
        }

        const res = await fetch('/api/home/dashboard', options);
        const data = await res.json();

        if (!data.message) {
          setToken(true);
        } else {
          localStorage["Token"] = "";
        }
      }
    }
    getData();
  });

  const [token, setToken] = useState(localStorage["Token"] ? true : false);

  function handleSetToken(token) {
    if(token) {
      localStorage["Token"] = token;
      setToken(true);
    } else {
      localStorage["Token"] = "";
      setToken(false);
    }
  }

  return (
    <Router>
      <Switch>
        <HomeContext.Provider value={{ token, handleSetToken }}>
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/login" isAuth component={Login}/>
          <ProtectedRoute path="/register" isAuth component={Register}/>
        </HomeContext.Provider>
      </Switch>
    </Router>   
  );
}     

export default App;