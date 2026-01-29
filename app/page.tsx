export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Pastebin Lite</h1>
      <p>Create and share text snippets easily.</p>

      <form method="POST" action="/api/paste">
        <textarea
          name="content"
          rows={10}
          style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Enter your paste here..."
          required
        />
        <br />
        <button type="submit">Create Paste</button>
      </form>
    </main>
  );
}
