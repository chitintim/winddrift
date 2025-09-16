# Wind Drift Calculator Documentation

## Overview
A mobile-friendly wind drift calculator for UK Private Pilot License (PPL) navigation. Features wind triangle calculations, wind star for diversions, drift calculations for multi-leg flights, and weather information display with METAR/TAF decoding.

## Project Structure

```
winddrift/
├── index.html           # Drift calculator (multi-leg flight planning)
├── windstar.html        # Wind star (8-point reference)
├── weather.html         # Weather display (METAR/TAF)
├── spotwind.html        # Spot wind visualization (coming soon)
├── styles.css           # Shared CSS styles
├── common.js            # Shared JavaScript functions
├── .gitignore          # Git ignore file
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
- `setActiveNav(pageName)` - Handles navigation highlighting
- `initializeCommon()` - Initializes clock and navigation
- `calculateWindTriangle()` - Core wind triangle mathematics
- `toRadians()`, `toDegrees()`, `normalizeHeading()` - Utility functions

### Recent Updates (September 2025)

1. **Restructured to 3 separate pages** - Each page now has single focus
2. **Fixed TAF visibility parsing** - No longer confuses wind direction with visibility
3. **Added day separation to TAF** - Groups periods by day with "Today/Tomorrow" labels
4. **Improved navigation** - Active page highlighting, 3-column mobile layout
5. **Added flight status indicators** - Colored dots on airport quick access buttons
6. **Fixed mobile styling** - Better button visibility, consistent navigation

### Pages

## index.html - Drift Calculator

### Functions

**Purpose**: Multi-leg flight planning with cumulative time/distance

**calculateWindTriangle(windDir, windSpeed, trueCourse, trueAirspeed)**
- Calculates wind correction angle using trigonometry
- Returns true/magnetic heading, ground speed, wind components
- Formula: WCA = arcsin(crosswind/TAS)


**calculateLeg(row)**
- Calculates heading/GS for individual leg
- Updates row with magnetic heading, ground speed, time

**addLeg()**
- Adds new row to flight plan table
- Attaches event listeners for dynamic updates

**updateTotals()**
- Sums total distance and time across all legs

### Input Fields
- Wind Direction (°) - Direction wind is FROM
- Wind Speed (kt)
- True Course (°) - Desired track over ground
- TAS (kt) - True airspeed, defaults to 98kt (PA28 Warrior II)
- Magnetic Variation (°) - Default -0.5° (White Waltham 2025)

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

### Wind Triangle Mathematics
```
Wind Angle = Wind Direction - True Course
Crosswind = Wind Speed × sin(Wind Angle)
Headwind = Wind Speed × cos(Wind Angle)
WCA = arcsin(Crosswind / TAS)
True Heading = True Course + WCA
Magnetic Heading = True Heading - Variation

Ground Speed calculation uses vector addition:
GSx = TAS × sin(True Heading) + Wind Speed × sin(Wind Direction)
GSy = TAS × cos(True Heading) + Wind Speed × cos(Wind Direction)
Ground Speed = √(GSx² + GSy²)
```

### Time Calculations
```
Time (minutes) = Distance (nm) / Ground Speed (kt) × 60
```

## Mobile Optimizations
- Font size 16px minimum (prevents iOS zoom)
- 2x2 grid navigation on mobile
- Responsive input rows (stack on small screens)
- Touch-friendly button sizes
- Simplified table layouts for small screens

## Browser Compatibility
- Modern browsers with ES6 support
- Leaflet.js for map compatibility
- Automatic BST/GMT handling for UK time

## Default Values
- TAS: 98 knots (Piper Warrior II cruise speed)
- Magnetic Variation: -0.5° (White Waltham 2025)
- Map center: 51.3°N, 0.5°W (Southern England)

## Upcoming Features

### Spot Wind Visualization (spotwind.html)
- Grid overlay showing wind arrows on map
- Altitude slider (0-10,000ft)
- Crosshair with interpolated wind at center
- Uses Open-Meteo API (no key required)
- Color-coded wind speeds
- Pre-loading for smooth transitions

## Future Extension Points
The modular structure allows easy addition of:
- New pages (add HTML file, link in navigation)
- Additional airports (add to airports object)
- New weather features (extend decode functions)
- Different aircraft defaults (modify form defaults)
- Additional calculations (extend common.js)
- Weather overlays and visualizations