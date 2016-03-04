FROM supervisor:alpine

RUN apk update \
    && rm -rf /var/cache/apk/*

ENV APP_NAME tornado-app

COPY . /opt/$APP_NAME

# RUN git clone https://github.com/cricket007/tornado-site.git /opt/$APP_NAME

RUN addgroup -S www-data
RUN adduser -D -H -s /sbin/nologin -G www-data www-data

RUN cd /opt/$APP_NAME \
    && pip install -qr requirements.txt \
    && mkdir /var/log/$APP_NAME \
    && cp -f config/supervisor.conf /etc/supervisord.d/$APP_NAME.conf \
    && sed -i "s/myapp/$APP_NAME/g" /etc/supervisord.d/$APP_NAME.conf \
    && sed -i "s/^directory=.*/directory=\/opt\/$APP_NAME/" /etc/supervisord.d/$APP_NAME.conf \
    && sed -ni '/^environment=/!p' /etc/supervisord.d/$APP_NAME.conf

EXPOSE 8001-8004
