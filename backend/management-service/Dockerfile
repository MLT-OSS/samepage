FROM maven:3.6.3-amazoncorretto-8 as builder
WORKDIR /app
COPY ./ /app/
RUN cd /app/backend/management-service && mvn clean package -Dmaven.test.skip=true
FROM amazoncorretto:8-alpine3.15-jdk

# set timezone
RUN apk add --update --no-cache util-linux curl ttf-dejavu fontconfig tzdata

EXPOSE 8089

WORKDIR /app

RUN mkdir -p /app/logs/

COPY --from=builder /app/backend/management-service/target/*.jar /app/app.jar



ENV JAVA_OPTS="-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/app/logs/gc.log -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/app/logs/dump_file.hprof"

ENTRYPOINT java ${JAVA_OPTS} -jar app.jar 2>/app/logs/error.log

