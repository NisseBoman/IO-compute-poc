/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { allowDynamicBackends } from "fastly:experimental";

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

  // Create new URL object
  let url = new URL(req.url);

  console.log(req.url.toString());
  
  // destination path. 
  let dest = url.pathname.toString();
  
  //console.log(dest);

  let tmpExt = dest.split(".");
  tmpExt = tmpExt[tmpExt.length -1];
  console.log("ext: " + tmpExt);
  
  // Verify that we have an image in the path
  if(tmpExt == "jpg" || tmpExt == "jpeg" || tmpExt == "png" || tmpExt == "webp" || tmpExt == "avif" || tmpExt == "gif")
  {
    
    let backendURL = "https:/" + dest; // Note that dest contains a leading /
    console.log("backendURL: " + backendURL);
    
    return fetch(backendURL);

  
  }else{
    return new Response("Error - No or incorrect image specified in path", {status:400});
  }
  
}