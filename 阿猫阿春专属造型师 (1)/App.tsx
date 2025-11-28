
import React, { useState, useEffect } from 'react';
import { AppMode, ClothingItem, Scene, AnalysisData, ChatMessage } from './types';
import { INITIAL_ANALYSIS, SCENES } from './constants';
import { WardrobePanel } from './components/WardrobePanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { CameraCapture } from './components/CameraCapture';
import { ChatAdvisor } from './components/ChatAdvisor';
import { analyzeUserImage, generateTryOnImage } from './services/geminiService';
import { Upload, Camera, Wand2, Loader2, RefreshCw, Activity, Smile, LayoutGrid, MessageSquare, User, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<ClothingItem | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0]);
  const [customClothes, setCustomClothes] = useState<ClothingItem[]>([]);
  
  // Controls for Pose and Expression
  const [poseInput, setPoseInput] = useState<string>("自然站立");
  const [expressionInput, setExpressionInput] = useState<string>("自然微笑");

  const [analysisData, setAnalysisData] = useState<AnalysisData>(INITIAL_ANALYSIS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<'wardrobe' | 'studio' | 'advisor'>('studio');

  // Tabs for right sidebar / mobile advisor view
  const [advisorTab, setAdvisorTab] = useState<'analysis' | 'chat'>('analysis');

  // Initial chat message derived from analysis
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Update chat when analysis finishes with suggestions
  useEffect(() => {
    if (analysisData.suggestedItemIds && analysisData.suggestedItemIds.length > 0) {
      const suggestedText = `根据你的身材和肤色分析，我强烈推荐这几套搭配：` + 
        analysisData.suggestedItemIds.map(id => ` [[${id}]] `).join(" 和 ");
      
      setChatMessages([{ role: 'model', text: `${analysisData.styleAdvice} ${suggestedText}` }]);
    }
  }, [analysisData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setOriginalImage(ev.target.result as string);
          setMode(AppMode.FITTING);
          performAnalysis(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    setOriginalImage(imageSrc);
    setMode(AppMode.FITTING);
    performAnalysis(imageSrc);
  };

  const performAnalysis = async (imageSrc: string) => {
    setIsAnalyzing(true);
    setAdvisorTab('analysis'); // Ensure analysis is shown
    // On mobile, maybe switch to advisor tab? Let's keep user in studio but show a notification or rely on manual switch
    const data = await analyzeUserImage(imageSrc);
    setAnalysisData(data);
    setIsAnalyzing(false);
  };

  const handleTryOn = async () => {
    if (!originalImage || !selectedClothes) return;

    setIsGenerating(true);
    try {
      const sceneDesc = selectedScene.prompt;
      
      const resultImg = await generateTryOnImage(
        originalImage, 
        selectedClothes, 
        sceneDesc,
        poseInput,
        expressionInput
      );
      setGeneratedImage(resultImg);
    } catch (err) {
      alert("生成试穿图片失败，请重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  // Triggered when clicking "Try On" from Chat
  const handleChatRecommendation = async (item: ClothingItem) => {
    setSelectedClothes(item);
    
    // Logic to switch view back to studio to see result
    if (window.innerWidth < 768) {
       setMobileTab('studio');
    }
    
    // Immediate try-on effect
    setIsGenerating(true);
    try {
        const sceneDesc = selectedScene.prompt;
        const resultImg = await generateTryOnImage(
            originalImage!, 
            item, 
            sceneDesc,
            poseInput,
            expressionInput
        );
        setGeneratedImage(resultImg);
    } catch (err) {
        alert("试穿失败");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCustomClothUpload = (item: ClothingItem) => {
     setCustomClothes(prev => [item, ...prev]);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setMode(AppMode.UPLOAD);
    setSelectedClothes(null);
    setAnalysisData(INITIAL_ANALYSIS);
    setChatMessages([]);
  };

  // --- Render Components Helpers ---

  const renderWardrobeContent = () => (
    <WardrobePanel 
      onSelectClothing={setSelectedClothes}
      onSelectScene={setSelectedScene}
      selectedClothingId={selectedClothes?.id || null}
      selectedSceneId={selectedScene.id}
      customClothes={customClothes}
      onUploadClothing={handleCustomClothUpload}
    />
  );

  const renderAdvisorContent = () => (
    <div className="flex flex-col h-full bg-neutral-900">
      <div className="flex border-b border-white/10 shrink-0">
        <button 
          onClick={() => setAdvisorTab('analysis')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${advisorTab === 'analysis' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500'}`}
        >
          AI 分析
        </button>
        <button 
          onClick={() => setAdvisorTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${advisorTab === 'chat' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500'}`}
        >
          智能助手
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {advisorTab === 'analysis' ? (
            <div className="h-full overflow-y-auto custom-scrollbar">
              <AnalysisPanel data={analysisData} loading={isAnalyzing} />
            </div>
         ) : (
           <ChatAdvisor 
              initialMessages={chatMessages} 
              onSelectClothing={handleChatRecommendation}
           />
         )}
      </div>
    </div>
  );

  const renderStudioContent = () => (
    <div className="flex flex-col h-full relative overflow-y-auto custom-scrollbar md:overflow-hidden">
        {mode === AppMode.CAMERA && (
            <div className="absolute inset-0 z-50 bg-black">
                <CameraCapture onCapture={handleCameraCapture} onClose={() => setMode(AppMode.UPLOAD)} />
            </div>
        )}

        {mode === AppMode.UPLOAD && (
            <div className="flex-1 flex items-center justify-center p-6">
                 <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
                        <div className="relative bg-neutral-800 ring-1 ring-white/10 rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl">
                            <div className="w-20 h-20 bg-neutral-700/50 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-300" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">上传你的照片</h2>
                                <p className="text-gray-400 text-sm">建议使用全身照以获得最佳试衣效果</p>
                            </div>
                            
                            <label className="w-full">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <div className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-center">
                                选择图片
                            </div>
                            </label>

                            <div className="w-full flex items-center gap-3">
                                <div className="h-[1px] bg-white/10 flex-1"></div>
                                <span className="text-xs text-gray-500 uppercase">OR</span>
                                <div className="h-[1px] bg-white/10 flex-1"></div>
                            </div>

                            <button 
                            onClick={() => setMode(AppMode.CAMERA)}
                            className="w-full bg-neutral-700/50 text-white font-semibold py-4 rounded-xl hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 border border-white/10"
                            >
                            <Camera className="w-5 h-5" /> 拍摄照片
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        )}

        {mode === AppMode.FITTING && originalImage && (
            <div className="flex flex-col h-full pb-20 md:pb-0"> {/* Padding bottom for mobile nav */}
                
                {/* Image Area */}
                <div className="flex-1 relative bg-black/50 flex items-center justify-center overflow-hidden min-h-[300px]">
                     <img 
                        src={generatedImage || originalImage} 
                        alt="Fitting Result" 
                        className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isGenerating ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                     />
                     
                     {generatedImage && !isGenerating && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-[10px] px-2 py-1 rounded border border-white/20 text-white/90">
                            虚拟效果
                        </div>
                    )}
                    
                    {isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-2" />
                            <p className="text-purple-200 font-medium animate-pulse">正在为您换装...</p>
                        </div>
                    )}

                    {/* Mobile Floating Reset Button */}
                    <button 
                        onClick={handleReset}
                        className="absolute top-4 left-4 bg-black/40 backdrop-blur p-2 rounded-full border border-white/10 text-white hover:bg-black/60 md:hidden"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Controls Area */}
                <div className="bg-neutral-900 border-t border-white/10 p-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                     {/* Info Row */}
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase font-bold">当前搭配</span>
                            <span className="text-sm font-medium text-purple-300 truncate max-w-[200px]">
                                {selectedClothes ? selectedClothes.name : "原图服装"}
                            </span>
                        </div>
                        {selectedClothes && (
                            <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                                {selectedClothes.category}
                            </div>
                        )}
                     </div>

                     {/* Inputs Row */}
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-black/40 rounded-lg p-2 border border-white/5 focus-within:border-purple-500/50 transition-colors">
                            <label className="text-[10px] uppercase text-gray-500 font-bold flex items-center gap-1 mb-1">
                                <Activity className="w-3 h-3" /> 动作
                            </label>
                            <input 
                                type="text" 
                                value={poseInput}
                                onChange={(e) => setPoseInput(e.target.value)}
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                placeholder="站立、坐着..."
                            />
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 border border-white/5 focus-within:border-purple-500/50 transition-colors">
                            <label className="text-[10px] uppercase text-gray-500 font-bold flex items-center gap-1 mb-1">
                                <Smile className="w-3 h-3" /> 表情
                            </label>
                            <input 
                                type="text" 
                                value={expressionInput}
                                onChange={(e) => setExpressionInput(e.target.value)}
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                placeholder="微笑、严肃..."
                            />
                        </div>
                     </div>

                     {/* Action Button */}
                     <button 
                        onClick={handleTryOn}
                        disabled={!selectedClothes || isGenerating}
                        className={`
                        w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                        ${!selectedClothes 
                            ? 'bg-neutral-800 text-gray-500 cursor-not-allowed border border-white/5' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-900/20 active:scale-[0.98]'
                        }
                        `}
                     >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                        {generatedImage ? '重新生成' : '一键换装'}
                    </button>
                </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-purple-500/30">
      
      {/* --- DESKTOP LEFT SIDEBAR --- */}
      <div className="hidden md:flex w-80 h-full border-r border-white/10 bg-neutral-900 z-10 flex-col">
          <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
             <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded mr-2"></div>
             <span className="font-bold text-lg">衣橱 & 场景</span>
          </div>
         {renderWardrobeContent()}
      </div>

      {/* --- MAIN CENTER AREA --- */}
      <div className="flex-1 flex flex-col relative bg-black min-w-0">
        
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-white/10 items-center justify-between px-6 bg-neutral-900/50 backdrop-blur z-20 shrink-0">
          <h1 className="text-xl font-bold tracking-tight">阿猫阿春 <span className="text-purple-400 font-light">专属造型师</span></h1>
          <div className="flex items-center gap-4">
             {originalImage && mode === AppMode.FITTING && (
               <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
                 <RefreshCw className="w-4 h-4" /> 重新开始
               </button>
             )}
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b border-white/10 flex items-center justify-between px-4 bg-neutral-900 z-20 shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded"></div>
                <span className="font-bold text-lg">阿猫阿春造型</span>
            </div>
            {/* Mobile Header Actions could go here */}
        </header>

        {/* Content View Switcher */}
        <main className="flex-1 relative overflow-hidden">
            {/* On Desktop: Always show Studio here. On Mobile: Switch based on tab */}
            <div className={`h-full w-full ${window.innerWidth < 768 && mobileTab !== 'studio' ? 'hidden' : 'block'}`}>
                {renderStudioContent()}
            </div>
            
            {/* Mobile Only Views */}
            <div className={`h-full w-full md:hidden ${mobileTab === 'wardrobe' ? 'block' : 'hidden'}`}>
                {renderWardrobeContent()}
            </div>
            <div className={`h-full w-full md:hidden ${mobileTab === 'advisor' ? 'block' : 'hidden'}`}>
                {renderAdvisorContent()}
            </div>
        </main>
      </div>

      {/* --- DESKTOP RIGHT SIDEBAR --- */}
      <div className="hidden lg:flex w-80 h-full border-l border-white/10 bg-neutral-900 z-10 flex-col">
        {renderAdvisorContent()}
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900 border-t border-white/10 flex items-center justify-around z-50 pb-safe">
         <button 
           onClick={() => setMobileTab('wardrobe')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'wardrobe' ? 'text-purple-400' : 'text-gray-500'}`}
         >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">衣橱</span>
         </button>

         <button 
           onClick={() => setMobileTab('studio')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative -top-5 ${mobileTab === 'studio' ? 'text-white' : 'text-gray-400'}`}
         >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-neutral-900 ${mobileTab === 'studio' ? 'bg-gradient-to-tr from-purple-600 to-pink-600' : 'bg-neutral-800'}`}>
                 <User className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">工作室</span>
         </button>

         <button 
           onClick={() => setMobileTab('advisor')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'advisor' ? 'text-purple-400' : 'text-gray-500'}`}
         >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium">顾问</span>
         </button>
      </div>

    </div>
  );
};

export default App;
