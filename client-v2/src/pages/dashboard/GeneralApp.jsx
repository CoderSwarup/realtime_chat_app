import React, { Suspense, lazy } from "react";
const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  return <>{/* <h1>Hello</h1> */}</>;
};

export default GeneralApp;
