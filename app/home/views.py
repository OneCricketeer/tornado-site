import tornado.websocket
from tornado.concurrent import Future
from tornado import gen

from app.views import BaseHandler
from models import BandwidthUsage

class HomeHandler(BaseHandler):

    def get(self):
        self.render('home.html')

class BandwidthHandler(BaseHandler):

    @gen.coroutine
    def get(self):
        self.bandwidth = BandwidthUsage()

        self.values.update({'bandwidth': self.bandwidth})
        self.render("bandwidth_monitor.html", **self.values)

    def update(self, response):
        if response and response['status'] == 'OK':
            response = response['message']
            self.bandwidth.bandwidth_class = response['bandwidth_class']
            self.bandwidth.policy_down = response['policy_bytes']['received']
            self.values.update({'bandwidth': self.bandwidth})
            self.render("bandwidth_monitor.html", **self.values)
        else:
            pass




# class BandwidthSocketHandler(tornado.websocket.WebSocketHandler):
#     def open(self):
#         print("WebSocket opened")
#
#     def on_message(self, message):
#         self.write_message(u"You said: " + message)
#
#     def on_close(self):
#         print("WebSocket closed")