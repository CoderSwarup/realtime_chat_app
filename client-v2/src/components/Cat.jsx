import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";

const Cat = () => {
  // State to manage loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation
    const wait = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 3000); // Simulating 3 seconds delay
      });
    };

    // Call wait function and update loading state once delay is over
    wait().then(() => {
      setLoading(false);
    });
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  // Render loading message if still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Once loading is complete, render the Avatar
  return (
    <div>
      <Avatar src="/vite.svg" alt="Cat Avatar" />
    </div>
  );
};

export default Cat;
