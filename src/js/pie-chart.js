// Initialize variables
let isUpdating = false;
let pieChart;

// Get slider elements
const nonInsectsSlider = document.getElementById('non-insects-slider');
const eptSlider = document.getElementById('ept-slider');
const otherInsectsSlider = document.getElementById('other-insects-slider');

// Get value display elements
const nonInsectsValue = document.getElementById('non-insects-value');
const eptValue = document.getElementById('ept-value');
const otherInsectsValue = document.getElementById('other-insects-value');

// Option 1: Use health status colors directly as background
function getHealthBasedColors() {
    const nonInsects = parseInt(nonInsectsSlider.value);
    const ept = parseInt(eptSlider.value);
    const otherInsects = parseInt(otherInsectsSlider.value);

    const indicators = ['nonInsects', 'ept', 'otherInsects'];
    const values = [nonInsects, ept, otherInsects];

    const healthColors = {
        'green': '#22C55E',   // Bright green - Healthy
        'yellow': '#F59E0B',  // Orange-yellow - Warning
        'red': '#EF4444'      // Red - Concerning
    };

    return values.map((value, index) => {
        const health = getHealthLevel(indicators[index], value);
        return healthColors[health];
    });
}

// Option 2: Base colors + border to show health status
function getBaseColors() {
    return ['#6366F1', '#8B5CF6', '#06B6D4']; // Purple-blue tones
}

function getHealthBorderColors() {
    const nonInsects = parseInt(nonInsectsSlider.value);
    const ept = parseInt(eptSlider.value);
    const otherInsects = parseInt(otherInsectsSlider.value);

    const indicators = ['nonInsects', 'ept', 'otherInsects'];
    const values = [nonInsects, ept, otherInsects];

    const healthColors = {
        'green': '#16A34A',   // Dark green border
        'yellow': '#D97706',  // Orange border
        'red': '#DC2626'      // Red border
    };

    return values.map((value, index) => {
        const health = getHealthLevel(indicators[index], value);
        return healthColors[health];
    });
}

// Get text color based on background brightness
function getTextColor(backgroundColor) {
    // Simple brightness detection
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

// Initialize pie chart
function initializePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');

    // Use Option 1: Health status directly determines colors
    const useHealthColors = true; // Set to false to use Option 2

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['NON-Insects', 'EPT', 'OTHER Insects'],
            datasets: [{
                data: [34, 33, 33],
                backgroundColor: useHealthColors ? getHealthBasedColors() : getBaseColors(),
                borderColor: useHealthColors ? ['#FFFFFF', '#FFFFFF', '#FFFFFF'] : getHealthBorderColors(),
                borderWidth: useHealthColors ? 3 : 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed;
                            const indicators = ['nonInsects', 'ept', 'otherInsects'];
                            const health = getHealthLevel(indicators[context.dataIndex], value);
                            const healthText = {
                                'green': 'Healthy',
                                'yellow': 'Unhealthy',
                                'red': 'Concerning'
                            };
                            return context.label + ': ' + value + '% (' + healthText[health] + ')';
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'customLabels',
            afterDraw: function (chart) {
                const ctx = chart.ctx;
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;
                const colors = chart.data.datasets[0].backgroundColor;
                const indicators = ['nonInsects', 'ept', 'otherInsects'];

                const healthText = {
                    'green': 'Healthy',
                    'yellow': 'Unhealthy',
                    'red': 'Concerning'
                };

                chart.data.datasets[0].data.forEach((value, index) => {
                    const meta = chart.getDatasetMeta(0);
                    const arc = meta.data[index];
                    const centerX = arc.x;
                    const centerY = arc.y;

                    // Calculate label position
                    const angle = (arc.startAngle + arc.endAngle) / 2;
                    const radius = arc.outerRadius * 0.7;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    // Get health status for this section
                    const health = getHealthLevel(indicators[index], value);
                    const healthLabel = healthText[health];

                    // Choose text color based on background color
                    const textColor = getTextColor(colors[index]);

                    // Draw text with shadow for better readability
                    ctx.save();

                    // Text shadow
                    ctx.fillStyle = textColor === '#FFFFFF' ? '#000000' : '#FFFFFF';
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Draw shadow slightly offset
                    ctx.fillText(labels[index] + ' (' + healthLabel + ')', x + 1, y - 8 + 1);
                    ctx.fillText(value + '%', x + 1, y + 8 + 1);

                    // Main text
                    ctx.fillStyle = textColor;
                    ctx.fillText(labels[index] + ' (' + healthLabel + ')', x, y - 8);
                    ctx.fillText(value + '%', x, y + 8);

                    ctx.restore();
                });
            }
        }]
        // Removed healthIndicator plugin to avoid overlapping
    });
}

// Update pie chart
function updatePieChart() {
    const nonInsects = parseInt(nonInsectsSlider.value);
    const ept = parseInt(eptSlider.value);
    const otherInsects = parseInt(otherInsectsSlider.value);

    pieChart.data.datasets[0].data = [nonInsects, ept, otherInsects];

    // Update colors based on current configuration
    if (pieChart.data.datasets[0].borderWidth === 3) {
        // Use health status color scheme
        pieChart.data.datasets[0].backgroundColor = getHealthBasedColors();
    } else {
        // Use border color scheme
        pieChart.data.datasets[0].borderColor = getHealthBorderColors();
    }

    pieChart.update();
}

// Update display values with % symbol
function updateDisplayValues() {
    nonInsectsValue.textContent = nonInsectsSlider.value;
    eptValue.textContent = eptSlider.value;
    otherInsectsValue.textContent = otherInsectsSlider.value;
}

// Balance sliders to maintain 100% total
function balanceSliders(changedSlider) {
    if (isUpdating) return;
    isUpdating = true;

    const nonInsects = parseInt(nonInsectsSlider.value);
    const ept = parseInt(eptSlider.value);
    const otherInsects = parseInt(otherInsectsSlider.value);

    const total = nonInsects + ept + otherInsects;
    const difference = 100 - total;

    if (difference !== 0) {
        const otherSliders = [];
        if (changedSlider !== nonInsectsSlider) otherSliders.push(nonInsectsSlider);
        if (changedSlider !== eptSlider) otherSliders.push(eptSlider);
        if (changedSlider !== otherInsectsSlider) otherSliders.push(otherInsectsSlider);

        if (otherSliders.length > 0) {
            const adjustmentPerSlider = Math.floor(difference / otherSliders.length);
            let remainder = difference % otherSliders.length;

            otherSliders.forEach((slider, index) => {
                let currentValue = parseInt(slider.value);
                let adjustment = adjustmentPerSlider;

                if (remainder > 0) {
                    adjustment += 1;
                    remainder--;
                }

                let newValue = currentValue + adjustment;
                newValue = Math.max(0, Math.min(100, newValue));
                slider.value = newValue;
                const sliderId = slider.id;
                const indicator = sliderMappings[sliderId];
                const healthLevel = getHealthLevel(indicator, newValue);
                updateSliderColor(sliderId, healthLevel);
            });
        }
    }

    updateDisplayValues();
    updatePieChart();
    isUpdating = false;
}

// Add event listeners to sliders
nonInsectsSlider.addEventListener('input', function () {
    balanceSliders(this);
});

eptSlider.addEventListener('input', function () {
    balanceSliders(this);
});

otherInsectsSlider.addEventListener('input', function () {
    balanceSliders(this);
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initializePieChart();
        updateDisplayValues();
    }, 100);
});