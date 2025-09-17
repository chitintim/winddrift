# Wind Drift Calculator Documentation

## Overview
A mobile-friendly wind drift calculator for UK Private Pilot License (PPL) navigation. Features wind triangle calculations, wind star for diversions, drift calculations for multi-leg flights, and weather information display with METAR/TAF decoding.

## Project Structure

```
winddrift/
├── index.html           # Drift calculator (per-leg wind support)
├── windstar.html        # Wind star (8-point reference)
├── weather.html         # Weather display (METAR/TAF)
├── spotwind.html        # Spot wind visualization
├── flightplan.html      # Interactive flight plan map
├── styles.css           # Shared CSS styles
├── common.js            # Shared functions and navigation
├── .gitignore          # Git ignore file
├── README.md           # Project readme
└── DOCUMENTATION.md     # This file
```

## Architecture

### Shared Components

#### styles.css
Common styling for both pages including:
- Base styles and reset
- Container and layout styles
- Navigation tabs (2x2 grid on mobile)
- Form elements (inputs, buttons)
- Results display components
- Flight category color coding
- Responsive breakpoints

#### common.js
Shared JavaScript functionality:
- `updateClock()` - Updates Zulu and UK local time displays
- `generateNavigation()` - Creates standardized navigation HTML
- `setActiveNav()` - Handles navigation highlighting (all 5 pages)
- `initializeCommon()` - Initializes navigation, clock, and active tabs
- `calculateWindTriangle()` - Core wind triangle mathematics
- `toRadians()`, `toDegrees()`, `normalizeHeading()` - Utility functions

### Recent Updates (December 2024)

#### Core Functionality Updates:
1. **Corrected Wind Triangle Calculation** - Fixed critical formula error (was adding WCA instead of subtracting)
2. **Per-Leg Wind Support** - Individual wind inputs for each leg in drift calculator
3. **Master Wind Cascading** - New legs automatically inherit master wind values
4. **Flight Plan Integration** - Seamless export from map to drift calculator with mobile Safari fixes
5. **Satellite Map View** - Toggle between street and satellite views on flight plan map

#### Mobile Optimizations:
6. **5-Column Navigation** - All navigation tabs displayed side-by-side on mobile
7. **Compressed Spot Wind Controls** - Altitude/time buttons in 3-column grid layout
8. **Balanced Table Columns** - Optimized track (80px) and distance (65px) column widths
9. **Compact Delete Buttons** - Reduced size with 9px font on mobile devices
10. **Current Date Display** - Added date to time display across all pages
11. **Mobile Safari Import Fix** - Added localStorage checks and fallback mechanisms
12. **Waypoint Clarity** - "TO" prefix for destination waypoints

#### Technical Improvements:
13. **Unified Wind Calculations** - Single source of truth in common.js
14. **Navigation Error Handling** - Retry mechanisms and fallback strategies
15. **Altitude-Based Wind Data** - Pressure level interpolation for accurate winds
16. **Enhanced Spot Wind** - Real-time wind visualization with altitude/time controls

### Pages

## index.html - Drift Calculator

### Functions

**Purpose**: Multi-leg flight planning with per-leg wind data and cumulative time/distance

**calculateLeg(row)**
- Calculates heading/GS for individual leg using leg-specific wind data
- Uses individual wind inputs from each table row
- Updates row with magnetic heading, ground speed, time

**addLeg()**
- Adds new row to flight plan table
- Automatically copies master wind values to new leg
- Attaches event listeners for dynamic updates on all inputs

**removeLeg(button)**
- Removes selected leg from flight plan
- Renumbers remaining legs automatically
- Updates totals after removal

**copyMasterWindToAllLegs()**
- Propagates master wind changes to all existing legs
- Triggered when master wind inputs are modified
- Allows bulk updates while preserving individual overrides

**importFlightPlan()**
- Imports flight plan data from localStorage
- Populates all leg data including winds from flight plan map
- Automatically triggered with ?import=flightplan URL parameter

**updateTotals()**
- Sums total distance and time across all legs

### Input Fields
#### Master Inputs (cascade to new legs):
- Master Wind Direction (°) - Applied to new legs
- Master Wind Speed (kt) - Update individual legs below
- TAS (kt) - True airspeed, defaults to 98kt (PA28 Warrior II)
- Magnetic Variation (°) - Default -0.5° (White Waltham 2025)

#### Per-Leg Inputs:
- Track (°T) - Desired track over ground
- Distance (nm) - Leg distance
- Wind Dir (°) - Individual leg wind direction
- Wind Spd (kt) - Individual leg wind speed

