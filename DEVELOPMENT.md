# دليل التطوير والتخصيص

## 🛠️ هيكل المشروع

```
speech-notes-app/
├── advanced-speech-notes-app.html    # التطبيق الأساسي المحسّن
├── advanced-features.js              # المميزات المتقدمة
├── enhanced-app.js                   # النسخة المحسّنة مع الإعدادات
├── advanced-styles.css              # أنماط CSS إضافية
├── README.md                        # دليل المستخدم
├── DEVELOPMENT.md                   # دليل التطوير (هذا الملف)
└── examples/                        # أمثلة عملية
```

## 🎯 المميزات المطورة

### 1. إدارة الملاحظات المحسّنة
- ✅ تعديل مباشر للملاحظات
- ✅ حذف مع تأكيد
- ✅ نسخ سريع للنص
- ✅ تصنيف متقدم مع ألوان مميزة

### 2. البحث والتصفية
- ✅ بحث فوري في النص
- ✅ تصفية بالتصنيف
- ✅ ترتيب متعدد المعايير
- 🔄 بحث ضبابي (قيد التطوير)

### 3. تصدير البيانات
- ✅ تصدير TXT و JSON
- ✅ تصدير CSV و Markdown
- ✅ تصدير HTML
- 🔄 تصدير PDF (قيد التطوير)

### 4. مميزات الذكاء الاصطناعي
- ✅ اقتراح التصنيفات
- ✅ تحليل المشاعر البسيط
- ✅ تلخيص النصوص
- 🔄 تحليل الكلمات المفتاحية

## 🔧 التخصيص والتطوير

### إضافة تصنيف جديد

```javascript
// إضافة تصنيف مخصص
app.categories.push('my-custom-category');
app.updateCategorySelects();

// تخصيص الألوان
.category-my-custom-category {
    border-right: 4px solid #your-color;
}

.category-my-custom-category .note-category {
    background: linear-gradient(45deg, #color1, #color2);
}
```

### تخصيص أنماط التصدير

```javascript
// إضافة تنسيق تصدير جديد
exportCustomFormat(notes, options) {
    // منطق التصدير المخصص
    const customContent = notes.map(note => {
        return `[${note.category}] ${note.text}`;
    }).join('\n\n');
    
    this.app.downloadFile(customContent, 'custom-export.txt', 'text/plain');
}
```

### إضافة مميزات ذكاء اصطناعي

```javascript
// إضافة خوارزمية تحليل جديدة
class CustomAI extends AIFeatures {
    detectKeywords(text) {
        // خوارزمية استخراج الكلمات المفتاحية
        const words = text.split(' ');
        const keywords = words.filter(word => word.length > 4);
        return keywords;
    }
    
    classifyTopic(text) {
        // تصنيف الموضوع
        const topics = {
            'technology': ['تقنية', 'برمجة', 'كمبيوتر'],
            'business': ['عمل', 'شركة', 'مال'],
            'education': ['تعليم', 'دراسة', 'تعلم']
        };
        
        // منطق التصنيف
        return 'general';
    }
}
```

## 📊 قاعدة البيانات المحلية

### هيكل البيانات

```javascript
// ملاحظة واحدة
const noteStructure = {
    id: "timestamp_random",           // معرف فريد
    text: "نص الملاحظة",             // المحتوى
    category: "work",                // التصنيف
    date: "1/1/2025, 12:00:00 ص",   // تاريخ منسق
    timestamp: 1735689600000,        // timestamp للترتيب
    sentiment: "positive",           // تحليل المشاعر (اختياري)
    wordCount: 25,                   // عدد الكلمات (اختياري)
    summary: "ملخص قصير",           // ملخص (اختياري)
    tags: ["tag1", "tag2"],         // علامات (اختياري)
    location: {                      // الموقع (اختياري)
        latitude: 0,
        longitude: 0,
        address: "العنوان"
    }
};

// إعدادات التطبيق
const settingsStructure = {
    recording: {
        language: "ar-SA",
        continuous: true,
        interimResults: true,
        maxRecordingTime: 300
    },
    ui: {
        theme: "auto",
        animations: true,
        soundFeedback: false
    },
    // ... المزيد من الإعدادات
};
```

