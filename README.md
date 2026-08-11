# TV Launcher Addon

A highly customizable, premium Android TV / Google TV style launcher extension for your browser's New Tab page.

## Features

- **TV-Style Interface**: A beautiful, grid-based launcher that feels like a modern smart TV.
- **Categorization**: Organize your favorite websites and web apps into categories.
- **Custom Pages**: Create nested pages to group related apps (e.g., a "Work" page or a "Games" page).
- **Keyboard Navigation**: Fully controllable with arrow keys, just like a real TV interface.
- **Deep Customization**:
  - Themes (Dark, Midnight, AMOLED)
  - Custom backgrounds (Solid, Gradient, Image)
  - Adjustable blur, opacity, and card sizes
  - Configurable grid columns and clock formats
- **Import/Export**: Easily backup and restore your configuration across different devices or browsers.

## Screenshots

*(Add screenshots here)*

## Installation for Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Building for Browsers

Build the extension for your preferred browser using the following commands:

- **Google Chrome**:
  ```bash
  npm run build:chrome
  ```
- **Mozilla Firefox**:
  ```bash
  npm run build:firefox
  ```
- **Chromium / Edge / Opera**:
  ```bash
  npm run build:chromium
  ```
- **Build for all supported browsers**:
  ```bash
  npm run build:all
  ```

## Loading the Extension

### Chrome
1. Navigate to `chrome://extensions`
2. Enable **Developer mode** in the top right corner
3. Click **Load unpacked**
4. Select the `dist/chrome/` directory from this project

### Firefox
1. Navigate to `about:debugging`
2. Click **This Firefox** on the left sidebar
3. Click **Load Temporary Add-on**
4. Select the `dist/firefox/manifest.json` file from this project

### Microsoft Edge
1. Navigate to `edge://extensions`
2. Enable **Developer mode** in the bottom left corner
3. Click **Load unpacked**
4. Select the `dist/chromium/` directory (Edge is fully compatible with Chromium builds)

### Opera
1. Navigate to `opera://extensions`
2. Enable **Developer mode** in the top right corner
3. Click **Load unpacked**
4. Select the `dist/chromium/` directory (Opera is fully compatible with Chromium builds)

## Project Structure

- `src/components/`: Reusable React components (Launcher, Settings, Dialogs, etc.)
- `src/pages/`: Main application routes (Home, Settings, Custom Pages)
- `src/context/`: Global state management
- `src/hooks/`: Custom React hooks for logic and keyboard navigation
- `src/models/`: TypeScript interfaces and types
- `src/browser/`: Browser extension API wrappers

## Technology Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- CSS Modules & Vanilla CSS Variables

## Privacy Policy

This extension is built with privacy in mind. It does **not** track your usage, collect analytics, or communicate with any external servers. All data (including your custom links, categories, and settings) is stored locally on your device using the browser's local storage API.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
