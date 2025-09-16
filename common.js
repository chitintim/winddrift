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
function setActiveNav(pageName) {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.tab');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if this link corresponds to the current page
        const linkText = link.textContent.toLowerCase();
        const linkHref = link.getAttribute('href');
        
        if (pageName === 'index') {
            // For index page, check for calculator, wind star, or drift calculator
            if (linkText.includes('calculator') || linkText.includes('wind star') || linkText.includes('drift')) {
                const hash = window.location.hash;
                if (hash === '#windstar' && linkText.includes('wind star')) {
                    link.classList.add('active');
                } else if (hash === '#driftcalc' && linkText.includes('drift')) {
                    link.classList.add('active');
                } else if (!hash && linkText.includes('calculator') && !linkText.includes('drift')) {
                    link.classList.add('active');
                }
            }
        } else if (pageName === 'weather' && linkText.includes('weather')) {
            link.classList.add('active');
        }
    });
}

// Initialize common functionality
function initializeCommon() {
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Determine current page and set active navigation
    const path = window.location.pathname;
    if (path.includes('weather')) {
        setActiveNav('weather');
    } else {
        setActiveNav('index');
    }
    
    // Handle hash changes for single-page navigation
    window.addEventListener('hashchange', function() {
        if (window.location.pathname.includes('index')) {
            setActiveNav('index');
        }
    });
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