### العمليات على البيانات

```javascript
// إضافة ملاحظة
function addNote(noteData) {
    const note = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        date: new Date().toLocaleString('ar-SA'),
        ...noteData
    };
    
    app.savedNotes.unshift(note);
    saveToStorage();
    updateUI();
}

// تحديث ملاحظة
function updateNote(noteId, updates) {
    const noteIndex = app.savedNotes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        app.savedNotes[noteIndex] = {
            ...app.savedNotes[noteIndex],
            ...updates,
            date: new Date().toLocaleString('ar-SA') + ' (معدّل)'
        };
        saveToStorage();
        updateUI();
    }
}

// حذف ملاحظة
function deleteNote(noteId) {
    app.savedNotes = app.savedNotes.filter(n => n.id !== noteId);
    saveToStorage();
    updateUI();
}

// البحث المتقدم
function searchNotes(query, filters = {}) {
    return app.savedNotes.filter(note => {
        const matchesText = !query || 
            note.text.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = !filters.category || 
            note.category === filters.category;
        
        const matchesSentiment = !filters.sentiment || 
            note.sentiment === filters.sentiment;
        
        const matchesDateRange = (!filters.dateFrom || 
            note.timestamp >= new Date(filters.dateFrom).getTime()) &&
            (!filters.dateTo || 
            note.timestamp <= new Date(filters.dateTo).getTime());
        
        return matchesText && matchesCategory && 
               matchesSentiment && matchesDateRange;
    });
}
```

## 🎨 تخصيص الواجهة

### إضافة نمط جديد

```css
/* نمط داكن مخصص */
.dark-theme {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --background-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #333333;
}

.dark-theme .recording-section,
.dark-theme .notes-section {
    background: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

/* رسوم متحركة مخصصة */
@keyframes customSlide {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.note-item.custom-animation {
    animation: customSlide 0.5s ease-out;
}
```

### تخصيص الأيقونات

```javascript
// تخصيص أيقونات التصنيفات
const categoryIcons = {
    'work': 'fas fa-briefcase',
    'personal': 'fas fa-user',
    'study': 'fas fa-graduation-cap',
    'ideas': 'fas fa-lightbulb',
    'meetings': 'fas fa-users',
    'health': 'fas fa-heartbeat',
    'travel': 'fas fa-plane'
};

// استخدام الأيقونات في العرض
function renderCategoryIcon(category) {
    const iconClass = categoryIcons[category] || 'fas fa-sticky-note';
    return `<i class="${iconClass}"></i>`;
}
```

## 🔌 تكامل APIs خارجية

### تكامل مع خدمات السحابة

```javascript
class CloudSync {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    
    async syncNotes(notes) {
        try {
            const response = await fetch(`${this.baseUrl}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({ notes })
            });
            
            return await response.json();
        } catch (error) {
            console.error('خطأ في المزامنة:', error);
            throw error;
        }
    }
    
    async downloadNotes() {
        try {
            const response = await fetch(`${this.baseUrl}/notes`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('خطأ في التحميل:', error);
            throw error;
        }
    }
}
```

### تكامل مع خدمات الذكاء الاصطناعي

```javascript
class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    
    async analyzeText(text) {
        try {
            const response = await fetch('https://api.example.com/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({ text })
            });
            
            return await response.json();
        } catch (error) {
            console.error('خطأ في التحليل:', error);
            return null;
        }
    }
    
    async translateText(text, targetLanguage) {
        // منطق الترجمة
    }
    
    async summarizeText(text, maxLength) {
        // منطق التلخيص
    }
}
```

## 🧪 الاختبار والتطوير

### اختبارات الوحدة

```javascript
// اختبار وظائف أساسية
function testNoteOperations() {
    console.log('اختبار إضافة ملاحظة...');
    const note = {
        text: 'ملاحظة تجريبية',
        category: 'test'
    };
    
    const initialCount = app.savedNotes.length;
    app.addNote(note);
    
    console.assert(
        app.savedNotes.length === initialCount + 1,
        'فشل في إضافة الملاحظة'
    );
    
    console.log('اختبار البحث...');
    const results = app.searchNotes('تجريبية');
    console.assert(
        results.length > 0,
        'فشل في البحث'
    );
    
    console.log('جميع الاختبارات نجحت!');
}

