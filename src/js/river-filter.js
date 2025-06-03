const colorMap = {
  green: 'transparent',
  yellow: 'rgba(255, 255, 0, 0.5)',
  red: 'rgba(255, 0, 0, 0.5)',
  unknown: 'transparent'
};


// Add event listeners to all sliders
Object.keys(sliderMappings).forEach(sliderId => {
  const slider = document.getElementById(sliderId);
  if (slider) {
    slider.addEventListener('input', (e) => {
      const indicator = sliderMappings[sliderId];
      const value = parseFloat(e.target.value); // Use parseFloat for decimal values (e.g., HBI)
      const healthLevel = getHealthLevel(indicator, value);
      console.log(`Slider: ${sliderId}, Indicator: ${indicator}, Value: ${value}, Health Level: ${healthLevel}`);
      setOverlayColor(healthLevel); // Update overlay based on slider's health level
    });
  }
});