export default function NotFound() {
  return (
    <div
      style={{
        background: "#ECEFF1",
        color: "rgba(0,0,0,0.87)",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          maxWidth: "360px",
          margin: "100px auto 16px",
          padding: "32px 24px 16px",
          borderRadius: "3px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        <h2
          style={{
            color: "#ffa100",
            fontWeight: "bold",
            fontSize: "16px",
            margin: "0 0 8px",
          }}
        >
          404
        </h2>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 300,
            color: "rgba(0,0,0,0.6)",
            margin: "0 0 16px",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            lineHeight: "140%",
            margin: "16px 0 24px",
            fontSize: "14px",
          }}
        >
          The specified file was not found on this website. Please check the URL for mistakes and try again.
        </p>
        <a
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            background: "#039be5",
            textTransform: "uppercase",
            textDecoration: "none",
            color: "white",
            padding: "16px",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