// اختبار الأداء
function performanceTest() {
    const startTime = performance.now();
    
    // إضافة 1000 ملاحظة تجريبية
    for (let i = 0; i < 1000; i++) {
        app.addNote({
            text: `ملاحظة تجريبية رقم ${i}`,
            category: 'test'
        });
    }
    
    const endTime = performance.now();
    console.log(`إضافة 1000 ملاحظة استغرقت ${endTime - startTime} مللي ثانية`);
    
    // اختبار البحث
    const searchStart = performance.now();
    app.searchNotes('تجريبية');
    const searchEnd = performance.now();
    
    console.log(`البحث في 1000 ملاحظة استغرق ${searchEnd - searchStart} مللي ثانية`);
}
```

## 📱 التطوير للأجهزة المحمولة

### تحسينات اللمس

```javascript
// دعم اللمس للأجهزة المحمولة
class TouchSupport {
    constructor() {
        this.initTouchEvents();
    }
    
    initTouchEvents() {
        let startX, startY, isScrolling;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = undefined;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            if (isScrolling === undefined) {
                isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
            }
            
            if (!isScrolling) {
                // إيماءة تمرير أفقية
                this.handleSwipeGesture(deltaX);
            }
        });
    }
    
    handleSwipeGesture(deltaX) {
        if (deltaX > 100) {
            // تمرير يمين - إجراء معين
        } else if (deltaX < -100) {
            // تمرير يسار - إجراء معين
        }
    }
}
```

## 🔧 أدوات التطوير المساعدة

### أداة تصحيح الأخطاء

```javascript
class DebugConsole {
    constructor() {
        this.enabled = localStorage.getItem('debugMode') === 'true';
        if (this.enabled) {
            this.createDebugPanel();
        }
    }
    
    log(message, data = null) {
        if (this.enabled) {
            console.log(`[DEBUG] ${message}`, data);
            this.addToDebugPanel(message, data);
        }
    }
    
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 300px;
            height: 200px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
            z-index: 10000;
        `;
        document.body.appendChild(panel);
    }
    
    addToDebugPanel(message, data) {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            const entry = document.createElement('div');
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            if (data) {
                entry.textContent += ` | ${JSON.stringify(data)}`;
            }
            panel.appendChild(entry);
            panel.scrollTop = panel.scrollHeight;
        }
    }
}

// تفعيل وضع التصحيح
// localStorage.setItem('debugMode', 'true');
// const debug = new DebugConsole();
```

## 🚀 نشر التطبيق

### تحسين الأداء للإنتاج

```javascript
// ضغط البيانات
function compressData(data) {
    // استخدام خوارزمية ضغط بسيطة
    return JSON.stringify(data);
}

// تحميل كسول للمميزات المتقدمة
async function loadAdvancedFeatures() {
    if (!window.advancedFeaturesLoaded) {
        await import('./advanced-features.js');
        window.advancedFeaturesLoaded = true;
    }
}

// تحسين استخدام الذاكرة
function optimizeMemory() {
    // تنظيف الملاحظات القديمة المحذوفة
    const cleanedNotes = app.savedNotes.filter(note => !note.deleted);
    app.savedNotes = cleanedNotes;
    
    // حفظ البيانات المضغوطة
    localStorage.setItem('speechNotes', compressData(cleanedNotes));
}
```

## 📋 قائمة التحقق للتطوير

- [ ] اختبار جميع المتصفحات المدعومة
- [ ] اختبار الاستجابة على الأجهزة المختلفة
- [ ] تحسين الأداء وتقليل الذاكرة المستخدمة
- [ ] إضافة اختبارات وحدة شاملة
- [ ] توثيق جميع الوظائف والمعاملات
- [ ] إضافة معالجة شاملة للأخطاء
- [ ] تحسين إمكانية الوصول (Accessibility)
- [ ] ضمان أمان البيانات والخصوصية

---

**ملاحظة**: هذا دليل تطوير شامل للمطورين الذين يرغبون في تخصيص أو توسيع التطبيق. للاستخدام العادي، راجع ملف README.md.