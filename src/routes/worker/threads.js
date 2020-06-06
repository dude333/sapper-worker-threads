import { isMainThread, parentPort } from 'worker_threads';
import { svc } from "../../lib/service";

if (!isMainThread) {
    console.log('Inside Worker!');
    console.log(isMainThread);  // Prints 'false'.
    parentPort.postMessage('Message from thread: ' + svc());
}
