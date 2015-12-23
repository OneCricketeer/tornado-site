import tornado.web

from jinja2 import Environment as Jinja2Environment, FileSystemLoader
from webassets import Environment as AssetsEnvironment
from webassets.ext.jinja2 import AssetsExtension

from urls import urls
from settings import settings


class Application(tornado.web.Application):
    def __init__(self):
        tornado.web.Application.__init__(self, urls, **settings)

        self.assets_env = AssetsEnvironment('../static', '')
        self.env = Jinja2Environment(loader=FileSystemLoader(settings.get('template_path')),
                                     extensions=[AssetsExtension])
        self.env.assets_environment = self.assets_env

app = Application()