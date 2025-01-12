#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Disease Tracker Backend Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo "📦 Installing required packages..."
sudo apt install -y python3-pip python3-venv sqlite3

# Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/disease-tracker
cd ~/disease-tracker

# Create and activate virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python requirements
echo "📦 Installing Python dependencies..."
pip install fastapi uvicorn pydantic

# Setup systemd service
echo "🔧 Setting up systemd service..."
sudo tee /etc/systemd/system/disease-tracker.service << EOF
[Unit]
Description=Disease Tracker Backend
After=network.target

[Service]
User=$USER
WorkingDirectory=/home/$USER/disease-tracker
Environment="PATH=/home/$USER/disease-tracker/venv/bin"
ExecStart=/home/$USER/disease-tracker/venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
EOF

# Setup automatic database backup
echo "💾 Setting up database backup..."
mkdir -p ~/backups

# Create backup script
cat > ~/backup-db.sh << EOF
#!/bin/bash
timestamp=\$(date +%Y%m%d_%H%M%S)
sqlite3 ~/disease-tracker/disease_tracker.db ".backup ~/backups/disease_tracker_\${timestamp}.db"
find ~/backups -type f -mtime +7 -delete  # Keep only last 7 days of backups
EOF

chmod +x ~/backup-db.sh

# Add to crontab
(crontab -l 2>/dev/null | grep -v "backup-db.sh"; echo "0 0 * * * ~/backup-db.sh") | crontab -

# Start services
echo "🚀 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable disease-tracker
sudo systemctl start disease-tracker

echo "🎉 Setup complete! Here's what you need to do next:"
echo ""
echo "1. Update your frontend .env.production with:"
echo "   VITE_API_URL=http://YOUR_RASPBERRY_PI_IP:8000"
echo ""
echo "2. Copy your backend files to the Raspberry Pi using:"
echo "   scp -r backend pi@YOUR_RASPBERRY_PI_IP:~/disease-tracker/"
echo ""
echo "3. Check the service status with:"
echo "   sudo systemctl status disease-tracker"
echo ""
echo "4. View logs with:"
echo "   sudo journalctl -u disease-tracker -f"