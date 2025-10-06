export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>🚀 Laboratório de Programação</h1>
      <p>Next.js rodando no Docker com MySQL, Flask, Node e phpMyAdmin.</p>
      <p>
        <strong>Portas:</strong><br />
        MySQL: 3306<br />
        phpMyAdmin: 8080<br />
        Node.js: 3001<br />
        Flask: 5000<br />
        Next.js: 3000
      </p>
    </div>
  );
}