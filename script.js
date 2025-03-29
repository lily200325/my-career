// 从localStorage加载数据
let careerData = JSON.parse(localStorage.getItem('careerData')) || {
    gonna: [],
    tried: [],
    yn: { yes: [], no: [], maybe: [] },
    people: [],
    environment: []
};

// 打开页面
function openPage(type) {
    const pageContent = document.getElementById('page-content');
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('page-title');
    
    pageContent.style.display = 'block';
    document.querySelector('.container').style.display = 'none';
    
    // 设置页面标题
    pageTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    
    // 根据类型显示不同的内容
    switch(type) {
        case 'gonna':
            content.innerHTML = getGonnaContent();
            break;
        case 'tried':
            content.innerHTML = getTriedContent();
            break;
        case 'yn':
            content.innerHTML = getYNContent();
            break;
        case 'people':
            content.innerHTML = getPeopleContent();
            break;
        case 'environment':
            content.innerHTML = getEnvironmentContent();
            break;
    }

    // 添加这行来初始化拖拽
    setTimeout(() => {
        const container = document.querySelector('.sortable-list');
        initSortable(container);
    }, 0);
}

// 返回主页
function goBack() {
    document.getElementById('page-content').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

// Gonna页面内容
function getGonnaContent() {
    return `
        <div id="gonna-list" class="sortable-list">
            ${careerData.gonna.map((item, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    ${item}
                    <button class="delete-btn" onclick="deleteRecord('gonna', ${index})">×</button>
                </div>
            `).join('')}
        </div>
        <button class="add-button" onclick="showAddForm('gonna')">+</button>
    `;
}

// Tried页面内容
function getTriedContent() {
    return `
        <div id="tried-list" class="sortable-list">
            ${careerData.tried.map((job, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    <h3>${job.name}</h3>
                    <div class="likes-dislikes">
                        <div>❤️ ${job.likes}</div>
                        <div>💔 ${job.dislikes}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteRecord('tried', ${index})">×</button>
                </div>
            `).join('')}
        </div>
        <button class="add-button" onclick="showAddForm('tried')">+</button>
    `;
}

// Y/N页面内容
function getYNContent() {
    return `
        <div class="yn-container">
            <div class="yn-card" onclick="showYNList('yes')">✅</div>
            <div class="yn-card" onclick="showYNList('no')">❌</div>
            <div class="yn-card" onclick="showYNList('maybe')">❓</div>
        </div>
        <div id="yn-list"></div>
    `;
}

// People页面内容
function getPeopleContent() {
    return `
        <div id="people-list" class="sortable-list">
            ${careerData.people.map((item, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    ${item}
                    <button class="delete-btn" onclick="deleteRecord('people', ${index})">×</button>
                </div>
            `).join('')}
        </div>
        <button class="add-button" onclick="showAddForm('people')">+</button>
    `;
}

// Environment页面内容
function getEnvironmentContent() {
    return `
        <div id="environment-list" class="sortable-list">
            ${careerData.environment.map((item, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    ${item}
                    <button class="delete-btn" onclick="deleteRecord('environment', ${index})">×</button>
                </div>
            `).join('')}
        </div>
        <button class="add-button" onclick="showAddForm('environment')">+</button>
    `;
}

// 显示添加表单
function showAddForm(type) {
    const content = document.getElementById('content');
    
    switch(type) {
        case 'gonna':
            content.innerHTML = `
                <div class="form-group">
                    <input type="text" id="gonna-input">
                </div>
            `;
            const gonnaInput = document.getElementById('gonna-input');
            gonnaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && gonnaInput.value.trim()) {
                    addGonna();
                }
            });
            gonnaInput.focus();
            break;
        case 'tried':
            content.innerHTML = `
                <div class="form-group">
                    <input type="text" id="job-name">
                    <textarea id="likes"></textarea>
                    <textarea id="dislikes"></textarea>
                </div>
            `;
            const jobName = document.getElementById('job-name');
            const likes = document.getElementById('likes');
            const dislikes = document.getElementById('dislikes');
            
            jobName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && jobName.value.trim()) {
                    likes.focus();
                }
            });
            likes.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    dislikes.focus();
                }
            });
            dislikes.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && jobName.value.trim()) {
                    e.preventDefault();
                    addTried();
                }
            });
            jobName.focus();
            break;
        case 'people':
            content.innerHTML = `
                <div class="form-group">
                    <input type="text" id="people-input">
                </div>
            `;
            const peopleInput = document.getElementById('people-input');
            peopleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && peopleInput.value.trim()) {
                    addPeople();
                }
            });
            peopleInput.focus();
            break;
        case 'environment':
            content.innerHTML = `
                <div class="form-group">
                    <input type="text" id="environment-input">
                </div>
            `;
            const envInput = document.getElementById('environment-input');
            envInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && envInput.value.trim()) {
                    addEnvironment();
                }
            });
            envInput.focus();
            break;
    }
}

