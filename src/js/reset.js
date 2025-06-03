function resetPageOne() {
  updateSliders('invertebrateGroups', 12);
  // reset filter
  setOverlayColor('green');
}

function resetPageTwo() {
  isUpdating = true;
  updateSliders('nonInsects', 34);
  updateSliders('ept', 33);
  updateSliders('otherInsects', 33);
  otherInsectsSlider.value = 33;
  updateDisplayValues();
  updatePieChart();
  isUpdating = false;
  // reset filter
  setOverlayColor('green');
}

function resetPageThree(){
  updateSliders('eptIndex', 15);
  // reset filter
  setOverlayColor('green');
}

function resetPageFour(){
  updateSliders('hbi', 3);
  // reset filter
  setOverlayColor('green');
}

function resetAll(){
  resetPageOne();
  resetPageTwo();
  resetPageThree();
  resetPageFour();
}