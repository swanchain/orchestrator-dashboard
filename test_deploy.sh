#!/bin/bash

# 定义源和目标目录
SOURCE_DIR="/tmp/provider_test/"
DEST_DIR="provider_test/"
BAK_DIR="provider_test_bak/"
ZIP_FILE="/tmp/dist_testnet.zip"
EXTRACTED_DIR="/tmp/dist_testnet/"

# 检查并解压zip文件
if [ -f "$ZIP_FILE" ]; then
    # 解压文件到指定目录
    unzip -o "$ZIP_FILE" -d "/tmp/"
    echo "Zip file extracted."

    # 删除zip文件
    rm "$ZIP_FILE"
    echo "Zip file removed."

    # 重命名解压后的文件夹
    if [ -d "$EXTRACTED_DIR" ]; then
        mv "$EXTRACTED_DIR" "$SOURCE_DIR"
        echo "Extracted folder renamed to $SOURCE_DIR"
    else
        echo "Error: Extracted directory not found!"
        exit 1
    fi
else
    echo "Error: ZIP file $ZIP_FILE not found!"
    exit 1
fi

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
