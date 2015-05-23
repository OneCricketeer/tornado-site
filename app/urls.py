from tornado import web
from tornado.web import URLSpec as url
from settings import settings
from app.utils import include

from app.views import NoDestinationHandler
from app.home.views import HomeHandler

urls = [
    url(r"/", HomeHandler),
    url(r"/static/(.*)", web.StaticFileHandler, {"path": settings.get('static_path')}),
    ]
urls += include(r"/", "app.home.urls")
urls += include(r"/api/", "app.api.urls")
urls += [(r'/.*$', NoDestinationHandler)]