// 显示Y/N列表
function showYNList(type) {
    currentYNType = type;
    const ynList = document.getElementById('yn-list');
    ynList.innerHTML = `
        <div class="sortable-list">
            ${careerData.yn[type].map((item, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    ${item}
                    <button class="delete-btn" onclick="deleteRecord('yn', ${index})">×</button>
                </div>
            `).join('')}
        </div>
        <div class="form-group">
            <input type="text" id="yn-input">
        </div>
    `;
    const ynInput = document.getElementById('yn-input');
    ynInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && ynInput.value.trim()) {
            addYN(type);
        }
    });
    initSortable(ynList.querySelector('.sortable-list'));
}

// 添加Gonna记录
function addGonna() {
    const input = document.getElementById('gonna-input');
    if (input.value.trim()) {
        careerData.gonna.push(input.value.trim());
        saveData();
        openPage('gonna');
    }
}

// 添加Tried记录
function addTried() {
    const name = document.getElementById('job-name').value.trim();
    const likes = document.getElementById('likes').value.trim();
    const dislikes = document.getElementById('dislikes').value.trim();
    
    if (name) {
        careerData.tried.push({ name, likes, dislikes });
        saveData();
        openPage('tried');
    }
}

// 添加Y/N记录
function addYN(type) {
    const input = document.getElementById('yn-input');
    if (input.value.trim()) {
        careerData.yn[type].push(input.value.trim());
        saveData();
        showYNList(type);
    }
}

// 添加People记录
function addPeople() {
    const input = document.getElementById('people-input');
    if (input.value.trim()) {
        careerData.people.push(input.value.trim());
        saveData();
        openPage('people');
    }
}

// 添加Environment记录
function addEnvironment() {
    const input = document.getElementById('environment-input');
    if (input.value.trim()) {
        careerData.environment.push(input.value.trim());
        saveData();
        openPage('environment');
    }
}

// 保存数据到localStorage
function saveData() {
    localStorage.setItem('careerData', JSON.stringify(careerData));
}

// 删除记录
function deleteRecord(type, index) {
    if (type === 'yn') {
        const ynType = currentYNType;
        careerData.yn[ynType].splice(index, 1);
        showYNList(ynType);
    } else {
        careerData[type].splice(index, 1);
        openPage(type);
    }
    saveData();
}

// Y/N页面内容和列表显示也需要更新
let currentYNType = null;

// 初始化拖拽功能
function initSortable(container) {
    if (!container) return;

    const items = container.querySelectorAll('.record-card');
    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            updateOrder(container);
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingItem = container.querySelector('.dragging');
        const siblings = [...container.querySelectorAll('.record-card:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY <= box.top + box.height / 2;
        });

        container.insertBefore(draggingItem, nextSibling);
    });
}

// 更新排序后的数据
function updateOrder(container) {
    const type = container.id.replace('-list', '');
    const items = container.querySelectorAll('.record-card');
    const newOrder = [];
    
    items.forEach(item => {
        const index = parseInt(item.dataset.index);
        if (type === 'yn') {
            newOrder.push(careerData.yn[currentYNType][index]);
        } else {
            newOrder.push(careerData[type][index]);
        }
    });

    if (type === 'yn') {
        careerData.yn[currentYNType] = newOrder;
    } else {
        careerData[type] = newOrder;
    }
    saveData();
} 