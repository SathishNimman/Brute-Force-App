import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [formType, setFormType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "" &&
    (formType === "login" || (firstName.trim() !== "" && lastName.trim() !== ""));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/${formType}`;

    try {
      const payload = formType === "login"
        ? { email, password }
        : { email, password, firstName, lastName };

      const res = await axios.post(url, payload);
      setMessage(res.data.message);
      alert(res.data.message);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      const errMsg = error.response?.data?.message || `${formType} failed`;
      setMessage(errMsg);
      alert(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {formType === "login" ? "Login to your account" : "Create an account"}
        </h2>

        {formType === "signup" && (
          <>
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required 
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full text-white font-semibold py-2 rounded-lg transition duration-300
            ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {formType === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {formType === "login" ? (
            <>Don't have an account? <button type="button" onClick={() => setFormType("signup")} className="text-blue-600 underline">Sign Up</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => setFormType("login")} className="text-blue-600 underline">Login</button></>
          )}
        </p>

      {message && (
  <p className={`text-center text-sm font-medium ${
    message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
  }`}>
    {message}
  </p>
)}
      </form>
    </div>
  );
}

export default LoginForm;



