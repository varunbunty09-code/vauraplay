import React from 'react';
import Skeleton from './Skeleton';

const MovieSkeleton = () => {
  return (
    <div className="movie-skeleton">
      <Skeleton height="300px" />
      <Skeleton variant="text" width="80%" height="16px" className="mt-2" />
      <Skeleton variant="text" width="40%" height="12px" className="mt-1" />
      <style>{`
        .movie-skeleton {
          flex: 0 0 200px;
          margin-bottom: 2rem;
        }
        .mt-2 { margin-top: 0.8rem; }
        .mt-1 { margin-top: 0.4rem; }
        @media (max-width: 768px) {
          .movie-skeleton { flex: 0 0 140px; }
          .movie-skeleton div:first-child { height: 210px !important; }
        }
      `}</style>
    </div>
  );
};

export const MovieRowSkeleton = () => {
    return (
        <div style={{ padding: '0 4%', marginBottom: '3rem' }}>
            <Skeleton variant="text" width="200px" height="32px" className="mb-4" />
            <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
                {[1, 2, 3, 4, 5, 6].map(i => <MovieSkeleton key={i} />)}
            </div>
            <style>{`
                .mb-4 { margin-bottom: 1.5rem; }
            `}</style>
        </div>
    )
}

export const HeroSkeleton = () => {
    return (
        <div className="hero-skeleton">
            <Skeleton height="85vh" />
            <div className="hero-skeleton-info container">
                <Skeleton width="60%" height="60px" style={{ marginBottom: '20px' }} />
                <Skeleton width="40%" height="20px" style={{ marginBottom: '10px' }} />
                <Skeleton width="45%" height="20px" style={{ marginBottom: '30px' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Skeleton width="150px" height="50px" />
                    <Skeleton width="150px" height="50px" />
                </div>
            </div>
            <style>{`
                .hero-skeleton { position: relative; width: 100%; margin-bottom: 3rem; }
                .hero-skeleton-info { position: absolute; top: 40%; left: 0; z-index: 10; }
                @media (max-width: 768px) {
                    .hero-skeleton-info { top: 30%; }
                }
            `}</style>
        </div>
    )
}

export const DetailSkeleton = () => {
    return (
        <div className="detail-skeleton">
            <div className="hero-skeleton-bg">
                <Skeleton height="80vh" />
            </div>
            <div className="container detail-content-skeleton">
                <div className="side-skeleton">
                    <Skeleton width="300px" height="450px" />
                </div>
                <div className="main-skeleton">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}>
                        <Skeleton width="100px" height="30px" />
                        <Skeleton width="100px" height="30px" />
                        <Skeleton width="100px" height="30px" />
                    </div>
                    <Skeleton width="80%" height="60px" style={{ marginBottom: '20px' }} />
                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '20px' }}>
                        <Skeleton width="80px" height="30px" />
                        <Skeleton width="80px" height="30px" />
                    </div>
                    <Skeleton width="100%" height="20px" style={{ marginBottom: '10px' }} />
                    <Skeleton width="100%" height="20px" style={{ marginBottom: '10px' }} />
                    <Skeleton width="60%" height="20px" style={{ marginBottom: '30px' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Skeleton width="160px" height="50px" />
                        <Skeleton width="160px" height="50px" />
                    </div>
                </div>
            </div>
            <style>{`
                .detail-skeleton { position: relative; min-height: 100vh; padding-bottom: 5rem; }
                .detail-content-skeleton { position: absolute; bottom: 4rem; left: 0; right: 0; z-index: 10; display: flex; gap: 3rem; align-items: flex-end; }
                .main-skeleton { flex: 1; }
                @media (max-width: 900px) {
                    .detail-content-skeleton { flex-direction: column; align-items: center; bottom: 2rem; }
                    .side-skeleton div { width: 200px !important; height: 300px !important; }
                }
            `}</style>
        </div>
    )
}

export const GridSkeleton = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i}>
                    <Skeleton height="300px" />
                    <Skeleton variant="text" width="80%" height="20px" style={{ marginTop: '1rem' }} />
                </div>
            ))}
        </div>
    )
}

export default MovieSkeleton;
