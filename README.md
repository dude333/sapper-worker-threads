# sapper-woker-threads

Testing worker_threads on [Sapper](https://github.com/sveltejs/sapper).

## Implementation

`/worker` route (src/routes/worker/index.svelte) will fetch `worker/run` that starts the worker threads.

### worker/run.js

Server side route:

```js
import { main } from "./worker";

export async function get(req, res) {
  res.setHeader('Content-Type', 'text/html');

  try {
    await main();
    res.end("ok");
  } catch (error) {
    res.end(error.message);
  }
}
```

### worker.js

The `main` function will be called and will create a new Worker that calls itself. This time it'll run the code inside the block `if (!isMainThread) {`, but when this part is reached only the first line is executed (`console.log('Inside Worker!');`) and an error is returned. It seems it's trying to evoke the Polka initialization again, hence the Error: listen EADDRINUSE: address already in use :::3000.

```js
import { Worker, isMainThread } from 'worker_threads';

export const main = () => new Promise(function (resolve, reject) {
  if (!isMainThread) return;

  // This re-loads the current file inside a Worker instance.
  const wk = new Worker(__filename);
  wk.on("online", () => console.log("Worker UP"));
  wk.on("message", (msg) => {
    console.log("message ~>", msg);
    resolve(msg);
  });
  wk.on("exit", (code) => console.warn("exit ~>", code));
  wk.on("error", (err) => {
    console.error("error ~>", err);
    reject(err);
  });
})

if (!isMainThread) {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Prints 'false'.
}
```

## Results
```
> sapper dev

✔ client (3.3s)
✔ server (3.3s)
> Listening on http://localhost:3000
✔ service worker (84ms)
Worker UP
Inside Worker!
error ~> Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (net.js:1313:16)
    at listenInCluster (net.js:1361:12)
    at Server.listen (net.js:1449:7)
    at Polka.listen (/mnt/disk2/adr/lab2/pollers/worker/node_modules/.pnpm/registry.npmjs.org/polka/1.0.0-next.11/node_modules/polka/build.js:59:22)
    at Object.<anonymous> (/mnt/disk2/adr/lab2/pollers/worker/__sapper__/dev/server/server.js:3119:3)
    at Module._compile (internal/modules/cjs/loader.js:1133:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1153:10)
    at Module.load (internal/modules/cjs/loader.js:977:32)
    at Function.Module._load (internal/modules/cjs/loader.js:877:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:74:12) {
  code: 'EADDRINUSE',
  errno: 'EADDRINUSE',
  syscall: 'listen',
  address: '::',
  port: 3000
}
exit ~> 1
```
