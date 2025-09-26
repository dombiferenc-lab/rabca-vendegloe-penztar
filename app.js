// Excel adatok integrálása hierarchikus struktúrával
const menuData = {
    "BOR": {
        "Fehér": {
            "Hosszúlepés": 140,
            "Kisfröccs": 135,
            "Nagyfröccs": 270
        },
        "Vörös": {
            "Hosszúlepés": 160,
            "Kisfröccs": 150,
            "Nagyfröccs": 300
        }
    },
    "SÖR": {
        "Kőbányai": {
            "Dobozos": 650,
            "Korsó": 490,
            "Pikoló": 200,
            "Pohár": 300,
            "Üveges": 550
        },
        "Borsodi": {
            "Dobozos": 651
        }
    },
    "RÖVID": {
        "Feles 0,5": {
            "Ferencz": 400,
            "Körte": 400,
            "Unikum": 400,
            "Vodka": 400
        },
        "Stampó 0,3": {
            "Ferencz": 200,
            "Körte": 200,
            "Szilva": 200,
            "Unikum": 200,
            "Vodka": 200
        },
        "Rakéta": {
            "Rakéta": 380
        }
    }
};

// Alapértelmezett tételek (kompatibilitás miatt)
const defaultItems = [
    { id: 'bor-feher-kisfrocss', name: 'Kisfröccs (Fehér)', price: 135, category: 'BOR', subcategory: 'Fehér', item: 'Kisfröccs' },
    { id: 'sor-kobanyai-dobozos', name: 'Kőbányai Dobozos', price: 650, category: 'SÖR', subcategory: 'Kőbányai', item: 'Dobozos' },
    { id: 'rovid-raketa-raketa', name: 'Rakéta', price: 380, category: 'RÖVID', subcategory: 'Rakéta', item: 'Rakéta' }
];

const STORAGE_KEY = 'rv-pos-state-v2';

