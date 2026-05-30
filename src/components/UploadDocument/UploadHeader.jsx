export default function UploadHeader() {
  return (
    <header className="mb-6">
      <h1
        className="font-semibold"
        style={{
          color: "#352481",
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "32px",
          lineHeight: "40px",
        }}
      >
        إضافة وثيقة جديدة
      </h1>
      <p
        className="mt-1"
        style={{
          color: "#484551",
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        يرجى رفع الملف وتعبئة البيانات الوصفية (Dublin Core) لإضافته إلى
        الأرشيف.
      </p>
    </header>
  );
}
