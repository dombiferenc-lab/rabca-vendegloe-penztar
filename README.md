# 🍺 Rabca Vendéglő Pénztár PWA

## 📋 Projekt Leírása

Modern, offline képes **Progressive Web App (PWA)** pénztárszoftver a Rabca Vendéglő számára. A szoftver hierarchikus menürendszerrel rendelkezik és integrálja az Excel alapadatokat a teljes étlappal.

### 🎆 Fő Funkciók

- **📈 Hierarchikus Menürendszer**: 3 szintű kategóriak (BOR, SÖR, RÖVID)
- **💾 Excel Adat Integráció**: 27 különböző tétel részletes árakkal
- **🖺 Offline Használat**: Service Worker segítségével
- **📦 Lokal Tárolás**: Adatok mentése localStorage-ban
- **📱 Responsive Design**: Mobil és tablet optimalizált
- **🎨 Modern UI**: Sötét téma, animaciók, emojis ikonok

### 🍽️ Menü Struktúra

#### 🍷 BOR
- **Fehér**: Hosszúlepés (140 Ft), Kisfröccs (135 Ft), Nagyfröccs (270 Ft)
- **Vörös**: Hosszúlepés (160 Ft), Kisfröccs (150 Ft), Nagyfröccs (300 Ft)

#### 🍺 SÖR
- **Kőbányai**: Dobozos (650 Ft), Korsó (490 Ft), Pikoló (200 Ft), Pohár (300 Ft), Üveges (550 Ft)
- **Borsodi**: Dobozos (651 Ft)

#### 🥃 RÖVID
- **Feles 0,5**: Ferencz, Körte, Unikum, Vodka (400 Ft)
- **Stampó 0,3**: Ferencz, Körte, Szilva, Unikum, Vodka (200 Ft)
- **Rakéta**: Rakéta (380 Ft)

## 🚀 Telepítés és Futtatás

### 1️⃣ Közvetlen Használat

```bash
# Repository klónozása
git clone https://github.com/dombiferenc-lab/rabca-vendegloe-penztar.git
cd rabca-vendegloe-penztar

# Lokal szerver indítása (Python)
python -m http.server 8000

# Vagy Node.js-szel
npx serve .

# Böngészőben megnyitás
open http://localhost:8000
```

### 2️⃣ GitHub Pages

Az alkalmazás elérhető közvetlenül a GitHub Pages-en:
**https://dombiferenc-lab.github.io/rabca-vendegloe-penztar/**

### 3️⃣ PWA Telepítés

1. Nyisd meg az alkalmazást böngészőben
2. Kattints a "Telepítés" gombra
3. Az app különálló alkalmazásként fog elindulni

## 🛠️ Használat

### 🔄 Alap Műveletek
- **+/-**: Mennyiség növelése/csökkentése
- **📋 Új Tétel**: Hierarchikus kiválasztás vagy kézi bevitel
- **⚙️ Szerkesztés**: Tételnevek és árak módosítása
- **🗑️ Nullázás**: Összes mennyiség törlése

### 📁 Kategoriás Hozzáadás
1. Válassz főkategóriát (BOR/SÖR/RÖVID)
2. Válassz alkategóriát (pl. Fehér, Kőbányai)
3. Válaszd ki a konkrét tételt
4. Kattints "Hozzáadás"-ra

### ✏️ Kézi Bevitel
1. Kattints "Kézi bevitel"-re
2. Add meg a tétel nevét és árát
3. Mentés

## 📊 Technikai Részletek

### 🏗️ Architektúra
- **Frontend**: Vanilla JavaScript, Modern CSS, HTML5
- **PWA**: Service Worker, Web App Manifest
- **Tárolás**: localStorage (kliens oldali)
- **Offline**: Teljes funkcionálitás internetszünet esetén is

### 📁 Fájlstruktúra
```
rabca-vendegloe-penztar/
├── index.html          # Fő HTML fájl
├── app.js              # Fő alkalmazás logika
├── styles.css          # CSS stílusok
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
└── README.md           # Dokumentáció
```

### 💾 Adat Struktúra

```javascript
// Hierarchikus menü struktúra
menuData = {
  "BOR": {
    "Fehér": {
      "Kisfröccs": 135,
      "Nagyfröccs": 270
    }
  }
}

// localStorage struktúra
state = {
  items: [...],     // Tételek listája
  qty: {...},       // Mennyiségek
  currency: 'Ft'    // Valutaném
}
```

## 🔄 Frissítések és Verziókezelés

### V2.0 Újdonságok
- ✅ Hierarchikus kategória rendszer
- ✅ Excel adatok integrálása (27 tétel)
- ✅ Fejlesztett UI/UX
- ✅ Duplikáció védelem
- ✅ Két hozzáadási mód (kategóriás/kézi)

### Jövőbeli Tervek
- 🔄 QR kódos fizetés integráció
- 📊 Statisztikák és riportok
- 💳 Bankkartya fizetés támogatás
- 🔍 Keressés és szűrés
- 📱 Natice app verzió

## 🔧 Fejlesztés

### Előfeltételek
- Modern böngésző (Chrome 80+, Firefox 75+, Safari 13+)
- HTTP szerver (nem file:// protokoll)
- JavaScript engedélyezve

### Hozzájárulás
1. Fork a repository-t
2. Hozz létre feature branch-et (`git checkout -b feature/uj-funkció`)
3. Commit-old a változtatásokat (`git commit -m 'Add: Új funkció hozzáadása'`)
4. Push branch-re (`git push origin feature/uj-funkció`)
5. Nyíss Pull Request-et

## 📜 Licenc

MIT License - Lásd [LICENSE](LICENSE) fájlt a részletekhez.

## 📧 Kapcsolat

**Fejlesztő:** dombiferenc-lab  
**GitHub:** [dombiferenc-lab](https://github.com/dombiferenc-lab)  
**Projekt:** [rabca-vendegloe-penztar](https://github.com/dombiferenc-lab/rabca-vendegloe-penztar)

---

### 🚀 Gyors Start

```bash
git clone https://github.com/dombiferenc-lab/rabca-vendegloe-penztar.git
cd rabca-vendegloe-penztar
python -m http.server 8000
# Megnyitni: http://localhost:8000
```

**❤️ Köszönöm, hogy használod a Rabca Vendéglő Pénztár PWA-t!**