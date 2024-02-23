FROM python:3.10.10-slim-bullseye

LABEL maintainer="limeng <limeng.b@mininglamp.com>"

EXPOSE 8082

WORKDIR /app

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./backend/ai-service/requirements.txt /app/requirements.txt

RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ --no-cache-dir -r requirements.txt

COPY ./backend/ai-service/deploy/data/cl100k_base.tiktoken /tmp/data-gym-cache/9b5ad71b2ce5302211f9c61530b329a4922fc6a4

COPY ./backend/ai-service /app/

ENTRYPOINT ["./entrypoint.sh"]
