# Who Am I?

I'm a software developer currently living Vancouver, BC and working at Hootsuite.

Born and raised in Victoria, BC. After graduating from St. Michael's University School in 2009 (and getting my first taste of web dev along the way), I continued my studies at UBC where I majored in Computer Science.

It was my time at UBC where I feel I grew the most. Becoming an executive of the UBC Badminton Club and taking a 2 year contract with SAP was just a couple of the impactful thing that happened during my time there.

Aside from my regular coding activities; I've competed in badminton since I was 8, into street photography (OM-D E-M5/17MMF1.8 30MM-EFL), somewhat of a fashionista (in Rick Owens we trust), and love to eat/drink/travel.

# What do I do?

I love to code. In particular, I love to develop solutions which solve complex problems and present them in a way which is consumable to a general audience. This is the core reason I enjoy coding for the web.

Development tooling and languages are changing at an incredible pace right now. It seems that every week theirs a new JS framework or library that aims to solve the same problem that was solved the week before. More and more, I'm seeing people fall back in love with typed languages thanks to LLVM and it allowing the emergence of modern typed languages that aren't Java or a C derivative. The development landscape is a vast field of choices for any dev right now; And I intend to try it all.

## My stack

I've been lucky enough to get to play with quite a few languages/frameworks over the years and have developed quite a personal taste in what I find 'enjoyable'.

When we think web, our first thoughts are usually of JS. Now, I'll be the first to say that vanilla JS is a far-cry from what I'd consider "enjoyable", but the direction web dev has been going in the past couple years has made it one of the fastest and most exciting fields to develop in; Typescript and Babel/ES6 are normalizing the mess that is cross browser support as well as adding organizational sanity to a prototyped language. Throw in some React and Redux and we have component based UI's, fast/understandable uni-directional data flow, and a global state that is only acted upon functionally with pure reducers. What's not to love?

What else is part of the web? A sexy server; and nothing makes a better back end than a Rails REST API. [Sam Stephenson](https://github.com/sstephenson) made an excellent argument on how complicated web stacks are getting now in his [Turbolinks 5 presentation](https://www.youtube.com/watch?v=SWEts0rlezA). Rails may not be hottest new thing on the block, but it has proved itself time and time again to fit the needs of 99% of projects. Ruby is a beautiful language to get things done quickly in and Rails provides the functionality to actually get it done well, and within the confines of a well coded and understandable MVC framework. Stay nimble, stay quick, stay sane ╭( ･ㅂ･)و ̑̑

### Front

For front end web development, the combo of TypeScript and React have made JS development fun again. TS offers the ability to actually scale your JS as well as have first class tooling from the guys who brought you Visual Studio. React brought a complete paradigm shift in how we think about and code UI's. Components by definition are a rather genious way to encapuslate the DOM which is already a node/component tree in itself. Facebook then introduced uni-directional data flow with Flux, but it was [Dan Abramov](https://github.com/gaearon) that perfected it with [Redux](https://www.youtube.com/watch?v=xsSnOQynTHs). Microsoft and Facebook both hit it out of the park with these two projects and their rate adoption is proof enough of that.

We went through the years of crazy DOM manipulation with jQuery, monolith apps with Ember and Angular, and have emerged the other side with a paradigm that everyone seems to have fallen in love with; components! Oddly enough, this paradigm reminds me of the visual basic days. I wonder if we'll ever have Visual Basic-esque IDE for React... ¯\\_(ツ)_/¯

### Back

For backend, it's hard to escape PHP. Facebook's HHVM and Hack have offered noticeable improvements in both increasing performance for PHP5 and improving the language overall with Hack. All the while offering competition to Zend and forcing them to finally release PHP7\. However, even with Symfony's rather beautiful dependency injection and composer for package management, it's still no Rails; which I consider to be one of the most beautiful abstraction for web-dev ever made.

Backend devs tend to think of JS development as a Wild-Wild-West-esque place where the prototyped nature of JS causes nothing but unattainability and headaches. However, I'd actually argue that the backend development realm is undergoing somewhat of a renaissance as well. Go, Rust, Scala... Microservices vs. SoA monolith... Relational vs NoSQL... Node vs Java (always an amusing one); All talking points that any backend dev will have personal thoughts on. I'll have to save my personal thoughts on the Node vs Java one for a later time… （；^ω^）

For solving more complex problems, recently, I've recently been playing with a couple newer languages. Internally on my team at Hootsuite, we use PHP/Hack on Facebook's HHVM; and while Hack is a noticeable improvement over PHP, the tooling support isn't quite there yet... sorry nuclide ᵟຶᴖ ᵟຶ. If anything gets too big for PHP to handle, my goto's tend to be Node for async stuff, Ruby for complex stuff, or most recently Go for computationally heavy/mathy stuff (having proper types again is always such a joy).

### Isomorph... ah... wah?

"Isomorphic" apps have been becoming more and more popular these days and for a somewhat good reason. Being able to write code that runs on both the client and server and have them seamlessly communicate with each other over a socket is quite impressive. The most popular framework for this is of course Meteor. I've used it in the past, and while very powerful, have found it a bit too heavy handed for my tastes (which is quite something coming from a Rails lover). Choosing to go Oprah style with sockets (you get a socket! and you get a socket!...), as well as, until 1.3, being unable to properly integrate with NPM were kinda deal breakers for me.

It seems that since the release of Meteor 1.3, the ecosystem has improved quite a bit.  Although I haven't delved into it enough recently to offer a fair analysis, I do think that the dedication the Meteor Development Group has shown in improving their product shows; And certainly makes it a standout as an opinionated full-stack JS solution compared to the many a-la-carte isomorphic-react-boilerplates I see sprinkled throughout GitHub (not saying their bad, sometime's it's just nice to have a batteries included solution).
