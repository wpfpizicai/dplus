# dplus
dplus nodejs sdk

> dplus nodejs sdk is a simple server side package for track data from nodejs environment; it doesn't depend any other npm package ;All functions is based on the nodejs initial apis;

## Usage

First, install `dpuls` as a development dependency:

```shell

    npm install --save-dev dplus

```

Then, require it to your code,and init it with `token`

```javascript

    var Dplus = require("dplus");

    var dplus = Dplus.init("YOUR TOKEN");

```

Then, you can use `dplus` object to track any events as you want;

```javascript

    dplus.track("user_login",{
        distinct_id:"some unique client id",
        name : "example name"
    });

    dplus.track("video_start");

    dplus.track("get_access",function(err, result){
        if(err){
            throw err
        }else{
            do(result)
        }
    });

```

####note

-the first parameter is the name of event (NOT NULL)
-the second parameter is the properties you want to sent with this event (NULL)
-the third parameter is a callback, it's called when the track is done;



## License

http://en.wikipedia.org/wiki/MIT_License[MIT License]
