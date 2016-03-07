tornado-site
====
My personal website and playground for web-development.

### Installation
Runs with [Tornado](http://www.tornadoweb.org/), a Python web framework and asynchronous networking library.

```sh
git clone https://github.com/cricket007/tornado-site.git
cd tornado-site
```

#### Virtualenv
```sh
virtualenv env
source env/bin/activate
pip install -r requirements.txt
python server.py
```

#### Docker
```sh
docker build Dockerfile -t tornado-site .
docker run -d --name tornado-site -p 8001-8004:8001-8004 tornado-site
```

A successful run of the server will fork a process for each logical CPU all listening on a single port (8888) for the virtualenv, or ports 8001-8004 for the Docker image.

### Load balancing

The `conf/` directory contains configurations for both supervisord and nginx.

Supervisord starts 4 servers on consecutive ports.

Nginx will forward requests from port 80 to these servers in round-robin fashion.
