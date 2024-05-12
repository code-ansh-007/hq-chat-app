import React, { useState } from "react";
import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";

const LoginSignup = ({ isSigninPage }) => {
  return <main className="px-4">{isSigninPage ? <SignIn /> : <SignUp />}</main>;
};

export default LoginSignup;
