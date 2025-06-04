const navButtons = document.querySelectorAll('.page-nav button');
const contentPages = document.querySelectorAll('.content-page');
const continueLinks = document.querySelectorAll('.continue-link');
let currentPageId = 'page-intro';

function navigateToPage(newPageId) {
  if (newPageId === currentPageId) return;
  const currentPage = document.getElementById(currentPageId);
  const newPage = document.getElementById(newPageId);

  const isNumberedNewPage = newPageId !== 'page-intro';
  const isNumberedCurrentPage = currentPageId !== 'page-intro';
  let animationDirection = 'right';

  if (isNumberedCurrentPage && isNumberedNewPage) {
    const currentPageNum = parseInt(currentPageId.replace('page-', ''));
    const newPageNum = parseInt(newPageId.replace('page-', ''));
    animationDirection = newPageNum > currentPageNum ? 'right' : 'left';
  } else if (!isNumberedCurrentPage && isNumberedNewPage) {
    animationDirection = 'right';
  } else if (isNumberedCurrentPage && !isNumberedNewPage) {
    animationDirection = 'left';
  }

  if (animationDirection === 'right') {
    currentPage.classList.add('slide-out-left');
    newPage.classList.add('slide-in-right');
  } else {
    currentPage.classList.add('slide-out-right');
    newPage.classList.add('slide-in-left');
  }

  newPage.style.display = 'flex';

  if (isNumberedNewPage) {
    updateButtonStates(parseInt(newPageId.replace('page-', '')));
  } else {
    resetButtonStates();
  }

  const pieDisplay = document.querySelector('#pie-display');
  const eptDisplay = document.querySelector('#ept-display');
  const exploreData = document.querySelector('.explore-data');
  const riverImgContainer = document.querySelector('.river-img-container');
  

  // Apply classes after the animation completes
  setTimeout(() => {
    currentPage.classList.remove('active', 'slide-out-left', 'slide-out-right');
    currentPage.style.display = 'none';
    newPage.classList.remove('slide-in-right', 'slide-in-left');
    newPage.classList.add('active');
    currentPageId = newPageId;
    resetAll();

    // Show #pie-display only on page-2
    if (newPageId === 'page-2') {
      pieDisplay.classList.add('active');
    } else {
      pieDisplay.classList.remove('active');
    }

    // Show #ept-display only on page-3
    if (newPageId === 'page-3') {
      eptDisplay.classList.add('active');
    } else {
      eptDisplay.classList.remove('active');
    }

    // Hide .explore-data and change river image on page-5
    if (newPageId === 'page-5') {
      exploreData.classList.add('hidden');
      riverImgContainer.classList.add('real');
    } else {
      exploreData.classList.remove('hidden');
      riverImgContainer.classList.remove('real');
    }
  }, 300); 
}

function updateButtonStates(activePageNum) {
  navButtons.forEach(button => {
    const buttonPageNum = parseInt(button.getAttribute('data-page'));
    button.classList.remove('active', 'complete', 'inactive');
    if (buttonPageNum === activePageNum) button.classList.add('active');
    else if (buttonPageNum < activePageNum) button.classList.add('complete');
    else button.classList.add('inactive');
  });
}

function resetButtonStates() {
  navButtons.forEach(button => {
    button.classList.remove('active', 'complete');
    button.classList.add('inactive');
  });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const pageNum = button.getAttribute('data-page');
    navigateToPage(`page-${pageNum}`);
  });
});

continueLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = link.getAttribute('data-target');
    const pageId = isNaN(targetPage) ? 'page-intro' : `page-${targetPage}`;
    navigateToPage(pageId);
  });
});

const exploreBtn = document.getElementById("explore-data-btn");
const dataLinks = document.getElementById("data-link");

exploreBtn.addEventListener("click", () => {
  dataLinks.style.display = dataLinks.style.display === "none" || dataLinks.style.display === "" ? "flex" : "none";
});

const indicatorValues = {
  invertebrateGroups: 12,
  nonInsects: 34,
  ept: 33,
  otherInsects: 33,
  dominantSpecies: 30,
  worms: 5,
  snails: 0,
  sowbugs: 0,
  insects: 50,
  flies: 30,
  midges: 5,
  eptIndex: 15,
  hbi: 3.0
};

