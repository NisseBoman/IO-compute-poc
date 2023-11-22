/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { allowDynamicBackends } from "fastly:experimental";
import { CacheOverride } from "fastly:cache-override";

allowDynamicBackends(true);

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  // Todo:
  // * Create a token auth for using this service like verify a req header and removing that from the response
  
  //console.log("FASTLY_SERVICE_VERSION:", env('FASTLY_SERVICE_VERSION') || 'local');

  // Get the client request.
  let req = event.request;

  // Filter requests that have unexpected methods.
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return new Response("This method is not allowed", {
      status: 405,
    });
  }
  if(env("FASTLY_HOSTNAME") == "localhost")
  {
    console.log("FASTLY_HOSTNAME:", env("FASTLY_HOSTNAME"));
  }  
  // Create new URL object
  let url = new URL(req.url);
  
  // Verify it's not local testing and also verify a token from the CDN service to avoid miss use of the service
  if(env("FASTLY_HOSTNAME") != "localhost") {
    if (req.headers.get("Token") != "948390khbams3") //Please note that this is a secret and should be changed
    {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
  }

  if(env("FASTLY_HOSTNAME") == "localhost")
  {  
    console.log("request url:", req.url.toString());
  }  
  // spara undan QS och lägg till i svaret tillbaka till delivery 
  let searchEntries = url.search;
  
  // destination path. 
  let dest = url.pathname.toString();
  
  if(env("FASTLY_HOSTNAME") == "localhost")
  {
    console.log("Destination: ", dest);
  }

  let tmpExt = dest.split(".");
  tmpExt = tmpExt[tmpExt.length -1].toLowerCase();
  
  if(env("FASTLY_HOSTNAME") == "localhost")
  {
    console.log("ext: " + tmpExt);
    console.log("QS: " + searchEntries);
  }

  // Verify that we have an image in the path
  if(tmpExt == "jpg" || tmpExt == "jpeg" || tmpExt == "png" || tmpExt == "webp" || tmpExt == "avif" || tmpExt == "gif")
  {
    
    let backendURL = "https:/" + dest + searchEntries; // Note that dest contains a leading /
    if(env("FASTLY_HOSTNAME") == "localhost")
    {
      console.log("backendURL: ", backendURL);
    }
    
    const myHeaders = new Headers();
   
    myHeaders.append('Accept-Encoding','gzip, deflate, br');
    myHeaders.append('Accept', 'image/*');
    //myHeaders.append('user-agent', 'curl/7.21.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3');
    myHeaders.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');

    // Set the TTL for the source image to 120 secs and override any other cache settings. Cache can be purged in 150ms!
    let cacheOverride = new CacheOverride('override', {ttl: 120}); 

    const response = await fetch(backendURL, {
      headers: myHeaders,
      method: "GET",
      cacheOverride
    }); 

    return new Response(response.body, {
      status: 200,
      headers : new Headers({
        "Content-Type": response.headers.get("Content-Type"), 
        "Accept-Ranges": response.headers.get("Accept-Ranges")   
      })
    });
    
  
  }else{
    return new Response("Error - No or incorrect image specified in path", {status:400});
  }
  
}