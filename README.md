# User Registration System

A modern, comprehensive web application for user registration and profile management built with Vue 3, Pinia, Vuetify, and TypeScript.

## 🚀 Features

### Comprehensive User Registration
- **Personal Information**: Full name, age, gender selection
- **Contact Details**: Phone number with formatting, email validation
- **Security**: Strong password requirements with strength indicator
- **Validation**: Real-time field validation with detailed error messages

### Advanced Validation System
- **Age Verification**: Minimum age requirement (13+ years)
- **Gender Selection**: Inclusive options (Male, Female, Non-binary, Prefer not to say, Other)
- **Phone Formatting**: Automatic phone number formatting and validation
- **Email Uniqueness**: Prevents duplicate email registrations
- **Password Strength**: 8+ characters with complexity requirements

### User Profile Management
- **CRUD Operations**: Create, Read, Update, Delete user profiles
- **Search & Filter**: Find users by name, email, phone, gender, or age range
- **Statistics Dashboard**: User counts, average age, recent registrations
- **Responsive Table**: Sortable data table with pagination

### Technical Features
- **Type Safety**: Full TypeScript implementation with interfaces
- **State Management**: Pinia store with local storage persistence
- **Modern UI**: Vuetify 3 components with responsive design
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: Graceful error handling with user feedback

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **State Management**: Pinia
- **UI Framework**: Vuetify 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Storage**: Local Storage with JSON persistence

## 📋 Requirements

- Node.js 16+ 
- npm or yarn package manager
- Modern web browser with ES2020 support

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FormRegistration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
FormRegistration/
├── src/
│   ├── components/          # Vue components
│   │   ├── UserRegistrationForm.vue
│   │   └── UserProfileManager.vue
│   ├── stores/             # Pinia stores
│   │   └── userStore.ts
│   ├── types/              # TypeScript interfaces
│   │   └── user.ts
│   ├── utils/              # Utility functions
│   │   └── validation.ts
│   ├── views/              # Page components
│   │   ├── HomeView.vue
│   │   └── UsersView.vue
│   ├── router/             # Vue Router configuration
│   │   └── index.ts
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## 📱 Usage

### User Registration
1. Navigate to the home page
2. Fill out the comprehensive registration form
3. All fields are validated in real-time
4. Password strength is displayed with visual feedback
5. Submit the form to create your account

### User Management
1. Navigate to "User Management" from the navigation
2. View all registered users in a sortable table
3. Search and filter users by various criteria
4. Edit user profiles by clicking the edit button
5. Delete users with confirmation dialog
6. View detailed user information

### Form Validation Rules

#### Full Name
- Required field
- 2-100 characters
- Letters, spaces, hyphens, and apostrophes only

#### Age
- Required field
- Minimum age: 13 years
- Maximum age: 120 years
- Must be a whole number

#### Gender
- Required selection
- Options: Male, Female, Non-binary, Prefer not to say, Other

#### Phone Number
- Required field
- 10-16 digits
- Automatic formatting applied
- International format support

#### Email
- Required field
- Valid email format
- Maximum 254 characters
- Must be unique across all users

#### Password
- Required field
- Minimum 8 characters
- Must include:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- Strength indicator with visual feedback

## 🎨 UI Components

The application uses Vuetify 3 components for a modern, responsive design:

- **Navigation**: App bar with navigation drawer
- **Forms**: Text fields, selects, expansion panels
- **Data Display**: Data tables, cards, chips, avatars
- **Feedback**: Snackbars, progress indicators, icons
- **Layout**: Grid system, containers, spacing utilities

## 🔒 Security Features

- **Password Strength**: Comprehensive password requirements
- **Input Validation**: Client-side validation for all fields
- **Data Sanitization**: Input cleaning and formatting
- **Local Storage**: Secure local data persistence
- **Error Handling**: Graceful error management

## 📊 Data Persistence

- **Local Storage**: All user data stored locally in browser
- **JSON Format**: Structured data storage
- **Automatic Loading**: Data persistence across browser sessions
- **Backup Ready**: Easy export/import functionality

## 🌟 Key Benefits

1. **Comprehensive**: Covers all aspects of user registration
2. **Type Safe**: Full TypeScript implementation
3. **Responsive**: Works on all device sizes
4. **Accessible**: Modern UI with accessibility features
5. **Maintainable**: Clean, organized code structure
6. **Scalable**: Easy to extend with additional features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Vue 3, Pinia, Vuetify, and TypeScript**
