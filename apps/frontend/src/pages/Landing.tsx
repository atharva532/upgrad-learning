import { useNavigate } from 'react-router-dom';
import libraryIllustration from '../assets/landing-page.png';

export function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="landing-hero">
        {/* Graduation Cap Icon */}
        <div className="landing-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M24 4L2 16L24 28L42 18.18V32H46V16L24 4Z" fill="#5b5fc7" />
            <path
              d="M10 21.18V33.18L24 42L38 33.18V21.18L24 30L10 21.18Z"
              fill="#5b5fc7"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="landing-title">Welcome to LearnSphere</h1>

        {/* Subtext */}
        <p className="landing-subtitle">
          Your personalized journey to knowledge starts here. Dive into curated video series and
          master new skills at your own pace.
        </p>

        {/* Illustration */}
        <div className="landing-illustration">
          <img src={libraryIllustration} alt="Students learning together in a library" />
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="btn-cta"
          aria-label="Get started with LearnSphere"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
