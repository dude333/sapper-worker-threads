import { main } from "./main";

export async function get(req, res) {
  res.setHeader('Content-Type', 'text/html');

  try {
    await main();
    res.end("ok");
  } catch (error) {
    res.end(error.message);
  }
}