function generateId(category, subcategory, item) {
    return `${category.toLowerCase()}-${subcategory.toLowerCase().replace(/[^a-z0-9]/g, '')}-${item.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
}

function generateName(category, subcategory, item) {
    if (subcategory === item) return item;
    return `${item} (${subcategory})`;
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: defaultItems, qty: {}, currency: 'Ft' };
    
    try {
        const parsed = JSON.parse(raw);
        const itemsById = Object.fromEntries(defaultItems.map(i => [i.id, i]));
        const current = parsed.items?.length ? parsed.items : defaultItems;
        const merged = current.map(it => (itemsById[it.id] ? { ...itemsById[it.id], ...it } : it));
        
        return {
            items: merged,
            qty: parsed.qty || {},
            currency: parsed.currency || 'Ft'
        };
    } catch {
        return { items: defaultItems, qty: {}, currency: 'Ft' };
    }
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

const els = {
    items: document.getElementById('items'),
    grandTotal: document.getElementById('grandTotal'),
    resetBtn: document.getElementById('resetBtn'),
    editBtn: document.getElementById('editBtn'),
    editDialog: document.getElementById('editDialog'),
    editList: document.getElementById('editList'),
    saveEditBtn: document.getElementById('saveEditBtn'),
    addItemBtn: document.getElementById('addItemBtn'),
    addDialog: document.getElementById('addDialog'),
    categorySelect: document.getElementById('categorySelect'),
    subcategorySelect: document.getElementById('subcategorySelect'),
    itemSelect: document.getElementById('itemSelect'),
    addSelectedBtn: document.getElementById('addSelectedBtn'),
    addManualBtn: document.getElementById('addManualBtn'),
    newName: document.getElementById('newName'),
    newPrice: document.getElementById('newPrice'),
    cancelAdd: document.getElementById('cancelAdd'),
    cancelEditBtn: document.getElementById('cancelEditBtn')
};

function fmt(amount) {
    return `${amount.toLocaleString('hu-HU')} ${state.currency}`;
}

function getQty(id) {
    return state.qty[id] || 0;
}

function setQty(id, val) {
    state.qty[id] = Math.max(0, val);
    saveState(state);
    render();
}

function addQty(id, delta) {
    setQty(id, getQty(id) + delta);
}

function calcLineTotal(item) {
    return getQty(item.id) * item.price;
}

function calcGrandTotal() {
    return state.items.reduce((s, it) => s + calcLineTotal(it), 0);
}

function render() {
    els.items.innerHTML = '';
    
    state.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const left = document.createElement('div');
        left.innerHTML = `
            <div class="title">${item.name}</div>
            <div class="price">${fmt(item.price)}</div>
        `;
        
        const qty = document.createElement('div');
        qty.className = 'qty';
        qty.innerHTML = `
            <button onclick="addQty('${item.id}', -1)">−</button>
            <span class="value">${getQty(item.id)}</span>
            <button onclick="addQty('${item.id}', 1)">+</button>
        `;
        
        const lineTotal = document.createElement('div');
        lineTotal.className = 'lineTotal';
        lineTotal.textContent = fmt(calcLineTotal(item));
        
        card.appendChild(left);
        card.appendChild(qty);
        card.appendChild(lineTotal);
        els.items.appendChild(card);
    });
    
    els.grandTotal.textContent = fmt(calcGrandTotal());
}

function initializeCategorySelector() {
    els.categorySelect.innerHTML = '<option value="">Válassz kategóriát...</option>';
    Object.keys(menuData).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        els.categorySelect.appendChild(option);
    });
}

function updateSubcategorySelector(category) {
    els.subcategorySelect.innerHTML = '<option value="">Válassz alkategóriát...</option>';
    
    if (!category || !menuData[category]) {
        document.querySelector('.subcategory-selector').style.display = 'none';
        document.querySelector('.item-selector').style.display = 'none';
        els.addSelectedBtn.disabled = true;
        return;
    }
    
    Object.keys(menuData[category]).forEach(subcategory => {
        const option = document.createElement('option');
        option.value = subcategory;
        option.textContent = subcategory;
        els.subcategorySelect.appendChild(option);
    });
    
    document.querySelector('.subcategory-selector').style.display = 'block';
    document.querySelector('.item-selector').style.display = 'none';
    els.addSelectedBtn.disabled = true;
}

function updateItemSelector(category, subcategory) {
    els.itemSelect.innerHTML = '<option value="">Válassz tételt...</option>';
    
    if (!category || !subcategory || !menuData[category] || !menuData[category][subcategory]) {
        document.querySelector('.item-selector').style.display = 'none';
        els.addSelectedBtn.disabled = true;
        return;
    }
    
    Object.keys(menuData[category][subcategory]).forEach(item => {
        const price = menuData[category][subcategory][item];
        const option = document.createElement('option');
        option.value = item;
        option.textContent = `${item} - ${fmt(price)}`;
        els.itemSelect.appendChild(option);
    });
    
    document.querySelector('.item-selector').style.display = 'block';
    els.addSelectedBtn.disabled = true;
}

function addSelectedItem() {
    const category = els.categorySelect.value;
    const subcategory = els.subcategorySelect.value;
    const item = els.itemSelect.value;
    
    if (!category || !subcategory || !item) return;
    
    const price = menuData[category][subcategory][item];
    const id = generateId(category, subcategory, item);
    const name = generateName(category, subcategory, item);
    
    // Ellenőrizzük, hogy már létezik-e
    if (state.items.find(i => i.id === id)) {
        alert('Ez a tétel már hozzá van adva a listához!');
        return;
    }
    
    const newItem = { id, name, price, category, subcategory, item };
    state.items.push(newItem);
    saveState(state);
    render();
    
    els.addDialog.close();
    resetAddDialog();
}

function addManualItem() {
    const name = els.newName.value.trim();
    const price = parseInt(els.newPrice.value);
    
    if (!name || isNaN(price) || price < 0) {
        alert('Kérjük töltse ki helyesen a mezőket!');
        return;
    }
    
    const id = `manual-${Date.now()}`;
    const newItem = { id, name, price, category: 'EGYÉB', subcategory: 'Egyéb', item: name };
    
    state.items.push(newItem);
    saveState(state);
    render();
    
    els.addDialog.close();
    resetAddDialog();
}

function resetAddDialog() {
    els.categorySelect.value = '';
    els.subcategorySelect.value = '';
    els.itemSelect.value = '';
    els.newName.value = '';
    els.newPrice.value = '';
    
    document.querySelector('.subcategory-selector').style.display = 'none';
    document.querySelector('.item-selector').style.display = 'none';
    document.querySelector('.manual-entry').style.display = 'none';
    
    els.addSelectedBtn.disabled = true;
    els.addSelectedBtn.textContent = '➕ Hozzáadás';
    els.addSelectedBtn.onclick = addSelectedItem;
}

function renderEditDialog() {
    els.editList.innerHTML = '';
    
    state.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'edit-row';
        row.innerHTML = `
            <input type="text" value="${item.name}" data-index="${index}" data-field="name">
            <input type="number" value="${item.price}" data-index="${index}" data-field="price" min="0" step="1">
            <button class="delete-btn" onclick="deleteItem(${index})" title="Törlés">🗑️</button>
        `;
        els.editList.appendChild(row);
    });
}

function deleteItem(index) {
    if (confirm('Biztosan törli ezt a tételt?')) {
        state.items.splice(index, 1);
        renderEditDialog();
    }
}

function saveEdit() {
    const inputs = els.editList.querySelectorAll('input');
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index);
        const field = input.dataset.field;
        const value = field === 'price' ? parseInt(input.value) : input.value.trim();
        
        if (field === 'name' && value) {
            state.items[index].name = value;
        } else if (field === 'price' && !isNaN(value) && value >= 0) {
            state.items[index].price = value;
        }
    });
    
    saveState(state);
    render();
    els.editDialog.close();
}

// Event listeners
els.resetBtn.addEventListener('click', () => {
    if (confirm('Biztosan nullázza az összes mennyiséget?')) {
        state.qty = {};
        saveState(state);
        render();
    }
});

els.editBtn.addEventListener('click', () => {
    renderEditDialog();
    els.editDialog.showModal();
});

els.saveEditBtn.addEventListener('click', saveEdit);

els.addItemBtn.addEventListener('click', () => {
    initializeCategorySelector();
    resetAddDialog();
    els.addDialog.showModal();
});

els.categorySelect.addEventListener('change', (e) => {
    updateSubcategorySelector(e.target.value);
});

els.subcategorySelect.addEventListener('change', (e) => {
    const category = els.categorySelect.value;
    updateItemSelector(category, e.target.value);
});

els.itemSelect.addEventListener('change', (e) => {
    els.addSelectedBtn.disabled = !e.target.value;
});

els.addSelectedBtn.addEventListener('click', addSelectedItem);

els.addManualBtn.addEventListener('click', () => {
    const isManual = document.querySelector('.manual-entry').style.display === 'none';
    
    if (isManual) {
        document.querySelector('.category-selector').style.display = 'none';
        document.querySelector('.subcategory-selector').style.display = 'none';
        document.querySelector('.item-selector').style.display = 'none';
        document.querySelector('.manual-entry').style.display = 'block';
        els.addManualBtn.textContent = '📋 Kategóriás választás';
        els.addSelectedBtn.textContent = '➕ Kézi hozzáadás';
        els.addSelectedBtn.onclick = addManualItem;
        els.addSelectedBtn.disabled = false;
    } else {
        document.querySelector('.category-selector').style.display = 'block';
        document.querySelector('.manual-entry').style.display = 'none';
        els.addManualBtn.textContent = '✏️ Kézi bevitel';
        els.addSelectedBtn.textContent = '➕ Hozzáadás';
        els.addSelectedBtn.onclick = addSelectedItem;
        resetAddDialog();
    }
});

els.cancelAdd.addEventListener('click', () => {
    els.addDialog.close();
    resetAddDialog();
});

els.cancelEditBtn.addEventListener('click', () => {
    els.editDialog.close();
});

// Kezdeti renderelés
render();