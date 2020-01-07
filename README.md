## How to setup your own Anylink Proxy Server
``` sh
$ npm install
$ npm run build
$ npm run start
```

the proxy server will start at port `8001`.

## How to use your own Anylink Proxy Server in chrome extension

e.g. your proxy server runs at `www.anyl.ink:8001`.

### for personal usage.
if you only want it to be used by only your self, you can input
```
http://www.anyl.ink:8001
```
directly into coresponding section in the popup.

### for public usage.
if you want to publish your Proxy Server, so that other users of Anylink can also use it.

you can send modify the `proxy_servers.json` and add the config of your proxy server into it.
and then send a merge request to this repo.

your public proxy server would be automatically listed in the dropdown list if it's accessible to them.
they can select it and use it directly.
