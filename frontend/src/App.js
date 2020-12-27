import UserSignupPage from "./pages/UserSignupPage";
import Footer from "./components/Footer";
import UserLoginPage from "./pages/UserLoginPage";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import TopBar from "./components/TopBar";
import { useSelector } from "react-redux";

function App() {
  const { loggedInUser } = useSelector((store) => ({
    loggedInUser: store.loggedInUser,
  }));

  return (
    <div>
      <Router>
        <TopBar />
        <div className="container">
          <div className="mt-3">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/user/:username" component={UserPage} />
              {!loggedInUser.isLoggedIn && (
                <>
                  <Route exact path="/login" component={UserLoginPage} />
                  <Route exact path="/signup" component={UserSignupPage} />
                </>
              )}
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
