import React, { useState, useRef, useCallback } from 'react';

const DualRangeSlider = () => {
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const MIN_VALUE = 0;
  const MAX_VALUE = 20000;
  const STEP = 100;

  const getPercentage = (value) => ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  const getValueFromPosition = (clientX) => {
    const slider = sliderRef.current;
    if (!slider) return 0;

    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = MIN_VALUE + percentage * (MAX_VALUE - MIN_VALUE);
    return Math.round(rawValue / STEP) * STEP;
  };

  const handleMouseDown = (thumb) => (e) => {
    e.preventDefault();
    setIsDragging(thumb);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (thumb) => (e) => {
    e.preventDefault();
    setIsDragging(thumb);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newValue = getValueFromPosition(e.clientX);
    
    if (isDragging === 'min') {
      setMinPrice(Math.min(newValue, maxPrice - STEP));
    } else {
      setMaxPrice(Math.max(newValue, minPrice + STEP));
    }
  }, [isDragging, minPrice, maxPrice]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newValue = getValueFromPosition(touch.clientX);
    
    if (isDragging === 'min') {
      setMinPrice(Math.min(newValue, maxPrice - STEP));
    } else {
      setMaxPrice(Math.max(newValue, minPrice + STEP));
    }
  }, [isDragging, minPrice, maxPrice]);

  const handleMouseUp = () => {
    setIsDragging(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    setIsDragging(null);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleMinInputChange = (e) => {
    const value = Number.parseInt(e.target.value) || 0;
    if (value >= MIN_VALUE && value < maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxInputChange = (e) => {
    const value = Number.parseInt(e.target.value) || MAX_VALUE;
    if (value <= MAX_VALUE && value > minPrice) {
      setMaxPrice(value);
    }
  };

  const minPercentage = getPercentage(minPrice);
  const maxPercentage = getPercentage(maxPrice);

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-purple-700">Price</h3>
      
      {/* Custom Slider */}
      <div className="pt-2 px-1 mb-6">
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-lg cursor-pointer"
          onClick={(e) => {
            const newValue = getValueFromPosition(e.clientX);
            const distanceToMin = Math.abs(newValue - minPrice);
            const distanceToMax = Math.abs(newValue - maxPrice);
            
            if (distanceToMin < distanceToMax) {
              setMinPrice(Math.min(newValue, maxPrice - STEP));
            } else {
              setMaxPrice(Math.max(newValue, minPrice + STEP));
            }
          }}
        >
          {/* Active Range */}
          <div
            className="absolute h-2 bg-purple-600 rounded-lg"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
          
          {/* Min Thumb */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-purple-600 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md hover:border-purple-700 transition-colors ${
              isDragging === 'min' ? 'cursor-grabbing scale-110' : ''
            }`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
            onTouchStart={handleTouchStart('min')}
          />
          
          {/* Max Thumb */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-purple-600 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md hover:border-purple-700 transition-colors ${
              isDragging === 'max' ? 'cursor-grabbing scale-110' : ''
            }`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
            onTouchStart={handleTouchStart('max')}
          />
        </div>
        
        {/* Display current values */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${minPrice.toLocaleString()}</span>
          <span>${maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span className="text-sm mr-1">Min:</span>
          <input
            type="number"
            value={minPrice}
            min={MIN_VALUE}
            max={maxPrice - STEP}
            step={STEP}
            onChange={handleMinInputChange}
            className="w-24 h-8 text-sm border border-gray-300 rounded px-2 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-1">Max:</span>
          <input
            type="number"
            value={maxPrice}
            min={minPrice + STEP}
            max={MAX_VALUE}
            step={STEP}
            onChange={handleMaxInputChange}
            className="w-24 h-8 text-sm border border-gray-300 rounded px-2 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
      
      {/* Selected Range Display */}
      <div className="text-sm text-purple-700 font-medium">
        Selected Range: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
      </div>
    </div>
  );
};

export default DualRangeSlider;