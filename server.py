import sys

import tornado.ioloop, tornado.httpserver, tornado.options
from tornado.options import options

from app import app

if __name__ == "__main__":
    tornado.options.parse_command_line()
    try:
        server = tornado.httpserver.HTTPServer(app)
        server.bind(options.port)
        server.start(0)  # forks one process per cpu
        # print "Starting server on http://localhost:{}".format(options.port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        # print "Stopping server."
        tornado.ioloop.IOLoop.instance().stop()
        # sys.exit(0)
