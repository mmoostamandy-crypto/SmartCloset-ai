import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    // Save login information
    localStorage.setItem(
      "smartcloset-user",
      JSON.stringify({
        email: formData.email,
      })
    );

    localStorage.setItem(
      "smartcloset-logged-in",
      "true"
    );

    // Go to Home
    navigate("/");

  };


  return (

    <section className="login-page">

      {/* BACK TO HOME */}

      <button
        type="button"
        className="login-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>


      {/* LOGIN CARD */}

      <div className="login-card">


        {/* LOGO */}

        <div className="login-logo">

          <div className="login-logo-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <strong>
              SmartCloset
            </strong>

            <span>
              AI Personal Stylist
            </span>
          </div>

        </div>


        {/* HEADER */}

        <div className="login-header">

          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to continue to your SmartCloset.
          </p>

        </div>


        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >


          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="login-input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>


          {/* FORGOT PASSWORD */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert(
                  "Password recovery will be available soon."
                )
              }
            >
              Forgot password?
            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
          >

            <LogIn size={18} />

            Sign In

          </button>


        </form>


        {/* SIGN UP */}

        <div className="login-signup">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Sign Up
          </button>

        </div>


      </div>

    </section>

  );
}


export default Login;