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

## Test Mode

The project includes a test backend for development and testing purposes. To use the test mode:

1. Navigate to the testbackend directory
2. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install the required package:

```bash
pip install websockets
```

4. Run the test backend:

```bash
python test.py
```
