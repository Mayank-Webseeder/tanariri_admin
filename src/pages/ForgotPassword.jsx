import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import {
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // "email", "otp", "success"
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides with professional images (same as login)
  const carouselSlides = [
    {
      title: "Password Recovery",
      subtitle: "Secure password reset with advanced encryption",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&crop=faces",
    },
    {
      title: "Account Security",
      subtitle: "Your account safety is our top priority",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&crop=faces",
    },
    {
      title: "Quick Recovery",
      subtitle: "Get back to managing your platform in minutes",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=faces",
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);
      // TODO: Add API call to send OTP
      // await sendOTP(formData.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStep("otp");
      setErrors({});
    } catch (error) {
      console.error("Send OTP Error:", error);
      setErrors({
        email: "Failed to send reset email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP and password reset submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP and passwords
    let tempErrors = {};
    if (!formData.otp) {
      tempErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      tempErrors.otp = "OTP must be 6 digits";
    }
    if (!formData.newPassword) {
      tempErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      tempErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);
      // TODO: Add API call to reset password
      // await resetPassword({
      //   email: formData.email,
      //   otp: formData.otp,
      //   newPassword: formData.newPassword
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStep("success");
      setErrors({});
    } catch (error) {
      console.error("Reset Password Error:", error);
      setErrors({
        otp: "Invalid OTP or failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a reset code
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        {/* General Error Display */}
        {errors.email && !formData.email && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.email}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${
                errors.email && formData.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>
          {errors.email && formData.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-[#293a90] text-white font-semibold rounded-lg hover:bg-[#293a90]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin w-4 h-4" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Code
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </form>
    </>
  );

  const renderOTPStep = () => (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600">
          Enter the code sent to {formData.email} and your new password
        </p>
      </div>

      <form onSubmit={handleResetSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            maxLength="6"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 text-center tracking-widest text-lg ${
              errors.otp
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            placeholder="000000"
          />
          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${
                errors.newPassword
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter new password"
            />
          </div>
          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Confirm new password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-[#293a90] text-white font-semibold rounded-lg hover:bg-[#293a90]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin w-4 h-4" />
              Resetting...
            </>
          ) : (
            <>
              Reset Password
              <Shield className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setStep("email")}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Email
          </button>
        </div>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successfully
        </h2>
        <p className="text-gray-600">
          Your password has been reset. You can now sign in with your new
          password.
        </p>
      </div>

      <Link
        to="/"
        className="w-full py-3 px-4 bg-[#293a90] text-white font-semibold rounded-lg hover:bg-[#293a90]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
      >
        Back to Sign In
        <ArrowRight className="w-4 h-4" />
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div className="h-full relative">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8 z-10">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-200 max-w-md mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <img src="/TanaRiri_Logo.png" alt="E-com" className="h-12 mx-auto mb-6" />
            {step === "email" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Password Recovery
                </h1>
                <p className="text-gray-600">
                  We'll help you get back into your account
                </p>
              </div>
            )}
          </div>

          {/* Dynamic Content */}
          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOTPStep()}
          {step === "success" && renderSuccessStep()}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Secured by WebSeeder Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
