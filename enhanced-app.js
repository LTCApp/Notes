// مثال على التكامل مع المميزات المتقدمة

// إعدادات التطبيق المتقدمة
const appConfig = {
    // إعدادات التسجيل
    recording: {
        language: 'ar-SA', // يمكن تغييرها حسب الحاجة
        continuous: true,
        interimResults: true,
        maxRecordingTime: 300, // 5 دقائق كحد أقصى
        autoStop: false
    },
    
    // إعدادات الحفظ التلقائي
    autoSave: {
        enabled: true,
        interval: 3000, // 3 ثواني
        showNotification: false
    },
    
    // إعدادات النسخة الاحتياطية
    backup: {
        enabled: true,
        frequency: 'daily', // daily, weekly, monthly
        maxBackups: 7,
        autoRestore: true
    },
    
    // إعدادات الواجهة
    ui: {
        theme: 'auto', // light, dark, auto
        animations: true,
        soundFeedback: false,
        compactMode: false
    },
    
    // إعدادات التصدير
    export: {
        defaultFormat: 'txt',
        includeMetadata: true,
        dateFormat: 'ar-SA',
        fileNaming: 'notes-{date}'
    },
    
    // إعدادات البحث
    search: {
        highlightResults: true,
        fuzzySearch: false,
        searchHistory: true,
        maxHistoryItems: 10
    },
    
    // المميزات التجريبية
    experimental: {
        aiSuggestions: false,
        voiceCommands: false,
        smartCategories: false,
        sentimentAnalysis: false
    }
};

// كلاس إدارة الإعدادات
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('speechNotesSettings');
        return saved ? { ...appConfig, ...JSON.parse(saved) } : appConfig;
    }
    
    saveSettings() {
        localStorage.setItem('speechNotesSettings', JSON.stringify(this.settings));
    }
    
    get(key) {
        return this.getNestedValue(this.settings, key);
    }
    
    set(key, value) {
        this.setNestedValue(this.settings, key, value);
        this.saveSettings();
    }
    
    getNestedValue(obj, key) {
        return key.split('.').reduce((o, k) => o && o[k], obj);
    }
    
    setNestedValue(obj, key, value) {
        const keys = key.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
        target[lastKey] = value;
    }
    
    reset() {
        this.settings = { ...appConfig };
        this.saveSettings();
    }
}

// نسخة محسّنة من التطبيق مع دعم الإعدادات المتقدمة
class EnhancedSpeechNotesApp extends AdvancedSpeechNotesApp {
    constructor() {
        super();
        this.settings = new SettingsManager();
        this.advancedFeatures = new AdvancedFeatures(this);
        this.aiFeatures = new AIFeatures(this);
        
        this.initEnhancedFeatures();
    }
    
    initEnhancedFeatures() {
        this.setupTheme();
        this.setupKeyboardShortcuts();
        this.setupVoiceCommands();
        this.createSettingsPanel();
    }
    
