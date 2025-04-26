# How to Run the Project

> **Note:** This repository was cloned from the original project at https://github.com/ChristophHandschuh/chatbot-ui.git

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

## Test Backend (Optional)

If you want to run the test backend:

1. Navigate to the `testbackend` directory.

2. Create and activate a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install the required package:

```bash
pip install websockets
```

4. Start the backend server:

```bash
python test.py
```
