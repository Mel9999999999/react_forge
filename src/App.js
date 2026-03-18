import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import "./index.css";

/* ------------------- DONNÉES FACTICES ------------------- */
const mockCharacters = [
  {
    id: 1,
    name: "Aranielle",
    class: "Voleur",
    race: "Elfe",
    level: 5,
    avatar: "https://i.pravatar.cc/100?img=1",
    skills: ["Dague", "Discrétion", "Acrobaties"],
    stats: { force: 10, agility: 18, intelligence: 14 },
    groups: [1, 3]
  },
  {
    id: 2,
    name: "Borok",
    class: "Guerrier",
    race: "Nain",
    level: 7,
    avatar: "https://i.pravatar.cc/100?img=2",
    skills: ["Hache", "Bouclier", "Endurance"],
    stats: { force: 18, agility: 12, intelligence: 10 },
    groups: [2]
  },
  {
    id: 3,
    name: "Celyra",
    class: "Mage",
    race: "Humain",
    level: 6,
    avatar: "https://i.pravatar.cc/100?img=3",
    skills: ["Boule de feu", "Soin", "Téléportation"],
    stats: { force: 8, agility: 14, intelligence: 20 },
    groups: [1, 3]
  },
  {
    id: 4,
    name: "Drogath",
    class: "Guerrier",
    race: "Orc",
    level: 4,
    avatar: "https://i.pravatar.cc/100?img=4",
    skills: ["Épée", "Charge", "Intimidation"],
    stats: { force: 16, agility: 10, intelligence: 8 },
    groups: [2]
  }
];

const mockGroups = [
  {
    id: 1,
    name: "Les Éclaireurs",
    description: "Groupe spécialisé dans la reconnaissance et l'espionnage.",
    maxMembers: 5,
    availableSlots: 3,
    members: [1,3]
  },
  {
    id: 2,
    name: "Les Guerriers du Nord",
    description: "Braves guerriers protégeant le nord des invasions.",
    maxMembers: 4,
    availableSlots: 2,
    members: [2,4]
  },
  {
    id: 3,
    name: "La Guilde des Mages",
    description: "Organisation de mages recherchant des artefacts anciens.",
    maxMembers: 6,
    availableSlots: 5,
    members: [1,3]
  }
];

/* ------------------- LISTE DES PERSONNAGES ------------------- */
function CharactersList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [raceFilter, setRaceFilter] = useState("");
  const [sortField, setSortField] = useState("name");

  useEffect(() => {
    setCharacters(mockCharacters);
    setLoading(false);
  }, []);

  const filtered = characters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (classFilter === "" || c.class === classFilter) &&
    (raceFilter === "" || c.race === raceFilter)
  );

  const sorted = [...filtered].sort((a,b) => {
    if(sortField==="name") return a.name.localeCompare(b.name);
    if(sortField==="level") return a.level - b.level;
    return 0;
  });

  if(loading) return <div>Chargement...</div>;

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
              <img src={c.avatar} alt={c.name} style={{ width:"60px", height:"60px", borderRadius:"50%", marginRight:"15px"}}/>
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

/* ------------------- DETAIL D’UN PERSONNAGE ------------------- */
function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(()=>{
    const found = mockCharacters.find(c=>c.id===parseInt(id));
    setCharacter(found||null);
  },[id]);

  if(!character) return <div>Personnage introuvable</div>;

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Accueil</Link>
      <div className="card" style={{ display:"flex", alignItems:"center" }}>
        <img src={character.avatar} alt={character.name} style={{ width:"100px", height:"100px", borderRadius:"50%", marginRight:"15px"}}/>
        <div>
          <h1>{character.name}</h1>
          <p><strong>Classe:</strong> {character.class}</p>
          <p><strong>Race:</strong> {character.race}</p>
          <p><strong>Niveau:</strong> {character.level}</p>
          <p><strong>Compétences:</strong> {character.skills.join(", ")}</p>
        </div>
      </div>

      <h3>Stats</h3>
      {Object.entries(character.stats).map(([key,value])=>(
        <div key={key}>
          <strong>{key.charAt(0).toUpperCase()+key.slice(1)}:</strong>
          <div className="progress-bar"><div className="progress" style={{width:`${value*5}%`}}></div></div>
        </div>
      ))}

      <h3>Groupes</h3>
      <ul>
        {character.groups.map(gid=>{
          const group = mockGroups.find(gr=>gr.id===gid);
          return <li key={gid}><Link to={`/group/${gid}`}>{group.name}</Link></li>
        })}
      </ul>
    </div>
  );
}

/* ------------------- LISTE DES GROUPES ------------------- */
function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(()=>setGroups(mockGroups),[]);

  const available = groups.filter(g=>g.availableSlots>0);
  const filtered = available.filter(g=>g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Accueil</Link>
      <h1>Liste des groupes</h1>

      <input type="text" placeholder="Rechercher un groupe" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"5px", marginBottom:"15px"}}/>

      {filtered.map(g=>(
        <Link key={g.id} to={`/group/${g.id}`} style={{ textDecoration:"none", color:"black" }}>
          <div className="card">
            <h3>{g.name}</h3>
            <p>Membres : {g.members.length}/{g.maxMembers} | Places restantes: {g.availableSlots}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ------------------- DETAIL D’UN GROUPE ------------------- */
function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(()=>{
    const found = mockGroups.find(g=>g.id===parseInt(id));
    setGroup(found||null);
  },[id]);

  if(!group) return <div>Groupe introuvable</div>;

  return (
    <div style={{ padding:"20px" }}>
      <Link to="/groups" style={{ display:"inline-block", marginBottom:"15px", color:"#007bff"}}>← Retour aux groupes</Link>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <p>Membres: {group.members.length}/{group.maxMembers} | Places restantes: {group.availableSlots}</p>

      <h3>Membres</h3>
      <ul>
        {group.members.map(cid=>{
          const char = mockCharacters.find(c=>c.id===cid);
          return <li key={cid}><Link to={`/character/${cid}`}>{char.name}</Link></li>
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