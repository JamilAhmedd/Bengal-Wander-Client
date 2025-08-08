# Bengal Wander

Bengal Wander is a MERN stack travel agency website promoting Bangladesh tourism. It offers a responsive platform for exploring destinations, culture, cuisine, and activities with secure user authentication and dynamic tour management.

## Main Technologies Used
- **Frontend**: React, React Router, Tailwind CSS, DaisyUI, Tanstack Query
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Google Login, JSON Web Tokens (JWT)
- **File Storage**: Cloudinary (for image uploads)
- **Payment Processing**: Stripe

## Core Features
- **User Authentication**: Secure login with Google OAuth and JWT-based session management.
- **Role-Based Dashboards**: Tailored interfaces for tourists, guides, and admins with specific functionalities.
- **Tour Package Management**: Create, update, and delete tour packages with dynamic pricing and details.
- **Image Uploads**: Cloudinary integration for uploading and managing tour-related images.
- **Payment Processing**: Secure transactions via Stripe for tour bookings.

## Dependencies
### Frontend
- react: ^18.2.0
- react-router-dom: ^6.14.2
- tailwindcss: ^3.3.3
- daisyui: ^3.5.0
- tanstack/react-query: ^5.0.0
- @react-oauth/google: ^0.11.0
- axios: ^1.4.0

### Backend
- express: ^4.18.2
- mongoose: ^7.4.3
- jsonwebtoken: ^9.0.1
- cloudinary: ^1.37.0
- stripe: ^12.14.0
- dotenv: ^16.0.3
- cors: ^2.8.5

## Setup and Running Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account
- Google OAuth credentials
