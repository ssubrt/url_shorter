# Link Glow Analytics Hub

![Project Logo](public/placeholder.svg) <!-- Replace with actual logo if available -->

A modern URL shortener with comprehensive analytics capabilities, built with React, TypeScript, and MongoDB.

## Features

- **URL Shortening**: Create short, memorable links
- **Custom Aliases**: Option to create custom short URLs
- **Link Analytics**: Track clicks, locations, devices, and browsers
- **QR Code Generation**: Generate QR codes for your shortened links
- **User Authentication**: Secure login Page
- **Dashboard**: Beautiful data visualization of link performance
- **API Integration**: Ready-to-use API endpoints

## Tech Stack

- **Frontend**: 
  - React + TypeScript
  - Vite (Build Tool)
  - Tailwind CSS (Styling)
  - ShadCN UI Components
- **Backend**:
  - Node.js (API)
- **Other**:
  - Axios (HTTP Client)
  - React Router (Routing)
  - Sonner (Toasts)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/link-glow-analytics-hub.git
cd link-glow-analytics-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```env
VITE_API_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/linkglow
JWT_SECRET=your_jwt_secret_here
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
link-glow-analytics-hub/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # Reusable components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Application pages
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── .gitignore
├── package.json
├── README.md
└── vite.config.ts     # Vite configuration
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build


## Screenshots

![Login Preview](assets/Screenshot%202025-04-13%20101901.png)

![Dashboard Preview](assets/Screenshot%202025-04-13%20101945.png)
![Dashboard Preview](assets/Screenshot%202025-04-13%20102144.png)
![Dashboard Preview](assets/Screenshot%202025-04-13%20102109.png)

![Analytics Preview](assets/Screenshot%202025-04-13%20102029.png)
![Analytics Preview](assets/Screenshot%202025-04-13%20102046.png)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - subratgangwar03@gmail.com

Project Link: [https://github.com/ssubrt/link-glow-analytics-hub](https://github.com/ssubrt/link-glow-analytics-hub)
