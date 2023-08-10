#!/bin/bash

# 定义源和目标目录
SOURCE_DIR="/tmp/provider_prod/"
DEST_DIR="provider_prod/"
BAK_DIR="provider_prod_bak/"

# 删除备份目录
if [ -d "$BAK_DIR" ]; then
    rm -rf "$BAK_DIR"
    echo "Old backup directory removed."
fi

# 将当前的dest目录重命名为备份目录
if [ -d "$DEST_DIR" ]; then
    mv "$DEST_DIR" "$BAK_DIR"
    echo "Current directory backed up."
fi

# 将源目录移动到目标目录
if [ -d "$SOURCE_DIR" ]; then
    mv "$SOURCE_DIR" "$DEST_DIR"
    echo "New version deployed."
else
    echo "Error: Source directory not found!"
    exit 1
fi

echo "Deployment completed successfully!"
