<script setup>
import { ref, watch } from 'vue';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 初始化Gemini API
const API_KEY = "AIzaSyDEIdnAdTIH7m_lW6z0ECjmv610saxYQiw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const sourceText = ref('');
const translatedText = ref('');
const translationStyle = ref('标准');
const isTranslating = ref(false);
const errorMessage = ref('');

// 翻译风格选项
const translationStyles = [
  { id: 'standard', name: '标准' },
  { id: 'formal', name: '正式的' },
  { id: 'casual', name: '随意的' },
  { id: 'poetic', name: '诗意的' },
  { id: 'professional', name: '专业的' },
  { id: 'simple', name: '简单的' },
  { id: 'literary', name: '文学的' },
  { id: 'surprise', name: '涩涩的' }
];

// 使用debounce防止频繁API调用
let debounceTimer;
const debouncedTranslate = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (sourceText.value.trim()) {
      translateText();
    }
  }, 800);
};

// 监听源文本变化
watch(sourceText, (newValue) => {
  if (newValue.trim()) {
    debouncedTranslate();
  } else {
    translatedText.value = '';
  }
});

// 监听翻译风格变化
watch(translationStyle, () => {
  if (sourceText.value.trim()) {
    translateText();
  }
});

const translationStyleConverter = (style) => {
  const styleMap = {
    '标准': '标准、自然且流畅的语言',
    '正式的': '书面化的、正式的语言，适合商务场合和官方文档',
    '随意的': '轻松、口语化的表达，就像朋友间的对话',
    '诗意的': '富有诗意和优美的表达，使用华丽的词藻和意象',
    '专业的': '使用行业术语和精确表达的专业语言',
    '简单的': '简洁、易懂的语言，避免复杂结构和生僻词汇',
    '文学的': '优美的文学表达，注重语言的韵律和节奏感',
    '涩涩的': '色气且带有性暗示的语言表达，并且假设你是一只可爱且性饥渴的猫娘'
  };
  
  return styleMap[style] || style; // 如果找不到映射，返回原始风格名称
};

const translateText = async () => {
  if (!sourceText.value.trim()) {
    translatedText.value = '';
    return;
  }

  try {
    isTranslating.value = true;
    errorMessage.value = '';
    
    // 获取风格的详细描述
    const styleDescription = translationStyleConverter(translationStyle.value);
    
    // 构建提示词，指导Gemini如何进行翻译
    const prompt = `请按照要求把以下的文字进行改写，使用${styleDescription}：
                    
${sourceText.value}

请只返回翻译后的文本，不要包含任何其他解释或原文。`;

    // 调用Gemini API
    const result = await model.generateContent(prompt);
    const translatedResult = result.response.text();
    
    // 清理结果（去除可能的引号和额外空格）
    translatedText.value = translatedResult.trim().replace(/^["']|["']$/g, '');
    
  } catch (error) {
    errorMessage.value = `翻译出错: ${error.message}`;
    console.error('Translation error:', error);
  } finally {
    isTranslating.value = false;
  }
};

const clearText = () => {
  sourceText.value = '';
  translatedText.value = '';
  errorMessage.value = '';
};
</script>

<template>
  <div class="translator-container">
    <div class="translator-header">
      <h2>智能翻译</h2>
      <div class="style-selector">
        <label for="style">翻译风格：</label>
        <select id="style" v-model="translationStyle">
          <option v-for="style in translationStyles" :key="style.id" :value="style.name">
            {{ style.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="translation-area">
      <div class="text-container">
        <textarea 
          v-model="sourceText" 
          placeholder="请输入要翻译的文字..."
        ></textarea>
        <button class="clear-btn" @click="clearText" title="清空文本">✕</button>
        <div class="char-count" v-if="sourceText">{{ sourceText.length }} 字符</div>
      </div>
      
      <div class="translator-divider">
        <div class="translation-loader" v-if="isTranslating">
          <div class="loader"></div>
          <span>翻译中...</span>
        </div>
        <div v-else class="arrow">→</div>
      </div>
      
      <div class="text-container result">
        <textarea 
          v-model="translatedText" 
          readonly
          placeholder="翻译结果将显示在这里..."
        ></textarea>
        <button 
          class="copy-btn" 
          @click="() => navigator.clipboard.writeText(translatedText)" 
          :disabled="!translatedText"
          title="复制到剪贴板"
        >
          📋
        </button>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.translator-container {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  opacity: 0.9;
}

.translator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.translator-header h2 {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 1.75rem;
}

.style-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.style-selector label {
  font-weight: 500;
  color: #555555;
}

.style-selector select {
  padding: 0.6rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-size: 0.95rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #333;
}

.style-selector select option {
  color: #333;
  background-color: #fff;
}

.style-selector select:focus {
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}

.translation-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}

.text-container {
  position: relative;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s;
}

.text-container:hover {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.translator-divider {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #646cff;
  font-size: 1.5rem;
  font-weight: 300;
}

.translation-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #646cff;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(100, 108, 255, 0.2);
  border-top: 3px solid #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

textarea {
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  border: none;
  resize: none;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #333;
  background-color: #fafafa;
}

textarea::placeholder {
  color: #aaa;
}

textarea:focus {
  outline: none;
}

.result textarea {
  background-color: #f8f9fa;
}

.clear-btn, .copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(240, 240, 240, 0.8);
  border: none;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover, .copy-btn:hover {
  background-color: rgba(220, 220, 220, 0.9);
  color: #333;
  transform: scale(1.05);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.8rem;
  color: #888;
}

.error-message {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.85rem;
  color: #e53935;
}

@media (max-width: 768px) {
  .translation-area {
    grid-template-columns: 1fr;
  }
  
  .translator-divider {
    height: 40px;
    transform: rotate(90deg);
  }
  
  .translator-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .style-selector {
    width: 100%;
  }
  
  .style-selector select {
    flex: 1;
  }
}
</style>