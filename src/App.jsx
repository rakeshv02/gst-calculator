import { useState } from "react";

const fmt = (n) => Number(n).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const COUNTRIES = {
  india: {
    name: "🇮🇳 India",
    currency: "₹",
    taxName: "GST",
    rates: [
      { label: "5%",  rate: 5,  desc: "Essential goods — packaged food, transport" },
      { label: "12%", rate: 12, desc: "Processed food, business class travel" },
      { label: "18%", rate: 18, desc: "Most services, electronics, restaurants" },
      { label: "28%", rate: 28, desc: "Luxury goods, cars, tobacco, aerated drinks" },
    ],
    extraInfo: "GST is split into CGST + SGST (intra-state) or IGST (inter-state)",
  },
  australia: {
    name: "🇦🇺 Australia",
    currency: "A$",
    taxName: "GST",
    rates: [
      { label: "10%", rate: 10, desc: "Standard rate for most goods and services" },
      { label: "0%",  rate: 0,  desc: "GST-free: fresh food, medical, education, exports" },
    ],
    extraInfo: "Australia's GST has been 10% since July 2000",
  },
  canada: {
    name: "🇨🇦 Canada",
    currency: "CA$",
    taxName: "GST/HST",
    rates: [
      { label: "5% — GST only",     rate: 5,  desc: "Alberta, BC, Manitoba, Quebec, Saskatchewan" },
      { label: "13% — HST Ontario", rate: 13, desc: "Ontario (5% federal + 8% provincial)" },
      { label: "15% — HST Atlantic",rate: 15, desc: "NB, NL, NS, PEI (5% + 10%)" },
      { label: "0% — Zero rated",   rate: 0,  desc: "Basic groceries, prescription drugs, exports" },
    ],
    extraInfo: "HST combines federal GST and provincial sales tax into one",
  },
};

export default function App() {
  const [country,    setCountry]    = useState("india");
  const [mode,       setMode]       = useState("add");
  const [amount,     setAmount]     = useState("");
  const [rateIdx,    setRateIdx]    = useState(0);

  const C = COUNTRIES[country];
  const selectedRate = C.rates[Math.min(rateIdx, C.rates.length - 1)];
  const rate = selectedRate.rate;
  const A = parseFloat(amount) || 0;

  let net = 0, tax = 0, gross = 0;
  if (A) {
    if (mode === "add") {
      net = A; tax = A * rate / 100; gross = A + tax;
    } else {
      gross = A; net = A / (1 + rate / 100); tax = A - net;
    }
  }

  // India breakdown
  const cgst = country === "india" ? tax / 2 : null;

  const inputStyle = { width: "100%", padding: "11px 14px", fontSize: "15px", border: "1.5px solid #e5e7eb", borderRadius: "10px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`@media print { .no-print { display:none!important; } }`}</style>

      <div className="no-print" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "15px", fontWeight: "700", color: "#6366f1", textDecoration: "none" }}>⌘ Tabutility</a>
          <button onClick={() => window.print()} style={{ padding: "8px 18px", background: "#f8f7f4", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>🖨️ Print</button>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "900", color: "#f8f7f4", margin: "0 0 6px" }}>GST Calculator</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 24px" }}>Add or remove GST for India, Australia, and Canada instantly.</p>

        {/* Country selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {Object.entries(COUNTRIES).map(([key, c]) => (
            <button key={key} onClick={() => { setCountry(key); setRateIdx(0); }}
              style={{ padding: "10px 18px", borderRadius: "10px", border: `2px solid ${country === key ? "#6366f1" : "#e5e7eb"}`, background: country === key ? "#6366f1" : "#fff", color: country === key ? "#fff" : "#374151", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "12px", padding: "4px", marginBottom: "20px", gap: "4px" }}>
          {[
            { id: "add",    label: `➕ Add ${C.taxName}`,    desc: "I have the pre-tax price" },
            { id: "remove", label: `➖ Remove ${C.taxName}`, desc: "I have the total price" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ flex: 1, padding: "12px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", background: mode === m.id ? "#fff" : "transparent", color: mode === m.id ? "#f8f7f4" : "#6b7280", boxShadow: mode === m.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
              <div>{m.label}</div>
              <div style={{ fontSize: "11px", fontWeight: "500", marginTop: "2px", color: mode === m.id ? "#6b7280" : "#9ca3af" }}>{m.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
          {/* Amount input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>{mode === "add" ? `Amount (before ${C.taxName})` : `Total Amount (inc. ${C.taxName})`}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: "700", fontSize: "15px" }}>{C.currency}</span>
              <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" style={{ ...inputStyle, paddingLeft: "44px", fontSize: "20px", fontWeight: "700" }} />
            </div>
          </div>

          {/* Rate selector */}
          <div>
            <label style={labelStyle}>{C.taxName} Rate</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {C.rates.map((r, i) => (
                <button key={r.label} onClick={() => setRateIdx(i)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", border: `1.5px solid ${rateIdx === i ? "#6366f1" : "#e5e7eb"}`, background: rateIdx === i ? "#f5f3ff" : "#fff", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: rateIdx === i ? "#6366f1" : "#f8f7f4" }}>{r.label}</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>{r.desc}</span>
                  </div>
                  {rateIdx === i && <span style={{ color: "#6366f1", fontWeight: "900" }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        {A > 0 && (
          <div style={{ background: "linear-gradient(135deg, #f8f7f4, #1e3a5f)", borderRadius: "20px", padding: "28px", marginBottom: "16px", color: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center", marginBottom: cgst ? "16px" : "0" }}>
              {[
                { label: `Pre-tax (${C.taxName} excl.)`, value: `${C.currency}${fmt(net)}`, highlight: mode === "remove" },
                { label: `${C.taxName} (${rate}%)`, value: `${C.currency}${fmt(tax)}`, highlight: false },
                { label: `Total (${C.taxName} incl.)`, value: `${C.currency}${fmt(gross)}`, highlight: mode === "add" },
              ].map(r => (
                <div key={r.label} style={{ padding: "16px 8px", background: r.highlight ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.04em" }}>{r.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: "900" }}>{r.value}</div>
                  {r.highlight && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>← your answer</div>}
                </div>
              ))}
            </div>

            {/* India CGST/SGST breakdown */}
            {country === "india" && tax > 0 && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "16px", display: "flex", justifyContent: "center", gap: "32px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", fontWeight: "700" }}>CGST ({rate / 2}%)</div>
                  <div style={{ fontSize: "17px", fontWeight: "900", marginTop: "4px" }}>{C.currency}{fmt(cgst)}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", fontWeight: "700" }}>SGST ({rate / 2}%)</div>
                  <div style={{ fontSize: "17px", fontWeight: "900", marginTop: "4px" }}>{C.currency}{fmt(cgst)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info box */}
        <div style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
          <strong style={{ color: "#374151" }}>ℹ️ {C.name} — </strong>{C.extraInfo}
        </div>

        <div className="no-print" style={{ textAlign: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>← Back to all free tools</a>
        </div>
      </div>
    </div>
  );
}
