#!/bin/bash

# parse arguments
db_name=$1

# check if db_name is provided
if [ -z "$db_name" ]; then
    echo "Usage: $0 <test|production>"
    exit 1
fi