#### Outputs:
- Hdg (°M) - Magnetic heading to steer
- GS (kt) - Ground speed
- Time (min) - Leg time

## windstar.html - Wind Star

### Functions

**generateWindStar()**
- Calculates wind effects for 8 cardinal directions
- Displays in 3x3 grid (compass rose layout)
- Shows ground speed and WCA for each direction
- Identifies best/worst ground speeds for diversions

## weather.html - Weather Display

### Map Display
**Purpose**: Visual representation of flight categories at airports

**initMap()**
- Initializes Leaflet map centered on Southern England
- Creates markers for 16 UK airports
- Labels markers with ICAO codes above

**loadAllWeather()**
- Fetches current METAR for all airports
- Updates marker colors based on flight category

**updateMarker(icao)**
- Updates individual marker color
- Colors: Green (VFR), Blue (MVFR), Red (IFR), Purple (LIFR), Grey (No data)

**updateQuickAccessButtons()**
- Adds status dots to airport buttons
- Updates dynamically as weather loads

### Flight Category Logic
**getFlightCategory(ceiling, visibility)**
- LIFR: Ceiling <500ft OR visibility <1SM
- IFR: Ceiling <1000ft OR visibility <3SM
- MVFR: Ceiling <3000ft OR visibility <5SM
- VFR: Ceiling ≥3000ft AND visibility ≥5SM

**getCeiling(clouds)**
- Returns lowest BKN/OVC/VV layer height
- Returns 999999 if no ceiling

### METAR Decoding
**decodeMetar(metar)**
Decodes:
- Observation time
- Flight category with color badge
- Wind (direction, speed, gusts, variable, calm)
- Visibility (handles 9999 = 10km+, 0000 = <50m)
- Weather phenomena (using weatherCodes dictionary)
- Cloud layers (using cloudTypes dictionary)
- Temperature/dewpoint with spread
- QNH (hPa and inHg)

### TAF Decoding
**decodeTaf(taf)**
Parses TAF sections:
- Groups periods by day with visual separation
- Adds "Today/Tomorrow" labels
- Sorts periods chronologically within each day
- Base forecast
- TEMPO (temporary changes)
- BECMG (becoming)
- PROB (probability)
- FM (from time)

**parseTafConditions(line)**
- Extracts ceiling and visibility from TAF line
- Used to calculate flight category for each period

**decodeTafLine(line)**
- Decodes individual TAF period
- Shows wind, visibility, weather, clouds
- Each period gets flight category badge

### Weather Dictionaries

**weatherCodes**
Complete ICAO weather phenomena:
- Intensity: -, +, VC
- Descriptors: MI, PR, BC, DR, BL, SH, TS, FZ
- Precipitation: DZ, RA, SN, GR, etc.
- Obscuration: BR, FG, FU, HZ, etc.
- Other: SQ, FC, DS, SS

**cloudTypes**
- SKC, CLR, NSC, NCD
- FEW (1-2 oktas), SCT (3-4), BKN (5-7), OVC (8)
- Special: VV (vertical visibility), CB, TCU

### API Integration
**Data Source**: aviationweather.gov
- No API key required
- Endpoints:
  - METAR: `/api/data/metar?ids={icao}&format=json`
  - TAF: `/api/data/taf?ids={icao}&format=json`

**fetchWeather(icao)**
- Fetches both METAR and TAF
- Calls decode functions
- Updates display and map marker

## Calculations Reference

### Wind Triangle Mathematics (CORRECTED)
```
Wind Angle = Wind Direction - True Course
Crosswind = Wind Speed × sin(Wind Angle)
Headwind = Wind Speed × cos(Wind Angle)

// Wind Correction Angle calculation
WCA = arcsin((Wind Speed / TAS) × sin(Wind Angle))

// Heading to steer (SUBTRACT WCA from track)
True Heading = True Course - WCA
Magnetic Heading = True Heading - Variation

// Ground Speed using cosine rule
Ground Speed = TAS × cos(WCA) + Wind Speed × cos(Wind Angle)

Note: Previous implementation incorrectly added WCA to track.
The corrected formula subtracts WCA as per standard aviation practice.
```

### Time Calculations
```
Time (minutes) = Distance (nm) / Ground Speed (kt) × 60
```

## Mobile Optimizations

### Navigation Layout
- 5-column grid for all navigation tabs (was 2x2)
- All tabs visible without scrolling
- Active tab highlighting maintained

