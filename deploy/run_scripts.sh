#!/bin/sh

sleep 30s
################################
#         samepage 测试信息     #
################################
# 创建数据库
# 如果变量存在且不为空，则创建数据库
if [ -n "$DATABASE_NAME" ]; then
  echo "Creating database: $DATABASE_NAME"
  mysql -h$MYSQL_HOST --port=$MYSQL_PORT --password="$MYSQL_ROOT_PASSWORD" --user=$MYSQL_USERNAME -e "CREATE DATABASE IF NOT EXISTS $DATABASE_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  #mysql --host=$MYSQL_HOST --port=$MYSQL_PORT --password="$MYSQL_ROOT_PASSWORD" --user=$MYSQL_USER -e "CREATE DATABASE IF NOT EXISTS $DATABASE_NAME;"
else
  echo "DATABASE_NAME variable is not set or empty. No database created."
fi
if [ -n "$OPEN_ASSISTANT_MYSQL_DB" ]; then
  echo "Creating open assistant  database: $OPEN_ASSISTANT_MYSQL_DB"
  mysql -h$MYSQL_HOST --port=$MYSQL_PORT --password="$MYSQL_ROOT_PASSWORD" --user=$MYSQL_USERNAME -e "CREATE DATABASE IF NOT EXISTS $OPEN_ASSISTANT_MYSQL_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
else
  echo "OPEN_ASSISTANT_MYSQL_DB variable is not set or empty. No database created."
fi
# 遍历指定目录下的所有文件
for script in /scripts/*.sql; do
  echo "Running script: $script"
  mysql --host=$MYSQL_HOST --port=$MYSQL_PORT --password="$MYSQL_ROOT_PASSWORD" --user=$MYSQL_USERNAME --database=$DATABASE_NAME < "$script"
done

################################
#   初始化one-api 的令牌信息      #
################################
if [ -n "$ONE_API_DATABASE" ]; then
  token=${ONE_API_KEY#*-}
  echo "init  token: $ONE_API_DATABASE $token"
  echo "init sql: INSERT IGNORE INTO tokens (user_id, key, status, name, created_time, accessed_time, expired_time, remain_quota, unlimited_quota, used_quota) VALUES(1, '${token}', 1, 'samepage', 1704349100, 1704349100, -1, 500000, 1, 0);"
  mysql -h$MYSQL_HOST --port=$MYSQL_PORT --password="$MYSQL_ROOT_PASSWORD" --user=$MYSQL_USER --database=$ONE_API_DATABASE -e "INSERT IGNORE INTO tokens (user_id, \`key\`, status, name, created_time, accessed_time, expired_time, remain_quota, unlimited_quota, used_quota) VALUES(1, '${token}', 1, 'samepage', 1704349100, 1704349100, -1, 500000, 1, 0);"
fi