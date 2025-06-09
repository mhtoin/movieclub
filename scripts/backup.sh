#!/bin/bash

# get env
source .env

# parse arguments
db_name=$1
collections=("Raffle" "RecommendedMovie" "accounts" "movies" "Review" "shortlist" "SiteConfig" "tier_movies" "Tier" "Tierlists" "users")

echo $collections
# check if db_name is provided
if [ -z "$db_name" ]; then
    echo "Usage: $0 <test|production>"
    exit 1
fi

echo "Backing up collections for database: $db_name"
# check if MONGO_URL is set
if [ -z "$MONGO_URL" ]; then
    echo "MONGO_URL is not set. Please set it in the .env file."
    exit 1
fi
for collection in ${collections[@]};
do
    # create backup directory if it doesn't exist
    mkdir -p "data/$db_name"

    # create a timestamp
    timestamp=$(date +"%Y-%m-%d")

    # backup the collection
    mongoexport --uri="$MONGO_URL" --db "$db_name" --collection "$collection" --out "data/$db_name/$collection-$timestamp.json" --jsonArray --pretty

    if [ $? -eq 0 ]; then
        echo "Backup of $collection completed successfully."
    else
        echo "Backup of $collection failed."
    fi
done