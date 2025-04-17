
import { useState, useEffect } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("trainingHistory") || "[]"));

  const defaultExercises = {
    "腿部": ["深蹲", "腿推機", "腿彎舉", "保加利亞分腿蹲", "弓箭步蹲", "腿外展機"],
    "胸部": ["槓鈴上斜胸推", "啞鈴平胸推", "夾胸飛鳥", "伏地挺身", "滑輪下壓胸推"],
    "背部": ["硬舉", "滑輪下拉", "槓鈴划船", "臉拉（Face Pull）", "啞鈴划船", "引體向上"],
    "肩部": ["啞鈴肩推", "側平舉", "阿諾肩推", "前平舉", "拉繩肩外展"],
    "手臂": ["二頭彎舉", "三頭下壓", "槌式彎舉", "繩索下壓", "Z槓彎舉"]
  };

  const [exercises, setExercises] = useState(() => {
    const flatList = [];
    Object.entries(defaultExercises).forEach(([group, names]) => {
      names.forEach(name => {
        flatList.push({ group, name, checked: false, sets: "", reps: "", weight: "", note: "" });
      });
    });
    return flatList;
  });

  const [email, setEmail] = useState("");
  const [exportText, setExportText] = useState("");

  const handleChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    const selected = exercises.filter(e => e.checked);
    const summary = `日期：${date}\n訓練紀錄：\n` +
      selected.map(e => `✅ [${e.group}] ${e.name} - ${e.sets} 組 × ${e.reps} 次 × ${e.weight} kg\n備註：${e.note}`).join("\n\n");

    window.open(`mailto:${email}?subject=訓練紀錄_${date}&body=${encodeURIComponent(summary)}`);
  };

  const handleExport = () => {
    const selected = exercises.filter(e => e.checked);
    const summary = `日期：${date}\n訓練紀錄：\n` +
      selected.map(e => `✅ [${e.group}] ${e.name} - ${e.sets} 組 × ${e.reps} 次 × ${e.weight} kg\n備註：${e.note}`).join("\n\n");

    setExportText(summary);
    const newHistory = [...history, { date, summary }];
    setHistory(newHistory);
    localStorage.setItem("trainingHistory", JSON.stringify(newHistory));
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 16, fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>🏋️‍♂️ 訓練紀錄</h1>

      <label>📅 日期：
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div style={{ marginTop: 16 }}>
        {Object.keys(defaultExercises).map((group) => (
          <div key={group} style={{ marginBottom: 24 }}>
            <h3 style={{ borderBottom: '1px solid #ccc' }}>{group}</h3>
            {exercises.filter(e => e.group === group).map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <label style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={e.checked}
                    onChange={(ev) => handleChange(exercises.findIndex(x => x.name === e.name), 'checked', ev.target.checked)}
                  />
                  <strong style={{ marginLeft: 4 }}>{e.name}</strong>
                  <input placeholder="組數" style={{ width: 50, marginLeft: 8 }} value={e.sets} onChange={(ev) => handleChange(i, 'sets', ev.target.value)} />
                  ×
                  <input placeholder="次數" style={{ width: 50, marginLeft: 8 }} value={e.reps} onChange={(ev) => handleChange(i, 'reps', ev.target.value)} />
                  ×
                  <input placeholder="重量kg" style={{ width: 60, marginLeft: 8 }} value={e.weight} onChange={(ev) => handleChange(i, 'weight', ev.target.value)} />
                  <input placeholder="備註" style={{ width: 200, marginLeft: 8 }} value={e.note} onChange={(ev) => handleChange(i, 'note', ev.target.value)} />
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <label>📧 傳送至 Email：
          <input type="email" style={{ marginLeft: 8 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 16, padding: 8 }}>📤 傳送訓練紀錄 Email</button>
      <button onClick={handleExport} style={{ marginTop: 8, padding: 8 }}>📋 匯出訓練文字（給教練）</button>

      {exportText && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: 12, marginTop: 16 }}>{exportText}</pre>
      )}

      <div style={{ marginTop: 32 }}>
        <h2>📜 歷史紀錄</h2>
        {history.length === 0 ? <p>目前尚無歷史紀錄</p> : history.map((h, idx) => (
          <details key={idx} style={{ marginBottom: 12 }}>
            <summary>📅 {h.date}</summary>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: 8 }}>{h.summary}</pre>
          </details>
        ))}
      </div>
    </div>
  );
}
