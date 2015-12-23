from tornado import web
from tornado.web import URLSpec as url
from settings import settings
from app.utils import include

from app.views import NoDestinationHandler
from app.home.views import HomeHandler


def get_urls(path):
    return "app." + path.replace('/', '.') + ".urls"

urls = [
    url(r"/", HomeHandler),
    ]

urls += include(r"/", get_urls("home"))
urls += include(r"/api/", get_urls("api"))

urls += [(r'/.*$', NoDestinationHandler)]
