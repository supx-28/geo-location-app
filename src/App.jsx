import { useState, useEffect } from "react";

export default function GeoLocationApp() {
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [address, setAddress] = useState("กำลังโหลด...");
  const [dateTime, setDateTime] = useState(new Date());

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(6),
            lon: position.coords.longitude.toFixed(6),
          });
          setAccuracy(position.coords.accuracy.toFixed(2));
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setAddress("ไม่สามารถระบุตำแหน่งได้");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=th`
      );
      const data = await response.json();
      setAddress(data.display_name || "ไม่พบที่อยู่");
    } catch (error) {
      setAddress("ข้อผิดพลาดในการดึงที่อยู่");
    }
  };

  useEffect(() => {
    fetchLocation();
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    if (location) {
      navigator.clipboard.writeText(`${location.lat}, ${location.lon}`);
      alert("คัดลอกพิกัดแล้ว!");
    }
  };

  return (
    <div className="app" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Geo Locator</h1>
      <p>{dateTime.toLocaleDateString("th-TH")} {dateTime.toLocaleTimeString("th-TH", { hour12: false })}</p>
      <p>ตำแหน่งปัจจุบัน:</p>
      <p>{address}</p>
      {location && (
        <>
          <p>Lat: {location.lat}</p>
          <p>Lon: {location.lon}</p>
          <p>Accuracy: {accuracy} เมตร</p>
        </>
      )}
      <div style={{ marginTop: '10px' }}>
        <button onClick={fetchLocation}>รีเฟรช</button>
        <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>คัดลอกพิกัด</button>
      </div>
    </div>
  );
}
