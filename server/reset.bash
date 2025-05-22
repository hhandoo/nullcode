#!/bin/bash

# Delete the database file
echo "Removing db.sqlite3..."
rm -f db.sqlite3

# Delete all migration files except __init__.py
echo "Deleting migration Python files..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

# Delete compiled Python migration files
echo "Deleting compiled migration files..."
find . -path "*/migrations/*.pyc" -delete

# Make new migrations
echo "Making new migrations..."
python manage.py makemigrations

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

echo "Reset complete."
