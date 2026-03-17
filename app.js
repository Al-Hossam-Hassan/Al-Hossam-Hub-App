const $ = (id) => document.getElementById(id);

// --- 1. Password Generator ---
function generatePassword() {
  const len = Math.max(8, Math.min(32, parseInt($("len").value || "16", 10)));
  const up = $("up").checked,
    low = $("low").checked,
    num = $("num").checked,
    sym = $("sym").checked;

  const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    L = "abcdefghijklmnopqrstuvwxyz",
    N = "0123456789",
    S = "!@#$%^&*()-_=+[]{};:,.?/";

  let pool = "";
  if (up) pool += U;
  if (low) pool += L;
  if (num) pool += N;
  if (sym) pool += S;
  if (!pool) return "اختار نوع واحد على الأقل يا هندسة.";

  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pass = "";
  for (let i = 0; i < len; i++) pass += pool[arr[i] % pool.length];
  return pass;
}

$("gen")?.addEventListener("click", () => {
  const pass = generatePassword();
  $("out").textContent = pass;
  $("out").style.opacity = "1";
});

// --- 2. QR Code Generator (النسخة المضمونة 100%) ---
$("qr-gen")?.addEventListener("click", () => {
  const data = $("qr-input").value.trim();
  const out = $("qr-out");

  if (!data) return alert("دخل نص أو رابط الأول يا حسام");

  // مسح المحتوى القديم وإظهار كلمة جاري التحميل
  out.innerHTML = `<p style="color:var(--mut)">جاري إنشاء الكود...</p>`;

  // استخدام خدمة QRServer مع تحديد لون الخلفية (bg) ولون الكود (color)
  // qzone=1 بتعمل إطار أبيض خفيف عشان يظهر في الثيم الغامق
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&bgcolor=ffffff&qzone=2`;

  const img = new Image();
  img.src = qrUrl;

  img.onload = () => {
    // لما الصورة تحمل، بنعرضها بـ Animation خفيف وبرواز
    out.innerHTML = `
      <div style="background: white; padding: 10px; display: inline-block; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        <img src="${qrUrl}" alt="QR" style="display: block; width: 180px; height: 180px;" />
      </div>
      <p style="margin-top:10px; font-size:12px; color:var(--mut)">✅ جاهز للمسح بالكاميرا</p>
    `;
  };

  img.onerror = () => {
    out.innerHTML = `<p style="color:#ef4444">فشل التحميل، تأكد من اتصالك بالإنترنت.</p>`;
  };
});

// --- 3. JSON Formatter ---
$("fmt")?.addEventListener("click", () => {
  const jsonOut = $("jsonOut");
  try {
    const raw = $("jsonIn").value.trim();
    if (!raw) return;
    const obj = JSON.parse(raw);
    jsonOut.textContent = JSON.stringify(obj, null, 2);
    jsonOut.style.color = "#10b981"; // لون أخضر
    jsonOut.style.borderLeft = "4px solid #10b981";
  } catch (e) {
    jsonOut.textContent = "❌ خطأ: صيغة الـ JSON غير صحيحة!";
    jsonOut.style.color = "#ef4444"; // لون أحمر
    jsonOut.style.borderLeft = "4px solid #ef4444";
  }
});

// --- 4. Text Cleaner ---
$("txt-clean")?.addEventListener("click", () => {
  const area = $("txt-in");
  if (!area.value) return;
  area.value = area.value.replace(/\s+/g, " ").trim();
});

$("txt-copy")?.addEventListener("click", () => {
  const area = $("txt-in");
  if (!area.value) return;
  area.select();
  navigator.clipboard.writeText(area.value).then(() => {
    const originalBtn = $("txt-copy").textContent;
    $("txt-copy").textContent = "تم النسخ! ✅";
    setTimeout(() => ($("txt-copy").textContent = originalBtn), 2000);
  });
});
