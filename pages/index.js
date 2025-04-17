import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercises, setExercises] = useState([
    { name: "深蹲", checked: false, sets: "", reps: "" },
    { name: "硬舉", checked: false, sets: "", reps: "" },
    { name: "槓鈴上斜胸推", checked: false, sets: "", reps: "" },
    { name: "啞鈴肩推", checked: false, sets: "", reps: "" },
    { name: "滑輪下拉", checked: false, sets: "", reps: "" },
    { name: "二頭彎舉", checked: false, sets: "", reps: "" },
  ]);
  const [email, setEmail] = useState("");

  const handleChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    const summary = `日期：${date}\n訓練紀錄：\n` +
      exercises.filter(e => e.checked).map(e => `✅ ${e.name} - ${e.sets} 組 × ${e.reps} 次`).join("\n");

    window.open(`mailto:${email}?subject=訓練紀錄_${date}&body=${encodeURIComponent(summary)}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 16 }}>
      <h1>訓練紀錄</h1>
      <label>📅 日期：
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <div style={{ marginTop: 16 }}>
        {exercises.map((e, i) => (
          <div key={i}>
            <label>
              <input type="checkbox" checked={e.checked} onChange={(ev) => handleChange(i, 'checked', ev.target.checked)} />
              {e.name}
              <input placeholder="組數" style={{ width: 50, marginLeft: 8 }} value={e.sets} onChange={(ev) => handleChange(i, 'sets', ev.target.value)} />
              ×
              <input placeholder="次數" style={{ width: 50, marginLeft: 8 }} value={e.reps} onChange={(ev) => handleChange(i, 'reps', ev.target.value)} />
            </label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <label>📧 傳送至 Email：
          <input type="email" style={{ marginLeft: 8 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <button onClick={handleSubmit} style={{ marginTop: 16, padding: 8 }}>📤 傳送訓練紀錄</button>
    </div>
  );
}
