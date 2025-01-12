# Disease Tracker Platform

## Setup Instructions

1. **Prerequisites**
   - Node.js (v16 or higher)
   - VS Code
   - Git

2. **VS Code Extensions**
   Install these recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

3. **Project Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd disease-tracker

   # Install dependencies
   npm install

   # Start the development server
   npm run dev

   # In a separate terminal, start the backend server
   npm run server
   ```

4. **VS Code Settings**
   Create `.vscode/settings.json` with recommended settings:
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib"
   }
   ```

5. **Environment Setup**
   Create `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

## Project Structure

```
disease-tracker/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── server/                # Backend server code
├── public/                # Static assets
└── backend/               # Python backend (alternative)
```

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run server` - Start the Node.js backend server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build locally

## Development Notes

- Frontend runs on http://localhost:5173
- Backend API runs on http://localhost:8000
- SQLite database is automatically created in server/database.sqlite