import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase'; 
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function App() {
  const [startups, setStartups] = useState([]);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");

  // 1. LISTEN
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "startups"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStartups(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. ADD
  const addStartup = async () => {
    if (!name) return;
    await addDoc(collection(db, "startups"), {
      name: name,
      sector: sector || "General",
      status: "applied"
    });
    setName("");
    setSector("");
  };

  // 3. MOVE
  const moveStartup = async (id, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "applied") newStatus = "screening";
    else if (currentStatus === "screening") newStatus = "portfolio";

    if (newStatus) {
      await updateDoc(doc(db, "startups", id), { status: newStatus });
    }
  };

  // 4. DELETE
  const deleteStartup = async (id) => {
    await deleteDoc(doc(db, "startups", id));
  };

  // Column Component
  const Column = ({ title, status, icon }) => (
    <div className="column">
      <h2><span>{icon}</span> {title}</h2>
      <div className="card-list">
        {startups
          .filter(s => s.status === status)
          .map(startup => (
            <div key={startup.id} className="card">
              <div className="card-title">{startup.name}</div>
              <div className="card-sector">{startup.sector}</div>
              
              <div className="card-actions">
                {status !== 'portfolio' && (
                  <button className="action-btn" onClick={() => moveStartup(startup.id, status)}>
                    Promote ➜
                  </button>
                )}
                <button className="action-btn delete-btn" onClick={() => deleteStartup(startup.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <>
      {/* BACKGROUND FLOATING ANIMATION */}
      <div className="floating-icons">
        <div className="icon">💸</div>
        <div className="icon">📈</div>
        <div className="icon">🦄</div>
        <div className="icon">💎</div>
      </div>

      <div className="container">
        <h1>Portfoliomate</h1>
        <p className="subtitle">Next-Gen Deal Flow Tracker</p>

        {/* GLASS INPUT BAR */}
        <div className="input-group">
          <input 
            placeholder="Startup Name..." 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            placeholder="Sector (e.g. AI, Fintech)..." 
            value={sector} 
            onChange={e => setSector(e.target.value)} 
          />
          <button className="add-btn" onClick={addStartup}>ADD DEAL</button>
        </div>

        {/* THE BOARD */}
        <div className="kanban-board">
          <Column title="APPLIED" status="applied" icon="📥" />
          <Column title="SCREENING" status="screening" icon="⚡" />
          <Column title="PORTFOLIO" status="portfolio" icon="🚀" />
        </div>
      </div>
    </>
  );
}

export default App;