// src/components/Loader.jsx
import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="d-flex flex-column align-items-center py-4">
      {/* Spinner component to indicate loading state */}
      <div className="spinner-border" role="status" aria-hidden="true"></div>

      {/* Displaying the loading message below the spinner */}
      <div className="mt-2 text-muted">{text}</div>
    </div>
  );
};

export default Loader;
