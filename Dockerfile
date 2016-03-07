FROM cricketeerone/supervisor:latest

RUN apk update \
    && rm -rf /var/cache/apk/*

ENV APP_NAME tornado-app

COPY . /opt/$APP_NAME

RUN addgroup -S www-data && adduser -D -H -s /sbin/nologin -G www-data www-data

RUN mkdir /var/log/$APP_NAME \
    && cp -f /opt/$APP_NAME/conf/supervisor.conf /etc/supervisord.d/$APP_NAME.conf \
    && sed -i "s/myapp/$APP_NAME/g" /etc/supervisord.d/$APP_NAME.conf \
    && sed -i "s/^directory=.*/directory=\/opt\/$APP_NAME/" /etc/supervisord.d/$APP_NAME.conf \
    && sed -ni '/^environment=/!p' /etc/supervisord.d/$APP_NAME.conf \
    && pip install -qr /opt/$APP_NAME/requirements.txt

EXPOSE 8001-8004
