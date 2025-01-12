# Disease Tracker Platform

**Disease Tracker Platform** is an innovative tool designed to visualize disease outbreak data in real-time. By aggregating information from hospitals, this platform generates an interactive map with heatmaps to highlight outbreak areas, the number of cases, and their severity. This helps healthcare professionals and policymakers take informed actions quickly.

## Features

- **Interactive Map with Heatmaps:**
  Displays areas of outbreaks based on severity and case count.

- **Real-Time Data Visualization:**
  Continuously updates with data received from hospitals.

- **User-Friendly Interface:**
  Designed for healthcare professionals, policymakers, and researchers.

- **Backend Options:**
  Supports both Node.js and Python backend implementations.

---

## 🚀 **Setup Instructions**

### 1. **Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

---

### 2. **Recommended VS Code Extensions**
Install these extensions for the best development experience:
- **ESLint**
- **Prettier**
- **TypeScript and JavaScript Language Features**
- **Tailwind CSS IntelliSense**

---

### 3. **Project Setup**

Open a terminal and follow these steps:

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

---

### 4. **VS Code Settings**
Configure VS Code for seamless formatting and linting. Create `.vscode/settings.json` with the following:

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

---

### 5. **Environment Setup**
Create a `.env` file in the root directory to specify your API URL:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📂 **Project Structure**

```
disease-tracker/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/           # API services
│   └── types/              # TypeScript types
├── server/                 # Backend server code
├── public/                 # Static assets
└── backend/                # Python backend (alternative)
```

---

## 🛠️ **Available Scripts**

| Script             | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Start the frontend development server    |
| `npm run server`   | Start the Node.js backend server         |
| `npm run build`    | Build the frontend for production        |
| `npm run preview`  | Preview the production build locally     |

---

## 🔍 **Development Notes**

- Frontend runs on: [http://localhost:5173](http://localhost:5173)
- Backend API runs on: [http://localhost:8000](http://localhost:8000)
- SQLite database file: `server/database.sqlite` (auto-created)

---

## 🌐 **How It Works**

1. **Data Aggregation:**
   Hospitals submit real-time outbreak data to the backend.

2. **Heatmap Visualization:**
   The frontend uses this data to generate an interactive heatmap, showing:
   - Number of cases
   - Severity levels

3. **User Interaction:**
   Users can explore the map to understand the spread and severity of outbreaks.

---

## 🧰 **Tech Stack**

- **Frontend:**
  - [React](https://reactjs.org/) for building the user interface.
  - [Vite.js](https://vitejs.dev/) for fast development and building tools.
  - [Tailwind CSS](https://tailwindcss.com/) for styling and responsive design.
  - [Leaflet](https://leafletjs.com/) for interactive map and heatmap rendering.

- **Backend:**
  - [Node.js](https://nodejs.org/) for the primary backend server.
  - [Python](https://www.python.org/) as an alternative backend implementation.
  - [SQLite](https://www.sqlite.org/index.html) for lightweight database management.

- **Additional Tools:**
  - [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality and formatting.
  - [TypeScript](https://www.typescriptlang.org/) for type safety.

---

**Start tracking disease outbreaks and make informed decisions to save lives!**
