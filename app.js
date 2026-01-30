// --- Inicialização ---
// Carrega os botões salvos na memória do celular assim que abre
let buttons = JSON.parse(localStorage.getItem('qt_buttons')) || [];
const textArea = document.getElementById('final-text');
const modal = document.getElementById('modal');

// Renderiza a lista inicial
renderButtons();

// --- Funções de Salvamento ---
function saveToPhone() {
    // Essa linha mágica guarda tudo no navegador do celular
    localStorage.setItem('qt_buttons', JSON.stringify(buttons));
    renderButtons();
}

// --- Funções Visuais (Renderização) ---
function renderButtons() {
    const list = document.getElementById('buttons-list');
    const emptyState = document.getElementById('empty-state');
    
    list.innerHTML = '';

    if (buttons.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        buttons.forEach(btn => {
            // Prepara HTML dos sub-botões
            let subButtonsHtml = '';
            if (btn.subButtons && btn.subButtons.length > 0) {
                subButtonsHtml = `<div class="sub-buttons-list">
                    ${btn.subButtons.map(sub => `
                        <div class="sub-card">
                            <div class="sub-info">
                                <strong>${sub.name}</strong>
                                <small>${sub.text.substring(0, 30)}...</small>
                            </div>
                            <button class="btn-small" onclick="addText('${encodeText(sub.text)}')">
                                <span class="material-symbols-outlined" style="font-size:16px">add</span>
                            </button>
                        </div>
                    `).join('')}
                </div>`;
            }

            // Cria o Card Principal
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="card-title">${btn.name}</div>
                        <span class="card-preview">${btn.text}</span>
                    </div>
                    <span class="material-symbols-outlined" style="color:#EF4444; cursor:pointer;" onclick="deleteButton(${btn.id})">delete</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn" onclick="addText('${encodeText(btn.text)}')">Adicionar Texto</button>
                    <button class="sub-btn-trigger" onclick="openModal(${btn.id})">
                        <span class="material-symbols-outlined">add</span> Sub-botão
                    </button>
                </div>
                ${subButtonsHtml}
            `;
            list.appendChild(card);
        });
    }
}

// --- Funções do Modal ---
function openModal(parentId = null) {
    modal.classList.add('active');
    document.getElementById('btn-name').value = '';
    document.getElementById('btn-content').value = '';
    document.getElementById('parent-id').value = parentId || '';
    
    const title = document.getElementById('modal-title');
    title.innerText = parentId ? 'Novo Sub-botão' : 'Novo Botão Principal';
}

function closeModal() {
    modal.classList.remove('active');
}

function saveButton() {
    const name = document.getElementById('btn-name').value;
    const text = document.getElementById('btn-content').value;
    const parentId = document.getElementById('parent-id').value;

    if (!name || !text) {
        alert('Por favor, preencha o nome e o texto!');
        return;
    }

    if (parentId) {
        // Adicionar Sub-botão ao pai existente
        const parentIndex = buttons.findIndex(b => b.id == parentId);
        if (parentIndex > -1) {
            if (!buttons[parentIndex].subButtons) buttons[parentIndex].subButtons = [];
            buttons[parentIndex].subButtons.push({ id: Date.now(), name, text });
        }
    } else {
        // Criar novo Botão Principal
        buttons.push({ id: Date.now(), name, text, subButtons: [] });
    }

    saveToPhone(); // Salva e atualiza a tela
    closeModal();
}

// --- Funções Utilitárias ---
function deleteButton(id) {
    if(confirm('Tem certeza que deseja excluir este botão?')) {
        buttons = buttons.filter(b => b.id != id);
        saveToPhone();
    }
}

function addText(encodedText) {
    // Decodifica o texto para evitar erros com aspas
    const text = decodeURIComponent(encodedText);
    const current = textArea.value;
    textArea.value = current + (current ? '\n' : '') + text;
    textArea.scrollTop = textArea.scrollHeight;
}

function copyAllText() {
    textArea.select();
    document.execCommand('copy');
    
    // Tenta usar a API nova de clipboard se disponível
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textArea.value).then(() => {
            feedbackCopy();
        });
    } else {
        feedbackCopy();
    }
}

function feedbackCopy() {
    const btn = document.querySelector('.btn-secondary');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Copiado!';
    setTimeout(() => btn.innerHTML = originalText, 2000);
}

function clearText() {
    if(textArea.value === '') return;
    if(confirm('Limpar toda a área de texto?')) {
        textArea.value = '';
    }
}

// Ajuda a passar textos com caracteres especiais (aspas, acentos) pelo HTML
function encodeText(str) {
    return encodeURIComponent(str);
}
