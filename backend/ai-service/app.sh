#!/bin/bash

# wget https://repo.anaconda.com/miniconda/Miniconda3-py38_4.12.0-Linux-x86_64.sh
# sh Miniconda3-py38_4.12.0-Linux-x86_64.sh
# pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

SCRIPT_HOME=$(cd `dirname $0`; pwd)

app_name=xming-py

mkdir -p ./log
source /data/miniconda3/etc/profile.d/conda.sh
conda activate xming

case "$@" in
	init)
	source /data/miniconda3/etc/profile.d/conda.sh
	conda create --name xming python=3.10
	conda activate xming
	# pip install -i https://mirrors.aliyun.com/pypi/simple/ -r requirements.txt
	pip install -r requirements.txt
	;;
	start)
	nohup gunicorn -c gunicorn.config.py app:app >> daemon.log 2>&1 &
	;;
	stop)
	kill $(cat $SCRIPT_HOME/xming-py-gunicorn.pid)
	;;
	status)
	echo pid: $(cat $SCRIPT_HOME/xming-py-gunicorn.pid)
	;;
	restart)
	kill $(cat $SCRIPT_HOME/xming-py-gunicorn.pid)
	sleep 2
	nohup gunicorn -c gunicorn.config.py app:app >> daemon.log 2>&1 &
	;;
	*)
	echo 'unknown arguments args(start|stop|status|restart)'
	exit 1
	;;
esac
