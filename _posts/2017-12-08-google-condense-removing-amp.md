---
layout: post
title: Google CON(dense); Removing AMP
date: 2017-12-08 15:54 -0800
---

Recently I decided to remove Google's Accelerated Mobile Pages (AMP) from a bunch of personal projects. While not a very painful endevour to do, with some `ag` find/replace magic you can remove most occurences of `amp-` in tags and get your page using normal HTML tags in no time.

## Why?

I did this for several reasons.

1. I wanted to be able to use JS without iframe shenanigans.
1. Loading the AMP components themselves more than doubled my payload size for a single page.
1. Cached versions were crazy buggy and once in the cached versions workflow, made for horrid UX in getting back into normal site behaviour.

This page itself loads in at ~70KB in total. Thats a respectably small page payload given what we normally get in the modern web. But if I throw in standard Google AMP Components I would require across the site, the payload for this page becomes ~160KB. Still small, but not small enough for me.

Google AMP was an interesting idea by Google. Force people to write minimalistic web pages and be rewarded with the ability to load your pages from Google's own AMP CDN's for free. With many webpages now loading enough JS to up a single load to > 1MB, this sounded like a blessing. But I soon felt the the pain of AMP's constrictions.

## What I Learned

Although I find myself no longer believing in AMP for my personal stuff, it is not to say that the exercise in implementing it on both personal and production projects wasn't a good learning experience. When you get into the habbit of carrying about page size and SEO performance, it really begins to change the way you think about both your content and how you design your pages. Without flashy JS interactions and such, simple and clean design comes to the forefront of how to drive your content.

When the web is filled with giant single page apps that can't render without JS enabled, it feels good to be able to build a super lightweight and content driven website. Harkening back to a simpler internet; before JS, before Flash, before ActionScript. Just Content :)

### Takeaways

* SVGs. Inline them. Love them.
* `<script>` tags. Use `async`/`defer` whenever possible. `async` if you dont care about script execution order, `defer` if want the dom parsed first (ie; mounting a React component).
* Inline important styles into the head of your page.
* Use [The Lighthouse Chrome plugin](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en). Protip: throw in `<script> document.querySelector('body').style.display = 'none'; document.querySelector('body').style.display = 'initial'; </script>` at the end of your page to trigger a `firstMeaningfulRender` event so the plugin doesn't say your performance is close to zero.
* Use [Turbolinks](https://github.com/turbolinks/turbolinks). Just do it. If your site was Google AMP compliant before, Turbolinks will work no problem as a drop in and make page loads noticably faster. (Note: throwing this in makes the hack for Lighthouse unnecessary)
