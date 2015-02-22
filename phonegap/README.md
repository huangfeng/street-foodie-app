The following files will be copied to `www` by Grunt
when running the `grunt build` command:

```
config.xml
icon.png
```

The `www` directory is wiped clean on `grunt build` and will contain
the build created by `broccoli build` (via Grunt).
This is the basis of the `phonegap build`.

So you can't use `phonegap serve` before running `grunt build`!
