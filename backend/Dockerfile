FROM python:3.10-slim

WORKDIR /app

# Install dependencies (system level if needed, then python)
# libgl1-mesa-glx may be needed for cv2 or other libs if used, keeping it simple for now
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY . .

# Expose the port Flask runs on
EXPOSE 5328

# Start the application
CMD ["python", "app.py"]
