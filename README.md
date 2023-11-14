# Fastly Image Optimizer fetch solution from undefined image source


This is a small app to be used to showcase how you could use compute to fetch images from "random" source and push them thru Fastly Image Optimizer and store them in cache for a nice user experience. 

This code requires you to have a CDN service setup with IO enabled and a Fastly compute service that runs this code. 

## Todo
- Add security in the way of a header token to validate that this app should run and remove the token from the response. 
- Fix the loop issue.

**For more details about other starter kits for Compute, see the [Fastly developer hub](https://developer.fastly.com/solutions/starters)**

## Security issues

Please see our [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
