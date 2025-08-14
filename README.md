# Easton Kitchen & Bath Remodel Website

A modern, responsive website for Easton Kitchen & Bath Remodel, built with Next.js 15, React 19, and TypeScript. This website showcases kitchen and bathroom remodeling services with advanced features like file uploads, quote submissions, and project management.

## 🏗️ Project Overview

This is a professional contractor website that serves as both a marketing platform and a project management tool for Easton Kitchen & Bath Remodel. The site features a multi-step quote form, file upload system, and comprehensive project showcase.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Framer Motion, Swiper, React Icons
- **Forms**: Custom multi-step forms with validation
- **File Handling**: File upload/download with archiving
- **Email**: Resend for email notifications
- **External APIs**: JotForm integration, Google reCAPTCHA
- **Deployment**: Optimized for production with image optimization

## 📁 Project Structure

```
eastonkitchenbathremodel.com/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── delete-file/         # File deletion endpoint
│   │   ├── get-files/           # File retrieval endpoint
│   │   ├── save-notes/          # Notes saving endpoint
│   │   ├── submit-quote/        # Quote submission endpoint
│   │   ├── update-quote/        # Quote update endpoint
│   │   └── upload-file/         # File upload endpoint
│   ├── upload/                  # File upload pages
│   │   └── [id]/               # Dynamic upload pages by ID
│   ├── globals.css              # Global styles
│   ├── HomeContent.tsx          # Main homepage component
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── public/                      # Static assets
│   ├── 3D/                     # 3D rendering images
│   ├── Bathroom/               # Bathroom project photos
│   ├── Kitchen/                # Kitchen project photos
│   ├── BeforeAfter/            # Before/after comparison photos
│   └── team photos             # Team and contractor images
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## 🎯 Key Features

### 1. Multi-Step Quote Form (`HomeContent.tsx`)
- **Step 1**: Contact information collection
- **Step 2**: Project details and budget
- **Step 3**: Form submission and redirect
- Integrated with Google reCAPTCHA for spam protection
- Real-time validation and error handling
- Responsive design with smooth animations

### 2. File Management System (`upload/[id]/`)
- **File Upload**: Drag-and-drop file uploads with progress tracking
- **File List**: Organized display of uploaded files with metadata
- **Notes System**: Rich text editor for project notes
- **File Operations**: Download, delete, and archive functionality
- **JotForm Integration**: Seamless connection with external form system

### 3. API Endpoints (`app/api/`)
- **Quote Submission**: Handles form data and sends to JotForm
- **File Operations**: Upload, download, and delete files
- **Notes Management**: Save and retrieve project notes
- **Security**: reCAPTCHA verification and input validation

### 4. SEO Optimization (`page.tsx`)
- **Meta Tags**: Comprehensive SEO metadata
- **Structured Data**: Schema.org markup for local business
- **Open Graph**: Social media optimization
- **Performance**: Image optimization and caching

## 🔧 How It Works

### Quote Form Flow
1. User fills out initial contact form
2. Form validates input and shows project selection
3. User selects project type and budget
4. reCAPTCHA verification prevents spam
5. Data is submitted to JotForm via API
6. Email notifications are sent to staff
7. User is redirected to file upload page

### File Management Flow
1. User accesses upload page with unique ID
2. Files can be uploaded via drag-and-drop
3. Files are stored and organized by project
4. Notes can be added and saved
5. Files can be downloaded individually or as archives
6. All operations are logged and tracked

### API Architecture
- **RESTful Design**: Clean, predictable endpoints
- **Error Handling**: Comprehensive error responses
- **Validation**: Input sanitization and verification
- **Integration**: External service connections (JotForm, Resend)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Environment variables configured

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd eastonkitchenbathremodel.com

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

### Environment Variables
```bash
# JotForm Integration
JOTFORM_API_KEY=your_jotform_api_key
JOTFORM_QUOTE_FORM=your_form_id

# Email Service
RESEND_API_KEY=your_resend_api_key

# Security
RECAPTCHA_SECRET=your_recaptcha_secret

# Environment
NEXT_PUBLIC_ENVIRONMENT=DEV|PROD
```

### Build and Deploy
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 🎨 Customization

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Animations**: Framer Motion for smooth interactions

### Content Management
- **Image Assets**: Organized in public folders
- **Dynamic Content**: React components for easy updates
- **SEO**: Meta tags and structured data
- **Performance**: Image optimization and lazy loading

## 🔒 Security Features

- **reCAPTCHA**: Bot protection on forms
- **Input Validation**: Server-side validation
- **API Security**: Rate limiting and error handling
- **File Upload**: Secure file handling and validation

## 📱 Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Gesture support for mobile devices
- **Performance**: Optimized images and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Performance Optimizations

- **Next.js 15**: Latest framework with App Router
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Caching**: Strategic caching strategies
- **Bundle Analysis**: Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Easton Kitchen & Bath Remodel.

## 📞 Support

For technical support or questions about the website, contact the development team.

---

**Built with ❤️ using Next.js, React, and TypeScript**
