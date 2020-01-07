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
if you want your proxy server to be used only by yourself, input
```
http://www.anyl.ink:8001
```
directly into the config item in the popup.

### for public usage.
if you want to publish your Proxy Server, so that other users of Anylink can also use it.
you need to modify the `proxy_servers.json` and register your proxy server into it.
and then push to this repo and send a merge request.
once merged, your public proxy server would be automatically listed in the dropdown list if it's accessible to the user.
they can select it and use it directly.
