# Soil AI 🌱

Soil AI is an intuitive tool that allows developers and designers to make changes to their web applications just by clicking an element and typing a message. Whether you're tweaking the UI, modifying styles, or altering content, Soil AI streamlines the process and makes development faster and more accessible.

## Features

- **Effortless Editing**: Simply click on any element in your app and type a message describing what you want to change.
- **Real-Time Updates**: See changes happen as you asyncronously as you continue developing.
- **Flexible Integration**: Works seamlessly with any web application, regardless of framework or platform.
- **Context-Aware AI**: The AI understands the context of your app, making precise adjustments based on your instructions.
- **Developer-Friendly**: Soil AI is easy to set up and integrates smoothly into your existing workflow.

## Setup Overview

1. Installation
1. Add Your API Key
1. Setup Dev Server
1. Setup Frontend

## Installation

```bash
npm install soilai
```

or

```bash
yarn add soilai
```

## Add Your API key

If you don't have an API key yet [click here](https://soilai.dev/)

_CAUTION!_ This should only be used in development. You should never publish or commit this key to source control.

To use these features you need to set the SOILAI_API_KEY environment variable in your development environment. Follow these steps to add the SOILAI_API_KEY to your .env.development file:

### Locate or Create .env.development:

1. If you do not already have a .env.development file in the root directory of your project, create one.
1. Add the SOILAI_API_KEY:
   Open the .env.development file in a text editor and add the following line:

```bash
SOILAI_API_KEY=your_api_key_here
```

Replace your_api_key_here with your actual SOIL AI API key.

_You may need to restart your development server_

## Add Soil AI dev server

To run the SOIL AI development server alongside your existing development server (e.g., Next.js), you'll need to modify the dev command in your package.json file. This allows both servers to run together, ensuring that Soil AI is available during development.

Steps to Update the dev Command:
Open package.json:
Locate the package.json file in the root directory of your project.

Modify the dev Command:
Update the dev script in the scripts section to include the `soilai` command followed by your existing development server command. Use a single ampersand (&) to run both servers concurrently.

```json
"scripts": {
  "dev": "soilai & next dev"
}
```

In this example, next dev represents the Next.js development server. If you're using a different framework, replace next dev with the appropriate command for your setup.

Save the package.json File:
After making the changes, save the package.json file.

Start the Development Servers:
Run your development server as usual by executing:

```bash
npm run dev
```

or

```bash
yarn dev
```

Important Note:
The single ampersand (&) in the command allows both servers to run in parallel. This means that Soil AI will be available for real-time updates while you're developing your application.

## Setup Frontend

### JavaScript

```js
import { initializeSoilAi } from "soilai";

document.addEventListener("DOMContentLoaded", function () {
  initializeSoilAi();
});
```

### React

#### Use the hook

```tsx
import { useSoilAi } from "soilai";

function App() {
  useSoilAi();

  return <h1>My App</h1>;
}
```

#### Use the component

```tsx
import { SoilAi } from "soilai";

function App() {
  return (
    <main>
      <h1>My App</h1>
      <SoilAi />
    </main>
  );
}
```

## Contributing

We welcome contributions to Soil AI\! If you have ideas, bug reports, or feature requests, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

## License

Soil AI is licensed under the MIT License. See the LICENSE file for more details.

---

Made with ❤️ by the Soil AI team.
