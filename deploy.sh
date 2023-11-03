#!/bin/bash

# Name of the folder to tar
FOLDER_NAME="API"

# Name of the tar file to create
TAR_FILE_NAME="api.tar"

# Ask the user if they want to run 'pnpm build'
read -r -p "Do you want to run 'pnpm build' in the 'client' folder? (y/n): " answer
if [ "$answer" != "${answer#[Yy]}" ]; then
  echo "Running 'pnpm build' in the 'client' folder..."
  (cd client && pnpm build --emptyOutDir)
else
  echo "Skipping 'pnpm build'..."
fi

# Step 1: Create the tar file for the specified folder (excluding "bin" and "obj" folders)
echo "Creating a tar file for $FOLDER_NAME (excluding 'bin' and 'obj' folders)..."
tar -cf "$TAR_FILE_NAME" --exclude="$FOLDER_NAME/bin" --exclude="$FOLDER_NAME/obj" "$FOLDER_NAME"

# Step 2: Deploy to CapRover
echo "Deploying to CapRover..."
caprover deploy -t "$TAR_FILE_NAME"

# Clean up the tar file (optional)
echo "Cleaning up..."
rm "$TAR_FILE_NAME"

echo "Deployment complete."
