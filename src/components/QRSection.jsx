import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

function QRSection({ sessionId }) {
  const botNumber =
  process.env.REACT_APP_BOT_NUMBER;

  const whatsappLink = `https://wa.me/${botNumber}?text=${encodeURIComponent(
    `Connect:${sessionId}`
  )}`;

  // =========================
  // SHARE QR
  // =========================
  const shareQRCode = async () => {
    try {
      const qrElement = document.getElementById("qr-share-container");

      if (!qrElement) return;

      // convert div to image
      const canvas = await html2canvas(qrElement);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          "whatsapp-connect-qr.png",
          {
            type: "image/png",
          }
        );

        // mobile/native share
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "WhatsApp Connect QR",
            text: "Scan this QR to connect",
            files: [file],
          });
        } else {
          // fallback download
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "whatsapp-connect-qr.png";
          a.click();

          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.log("SHARE ERROR:", err);
    }
  };

  return (
    <div>
      <h2>Scan QR</h2>

      {/* QR CONTAINER */}
      <div
        id="qr-share-container"
        style={{
          background: "white",
          padding: "20px",
          display: "inline-block",
          borderRadius: "12px",
        }}
      >
        <QRCode value={whatsappLink} size={300} />

        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            wordBreak: "break-word",
            width: "300px",
          }}
        >
          Connect:{sessionId}
        </p>
      </div>

      <p style={{ marginTop: "20px" }}>
        Scan QR to connect instantly
      </p>

      {/* OPEN WHATSAPP */}
      <div style={{ marginTop: "20px" }}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "green",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          Connect WhatsApp
        </a>

        {/* SHARE BUTTON */}
        <button
          onClick={shareQRCode}
          style={{
            padding: "12px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Share QR
        </button>
      </div>
    </div>
  );
}

export default QRSection;