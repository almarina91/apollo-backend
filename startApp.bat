// sudo chmod +x startApp.bat

echo "Starting backend application..."
cd backend
nodemon index.js

echo "Starting frontend application..."
cd ..
cd frontend
nodemon index.js
