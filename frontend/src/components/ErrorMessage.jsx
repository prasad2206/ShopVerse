// src/components/ErrorMessage.jsx
import React from "react";

const ErrorMessage = ({ title = "Error", message }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <strong>{title}:</strong>{" "}
      {message ?? "Something went wrong. Please try again."}
    </div>
  );
};

export default ErrorMessage;
