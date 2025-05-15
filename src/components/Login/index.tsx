"use client";

import React, { useState, FormEvent } from "react";
import { EyeSlash2 } from "../../icons/EyeSlash2";
import { SocialIcons } from "../../icons/SocialIcons";
import { SocialIcons1 } from "../../icons/SocialIcons1";
import { loginUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";
import { User } from "../../types/auth";
import "./style.css";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First get the access token
      const response = await loginUser(email, password);
      const token = response.access_token;
      
      try {
        // Fetch user data from API using the token
        const userData = await apiRequest<User>('/api/v1/users/me', 'GET', null, token);
        
        // Use the user data from the API
        login(userData, token);
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Fallback: use limited data if API call fails
        login({ email }, token);
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login" data-model-id="2:2345">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="div">
            <img
              className="plant"
              alt="Plant"
              src="/img/Plant.svg"
            />

            <div className="text-wrapper">FarmLand</div>
          </div>

          <form onSubmit={handleSubmit} className="frame-2">
            <div className="frame-3">
              <div className="text-wrapper-2">Welcome back!</div>

              <p className="p">
                Kindly fill in your details to login to your acccount
              </p>
            </div>

            <div className="frame-4">
              <div className="frame-5">
                <SocialIcons className="icon-instance-node" />
                <div className="text-wrapper-3">Login with Google</div>
              </div>

              <div className="frame-5">
                <SocialIcons1 className="icon-instance-node" />
                <div className="text-wrapper-3">Login with Facebook</div>
              </div>
            </div>

            <img
              className="line"
              alt="Line"
              src="/img/line-1.svg"
            />

            {error && <div className="error-message">{error}</div>}

            <div className="frame-6">
              <div className="frame-7">
                <div className="title">Email address</div>
                <div className="frame-8">
                  <input 
                    type="email" 
                    className="placeholder" 
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="frame-7">
                <div className="title">Password</div>
                <div className="frame-8">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="placeholder" 
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div onClick={() => setShowPassword(!showPassword)}>
                    <EyeSlash2 className="icon-instance-node" />
                  </div>
                </div>
              </div>

              <div className="text-wrapper-4">Forgot password?</div>
            </div>

            <button 
              type="submit" 
              className="div-wrapper" 
              disabled={loading}
            >
              <div className="text-wrapper-5">{loading ? "Logging in..." : "Login"}</div>
            </button>
            
            <div className="register-link">
              Don't have an account? <a href="/register" className="register-text">Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 