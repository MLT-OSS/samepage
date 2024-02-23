loglevel = "info"
accesslog = './log/access.log'
errorlog = './log/error.log'
pidfile = 'samepage-py-gunicorn.pid'

workers = 8
worker_class = "gevent"
bind = "0.0.0.0:8082"
