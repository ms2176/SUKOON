# SUKOON Smart Home Management

SUKOON is a modern, React-based smart home management application that allows users to control their smart devices, monitor energy consumption, and participate in gamification features that encourage sustainable living.

![SUKOON Logo](public/vite.svg) <!-- Replace with actual logo -->

## Features

- **User Authentication**: Secure login and registration with email/password or Google Sign-In
- **Multi-Home Management**: Add and manage multiple homes/hubs
- **Room & Device Control**: Organize devices by room and control them remotely
- **Energy Monitoring**: Track energy consumption with detailed statistics and visualizations
- **Be'ati Gamification**: Grow a virtual greenhouse by meeting energy-saving goals
- **Energy Assistant**: AI-powered chatbot for energy management recommendations
- **Admin Dashboard**: Special features for property managers to monitor multiple units
- **Device Pinning**: Pin frequently used devices and rooms to your home screen
- **Responsive Design**: Works across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js v16 or later
- npm or yarn package manager
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ms2176/SUKOON.git
   cd SUKOON
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Architecture

SUKOON is built using the following technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Flowbite React components
- **Backend Services**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router Dom
- **API Integration**: Fetch for data retrieval from SUKOON APIs and Groq for AI chatbot

## Project Structure

```
sukoon/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── App.tsx             # Main application component with routing
│   ├── assets/             # Fonts and other static assets
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Basic UI components (buttons, dialogs, etc.)
│   ├── config/             # Configuration files
│   │   └── firebase_conf.ts # Firebase initialization
│   ├── customComponents/   # Feature-specific components
│   │   ├── account/        # User account management
│   │   ├── beati/          # Gamification feature
│   │   ├── homepage/       # Main dashboard
│   │   ├── login/          # Authentication flow
│   │   ├── navBar/         # Navigation components
│   │   ├── rooms/          # Room and device management
│   │   ├── settings/       # App settings
│   │   └── stats/          # Statistics visualization
│   ├── images/             # Image assets
│   ├── JSONFiles/          # Static JSON data for development
│   ├── utilities/          # Utility functions
│   │   └── firebase_auth_functions.ts
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── .gitignore              # Git ignore file
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## User Roles

SUKOON supports two main user roles:

- **Tenants**: Regular users who manage their own homes, rooms, and devices
- **Admins**: Property managers who can monitor multiple tenant units and view aggregated statistics

## Development

### Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production-ready app
- `npm run lint`: Run ESLint to check code quality

### Adding a New Device Type

1. Create a new control component in `src/customComponents/rooms/deviceconfigurations/`
2. Add appropriate icons in `src/images/devicesIcons/`
3. Update the device type mappings in relevant files
4. Add the new device type to the control page routing

### Adding a New Feature

1. Create components in a new directory under `src/customComponents/`
2. Add new routes in `App.tsx`
3. Update navigation components as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built by the SUKOON team
- UI components from Flowbite React, Chakra UI, and HeroUI
- Icons and illustrations from various sources
