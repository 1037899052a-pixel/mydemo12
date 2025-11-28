
import React from 'react';
import { AnalysisData } from '../types';
import { User, Sparkles, TrendingUp, Palette } from 'lucide-react';

interface Props {
  data: AnalysisData;
  loading: boolean;
}

export const AnalysisPanel: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        <div className="h-24 bg-gray-800/50 rounded-xl"></div>
        <div className="h-24 bg-gray-800/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-sm pb-24 md:pb-6"> {/* Bottom padding for mobile nav */}
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        AI 风格分析
      </h2>

      <div className="space-y-4">
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-purple-300 mb-3 font-semibold text-base">
            <User className="w-4 h-4" /> 身型与肤色
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400">体型</span>
                <span className="text-white font-medium">{data.bodyType}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400">肤色</span>
                <span className="text-white font-medium">{data.skinTone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-pink-300 mb-3 font-semibold text-base">
            <Palette className="w-4 h-4" /> 穿搭建议
          </div>
          <p className="text-gray-300 leading-relaxed text-justify">{data.styleAdvice}</p>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm">
           <div className="flex items-center gap-2 text-blue-300 mb-3 font-semibold text-base">
            <TrendingUp className="w-4 h-4" /> 流行趋势
          </div>
          <p className="text-gray-300 leading-relaxed text-justify">{data.trendingNow}</p>
        </div>
      </div>
    </div>
  );
};
