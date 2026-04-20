import React from 'react';

const Skeleton = ({ className, width, height, variant = 'rect' }) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: variant === 'circle' ? '50%' : variant === 'text' ? '4px' : '12px'
  };

  return (
    <div className={`skeleton-base ${className}`} style={style}>
      <style>{`
        .skeleton-base {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(255, 255, 255, 0.08) 37%,
            rgba(255, 255, 255, 0.03) 63%
          );
          background-size: 400% 100%;
          animation: skeleton-loading 1.4s ease infinite;
        }

        @keyframes skeleton-loading {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
