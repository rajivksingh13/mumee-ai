# MumeeAI

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## CI/CD Pipeline Setup

This project includes an automated CI/CD pipeline that builds and deploys to Firebase when changes are pushed to the `master` branch.

### Prerequisites

1. **Firebase CLI Token**: You need to generate a Firebase CLI token for automated deployment.

### Setup Instructions

1. **Generate Firebase CLI Token**:
   ```bash
   firebase login:ci
   ```
   This will open a browser window for authentication and output a token.

2. **Add GitHub Secret**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1

3. **Verify Setup**:
   - Push any change to the `master` branch
   - Check the Actions tab in your GitHub repository
   - The workflow should automatically run and deploy to Firebase

### What the Pipeline Does

1. **Triggers**: Automatically runs on every push to the `master` branch
2. **Build**: Installs dependencies and builds the React app
3. **Deploy**: Deploys both hosting and functions to Firebase
4. **Status**: You can monitor deployment status in the GitHub Actions tab

### Manual Deployment

If you need to deploy manually:
```bash
npm run build
firebase deploy
```
