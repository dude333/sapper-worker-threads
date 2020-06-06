import { Worker, isMainThread } from 'worker_threads';
import path from "path";

export const main = () => new Promise(function (resolve, reject) {
  if (!isMainThread) return;

  // This re-loads the current file inside a Worker instance.
  const wk = new Worker(path.join(__dirname, "threads.js"));
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
});;

// if (!isMainThread) {
//   console.log('Inside Worker!');
//   console.log(isMainThread);  // Prints 'false'.
// }
