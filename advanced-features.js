// وظائف إضافية متقدمة لتطبيق الملاحظات الصوتية

class AdvancedFeatures {
    constructor(app) {
        this.app = app;
        this.initAdvancedFeatures();
    }

    initAdvancedFeatures() {
        this.setupKeyboardShortcuts();
        this.setupAutoSave();
        this.setupBackup();
        this.setupAnalytics();
    }

    // اختصارات لوحة المفاتيح
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R للتسجيل
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.app.toggleRecording();
            }
            
            // Ctrl/Cmd + S للحفظ
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.app.saveNote();
            }
            
            // Ctrl/Cmd + K للبحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.app.searchInput.focus();
            }
            
            // Escape لإلغاء التعديل
            if (e.key === 'Escape') {
                if (this.app.editingNoteId) {
                    this.app.displayNotes();
                    this.app.editingNoteId = null;
                }
            }
        });
    }

    // حفظ تلقائي
    setupAutoSave() {
        let autoSaveTimer;
        
        this.app.resultText.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                this.autoSaveDraft();
            }, 3000); // حفظ تلقائي كل 3 ثواني
        });
    }

    autoSaveDraft() {
        const text = this.app.resultText.textContent;
        if (text && text !== 'النص المسجل سيظهر هنا...') {
            localStorage.setItem('speechNotesDraft', text);
        }
    }

    loadDraft() {
        const draft = localStorage.getItem('speechNotesDraft');
        if (draft) {
            this.app.resultText.textContent = draft;
            this.app.showToast('تم استرداد المسودة المحفوظة');
        }
    }

    clearDraft() {
        localStorage.removeItem('speechNotesDraft');
    }

    // نسخة احتياطية
    setupBackup() {
        // نسخة احتياطية يومية
        const lastBackup = localStorage.getItem('lastBackupDate');
        const today = new Date().toDateString();
        
        if (lastBackup !== today) {
            this.createBackup();
            localStorage.setItem('lastBackupDate', today);
        }
    }

    createBackup() {
        const backupData = {
            notes: this.app.savedNotes,
            categories: this.app.categories,
            date: new Date().toISOString(),
            version: '2.0'
        };
        
        localStorage.setItem('speechNotesBackup', JSON.stringify(backupData));
    }

    restoreBackup() {
        const backup = localStorage.getItem('speechNotesBackup');
        if (backup) {
            try {
                const backupData = JSON.parse(backup);
                this.app.savedNotes = backupData.notes || [];
                this.app.categories = backupData.categories || [];
                
                localStorage.setItem('speechNotes', JSON.stringify(this.app.savedNotes));
                localStorage.setItem('noteCategories', JSON.stringify(this.app.categories));
                
                this.app.displayNotes();
                this.app.updateStats();
                this.app.updateCategorySelects();
                
                this.app.showToast('تم استرداد النسخة الاحتياطية');
                return true;
            } catch (error) {
                this.app.showToast('خطأ في استرداد النسخة الاحتياطية', 'error');
                return false;
            }
        }
        return false;
    }

    // إحصائيات متقدمة
    setupAnalytics() {
        this.analytics = {
            totalNotes: 0,
            totalWords: 0,
            categoriesUsed: new Set(),
            recordingTime: 0,
            lastUpdate: Date.now()
        };
        
        this.loadAnalytics();
    }

    updateAnalytics() {
        this.analytics.totalNotes = this.app.savedNotes.length;
        this.analytics.totalWords = this.app.savedNotes.reduce((total, note) => {
            return total + note.text.split(' ').length;
        }, 0);
        
        this.analytics.categoriesUsed = new Set(
            this.app.savedNotes.map(note => note.category)
        );
        
        this.analytics.lastUpdate = Date.now();
        this.saveAnalytics();
    }

    saveAnalytics() {
        localStorage.setItem('speechNotesAnalytics', JSON.stringify(this.analytics));
    }

    loadAnalytics() {
        const saved = localStorage.getItem('speechNotesAnalytics');
        if (saved) {
            this.analytics = { ...this.analytics, ...JSON.parse(saved) };
        }
    }

    getAnalyticsReport() {
        this.updateAnalytics();
        
        return {
            totalNotes: this.analytics.totalNotes,
            totalWords: this.analytics.totalWords,
            averageWordsPerNote: Math.round(this.analytics.totalWords / this.analytics.totalNotes) || 0,
            categoriesCount: this.analytics.categoriesUsed.size,
            mostUsedCategory: this.getMostUsedCategory(),
            recordingTimeFormatted: this.formatTime(this.analytics.recordingTime)
        };
    }

    getMostUsedCategory() {
        const categoryCount = {};
        this.app.savedNotes.forEach(note => {
            categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;
        });
        
        let maxCategory = '';
        let maxCount = 0;
        
        for (const [category, count] of Object.entries(categoryCount)) {
            if (count > maxCount) {
                maxCount = count;
                maxCategory = category;
            }
        }
        
        return this.app.getCategoryDisplayName(maxCategory);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // وظائف البحث المتقدم
    advancedSearch(query, options = {}) {
        const {
            category = '',
            dateFrom = null,
            dateTo = null,
            minWords = 0,
            maxWords = Infinity
        } = options;
        
        return this.app.savedNotes.filter(note => {
            // البحث في النص
            const matchesText = !query || note.text.toLowerCase().includes(query.toLowerCase());
            
            // التصفية بالتصنيف
            const matchesCategory = !category || note.category === category;
            
            // التصفية بالتاريخ
            const noteDate = new Date(note.timestamp);
            const matchesDateFrom = !dateFrom || noteDate >= new Date(dateFrom);
            const matchesDateTo = !dateTo || noteDate <= new Date(dateTo);
            
            // التصفية بعدد الكلمات
            const wordCount = note.text.split(' ').length;
            const matchesWordCount = wordCount >= minWords && wordCount <= maxWords;
            
            return matchesText && matchesCategory && matchesDateFrom && matchesDateTo && matchesWordCount;
        });
    }

    // تصدير متقدم
    exportAdvanced(format, options = {}) {
        const {
            includeMetadata = true,
            filterCategory = '',
            customTemplate = null
        } = options;
        
        let notesToExport = this.app.savedNotes;
        
        if (filterCategory) {
            notesToExport = notesToExport.filter(note => note.category === filterCategory);
        }
        
        const date = new Date().toISOString().split('T')[0];
        
        switch (format) {
            case 'csv':
                return this.exportCSV(notesToExport, includeMetadata);
                
            case 'markdown':
                return this.exportMarkdown(notesToExport, includeMetadata);
                
            case 'html':
                return this.exportHTML(notesToExport, includeMetadata);
                
            case 'pdf':
                return this.exportPDF(notesToExport, includeMetadata);
                
            default:
                return null;
        }
    }

    exportCSV(notes, includeMetadata) {
        const headers = includeMetadata 
            ? ['التاريخ', 'التصنيف', 'النص', 'عدد الكلمات']
            : ['النص'];
        
        const rows = notes.map(note => {
            const wordCount = note.text.split(' ').length;
            return includeMetadata
                ? [note.date, this.app.getCategoryDisplayName(note.category), note.text, wordCount]
                : [note.text];
        });
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        const date = new Date().toISOString().split('T')[0];
        this.app.downloadFile(csvContent, `notes-${date}.csv`, 'text/csv');
    }

    exportMarkdown(notes, includeMetadata) {
        let content = '# الملاحظات الصوتية\n\n';
        
        if (includeMetadata) {
            const analytics = this.getAnalyticsReport();
            content += `## إحصائيات\n\n`;
            content += `- العدد الإجمالي: ${analytics.totalNotes}\n`;
            content += `- إجمالي الكلمات: ${analytics.totalWords}\n`;
            content += `- متوسط الكلمات: ${analytics.averageWordsPerNote}\n`;
            content += `- عدد التصنيفات: ${analytics.categoriesCount}\n\n`;
        }
        
        content += '## الملاحظات\n\n';
        
        notes.forEach((note, index) => {
            content += `### ملاحظة ${index + 1}\n\n`;
            if (includeMetadata) {
                content += `**التاريخ:** ${note.date}\n\n`;
                content += `**التصنيف:** ${this.app.getCategoryDisplayName(note.category)}\n\n`;
            }
            content += `${note.text}\n\n---\n\n`;
        });
        
        const date = new Date().toISOString().split('T')[0];
        this.app.downloadFile(content, `notes-${date}.md`, 'text/markdown');
    }

    exportHTML(notes, includeMetadata) {
        let html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الملاحظات الصوتية</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .note { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .note-meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .note-category { background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; }
        .stats { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>الملاحظات الصوتية</h1>
`;
        
        if (includeMetadata) {
            const analytics = this.getAnalyticsReport();
            html += `
    <div class="stats">
        <h2>إحصائيات</h2>
        <p>العدد الإجمالي: ${analytics.totalNotes}</p>
        <p>إجمالي الكلمات: ${analytics.totalWords}</p>
        <p>متوسط الكلمات: ${analytics.averageWordsPerNote}</p>
        <p>عدد التصنيفات: ${analytics.categoriesCount}</p>
    </div>
`;
        }
        
        notes.forEach((note, index) => {
            html += `
    <div class="note">
        ${includeMetadata ? `
        <div class="note-meta">
            <strong>التاريخ:</strong> ${note.date} |
            <span class="note-category">${this.app.getCategoryDisplayName(note.category)}</span>
        </div>
        ` : ''}
        <div class="note-content">${note.text}</div>
    </div>
`;
        });
        
        html += `
</body>
</html>`;
        
        const date = new Date().toISOString().split('T')[0];
        this.app.downloadFile(html, `notes-${date}.html`, 'text/html');
    }

    // استيراد البيانات
    importNotes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.notes && Array.isArray(data.notes)) {
                        // دمج الملاحظات المستوردة
                        const importedNotes = data.notes.map(note => ({
                            ...note,
                            id: Date.now() + Math.random(), // معرف جديد
                            imported: true
                        }));
                        
                        this.app.savedNotes = [...importedNotes, ...this.app.savedNotes];
                        
                        // دمج التصنيفات
                        if (data.categories && Array.isArray(data.categories)) {
                            const newCategories = data.categories.filter(
                                cat => !this.app.categories.includes(cat)
                            );
                            this.app.categories = [...this.app.categories, ...newCategories];
                        }
                        
                        // حفظ البيانات الجديدة
                        localStorage.setItem('speechNotes', JSON.stringify(this.app.savedNotes));
                        localStorage.setItem('noteCategories', JSON.stringify(this.app.categories));
                        
                        // تحديث الواجهة
                        this.app.displayNotes();
                        this.app.updateStats();
                        this.app.updateCategorySelects();
                        
                        resolve({
                            imported: importedNotes.length,
                            categories: data.categories ? data.categories.length : 0
                        });
                    } else {
                        reject('تنسيق الملف غير صحيح');
                    }
                } catch (error) {
                    reject('خطأ في قراءة الملف');
                }
            };
            
            reader.onerror = () => reject('خطأ في قراءة الملف');
            reader.readAsText(file);
        });
    }

    // مزامنة السحابة (مستقبلياً)
    setupCloudSync() {
        // سيتم تنفيذها لاحقاً مع خدمات السحابة
        console.log('Cloud sync will be available in future updates');
    }
}

// إضافة وظائف الذكاء الاصطناعي (محاكاة)
class AIFeatures {
    constructor(app) {
        this.app = app;
    }

    // تحليل المشاعر (محاكاة)
    analyzeSentiment(text) {
        const positiveWords = ['سعيد', 'ممتاز', 'رائع', 'جيد', 'ناجح', 'إيجابي'];
        const negativeWords = ['حزين', 'سيء', 'فاشل', 'صعب', 'مشكلة', 'خطأ'];
        
        const words = text.toLowerCase().split(' ');
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
            if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
        });
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    // اقتراح التصنيفات
    suggestCategory(text) {
        const keywords = {
            'work': ['اجتماع', 'مشروع', 'عمل', 'مهمة', 'شركة', 'موظف'],
            'personal': ['عائلة', 'شخصي', 'منزل', 'صحة', 'رياضة'],
            'study': ['دراسة', 'امتحان', 'جامعة', 'تعلم', 'كتاب', 'بحث'],
            'ideas': ['فكرة', 'إبداع', 'اختراع', 'تطوير', 'ابتكار'],
            'meetings': ['اجتماع', 'لقاء', 'مؤتمر', 'جلسة', 'مناقشة']
        };
        
        const textLower = text.toLowerCase();
        let maxScore = 0;
        let suggestedCategory = 'other';
        
        for (const [category, words] of Object.entries(keywords)) {
            const score = words.reduce((count, word) => {
                return count + (textLower.includes(word) ? 1 : 0);
            }, 0);
            
            if (score > maxScore) {
                maxScore = score;
                suggestedCategory = category;
            }
        }
        
        return suggestedCategory;
    }

    // تلخيص النص (محاكاة بسيطة)
    summarizeText(text, maxSentences = 2) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length <= maxSentences) {
            return text;
        }
        
        // اختيار الجمل الأولى والأخيرة كتلخيص بسيط
        return [sentences[0], sentences[sentences.length - 1]]
            .join('. ') + '.';
    }
}

// تصدير الكلاسات للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedFeatures, AIFeatures };
}