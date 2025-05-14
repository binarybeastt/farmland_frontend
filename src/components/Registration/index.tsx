"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { EyeSlash2 } from "../../icons/EyeSlash2";
import { SocialIcons } from "../../icons/SocialIcons";
import { SocialIcons1 } from "../../icons/SocialIcons1";
import { registerUser } from "../../services/auth";
import { useRouter } from "next/navigation";
import { RegisterData } from "../../types/auth";
import "./style.css";

export const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    farm_name: "",
    location: {},
    password: "",
    is_active: true
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "location") {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, additionalProp1: { value } }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      router.push("/"); // Redirect to login after successful registration
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration" data-model-id="2:2346">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="div">
            <img
              className="plant"
              alt="Plant"
              src="/img/plant.svg"
            />
            <div className="text-wrapper">FarmLand</div>
          </div>

          <form onSubmit={handleSubmit} className="frame-2">
            <div className="frame-3">
              <div className="text-wrapper-2">Create an account</div>

              <p className="p">
                Register to manage your farm efficiently
              </p>
            </div>

            <div className="frame-4">
              <div className="frame-5">
                <SocialIcons className="icon-instance-node" />
                <div className="text-wrapper-3">Register with Google</div>
              </div>

              <div className="frame-5">
                <SocialIcons1 className="icon-instance-node" />
                <div className="text-wrapper-3">Register with Facebook</div>
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
                <div className="title">Username</div>
                <div className="frame-8">
                  <input 
                    type="text" 
                    name="username"
                    className="placeholder" 
                    placeholder="Enter your username" 
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="frame-7">
                <div className="title">Email address</div>
                <div className="frame-8">
                  <input 
                    type="email" 
                    name="email"
                    className="placeholder" 
                    placeholder="abc@gmail.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="frame-7">
                <div className="title">Farm Name</div>
                <div className="frame-8">
                  <input 
                    type="text" 
                    name="farm_name"
                    className="placeholder" 
                    placeholder="Enter your farm name" 
                    value={formData.farm_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="frame-7">
                <div className="title">Location</div>
                <div className="frame-8">
                  <input 
                    type="text" 
                    name="location"
                    className="placeholder" 
                    placeholder="Enter your location" 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="frame-7">
                <div className="title">Password</div>
                <div className="frame-8">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className="placeholder" 
                    placeholder="********" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div onClick={() => setShowPassword(!showPassword)}>
                    <EyeSlash2 className="icon-instance-node" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="div-wrapper"
              disabled={loading}
            >
              <div className="text-wrapper-5">
                {loading ? "Registering..." : "Register"}
              </div>
            </button>
            
            <div className="login-link">
              Already have an account? <a href="/" className="login-text">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 