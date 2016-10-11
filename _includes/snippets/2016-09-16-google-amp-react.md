## Whats Happening?

Google AMP offers a difficult problem for front end JS developers. Google has effectively sandboxed all JS into their `<amp-iframe>` tag and made manipulation of the main document pretty much impossible.

That doesn't mean that you can't load your app however.

With a little bit of hackery if how you code your app, I imagine you develop quite an 'interactive' experience just with the `<amp-iframe>` tag and how its styled and presented.  I'm not saying your gonna be able to do much with it, but you be able to pass your main `window` state to your app.

## Things You'll Need

A core JavaScript Controller for your app. One that acts completely on GET params. Sounds horrifying I know, but the only way your going to effectively integrate any JS into an AMP page is via GET param.

```html
<amp-iframe width=300 height=300
    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
    layout="responsive"
    frameborder="0"
    src="/project-euler">

  <amp-img width="245" height="170" layout="responsive" src="https://www.fillmurray.com/400/300" placeholder></amp-img>
</amp-iframe>
```

Above I have an `<amp-frame>` who's src attribute is set to `/project-euler`. The keen can probably already see what I'm getting at. If we define the contents of the src as to be our JS controller, we can easily set our apps initial state via those params.

I'm currently experimenting with the limits to which this could actually be used, but it should prove at least somewhat useful; Being able to sprinkle in your own app code to render something like an Instagram or Twitter post is something that, while AMP tags exist for, shouldn't be limited to by vendor such as Google.