### Spot Wind Controls
- Altitude buttons: 3-column grid (Surface/5000/FL100)
- Time buttons: 3-column grid for hours ahead
- Significant space reduction while maintaining usability

### Table Optimizations
- Drift calculator columns balanced:
  - Leg: 35px
  - Track: 80px (was too narrow for 3 digits)
  - Distance: 65px (reduced from default)
  - Wind Dir/Spd: 60px each
  - Outputs: appropriate widths

### Button Sizing
- Delete buttons: 9px font, 3px 6px padding on mobile
- Uses !important to override default styles
- Consistent across flight plan and drift calculator

### Safari Compatibility
- localStorage availability checks
- Fallback URL parameter parsing
- Manual import button as backup
- Error handling for restricted environments

## Browser Compatibility
- Modern browsers with ES6 support
- Leaflet.js for map compatibility (v1.9.4)
- Automatic BST/GMT handling for UK time
- Mobile Safari: localStorage restrictions handled
- Touch event support for mobile devices
- Responsive design tested on iPhone/Android

## Default Values
- TAS: 98 knots (Piper Warrior II cruise speed)
- Magnetic Variation: -0.5° (White Waltham 2025) - User adjustable
- Map center: 51.5°N, 0.5°W (Southern England)
- Default altitude: 3000ft for wind fetching
- Time display: Shows current date, Zulu time, and UK local time

## flightplan.html - Interactive Flight Plan Map

### Functions

**Purpose**: Visual flight planning with automatic wind data fetching and satellite view

**initMap()**
- Initializes Leaflet map with street and satellite layers
- Adds layer control for map type switching
- Centers on Southern England (51.5°N, 0.5°W)

**addWaypoint(lat, lng)**
- Adds waypoint marker to map with "WP" prefix
- Calculates distance and track from previous waypoint
- Triggers automatic wind fetching for new leg
- Labels waypoints as "TO WP(n)" for clarity

**fetchWindData(lat, lng, altitude)**
- Fetches wind data from Open-Meteo API
- Uses pressure level interpolation based on altitude
- Caches results to reduce API calls
- Returns wind speed and direction

**exportFlightPlan()**
- Compiles all leg data including wind information
- Stores in localStorage (with availability check for Safari)
- Navigates to drift calculator with import parameter
- Includes fallback for mobile Safari restrictions

**Map Layers**
- Street Layer: OpenStreetMap standard tiles
- Satellite Layer: ESRI World Imagery tiles
- Toggle control in top-right corner

**updateAltitude(waypointId, altitude)**
- Updates waypoint altitude and refetches wind data
- Triggers recalculation of wind for affected leg

### Input Fields
- Departure Time - For accurate wind forecasts
- Individual altitude inputs per waypoint (0-15,000ft)

### Features
- Click-to-add waypoints on interactive map
- Automatic distance/track calculations using Haversine formula
- Real-time wind fetching at leg midpoints
- Visual waypoint management with delete capability
- Export to drift calculator with all data intact

## spotwind.html - Spot Wind Visualization

### Functions

**Purpose**: Real-time wind visualization with interactive controls

**fetchSpotWindData()**
- Fetches wind grid data from Open-Meteo API
- Processes multiple pressure levels for altitude selection
- Updates wind arrows and color coding

**Features**
- Interactive map with wind arrow overlay
- Altitude slider (surface to 10,000ft / FL100)
- Time slider for forecast winds (0-24 hours ahead)
- Crosshair with interpolated wind at center point
- Color-coded wind strength indicators
- Bilinear interpolation for smooth wind transitions

## Known Issues and Fixes

### Navigation Disappearing
- **Issue**: Navigation bar occasionally fails to load
- **Fix**: Added retry mechanism with 100ms and 500ms delays
- **Logging**: Console logs for debugging navigation generation

### Mobile Safari Import
- **Issue**: localStorage restricted in private browsing
- **Fix**: Added availability check and URL parameter fallback
- **Workaround**: Manual "Import Flight Plan" button

### Wind Calculation Error (FIXED)
- **Issue**: Was adding WCA to track instead of subtracting
- **Fix**: Corrected formula in common.js calculateWindTriangle()
- **Impact**: All pages now use correct unified calculation

## Future Extension Points
The modular structure allows easy addition of:
- New pages (add HTML file, link in navigation)
- Additional airports (add to airports object)
- New weather features (extend decode functions)
- Different aircraft defaults (modify form defaults)
- Additional calculations (extend common.js)
- Weather overlays and visualizations
- More map layers (terrain, aviation charts)
- Flight plan saving/loading to files