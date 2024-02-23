


# 打包
FROM   node:16.14.0 as build-stage

WORKDIR /app

COPY ./ /app/




RUN npm config set registry https://registry.npmmirror.com/  && npm install -g pnpm  && cd /app/frontend/ && pnpm install && pnpm nx run login:build && pnpm nx run web:build && pnpm nx run doc-chat:build && pnpm nx run h5:build && pnpm nx run playground:build && pnpm nx run scripts:build



FROM nginx:alpine
# 添加build 后的静态文件
ENV TZ=Asia/Shanghai
COPY --from=build-stage /app/frontend/dist/apps/ /usr/share/nginx/
# 修改镜像默认配置
RUN sed -i 's/http_x_forwarded_for/http_x_forwarded_for" "$request_id/g' /etc/nginx/nginx.conf

# 添加 nginx 配置文件
COPY ./frontend/deploy/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

