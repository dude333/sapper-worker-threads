<script>
  let response = "";

  async function click() {
    response = "";
    const res = await fetch(`worker/run`);
    const data = await res.text();

    if (res.status === 200) {
      response = { data };
    } else {
      response = {
        status: res.status,
        error: data
      };
    }
  }
</script>

<h1>Worker Threads</h1>

<button on:click={click}>Run</button>

{#if response}
  <pre>{JSON.stringify(response, null, 2)}</pre>
{/if}
