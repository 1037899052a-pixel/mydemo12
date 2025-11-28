
import React, { useState } from 'react';
import { CLOTHING_ITEMS, SCENES } from '../constants';
import { ClothingCategory, ClothingItem, Scene } from '../types';
import { Shirt, Map, Tag, Upload } from 'lucide-react';

interface Props {
  onSelectClothing: (item: ClothingItem) => void;
  onSelectScene: (scene: Scene) => void;
  selectedClothingId: string | null;
  selectedSceneId: string | null;
  customClothes: ClothingItem[];
  onUploadClothing: (item: ClothingItem) => void;
}

export const WardrobePanel: React.FC<Props> = ({
  onSelectClothing,
  onSelectScene,
  selectedClothingId,
  selectedSceneId,
  customClothes,
  onUploadClothing
}) => {
  const [activeTab, setActiveTab] = useState<'clothes' | 'scenes'>('clothes');
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>(ClothingCategory.CASUAL);

  // Combine system clothes with custom clothes
  const allClothes = [...customClothes, ...CLOTHING_ITEMS];
  
  // Filter logic: If category is CUSTOM, show only custom clothes. Otherwise show system clothes of that category.
  const filteredClothes = activeCategory === ClothingCategory.CUSTOM 
    ? customClothes 
    : CLOTHING_ITEMS.filter(item => item.category === activeCategory);

  const handleClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newItem: ClothingItem = {
             id: `custom_${Date.now()}`,
             name: `自定义: ${file.name.substring(0, 10)}`,
             category: ClothingCategory.CUSTOM,
             image: ev.target.result as string,
             description: '用户上传的服装',
             isCustom: true
          };
          onUploadClothing(newItem);
          setActiveCategory(ClothingCategory.CUSTOM);
          onSelectClothing(newItem);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 md:bg-transparent pb-20 md:pb-0"> {/* Add padding bottom for mobile nav */}
      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('clothes')}
          className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'clothes' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shirt className="w-4 h-4" /> 衣橱
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'scenes' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Map className="w-4 h-4" /> 场景
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'clothes' && (
          <div className="space-y-4">
            {/* Upload Button */}
            <label className="flex items-center justify-center w-full p-4 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all group">
               <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-purple-400">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">上传我的衣服</span>
               </div>
               <input type="file" accept="image/*" onChange={handleClothingUpload} className="hidden" />
            </label>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              <button
                  onClick={() => setActiveCategory(ClothingCategory.CUSTOM)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    activeCategory === ClothingCategory.CUSTOM
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'border-white/20 text-gray-400 hover:border-white/40'
                  }`}
                >
                  {ClothingCategory.CUSTOM} ({customClothes.length})
              </button>
              {Object.values(ClothingCategory).filter(c => c !== ClothingCategory.CUSTOM).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    activeCategory === cat
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'border-white/20 text-gray-400 hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clothes Grid */}
            {filteredClothes.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-2">
                  <Shirt className="w-10 h-10 opacity-20" />
                  <span className="text-sm">此分类下暂无服装</span>
               </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 pb-20 md:pb-0">
              {filteredClothes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectClothing(item)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all aspect-[3/4] ${
                    selectedClothingId === item.id ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover bg-neutral-800" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3 opacity-100">
                    <p className="text-white text-xs font-bold truncate">{item.name}</p>
                    <p className="text-gray-400 text-[10px] truncate">{item.description}</p>
                  </div>
                  {selectedClothingId === item.id && (
                     <div className="absolute top-2 right-2 bg-purple-500 text-white p-1.5 rounded-full shadow-lg">
                        <Tag className="w-3 h-3" />
                     </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {activeTab === 'scenes' && (
          <div className="grid grid-cols-1 gap-4 pb-20 md:pb-0">
            {SCENES.map((scene) => (
              <div
                key={scene.id}
                onClick={() => onSelectScene(scene)}
                className={`relative h-40 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedSceneId === scene.id ? 'border-purple-500 grayscale-0' : 'border-transparent grayscale hover:grayscale-0'
                }`}
              >
                <img src={scene.image} alt={scene.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-xl drop-shadow-lg tracking-wide">{scene.name}</span>
                </div>
                {selectedSceneId === scene.id && (
                    <div className="absolute top-3 right-3 bg-purple-500 rounded-full p-1">
                        <Tag className="w-3 h-3 text-white" />
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
