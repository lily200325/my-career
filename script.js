// 从localStorage加载数据
let careerData = JSON.parse(localStorage.getItem('careerData')) || {
    gonna: [],
    tried: [],
    yn: { yes: [], no: [], maybe: [] },
    people: [],
    environment: [] // 每个记录项现在将是一个包含图片数组的对象
};

// 打开页面
function openPage(type) {
    const pageContent = document.getElementById('page-content');
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('page-title');
    const container = document.querySelector('.container');
    
    // 如果是从首页进入，显示页面内容并隐藏首页
    if (container.style.display !== 'none') {
        pageContent.style.display = 'block';
        container.style.display = 'none';
    }
    
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
        const sortableList = document.querySelector('.sortable-list');
        if (sortableList) {
            initSortable(sortableList);
        }
    }, 0);
}

// 返回主页
function goBack() {
    const pageContent = document.getElementById('page-content');
    const container = document.querySelector('.container');
    
    pageContent.style.display = 'none';
    container.style.display = 'block';
}

// Gonna页面内容
function getGonnaContent() {
    return `
        <div id="gonna-list" class="sortable-list">
            ${careerData.gonna.map((item, index) => `
                <div class="record-card" draggable="true" data-index="${index}">
                    <div class="content">
                        ${item}
                    </div>
                    <div class="actions">
                        <button class="edit-btn" onclick="showEditForm('gonna', ${index})">✎</button>
                        <button class="delete-btn" onclick="deleteRecord('gonna', ${index})">×</button>
                    </div>
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
                    <div class="content">
                        <h3>${job.name}</h3>
                        <div class="likes-dislikes">
                            <div>
                                <span class="emoji">❤️</span>
                                <span class="text-content">${job.likes}</span>
                            </div>
                            <div>
                                <span class="emoji">💔</span>
                                <span class="text-content">${job.dislikes}</span>
                            </div>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-btn" onclick="showEditForm('tried', ${index})">✎</button>
                        <button class="delete-btn" onclick="deleteRecord('tried', ${index})">×</button>
                    </div>
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
                    <div class="content">
                        ${item}
                    </div>
                    <div class="actions">
                        <button class="edit-btn" onclick="showEditForm('people', ${index})">✎</button>
                        <button class="delete-btn" onclick="deleteRecord('people', ${index})">×</button>
                    </div>
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
                    <div class="content">
                        <div class="image-grid">
                            ${(item.images || []).map((img, imgIndex) => `
                                <div class="image-item" onclick="showImageViewer('${img}')">
                                    <img src="${img}" alt="环境图片">
                                    <button class="delete-image-btn" onclick="deleteImage(${index}, ${imgIndex}); event.stopPropagation();">×</button>
                                </div>
                            `).join('')}
                            ${(!item.images || item.images.length < 5) ? `
                                <label class="image-upload-label" onclick="addImageToCard(${index})">
                                    <span>+</span>
                                </label>
                            ` : ''}
                        </div>
                    </div>
                    <div class="actions">
                        <button class="delete-btn" onclick="deleteRecord('environment', ${index})">×</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="add-button" onclick="showEnvironmentUpload()">+</button>
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
                    <input type="text" id="job-name" placeholder="工作/项目名称">
                    <textarea id="likes" placeholder="喜欢的方面（每行一条）"></textarea>
                    <textarea id="dislikes" placeholder="不喜欢的方面（每行一条）"></textarea>
                    <div class="form-buttons">
                        <button onclick="openPage('tried')" class="cancel-btn">取消</button>
                        <button onclick="addTried()" class="save-btn">保存</button>
                    </div>
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
            likes.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    e.preventDefault();
                    dislikes.focus();
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
                    <div class="content">
                        ${item}
                    </div>
                    <div class="actions">
                        <button class="edit-btn" onclick="showEditForm('yn_${type}', ${index})">✎</button>
                        <button class="delete-btn" onclick="deleteRecord('yn', ${index})">×</button>
                    </div>
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

    let draggedItem = null;
    let touchStartY = 0;
    let initialY = 0;
    let currentY = 0;

    const items = container.querySelectorAll('.record-card');
    items.forEach(item => {
        // 移除卡片的draggable属性
        item.removeAttribute('draggable');
        
        // 添加拖动手柄
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.setAttribute('draggable', 'true');
        item.insertBefore(dragHandle, item.firstChild);

        // PC端拖拽 - 只在拖动手柄时触发
        dragHandle.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
            // 设置拖动时的透明度
            setTimeout(() => {
                item.style.opacity = '0.5';
            }, 0);
        });

        dragHandle.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem.style.opacity = '';
                updateOrder(container);
                draggedItem = null;
            }
        });

        // 移动端触摸 - 只在拖动手柄时触发
        dragHandle.addEventListener('touchstart', (e) => {
            draggedItem = item;
            touchStartY = e.touches[0].clientY;
            initialY = item.offsetTop;
            
            item.classList.add('dragging');
            item.style.position = 'relative';
            item.style.zIndex = '1000';
            
            // 记录其他项的初始位置
            items.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.initialTop = otherItem.offsetTop;
                }
            });
        }, { passive: false });

        dragHandle.addEventListener('touchmove', (e) => {
            if (!draggedItem) return;
            e.preventDefault();

            currentY = e.touches[0].clientY - touchStartY;
            draggedItem.style.transform = `translateY(${currentY}px)`;

            // 计算当前位置
            const draggedRect = draggedItem.getBoundingClientRect();
            const draggedCenter = draggedRect.top + draggedRect.height / 2;

            // 移动其他项
            items.forEach(otherItem => {
                if (otherItem !== draggedItem) {
                    const otherRect = otherItem.getBoundingClientRect();
                    const otherCenter = otherRect.top + otherRect.height / 2;

                    if (draggedCenter < otherCenter && 
                        draggedItem.initialTop > otherItem.initialTop) {
                        otherItem.style.transform = 'translateY(100%)';
                    } else if (draggedCenter > otherCenter && 
                        draggedItem.initialTop < otherItem.initialTop) {
                        otherItem.style.transform = 'translateY(-100%)';
                    } else {
                        otherItem.style.transform = '';
                    }
                }
            });
        }, { passive: false });

        dragHandle.addEventListener('touchend', () => {
            if (!draggedItem) return;
            
            draggedItem.classList.remove('dragging');
            draggedItem.style.transform = '';
            draggedItem.style.position = '';
            draggedItem.style.zIndex = '';

            // 重置其他项的位置
            items.forEach(otherItem => {
                otherItem.style.transform = '';
            });

            updateOrder(container);
            draggedItem = null;
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingItem = container.querySelector('.dragging');
        if (!draggingItem) return;
        
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

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(careerData, null, 2);
    
    // 创建模态框显示数据
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="export-modal">
            <div class="export-modal-content">
                <h3>导出数据</h3>
                <p>请复制以下内容并保存为 .json 文件：</p>
                <textarea class="export-text" readonly>${dataStr}</textarea>
                <div class="export-actions">
                    <button onclick="copyExportData()">复制</button>
                    <button onclick="closeExportModal()">关闭</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(content);

    // 自动选中文本
    const textarea = content.querySelector('.export-text');
    textarea.select();
}

// 复制导出数据
function copyExportData() {
    const textarea = document.querySelector('.export-text');
    textarea.select();
    document.execCommand('copy');
    alert('已复制到剪贴板');
}

// 关闭导出模态框
function closeExportModal() {
    const modal = document.querySelector('.export-modal');
    if (modal) {
        modal.parentElement.remove();
    }
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // 验证数据结构
            if (validateData(importedData)) {
                careerData = importedData;
                saveData();
                // 如果当前在某个页面，刷新显示
                const pageContent = document.getElementById('page-content');
                if (pageContent.style.display === 'block') {
                    const currentPage = document.getElementById('page-title').textContent.toLowerCase();
                    openPage(currentPage);
                }
                alert('数据导入成功！');
            } else {
                alert('数据格式不正确，请确保导入正确的备份文件。');
            }
        } catch (error) {
            alert('导入失败：文件格式错误');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // 清除文件选择，允许重复导入同一文件
}

// 验证导入的数据结构
function validateData(data) {
    const requiredKeys = ['gonna', 'tried', 'yn', 'people', 'environment'];
    const requiredYNKeys = ['yes', 'no', 'maybe'];
    
    // 检查顶级键是否存在
    const hasAllKeys = requiredKeys.every(key => key in data);
    if (!hasAllKeys) return false;
    
    // 检查数组类型
    if (!Array.isArray(data.gonna) || 
        !Array.isArray(data.tried) || 
        !Array.isArray(data.people) || 
        !Array.isArray(data.environment)) {
        return false;
    }
    
    // 检查 Y/N 结构
    if (typeof data.yn !== 'object') return false;
    const hasAllYNKeys = requiredYNKeys.every(key => key in data.yn);
    if (!hasAllYNKeys) return false;
    
    // 检查 Y/N 的子数组
    if (!Array.isArray(data.yn.yes) || 
        !Array.isArray(data.yn.no) || 
        !Array.isArray(data.yn.maybe)) {
        return false;
    }
    
    return true;
}

// 显示编辑表单
function showEditForm(type, index) {
    let record;
    let recordElement;
    
    if (type.startsWith('yn_')) {
        const ynType = type.split('_')[1];
        record = careerData.yn[ynType][index];
        recordElement = document.querySelector(`[data-index="${index}"]`);
        type = 'yn';
    } else {
        record = careerData[type][index];
        recordElement = document.querySelector(`[data-index="${index}"]`);
    }
    
    if (type === 'tried') {
        const formHTML = `
            <div class="edit-form">
                <input type="text" id="edit-name" value="${record.name}" placeholder="工作名称">
                <textarea id="edit-likes" placeholder="喜欢的方面">${record.likes}</textarea>
                <textarea id="edit-dislikes" placeholder="不喜欢的方面">${record.dislikes}</textarea>
                <div class="edit-form-buttons">
                    <button onclick="cancelEdit('${type}', ${index})">取消</button>
                    <button onclick="saveEdit('${type}', ${index})">保存</button>
                </div>
            </div>
        `;
        recordElement.innerHTML = formHTML;
    } else {
        const formHTML = `
            <div class="edit-form">
                <input type="text" id="edit-content" value="${record}" placeholder="内容">
                <div class="edit-form-buttons">
                    <button onclick="cancelEdit('${type}', ${index})">取消</button>
                    <button onclick="saveEdit('${type}', ${index})">保存</button>
                </div>
            </div>
        `;
        recordElement.innerHTML = formHTML;
    }
}

// 保存编辑
function saveEdit(type, index) {
    if (type === 'tried') {
        const name = document.getElementById('edit-name').value.trim();
        const likes = document.getElementById('edit-likes').value.trim();
        const dislikes = document.getElementById('edit-dislikes').value.trim();
        
        if (name) {
            careerData[type][index] = { name, likes, dislikes };
            saveData();
            openPage(type);
        }
    } else if (type === 'yn') {
        const content = document.getElementById('edit-content').value.trim();
        if (content) {
            careerData.yn[currentYNType][index] = content;
            saveData();
            showYNList(currentYNType);
        }
    } else {
        const content = document.getElementById('edit-content').value.trim();
        if (content) {
            careerData[type][index] = content;
            saveData();
            openPage(type);
        }
    }
}

// 取消编辑
function cancelEdit(type, index) {
    openPage(type);
}

// 删除单张图片
function deleteImage(cardIndex, imageIndex) {
    careerData.environment[cardIndex].images.splice(imageIndex, 1);
    if (careerData.environment[cardIndex].images.length === 0) {
        careerData.environment.splice(cardIndex, 1);
    }
    saveData();
    openPage('environment');
}

// 显示环境图片上传界面
function showEnvironmentUpload() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="upload-container">
            <div class="image-preview-grid"></div>
            <label class="image-upload-button">
                <input type="file" accept="image/*" multiple onchange="handleImageUpload(event)" style="display: none;">
                选择图片（最多5张）
            </label>
            <div class="upload-actions">
                <button onclick="openPage('environment')">取消</button>
                <button onclick="saveEnvironmentImages()" class="primary">保存</button>
            </div>
        </div>
    `;
}

// 处理图片上传
let tempImages = [];
function handleImageUpload(event) {
    const files = event.target.files;
    const previewGrid = document.querySelector('.image-preview-grid');
    
    if (tempImages.length + files.length > 5) {
        alert('最多只能上传5张图片');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (tempImages.length >= 5) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            tempImages.push(e.target.result);
            updatePreviewGrid();
        };
        reader.readAsDataURL(file);
    });
}

// 更新预览网格
function updatePreviewGrid() {
    const previewGrid = document.querySelector('.image-preview-grid');
    previewGrid.innerHTML = tempImages.map((img, index) => `
        <div class="image-preview">
            <img src="${img}" alt="预览图片">
            <button onclick="removePreviewImage(${index})">×</button>
        </div>
    `).join('');
}

// 移除预览图片
function removePreviewImage(index) {
    tempImages.splice(index, 1);
    updatePreviewGrid();
}

// 保存环境图片
function saveEnvironmentImages() {
    if (tempImages.length > 0) {
        careerData.environment.push({
            images: [...tempImages]
        });
        saveData();
        tempImages = [];
        openPage('environment');
    }
}

// 向已有卡片添加图片
function addImageToCard(cardIndex) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = function(event) {
        const files = event.target.files;
        const currentImages = careerData.environment[cardIndex].images || [];
        
        if (currentImages.length + files.length > 5) {
            alert('每个记录最多只能包含5张图片');
            return;
        }
        
        let processedFiles = 0;
        Array.from(files).forEach(file => {
            if (currentImages.length >= 5) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                currentImages.push(e.target.result);
                processedFiles++;
                
                if (processedFiles === files.length) {
                    careerData.environment[cardIndex].images = currentImages;
                    saveData();
                    openPage('environment');
                }
            };
            reader.readAsDataURL(file);
        });
    };
    input.click();
}

// 显示图片查看器
function showImageViewer(imageSrc) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'image-viewer-modal';
    modal.innerHTML = `
        <div class="image-viewer-content">
            <button class="image-viewer-close" onclick="closeImageViewer(this)">×</button>
            <img src="${imageSrc}" alt="查看图片">
        </div>
    `;
    
    // 添加点击背景关闭功能
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageViewer(modal);
        }
    });
    
    // 添加键盘ESC关闭功能
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageViewer(modal);
        }
    });
    
    document.body.appendChild(modal);
    // 触发重排以启动动画
    setTimeout(() => modal.classList.add('show'), 10);
}

// 关闭图片查看器
function closeImageViewer(element) {
    const modal = element.closest('.image-viewer-modal');
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}