const sliderMappings = {
  'invertebrate-groups-slider': 'invertebrateGroups',
  'non-insects-slider': 'nonInsects',
  'ept-slider': 'ept',
  'other-insects-slider': 'otherInsects',
  'worms-slider-2': 'worms',
  'snails-slider-2': 'snails',
  'sowbugs-slider-2': 'sowbugs',
  'insects-slider-3': 'insects',
  'flies-slider-3': 'flies',
  'midges-slider-3': 'midges',
  'ept-index-slider-3': 'eptIndex',
  'species-slider-4': 'species',
  'dominant-species-slider-4': 'dominantSpecies',
  'worms-slider-4': 'worms',
  'snails-slider-4': 'snails',
  'sowbugs-slider-4': 'sowbugs',
  'insects-slider-4': 'insects',
  'flies-slider-4': 'flies',
  'midges-slider-4': 'midges',
  'ept-index-slider-4': 'eptIndex',
  'hbi-slider-4': 'hbi'
};

function updateSliders(indicator, value) {
  for (const [sliderId, ind] of Object.entries(sliderMappings)) {
    if (ind === indicator) {
      const slider = document.getElementById(sliderId);
      if (slider) {
        slider.value = value;
        const valueSpan = slider.nextElementSibling;
        valueSpan.textContent = value;
        const healthLevel = getHealthLevel(indicator, value);
        updateSliderColor(sliderId, healthLevel);
      }
    }
  }
}

function getHealthLevel(indicator, value) {
  switch (indicator) {
    case 'invertebrateGroups':
      if (value >= 12) return 'green';
      else if (value === 11) return 'yellow';
      else return 'red';
    case 'nonInsects':
      // Healthy (30%-36%), Unhealthy (12%-30%, 36%-45%), Concerning (≤12 or ≥45%)
      if (value >= 30 && value <= 36) return 'green';
      else if ((value >= 12 && value < 30) || (value > 36 && value <= 45)) return 'yellow';
      else return 'red';
    case 'ept':
      // Healthy (30%-36%), Unhealthy (12%-30%, 36%-45%), Concerning (≤12 or ≥45%)
      if (value >= 30 && value <= 36) return 'green';
      else if ((value >= 12 && value < 30) || (value > 36 && value <= 45)) return 'yellow';
      else return 'red';
    case 'otherInsects':
      // Healthy (30%-36%), Unhealthy (12%-30%, 36%-45%), Concerning (≤12 or ≥45%)
      if (value >= 30 && value <= 36) return 'green';
      else if ((value >= 12 && value < 30) || (value > 36 && value <= 45)) return 'yellow';
      else return 'red';
    case 'worms':
      if (value <= 10) return 'green';
      else if (value <= 30) return 'yellow';
      else return 'red';
    case 'snails':
      if (value === 0) return 'green';
      else if (value <= 10) return 'yellow';
      else return 'red';
    case 'sowbugs':
      if (value === 0) return 'green';
      else if (value <= 5) return 'yellow';
      else return 'red';
    case 'insects':
      if ((value > 40 && value < 50) || (value > 80 && value <= 90)) return 'yellow';
      else if (value >= 50 && value <= 80) return 'green';
      else return 'red';
    case 'flies':
      if (value >= 21 && value <= 45) return 'green';
      else if ((value >= 16 && value <= 20) || (value >= 46 && value <= 50)) return 'yellow';
      else return 'red';
    case 'midges':
      if (value <= 10) return 'green';
      else if (value <= 40) return 'yellow';
      else return 'red';
    case 'eptIndex':
      if (value >= 11) return 'green';
      else if (value >= 6) return 'yellow';
      else return 'red';
    case 'hbi':
      if (value <= 5) return 'green';
      else if (value <= 7) return 'yellow';
      else return 'red';
    default:
      return 'unknown';
  }
}

function updateSliderColor(sliderId, healthLevel) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    slider.classList.remove('green', 'yellow', 'red');
    slider.classList.add(healthLevel);
  }
}

