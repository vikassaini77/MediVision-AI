# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY backend/requirements.txt .

# Install dependencies, specifically for PyTorch CPU for optimization
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ ./backend/

# Copy the environment file if it exists, or let passing ENV variables handle it
# (Best practice: pass ENV variables through Render/Railway dashboard)

# Expose port
EXPOSE 8000

# Set environment variable for Python path to recognize backend module
ENV PYTHONPATH=/app

# Command to run the Fastapi application
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
