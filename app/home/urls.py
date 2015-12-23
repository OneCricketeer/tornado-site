from tornado.web import URLSpec as url
from .views import BandwidthHandler

urls = [
    url(r"/bandwidth", BandwidthHandler)
]