// function calculateTER() {
  //   let sum = 0;
  //   const ratings = { green: 0, yellow: 3, red: 5 };
  //   for (const indicator in indicatorValues) {
  //     const value = indicatorValues[indicator];
  //     const healthLevel = getHealthLevel(indicator, value);
  //     sum += ratings[healthLevel] || 0;
  //   }

  //   let ter, overlayColor, textColor;
  //   if (sum <= 19) {
  //     ter = 'GREEN Unimpaired';
  //     overlayColor = 'transparent';
  //     textColor = 'green';
  //   } else if (sum <= 24) {
  //     ter = 'YELLOW-GREEN Potentially Impaired';
  //     overlayColor = '#ADFF2F';
  //     textColor = '#ADFF2F';
  //   } else if (sum <= 29) {
  //     ter = 'YELLOW Potentially Impaired';
  //     overlayColor = '#FFD700';
  //     textColor = '#FFD700';
  //   } else if (sum <= 34) {
  //     ter = 'ORANGE Potentially Impaired';
  //     overlayColor = '#FFA500';
  //     textColor = 'orange';
  //   } else {
  //     ter = 'RED Impaired';
  //     overlayColor = '#FF0000';
  //     textColor = 'red';
  //   }

  //   const terScore = document.getElementById('ter-score');
  //   const terValue = document.getElementById('ter-value');
  //   const terDisplay = document.getElementById('ter-display');
  //   const overlay = document.querySelector('.overlay');

  //   if (terScore) terScore.textContent = sum;
  //   if (terValue) terValue.textContent = ter;
  //   if (terDisplay) {
  //     terDisplay.style.backgroundColor = textColor;
  //     terDisplay.style.color = (textColor === '#ADFF2F' || textColor === '#FFD700') ? 'black' : 'white';
  //   }
  //   if (overlay) {
  //     overlay.style.backgroundColor = overlayColor;
  //     overlay.style.opacity = overlayColor === 'transparent' ? '0' : '0.5';
  //   }
// }

// function adjustRelatedSliders(sliderClass, value) {
//   const wormsSliders = document.querySelectorAll('.worms-slider');
//   const sowbugsSliders = document.querySelectorAll('.sowbugs-slider');
//   const snailsSliders = document.querySelectorAll('.snails-slider');
//   const insectsSliders = document.querySelectorAll('.insects-slider');
//   const fliesSliders = document.querySelectorAll('.flies-slider');
//   const midgesSliders = document.querySelectorAll('.midges-slider');
//   const eptSliders = document.querySelectorAll('.ept-slider');

//   let worms = Math.round(parseFloat(wormsSliders[0].value));
//   let sowbugs = Math.round(parseFloat(sowbugsSliders[0].value));
//   let snails = Math.round(parseFloat(snailsSliders[0].value));
//   let insects = Math.round(parseFloat(insectsSliders[0].value));
//   let flies = Math.round(parseFloat(fliesSliders[0].value));
//   let midges = Math.round(parseFloat(midgesSliders[0].value));
//   let ept = Math.round(parseFloat(eptSliders[0].value));

//   value = Math.round(value);

//   switch (sliderClass) {
//     case 'worms-slider':
//     case 'sowbugs-slider':
//     case 'snails-slider':
//       let totalNonInsects = worms + sowbugs + snails;
//       if (totalNonInsects >= insects) {  // Ensure total < 101
//         // First try to increase insects up to 99 (to keep total < 101)
//         let newInsects = Math.min(99, totalNonInsects);
//         insectsSliders.forEach(slider => {
//           slider.value = newInsects;
//           updateSliders('insects', newInsects);
//         });
//         insects = newInsects;

//         // If insects is already at 100, reduce the other sliders (WORMS, SNAILS, SOWBUGS)
//         if (insects === 100) {
//           let excess = totalNonInsects - 99;  // Ensure total < 101
//           let sliderGroups = [
//             { sliders: wormsSliders, value: worms },
//             { sliders: sowbugsSliders, value: sowbugs },
//             { sliders: snailsSliders, value: snails }
//           ].filter(group => !group.sliders[0].classList.contains(sliderClass));

//           let reduction = Math.round(excess / 2); // Divide by 2 since we adjust two other sliders
//           sliderGroups.forEach(group => {
//             let newVal = Math.max(0, group.value - reduction);
//             group.sliders.forEach(slider => {
//               slider.value = newVal;
//               updateSliders(sliderMappings[slider.id], newVal);
//             });
//           });
//         }
//       }
//       break;

//     case 'insects-slider':
//       if (worms + sowbugs + snails > value) {
//         let excess = (worms + sowbugs + snails) - value;
//         let sliderGroups = [
//           { sliders: wormsSliders, value: worms },
//           { sliders: sowbugsSliders, value: sowbugs },
//           { sliders: snailsSliders, value: snails }
//         ];

//         let reduction = Math.round(excess / 3);
//         sliderGroups.forEach(group => {
//           let newVal = Math.max(0, group.value - reduction);
//           group.sliders.forEach(slider => {
//             slider.value = newVal;
//             updateSliders(sliderMappings[slider.id], newVal);
//           });
//         });
//       }
//       if (value < flies) {
//         fliesSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('flies', value);
//         });
//         if (value < midges) {
//           midgesSliders.forEach(slider => {
//             slider.value = value;
//             updateSliders('midges', value);
//           });
//         }
//       }
//       if (value < ept) {
//         eptSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('eptIndex', value);
//         });
//       }
//       break;

