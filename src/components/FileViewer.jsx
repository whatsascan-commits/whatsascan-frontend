function FileViewer({ files }) {
  const getFilePreview = (file) => {
    if (file.mimeType.includes("image")) {
      return (
        <img
          src={file.url}
          alt={file.fileName}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "14px",
          }}
        />
      );
    }

    if (file.mimeType.includes("pdf")) {
      return (
        <iframe
          src={file.url}
          title={file.fileName}
          style={{
            width: "100%",
            height: "220px",
            border: "none",
            borderRadius: "14px",
            background: "#f3f4f6",
          }}
        />
      );
    }

    if (file.mimeType.includes("video")) {
      return (
        <video
          controls
          style={{
            width: "100%",
            height: "220px",
            borderRadius: "14px",
            objectFit: "cover",
          }}
        >
          <source src={file.url} type={file.mimeType} />
        </video>
      );
    }

    if (file.mimeType.includes("audio")) {
      return (
        <div
          style={{
            height: "220px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#f3f4f6",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "70px" }}>🎵</div>

          <audio controls style={{ width: "100%" }}>
            <source src={file.url} type={file.mimeType} />
          </audio>
        </div>
      );
    }

    // default files
    return (
      <div
        style={{
          height: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "80px" }}>📄</div>

        <p
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {file.fileName}
        </p>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        📂 Received Files
      </h2>

      {files.length === 0 ? (
        <div
          style={{
            padding: "40px",
            background: "#f8fafc",
            borderRadius: "18px",
            fontSize: "20px",
            color: "#555",
            width: "300px",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          Waiting for files...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "25px",
            marginTop: "20px",
          }}
        >
          {files.map((file, index) => {

  // FULL FILE URL
  const fileUrl =
    process.env.REACT_APP_API_URL + file.url;

  return (
    <div
      key={index}
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "0.3s",
        border: "1px solid #eee",
      }}
    >
      {/* FILE PREVIEW */}
      <div
        style={{
          padding: "15px",
        }}
      >
        {getFilePreview({
          ...file,
          url: fileUrl,
        })}
      </div>

      {/* FILE INFO */}
      <div
        style={{
          padding: "0 20px 20px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            marginBottom: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.fileName}
        </h3>

        <p
          style={{
            color: "#666",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {file.mimeType}
        </p>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {/* VIEW */}
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              background: "#10b981",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            View
          </a>

          {/* DOWNLOAD */}
          <a
            href={fileUrl}
            download={file.fileName}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
})}
        </div>
      )}
    </div>
  );
}

export default FileViewer;