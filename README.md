# Job Hiring Website

A modern, full-stack job hiring platform built with Next.js, TypeScript, and Prisma. This application connects job seekers with employers, providing a seamless experience for posting jobs, applying to positions, and managing applications.

## Features

- 🔐 **Authentication & Authorization**
  - Secure user authentication with NextAuth.js
  - Email/Password and Google OAuth login
  - Role-based access control (Employer/Job Seeker)
  - Protected routes and middleware
  - Email verification with OTP
  - Password reset functionality

- 👥 **User Roles**
  - Employers: Post jobs, manage applications, view candidates
  - Job Seekers: Browse jobs, apply to positions, manage applications

- 💼 **Job Management**
  - Create and edit job postings
  - Rich text editor for job descriptions
  - Job application tracking
  - PDF resume upload and viewing
  - Job status management (applied, reviewing, interview, hired, rejected)

- 🎨 **Modern UI/UX**
  - Built with Tailwind CSS and Radix UI
  - Responsive design
  - Modern component library
  - Toast notifications for user feedback

## Tech Stack

- **Frontend:**
  - Next.js 15
  - React 18
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Framer Motion

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database
  - NextAuth.js

- **File Storage:**
  - Cloudinary

- **Additional Tools:**
  - React Hook Form
  - Socket.io for real-time features
  - Jodit React for rich text editing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Cloudinary account (for file storage)
- Google OAuth credentials (for Google login)
- Resend API key (for email notifications)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd job-hiring-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   AUTH_SECRET="your-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   EDGE_STORE_ACCESS_KEY="your-edge-store-key"
   EDGE_STORE_SECRET_KEY="your-edge-store-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   RESEND_API_KEY="your-resend-api-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
job-hiring-website/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── context/         # React context providers
│   ├── service/         # API service functions
│   └── middleware.ts    # Next.js middleware
├── prisma/              # Database schema and migrations
├── public/             # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate` - Generate Prisma client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or open an issue in the repository.