//     case 'midges-slider':
//       if (value > flies) {
//         flies = value;
//         fliesSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('flies', value);
//         });
//       }
//       if (flies > insects) {
//         insects = flies;
//         insectsSliders.forEach(slider => {
//           slider.value = flies;
//           updateSliders('insects', flies);
//         });
//       }
//       break;

//     case 'flies-slider':
//       if (value < midges) {
//         midgesSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('midges', value);
//         });
//       }
//       if (value > insects) {
//         insectsSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('insects', value);
//         });
//       }
//       break;

//     case 'ept-slider':
//       if (value > insects) {
//         insectsSliders.forEach(slider => {
//           slider.value = value;
//           updateSliders('insects', value);
//         });
//       }
//       break;
//   }

//   // Ensure FLIES + EPT <= INSECTS
//   if (flies + ept > insects) {
//     let excess = Math.round((flies + ept) - insects);
//     if (flies > ept) {
//       let newFlies = flies - excess;
//       fliesSliders.forEach(slider => {
//         slider.value = newFlies;
//         updateSliders('flies', newFlies);
//       });
//       if (newFlies < midges) {
//         midgesSliders.forEach(slider => {
//           slider.value = newFlies;
//           updateSliders('midges', newFlies);
//         });
//       }
//     } else {
//       let newEpt = ept - excess;
//       eptSliders.forEach(slider => {
//         slider.value = newEpt;
//         updateSliders('eptIndex', newEpt);
//       });
//     }
//   }

//   // Final check to ensure WORMS + SNAILS + SOWBUGS + INSECTS < 101
//   let finalTotal = worms + sowbugs + snails + insects;
//   if (finalTotal >= 101) {
//     let excess = finalTotal - 100;
//     let sliderGroups = [
//       { sliders: wormsSliders, value: worms },
//       { sliders: sowbugsSliders, value: sowbugs },
//       { sliders: snailsSliders, value: snails },
//       { sliders: insectsSliders, value: insects }
//     ].filter(group => group.value > 0);

//     let reduction = Math.round(excess / sliderGroups.length);
//     sliderGroups.forEach(group => {
//       let newVal = Math.max(0, group.value - reduction);
//       group.sliders.forEach(slider => {
//         slider.value = newVal;
//         updateSliders(sliderMappings[slider.id], newVal);
//       });
//     });
//   }
// }


for (const [sliderId, indicator] of Object.entries(sliderMappings)) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    slider.value = indicatorValues[indicator];
    const valueSpan = slider.nextElementSibling;
    valueSpan.textContent = indicatorValues[indicator];
    const healthLevel = getHealthLevel(indicator, indicatorValues[indicator]);
    updateSliderColor(sliderId, healthLevel);
  }
}

document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener('input', function () {
    const sliderId = this.id;
    const indicator = sliderMappings[sliderId];
    const value = Math.round(parseFloat(this.value));

    const sliderClass = this.className.split(' ')[0];
    document.querySelectorAll(`.${sliderClass}`).forEach(s => {
      s.value = value;
      updateSliders(sliderMappings[s.id], value);
    });

    indicatorValues[indicator] = value;

    // if (sliderId.includes('-2') || sliderId.includes('-3') || sliderId.includes('-4')) {
    //   adjustRelatedSliders(sliderClass, value);
    // }

    // calculateTER();
  });
});

const data = {
  2023: { invertebrateGroups: 15, nonInsects: 30, ept: 34, otherInsects: 36, insects: 60, flies: 30, midges: 10, 'ept-index': 20, hbi: 4.5 },
  2024: { invertebrateGroups: 12, nonInsects: 36, ept: 31, otherInsects: 33, insects: 55, flies: 28, midges: 15, 'ept-index': 18, hbi: 5.0 },
  defaultValues: indicatorValues
};

document.querySelectorAll('#data-link a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const linkText = link.textContent;
    const year = linkText;
    for (const [key, value] of Object.entries(data[year])) {
      const indicator = key.replace('ept-index', 'eptIndex').replace('invertebrate-groups', 'invertebrateGroups');
      indicatorValues[indicator] = value;
      updateSliders(indicator, value);
      setOverlayColor('green');
    }
    // calculateTER();
  });
});
// calculateTER();

// Function to set overlay color based on health level
function setOverlayColor(healthLevel) {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    const overlayColor = colorMap[healthLevel] || 'transparent';
    overlay.style.backgroundColor = overlayColor;
    overlay.style.opacity = overlayColor === 'transparent' ? '0' : '0.5';
  }
}