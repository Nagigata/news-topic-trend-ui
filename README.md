# How to Run the Project

> **Note:** This repository was cloned from the original project at https://github.com/ChristophHandschuh/chatbot-ui.git

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/Nagigata/news-topic-trend-ui.git
```

2. Install dependencies

```bash
npm i
```

3. Start the development server

```bash
npm run dev
```

## Offline Mode (PWA)

The project supports **offline usage** via **Progressive Web App (PWA)** features. Once the app is accessed and installed, it can be used without an internet connection.

To enable offline mode:

1. Build the project:

```bash
npm run build
```

2. Preview the production build locally:

```bash
npm run serve
```

3. Open the following URL in your browser:

```
http://localhost:8501
```

4. Install the app when prompted by the browser.  
   You can also manually install it via the browser menu.

5. After installation, you can launch the app from your desktop or mobile home screen and use it offline.
