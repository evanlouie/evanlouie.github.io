---
layout: post
title: Efficient AdBlock in MacOS
date: 2018-10-13 12:50 -0700
---

`Hosts` redirects are the most efficient way to block unwanted network traffic; they essentially tell your OS to a system level redirect from the targeted host (eg. <www.google.com>) and redirect the request to whatever you want to (ie. to have it short, `0.0.0.0` or `127.0.0.1`). But sadly, editing and maintaining a systems `Hosts` file can be a pain.

Luckily there are some very kind people who curate and maintain `Hosts` files we can swap out with our own and will provide all the ad-blocking magic we want:

1. Download and install [GasMask](https://github.com/2ndalpha/gasmask).
2. In GasMask, create a new "Remote" using [StevenBlack](https://github.com/StevenBlack/)'s amazing consolidated hosts file: <https://github.com/StevenBlack/hosts>. Here is a [Direct Link](http://sbc.io/hosts/hosts) to the hosts file you can import to GasMask.
3. Add any additional remote hosts you may want.
4. Create a "Combined" hosts lists consisting of your "Original File" and any you added.
5. Activate it.
6. Done!

If you experience broken sites that you need to temporarily use, you can click on the GasMask icon now found in the top of your screen and reactivate your "Original File" to disable quickly go back to your vanilla setup.
