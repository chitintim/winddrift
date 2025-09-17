// Common JavaScript functions for Wind Drift Calculator

// Clock functionality
function updateClock() {
    const now = new Date();
    
    // Current date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const dateStr = now.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        dateElement.textContent = dateStr;
    }
    
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
        } else if (currentPath === 'flightplan.html' && href === 'flightplan.html') {
            link.classList.add('active');
        }
    });
}

// Generate navigation HTML
function generateNavigation() {
    const navigation = `
        <div class="tabs">
            <a href="index.html" class="tab">Drift Calc</a>
            <a href="windstar.html" class="tab">Wind Star</a>
            <a href="weather.html" class="tab">Weather</a>
            <a href="spotwind.html" class="tab">Spot Wind</a>
            <a href="flightplan.html" class="tab">Flight Plan</a>
        </div>
    `;
    
    // Find the navigation placeholder and replace it
    const navPlaceholder = document.getElementById('navigation-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navigation;
        console.log('Navigation generated successfully');
    } else {
        console.warn('Navigation placeholder not found, retrying...');
        // Fallback: try again after a short delay for slow loading on mobile
        setTimeout(() => {
            const placeholder = document.getElementById('navigation-placeholder');
            if (placeholder) {
                placeholder.innerHTML = navigation;
                console.log('Navigation generated on retry');
                // Re-run active navigation after insertion
                setActiveNav();
            } else {
                console.error('Navigation placeholder still not found');
            }
        }, 100);
    }
}

// Initialize common functionality
function initializeCommon() {
    try {
        // Generate navigation with multiple attempts for mobile compatibility
        generateNavigation();
        
        // Double-check navigation after a delay for slow mobile loading
        setTimeout(() => {
            const navCheck = document.querySelector('.tabs');
            if (!navCheck) {
                console.log('Navigation not found on second check, regenerating...');
                generateNavigation();
            }
        }, 500);
        
        // Start clock
        updateClock();
        setInterval(updateClock, 1000);
        
        // Set active navigation based on current page
        setTimeout(setActiveNav, 100);
    } catch (error) {
        console.error('Error in initializeCommon:', error);
    }
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
    // Given:
    // trueCourse: desired ground track (°)
    // trueAirspeed: true airspeed (kt)
    // windDir: wind FROM direction (°)
    // windSpeed: wind speed (kt)
    
    // Calculate relative wind angle
    const windAngle = windDir - trueCourse;
    const windAngleRad = toRadians(windAngle);
    
    // Calculate wind correction angle using sine rule
    let wca = 0;
    if (trueAirspeed > 0 && windSpeed > 0) {
        const sinWCA = (windSpeed / trueAirspeed) * Math.sin(windAngleRad);
        if (Math.abs(sinWCA) <= 1) {
            wca = toDegrees(Math.asin(sinWCA));
        }
    }
    
    // Heading to fly (subtract WCA from track)
    const trueHeading = normalizeHeading(trueCourse - wca);
    
    // Ground speed using cosine rule
    const wcaRad = toRadians(wca);
    const groundSpeed = Math.max(0, trueAirspeed * Math.cos(wcaRad) + 
                       windSpeed * Math.cos(windAngleRad));
    
    // Calculate wind components for reference
    const crosswind = windSpeed * Math.sin(windAngleRad);
    const headwind = windSpeed * Math.cos(windAngleRad);
    
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