    setupTheme() {
        const theme = this.settings.get('ui.theme');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'light') {
            document.body.classList.add('light-theme');
        }
        // auto theme يعتمد على إعدادات النظام
    }
    
    setupKeyboardShortcuts() {
        if (!this.settings.get('ui.animations')) {
            document.body.classList.add('no-animations');
        }
        
        // اختصارات إضافية
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + E للتصدير السريع
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.quickExport();
            }
            
            // Ctrl/Cmd + B للنسخة الاحتياطية
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.advancedFeatures.createBackup();
                this.showToast('تم إنشاء نسخة احتياطية');
            }
            
            // Ctrl/Cmd + , للإعدادات
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                this.showSettingsPanel();
            }
        });
    }
    
    setupVoiceCommands() {
        if (!this.settings.get('experimental.voiceCommands')) return;
        
        // إضافة أوامر صوتية بسيطة
        const originalOnResult = this.recognition.onresult;
        
        this.recognition.onresult = (event) => {
            originalOnResult.call(this, event);
            
            // التحقق من الأوامر الصوتية
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const text = lastResult[0].transcript.toLowerCase();
                
                if (text.includes('احفظ') || text.includes('حفظ')) {
                    setTimeout(() => this.saveNote(), 1000);
                } else if (text.includes('امسح') || text.includes('مسح')) {
                    setTimeout(() => this.clearText(), 1000);
                } else if (text.includes('توقف') || text.includes('إيقاف')) {
                    setTimeout(() => this.toggleRecording(), 1000);
                }
            }
        };
    }
    
    // تحسين وظيفة الحفظ مع الذكاء الاصطناعي
    saveNote() {
        const text = this.resultText.textContent.trim();
        if (!text || text === 'النص المسجل سيظهر هنا...') {
            this.showToast('لا يوجد نص للحفظ', 'error');
            return;
        }
        
        let category = this.categorySelect.value;
        
        // اقتراح التصنيف التلقائي
        if (!category && this.settings.get('experimental.smartCategories')) {
            const suggestedCategory = this.aiFeatures.suggestCategory(text);
            category = suggestedCategory;
            
            this.showToast(`تم اقتراح التصنيف: ${this.getCategoryDisplayName(category)}`);
        }
        
        // تحليل المشاعر
        let sentiment = null;
        if (this.settings.get('experimental.sentimentAnalysis')) {
            sentiment = this.aiFeatures.analyzeSentiment(text);
        }
        
        // إنشاء الملاحظة مع البيانات المحسّنة
        const note = {
            id: Date.now() + Math.random(),
            text: text,
            category: category || 'other',
            date: new Date().toLocaleString(this.settings.get('export.dateFormat')),
            timestamp: Date.now(),
            sentiment: sentiment,
            wordCount: text.split(' ').length,
            summary: this.aiFeatures.summarizeText(text)
        };
        
        this.savedNotes.unshift(note);
        localStorage.setItem('speechNotes', JSON.stringify(this.savedNotes));
        
        this.displayNotes();
        this.updateStats();
        this.clearText();
        this.categorySelect.value = '';
        
        // تنظيف مسودة الحفظ التلقائي
        this.advancedFeatures.clearDraft();
        
        this.showToast('تم حفظ الملاحظة بنجاح!');
        this.updateStatus('تم حفظ الملاحظة بنجاح!', 'ready');
        
        // تشغيل صوت التأكيد إذا كان مفعلاً
        if (this.settings.get('ui.soundFeedback')) {
            this.playNotificationSound();
        }
    }
    
    quickExport() {
        const format = this.settings.get('export.defaultFormat');
        this.exportNotes(format);
    }
    
    playNotificationSound() {
        // تشغيل صوت بسيط باستخدام Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    createSettingsPanel() {
        const settingsHtml = `
            <div id="settingsModal" class="modal">
                <div class="modal-content" style="max-width: 600px;">
                    <h3>إعدادات التطبيق</h3>
                    <div class="settings-content">
                        <div class="setting-group">
                            <h4>الواجهة</h4>
                            <label>
                                <input type="checkbox" id="animations" ${this.settings.get('ui.animations') ? 'checked' : ''}>
                                تفعيل الرسوم المتحركة
                            </label>
                            <label>
                                <input type="checkbox" id="soundFeedback" ${this.settings.get('ui.soundFeedback') ? 'checked' : ''}>
                                الأصوات التأكيدية
                            </label>
                            <label>
                                النمط:
                                <select id="theme">
                                    <option value="auto" ${this.settings.get('ui.theme') === 'auto' ? 'selected' : ''}>تلقائي</option>
                                    <option value="light" ${this.settings.get('ui.theme') === 'light' ? 'selected' : ''}>فاتح</option>
                                    <option value="dark" ${this.settings.get('ui.theme') === 'dark' ? 'selected' : ''}>داكن</option>
                                </select>
                            </label>
                        </div>
                        
                        <div class="setting-group">
                            <h4>الحفظ التلقائي</h4>
                            <label>
                                <input type="checkbox" id="autoSave" ${this.settings.get('autoSave.enabled') ? 'checked' : ''}>
                                تفعيل الحفظ التلقائي
                            </label>
                            <label>
                                فترة الحفظ (ثانية):
                                <input type="number" id="autoSaveInterval" value="${this.settings.get('autoSave.interval') / 1000}" min="1" max="60">
                            </label>
                        </div>
                        
                        <div class="setting-group">
                            <h4>المميزات التجريبية</h4>
                            <label>
                                <input type="checkbox" id="smartCategories" ${this.settings.get('experimental.smartCategories') ? 'checked' : ''}>
                                التصنيف الذكي
                            </label>
                            <label>
                                <input type="checkbox" id="voiceCommands" ${this.settings.get('experimental.voiceCommands') ? 'checked' : ''}>
                                الأوامر الصوتية
                            </label>
                            <label>
                                <input type="checkbox" id="sentimentAnalysis" ${this.settings.get('experimental.sentimentAnalysis') ? 'checked' : ''}>
                                تحليل المشاعر
                            </label>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <button id="saveSettings" class="btn btn-primary">حفظ</button>
                        <button id="resetSettings" class="btn btn-warning">إعادة تعيين</button>
                        <button id="closeSettings" class="btn btn-secondary">إغلاق</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHtml);
        
        // ربط الأحداث
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.hideSettingsPanel());
    }
    
    showSettingsPanel() {
        document.getElementById('settingsModal').style.display = 'block';
    }
    
    hideSettingsPanel() {
        document.getElementById('settingsModal').style.display = 'none';
    }
    
    saveSettings() {
        // حفظ الإعدادات الجديدة
        this.settings.set('ui.animations', document.getElementById('animations').checked);
        this.settings.set('ui.soundFeedback', document.getElementById('soundFeedback').checked);
        this.settings.set('ui.theme', document.getElementById('theme').value);
        this.settings.set('autoSave.enabled', document.getElementById('autoSave').checked);
        this.settings.set('autoSave.interval', document.getElementById('autoSaveInterval').value * 1000);
        this.settings.set('experimental.smartCategories', document.getElementById('smartCategories').checked);
        this.settings.set('experimental.voiceCommands', document.getElementById('voiceCommands').checked);
        this.settings.set('experimental.sentimentAnalysis', document.getElementById('sentimentAnalysis').checked);
        
        this.hideSettingsPanel();
        this.showToast('تم حفظ الإعدادات');
        
        // إعادة تحميل الصفحة لتطبيق الإعدادات الجديدة
        setTimeout(() => location.reload(), 1000);
    }
    
    resetSettings() {
        this.settings.reset();
        this.hideSettingsPanel();
        this.showToast('تم إعادة تعيين الإعدادات');
        setTimeout(() => location.reload(), 1000);
    }
    
    // تحسينات إضافية للعرض
    displayNotes() {
        super.displayNotes();
        
        // إضافة معلومات إضافية للملاحظات
        if (this.settings.get('experimental.sentimentAnalysis')) {
            this.addSentimentIndicators();
        }
    }
    
    addSentimentIndicators() {
        const noteItems = document.querySelectorAll('.note-item');
        
        noteItems.forEach((item, index) => {
            const note = this.savedNotes[index];
            if (note && note.sentiment) {
                const indicator = document.createElement('span');
                indicator.className = `sentiment-indicator ${note.sentiment}`;
                
                const icon = note.sentiment === 'positive' ? '😊' : 
                           note.sentiment === 'negative' ? '😞' : '😐';
                
                indicator.innerHTML = icon;
                item.querySelector('.note-meta').appendChild(indicator);
            }
        });
    }
}

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedSpeechNotesApp, SettingsManager, appConfig };
}