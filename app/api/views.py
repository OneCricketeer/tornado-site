import tornado.web
from app.lib.bandwidth_scraper import get_json_all_data

class BandwidthHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(get_json_all_data())