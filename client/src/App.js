import Dashboard from "./pages/dashboard";
import LoginSignup from "./pages/loginSignup";
import { Routes, Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, auth }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null;

  if (!isLoggedIn && !auth) {
    return <Navigate to={"/user/signin"} />;
  } else if (
    isLoggedIn &&
    ["/user/signin", "/user/signup"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/signin"
        element={
          <ProtectedRoute auth={true}>
            <LoginSignup isSigninPage={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/signup"
        element={
          <ProtectedRoute auth={true}>
            <LoginSignup isSigninPage={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
    // <main>
    //   <Dashboard />
    // </main>
  );
}

export default App;
