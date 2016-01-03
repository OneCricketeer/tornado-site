from tornado.web import RequestHandler, HTTPError
from jinja2.exceptions import TemplateNotFound
import logging


class BaseHandler(RequestHandler):
    """This is the base handler for all other Request Handlers
    """
    # This variable will hold the values to render into the template
    values = {}

    @property
    def env(self):
        return self.application.env

    def write_error(self, status_code, **kwargs):
        self.set_status(status_code)
        try:
            self.render('error/{}.html'.format(status_code))
        except (TemplateNotFound, HTTPError):
            try:
                self.render('error/50x.html')
            except (TemplateNotFound, HTTPError):
                raise HTTPError(500)
                # Session.close()

    def render(self, template=None, **kwds):
        logging.info("["+template+"] " + str(kwds))
        try:
            template = self.env.get_template(template)
        except TemplateNotFound:
            raise HTTPError(404)

        self.env.globals['request'] = self.request
        self.env.globals['static_url'] = self.static_url
        # self.env.globals['xsrf_form_html'] = self.xsrf_form_html
        self.write(template.render(kwds))

    def get(self):
        self.render(**self.values)

    def post(self):
        """By default the post request performs a get unless overridden."""
        self.get()


class NoDestinationHandler(BaseHandler):
    def get(self):
        self.write_error(404)
