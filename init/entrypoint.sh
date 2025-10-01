#!/bin/sh

# Optional: install bash if not already built into your image
apt-get update && apt-get install -y bash

# Add alias for bash users
echo "alias ll='ls -l'" >> /etc/bash.bashrc

# Optionally wait for DB or other services (reuse your existing wait script if needed)
# ./scripts/wait-for-mariadb.sh mariadb

# Keep the container alive
exec tail -f /dev/null