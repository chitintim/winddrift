// Common JavaScript functions for Wind Drift Calculator

// Clock functionality
function updateClock() {
    const now = new Date();
    
    // Zulu time (UTC)
    const zuluHours = String(now.getUTCHours()).padStart(2, '0');
    const zuluMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const zuluSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    const zuluElement = document.getElementById('zuluTime');
    if (zuluElement) {
        zuluElement.textContent = `${zuluHours}:${zuluMinutes}:${zuluSeconds}`;
    }
    
    // UK local time (handles BST automatically)
    const ukTime = now.toLocaleString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const localElement = document.getElementById('localTime');
    if (localElement) {
        localElement.textContent = ukTime;
    }
}

// Navigation highlighting
function setActiveNav() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.tab');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        const linkText = link.textContent.toLowerCase();
        
        // Check if this link corresponds to the current page
        if ((currentPath === 'index.html' || currentPath === '') && href === 'index.html') {
            link.classList.add('active');
        } else if (currentPath === 'windstar.html' && href === 'windstar.html') {
            link.classList.add('active');
        } else if (currentPath === 'weather.html' && href === 'weather.html') {
            link.classList.add('active');
        } else if (currentPath === 'spotwind.html' && href === 'spotwind.html') {
            link.classList.add('active');
        }
    });
}

// Initialize common functionality
function initializeCommon() {
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Set active navigation based on current page
    setActiveNav();
}

// Utility functions for calculations
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function normalizeHeading(heading) {
    while (heading < 0) heading += 360;
    while (heading >= 360) heading -= 360;
    return heading;
}

// Wind triangle calculation
function calculateWindTriangle(windDir, windSpeed, trueCourse, trueAirspeed) {
    const wcRad = toRadians(windDir);
    const tcRad = toRadians(trueCourse);
    
    const windAngle = windDir - trueCourse;
    const windAngleRad = toRadians(windAngle);
    
    const crosswind = windSpeed * Math.sin(windAngleRad);
    const headwind = windSpeed * Math.cos(windAngleRad);
    
    let wca = 0;
    if (trueAirspeed > 0) {
        const sinWCA = crosswind / trueAirspeed;
        if (Math.abs(sinWCA) <= 1) {
            wca = toDegrees(Math.asin(sinWCA));
        }
    }
    
    const trueHeading = normalizeHeading(trueCourse + wca);
    
    const gsX = trueAirspeed * Math.sin(toRadians(trueHeading)) + windSpeed * Math.sin(wcRad);
    const gsY = trueAirspeed * Math.cos(toRadians(trueHeading)) + windSpeed * Math.cos(wcRad);
    const groundSpeed = Math.sqrt(gsX * gsX + gsY * gsY);
    
    return {
        trueHeading: trueHeading,
        groundSpeed: groundSpeed,
        windCorrectionAngle: wca,
        driftAngle: wca,
        headwindComponent: headwind,
        crosswindComponent: Math.abs(crosswind),
        crosswindDirection: crosswind > 0 ? 'right' : 'left'
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateClock,
        setActiveNav,
        initializeCommon,
        toRadians,
        toDegrees,
        normalizeHeading,
        calculateWindTriangle
    };
}