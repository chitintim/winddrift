# Wind Drift Calculator

A comprehensive web-based aviation tool for UK PPL pilots, providing wind calculations, weather decoding, and interactive wind visualization.

## Features

### 🧮 Drift Calculator
- Calculate wind correction angles and ground speed
- Multi-leg flight planning with individual wind data per leg
- Master wind input that automatically cascades to new legs
- Individual wind override capability for each leg
- Import flight plans directly from Flight Plan Map
- Real-time magnetic variation

### ⭐ Wind Star
- 8-point wind reference (N, NE, E, SE, S, SW, W, NW)
- Ground speed and drift for all cardinal/intercardinal headings
- Quick visual reference for wind effects

### 🌤️ Weather Station
- METAR decoder with flight categories (VFR/MVFR/IFR/LIFR)
- TAF decoder with day grouping and temporal organization
- Quick access to major UK airports (Heathrow, Gatwick, Manchester, etc.)
- Human-readable weather translations

### 🗺️ Spot Wind Visualization
- Interactive map with real-time wind data
- Altitude selection from surface to FL100 (10,000ft)
- Time slider for forecast winds (0-24 hours ahead)
- Wind speed and direction at any point via bilinear interpolation
- Color-coded wind strength indicators

### ✈️ Flight Plan Map
- Click-to-add waypoints on interactive map
- Automatic distance and track calculations between waypoints
- Altitude selection for each leg (0-15,000ft)
- Automatic wind fetching at leg midpoints
- Departure time setting for accurate wind forecasts
- Export complete flight plan to drift calculator

## Technical Details

### Data Sources
- **Weather Data**: aviationweather.gov ADDS API
- **Wind Forecasts**: Open-Meteo API (no key required)
- **Map Tiles**: OpenStreetMap via Leaflet.js

### Key Technologies
- Vanilla JavaScript for calculations
- Leaflet.js for interactive mapping
- CSS Grid for responsive layouts
- Local storage for user preferences

### Wind Calculations
- Uses standard wind triangle formulas
- Accounts for magnetic variation
- Interpolates between pressure levels for altitude
- Circular interpolation for wind direction

## Usage

Simply open `index.html` in a modern web browser. The application is fully client-side and requires no installation.

### Navigation
- Use the tab buttons to switch between features
- Standardized navigation across all pages (dynamically generated)
- All times display in both Zulu (UTC) and UK local time
- Mobile-responsive design with 3-column grid navigation on small screens
- 5 main sections: Drift Calc, Wind Star, Weather, Spot Wind, Flight Plan

### Flight Planning Workflow
1. **Flight Plan Map**: Click to add waypoints, set altitudes, choose departure time
2. **Automatic Wind Fetching**: Wind data retrieved for each leg midpoint
3. **Export to Drift Calculator**: One-click transfer with all data intact
4. **Per-Leg Wind Control**: Fine-tune individual leg winds in drift calculator

## Browser Requirements
- Modern browser with ES6+ support
- Internet connection for weather data and map tiles
- JavaScript enabled

## Development

### File Structure
```
/
├── index.html          # Drift calculator with per-leg wind support
├── windstar.html       # Wind star display
├── weather.html        # Weather decoder
├── spotwind.html       # Spot wind visualization
├── flightplan.html     # Interactive flight plan map
├── common.js           # Shared functions and navigation
└── styles.css          # Common styles
```

### Recent Updates (December 2024)

#### Core Functionality
- **Per-Leg Wind Data**: Drift calculator supports individual wind inputs for each leg
- **Master Wind Cascading**: New legs automatically inherit master wind values
- **Flight Plan Integration**: Seamless import from flight plan map to drift calculator
- **Corrected Wind Calculations**: Fixed wind triangle formula to use proper aviation equations
- **Satellite Map View**: Toggle between street and satellite views on flight plan map

#### Mobile Optimizations
- **Responsive Navigation**: All 5 tabs displayed side-by-side on mobile
- **Compressed Controls**: Spot wind altitude/time buttons in 3-column grid
- **Optimized Tables**: Balanced column widths with proper track input sizing
- **Compact UI Elements**: Smaller delete buttons and better space utilization
- **Current Date Display**: Added date to time display across all pages

#### Technical Improvements
- **Standardized Navigation**: Dynamic generation from common.js
- **Enhanced Wind Fetching**: Altitude-based data with pressure level interpolation
- **Unified Calculations**: Single source of truth for wind triangle math
- **Mobile Safari Fixes**: Improved compatibility and import functionality
- **Error Handling**: Better navigation loading with retry mechanisms

### API Integration
- Weather data fetched via CORS proxy when needed
- Open-Meteo provides free wind forecast data
- No API keys required for current services

## License

This project is for educational and personal use by UK PPL pilots.