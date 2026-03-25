import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";
import "./index.css";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1";

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.["hydra:member"])) return payload["hydra:member"];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeItem = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

const toId = (value) => {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, "id")) return value.id;
    if (typeof value["@id"] === "string") {
      const parts = value["@id"].split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    }
  }
  return null;
};

const idsEqual = (a, b) => String(a) === String(b);

/* ------------------- LISTE DES PERSONNAGES ------------------- */
function CharactersList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [raceFilter, setRaceFilter] = useState("");
  const [sortField, setSortField] = useState("name");

  useEffect(() => {
    axios.get(`${API}/characters`)
      .then(res => { setCharacters(normalizeCollection(res.data)); setLoading(false); })
      .catch(() => { setError("Impossible de contacter l'API. Vérifie que Symfony est lancé avec : symfony serve --no-tls"); setLoading(false); });
  }, []);

  const filtered = characters.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) &&
    (classFilter === "" || c.class === classFilter) &&
    (raceFilter === "" || c.race === raceFilter)
  );

  const sorted = [...filtered].sort((a,b) => {
    if(sortField==="name") return (a.name || "").localeCompare(b.name || "");
    if(sortField==="level") return Number(a.level || 0) - Number(b.level || 0);
    return 0;
  });

  if(loading) return <div>Chargement...</div>;
  if(error) return <div style={{ color:"red", padding:"20px" }}>{error}</div>;

  return (
    <div style={{ padding:"20px" }}>
      <h1>Liste des personnages</h1>

      <div style={{ marginBottom:"15px" }}>
        <input type="text" placeholder="Rechercher par nom" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"5px", marginRight:"10px"}}/>
        <select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{ marginRight:"10px"}}>
          <option value="">Toutes les classes</option>
          <option value="Guerrier">Guerrier</option>
          <option value="Mage">Mage</option>
          <option value="Voleur">Voleur</option>
        </select>
        <select value={raceFilter} onChange={e=>setRaceFilter(e.target.value)} style={{ marginRight:"10px"}}>
          <option value="">Toutes les races</option>
          <option value="Humain">Humain</option>
          <option value="Elfe">Elfe</option>
          <option value="Nain">Nain</option>
          <option value="Orc">Orc</option>
        </select>
        <label>Trier par : </label>
        <select value={sortField} onChange={e=>setSortField(e.target.value)}>
          <option value="name">Nom</option>
          <option value="level">Niveau</option>
        </select>
      </div>

      <div>
        {sorted.map(c => (
          <Link key={c.id} to={`/character/${c.id}`} style={{ textDecoration:"none", color:"black" }}>
            <div className="card" style={{ display:"flex", alignItems:"center" }}>
              {c.image
                ? <img src={`http://127.0.0.1:8000/uploads/characters/${c.image}`} alt={c.name} style={{ width:"60px", height:"60px", borderRadius:"50%", marginRight:"15px"}}/>
                : <img src="https://i.pravatar.cc/100" alt={c.name} style={{ width:"60px", height:"60px", borderRadius:"50%", marginRight:"15px"}}/>
              }
              <div>
                <h3>{c.name} - Niveau {c.level}</h3>
                <p><strong>Classe:</strong> {c.class} | <strong>Race:</strong> {c.race}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/groups">Voir les groupes →</Link>
    </div>
  );
}

/* ------------------- DETAIL D'UN PERSONNAGE ------------------- */
function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    axios.get(`${API}/characters/${id}`)
      .then(res => setCharacter(normalizeItem(res.data)))
      .catch(() => setError("Personnage introuvable"));
    axios.get(`${API}/parties`)
      .then(res => setGroups(normalizeCollection(res.data)))
      .catch(() => {});
  },[id]);

  if(error) return <div>{error}</div>;
  if(!character) return <div>Chargement...</div>;

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Accueil</Link>
      <div className="card" style={{ display:"flex", alignItems:"center" }}>
        {character.image
          ? <img src={`http://127.0.0.1:8000/uploads/characters/${character.image}`} alt={character.name} style={{ width:"100px", height:"100px", borderRadius:"50%", marginRight:"15px"}}/>
          : <img src="https://i.pravatar.cc/100" alt={character.name} style={{ width:"100px", height:"100px", borderRadius:"50%", marginRight:"15px"}}/>
        }
        <div>
          <h1>{character.name}</h1>
          <p><strong>Classe:</strong> {character.class}</p>
          <p><strong>Race:</strong> {character.race}</p>
          <p><strong>Niveau:</strong> {character.level}</p>
          <p><strong>Compétences:</strong> {(character.skills || []).join(", ") || "Aucune"}</p>
        </div>
      </div>

      <h3>Stats</h3>
      {Object.entries(character.stats || {}).map(([key,value])=>(
        <div key={key}>
          <strong>{key.charAt(0).toUpperCase()+key.slice(1)}:</strong> {value}
          <div className="progress-bar"><div className="progress" style={{width:`${value*5}%`}}></div></div>
        </div>
      ))}

      <h3>Groupes</h3>
      <ul>
        {(character.groups || []).map(toId).filter(gid => gid !== null).map(gid=>{
          const group = groups.find(gr => idsEqual(gr.id, gid));
          return group ? <li key={String(gid)}><Link to={`/group/${gid}`}>{group.name}</Link></li> : null;
        })}
      </ul>
    </div>
  );
}

