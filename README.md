![SoundLine logo](https://raw.githubusercontent.com/purelogiq/soundline/master/soundline_logo.png)

SoundLine is a simple visual explorer for SoundCloud songs. Start by typing a song or category you are interested in, then keep clicking song titles that interest you to build your "line". You can also change midway so go crazy.

### Features
The idea behind SoundLine arose from the want to browse SoundCloud songs in a more visual way. 
It works by getting the "Related Tracks" section of a SoundCloud track and blowing up the images to make it look more attractive. 

### Cross Site Requests
Unfortunately, SoundCloud does not officially support a related tracks listing in their API (until v2 releases, see credits.txt) and so I had to have a few sneaky workarounds...

![SoundLine relatedreq](https://raw.githubusercontent.com/purelogiq/soundline/master/relatedreq.PNG)

When you load a track on SoundCloud's main website, a request to https://api-v2.soundcloud.com/tracks/{{trackid}}/related is send and JSON with a listing of related tracks is returned. Unfortunately, if you try to request the same json from a client side webpage loaded from localhost or your personal server, you will encounter a cross site request error as modern browsers are configured to prevent such requests for security reasons.

Lukily I was able to get around this by adding an additional route to a nodejs server script that I had from class (credit Joe Mertz joemertz@andrew.cmu.edu). This route accepts api https urls at /crossrequest?theurl=, does the request on the server side and returns back the json to the client. In addition, I added response headers to that route so that the server itself will allow cross site requests.

For anyone else interested in doing this, I advise you wait till SoundCloud releases it publically in their api so that we do not cause any disruption to their server load :3

### Result
Here is how it looks.
If you're lucky the page is still up [here](http://nodejs67328-cmuimadueme.rhcloud.com/soundline/soundline.html).

![SoundLine SS](https://raw.githubusercontent.com/purelogiq/soundline/master/screenshot.png)

