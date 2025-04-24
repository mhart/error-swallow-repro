# Error swallowing in workerd reproduction

## Running

```sh
npm install
npm run dev
```

## Triggering error

```sh
curl -H 'accept: application/json, text/event-stream' -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"a","version":"1"}},"id":0}' \
  http://localhost:3000
```

Note the following output:

```sh
✘ [ERROR] A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.

✘ [ERROR] Uncaught (in response) Error: The script will never generate a response.
```

The actual error should be something along the lines of:

```sh
TypeError: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received type string (...)
```

At least, that's the logic bug I added to trigger this in `http-outgoing.ts`.
There's a chance something else is blowing up (eg, it's erroring while trying to output the error), but in any
case there's no info about where the error is actually occurring.