/* ------------------- LISTE DES GROUPES ------------------- */
function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    axios.get(`${API}/parties`).then(res => setGroups(normalizeCollection(res.data))).catch(()=>{});
  },[]);

  const available = groups.filter(g => {
    const slots = typeof g.availableSlots === "number" ? g.availableSlots : Math.max((g.maxSize || 0) - (g.memberCount || 0), 0);
    return slots > 0;
  });
  const filtered = available.filter(g => (g.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Accueil</Link>
      <h1>Liste des groupes</h1>

      <input type="text" placeholder="Rechercher un groupe" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"5px", marginBottom:"15px"}}/>

      {filtered.map(g=>(
        <Link key={g.id} to={`/group/${g.id}`} style={{ textDecoration:"none", color:"black" }}>
          <div className="card">
            <h3>{g.name}</h3>
            <p>Membres : {g.memberCount}/{g.maxSize} | Places restantes: {g.availableSlots}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ------------------- DETAIL D'UN GROUPE ------------------- */
function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    axios.get(`${API}/parties/${id}`)
      .then(res => setGroup(normalizeItem(res.data)))
      .catch(() => setError("Groupe introuvable"));
    axios.get(`${API}/characters`)
      .then(res => setCharacters(normalizeCollection(res.data)))
      .catch(()=>{});
  },[id]);

  if(error) return <div>{error}</div>;
  if(!group) return <div>Chargement...</div>;

  const groupMemberIds = (group.members || []).map(toId).filter(cid => cid !== null);
  const maxMembers = Number(group.maxSize || 0);
  const availableSlots = typeof group.availableSlots === "number"
    ? group.availableSlots
    : Math.max(maxMembers - groupMemberIds.length, 0);

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/groups" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Retour aux groupes</Link>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <p>Membres: {groupMemberIds.length}/{maxMembers} | Places restantes: {availableSlots}</p>

      <h3>Membres</h3>
      <ul>
        {groupMemberIds.map(cid=>{
          const char = characters.find(c => idsEqual(c.id, cid));
          return char ? <li key={String(cid)}><Link to={`/character/${cid}`}>{char.name}</Link></li> : null;
        })}
      </ul>
    </div>
  );
}

/* ------------------- APP ------------------- */
function App() {
  return (
    <Routes>
      <Route path="/" element={<CharactersList />} />
      <Route path="/character/:id" element={<CharacterDetail />} />
      <Route path="/groups" element={<GroupsList />} />
      <Route path="/group/:id" element={<GroupDetail />} />
    </Routes>
  );
}

export default App;
