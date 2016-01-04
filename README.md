tornado-site
====
My personal website and playground for web-development. 

### Installation 
Runs with [Tornado](http://www.tornadoweb.org/), a Python web framework and asynchronous networking library.

```sh
git clone https://github.com/cricket007/tornado-site.git
cd tornado-site
## Optional virtualenv
# virtualenv env
# source env/bin/activate
pip install -r requirements.txt
python server.py
```

A successful run of the server will fork a process for each logical CPU all listening on a single port.

##### Load balancing

The `conf/` directory contains configurations for both supervisord and nginx. 

Supervisord starts 4 servers on consecutive ports.

Nginx forwards requests from port 80 to these servers in round-robin fashion. 
