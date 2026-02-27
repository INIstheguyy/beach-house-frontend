import { useState } from "react";

interface Photo {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText: string | null;
  caption: string | null;
}

interface StackedPhotoGalleryProps {
  photos: Photo[];
  baseUrl?: string;
}

const StackedPhotoGallery = ({ photos, baseUrl = "" }: StackedPhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ensure we have photos to display
  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  // Create ordered array based on current index
  const getOrderedPhotos = () => {
    const ordered = [];
    for (let i = 0; i < Math.min(photos.length, 5); i++) {
      const index = (currentIndex + i) % photos.length;
      ordered.push({ ...photos[index], position: i });
    }
    return ordered;
  };

  const handleCardClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Update index after animation completes
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
      setIsAnimating(false);
    }, 400);
  };

  const orderedPhotos = getOrderedPhotos();

  return (
    <div className="relative w-full aspect-[4/3] cursor-pointer select-none" onClick={handleCardClick}>
      <div className="relative w-full h-full">
        {orderedPhotos.map((photo, idx) => {
          const position = photo.position;
          const isTop = position === 0;
          
          return (
            <div
              key={`${photo.id}-${idx}`}
              className={`absolute inset-0 transition-all duration-400 ease-out ${
                isTop && isAnimating ? 'animate-card-flip' : ''
              }`}
              style={{
                transform: `
                  translateY(${position * 8}px) 
                  translateX(${position * 4}px) 
                  rotate(${position === 0 ? 0 : position % 2 === 0 ? position * 1.5 : -position * 1.5}deg)
                  scale(${1 - position * 0.02})
                `,
                zIndex: isTop && isAnimating ? 0 : 100 - position,
                opacity: position < 4 ? 1 - position * 0.15 : 0,
              }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden shadow-xl bg-white">
                <img
                  src={`${baseUrl}${photo.url}`}
                  alt={photo.alternativeText || photo.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Click indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
        Click to view next • {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};

export default StackedPhotoGallery;
