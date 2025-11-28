
import { ClothingCategory, ClothingItem, Scene, AnalysisData } from './types';

export const CLOTHING_ITEMS: ClothingItem[] = [
  // 休闲 (Casual)
  {
    id: 'c1',
    name: '白色亚麻衬衫 & 斜纹棉布裤',
    category: ClothingCategory.CASUAL,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670&auto=format&fit=crop',
    description: '宽松版型的白色亚麻衬衫，搭配米色斜纹棉布裤，轻松自在。'
  },
  {
    id: 'c2',
    name: '经典牛仔夹克套装',
    category: ClothingCategory.CASUAL,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2670&auto=format&fit=crop',
    description: '经典的复古水洗蓝色牛仔夹克，搭配同色系直筒牛仔裤。'
  },
  {
    id: 'c3',
    name: '条纹T恤 & 短裤',
    category: ClothingCategory.CASUAL,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2576&auto=format&fit=crop',
    description: '法式海军风条纹T恤，搭配卡其色百慕大短裤。'
  },

  // 正式 (Formal)
  {
    id: 'f1',
    name: '海军蓝定制西装',
    category: ClothingCategory.FORMAL,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2680&auto=format&fit=crop',
    description: '剪裁利落的意大利羊毛海军蓝西装，搭配挺括的白衬衫。'
  },
  {
    id: 'f2',
    name: '米色双排扣风衣',
    category: ClothingCategory.FORMAL,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2695&auto=format&fit=crop',
    description: '经典的米色双排扣风衣，内搭深色商务套装。'
  },
  {
    id: 'f3',
    name: '灰色格纹西装',
    category: ClothingCategory.FORMAL,
    image: 'https://images.unsplash.com/photo-1593030761757-71bd90dbe3a4?q=80&w=2702&auto=format&fit=crop',
    description: '英伦风格灰色格纹三件套西装，彰显绅士风度。'
  },

  // 商务休闲 (Business Casual)
  {
    id: 'bc1',
    name: '高领毛衣 & 西装裤',
    category: ClothingCategory.BUSINESS_CASUAL,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop',
    description: '黑色羊绒高领毛衣搭配灰色羊毛西裤，干练且保暖。'
  },
  {
    id: 'bc2',
    name: 'Polo衫 & 休闲西装',
    category: ClothingCategory.BUSINESS_CASUAL,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=2574&auto=format&fit=crop',
    description: '针织Polo衫外搭非结构化休闲西装，适合周五办公。'
  },

  // 极简主义 (Minimalist)
  {
    id: 'm1',
    name: '全黑机能风',
    category: ClothingCategory.MINIMALIST,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
    description: '全黑色系搭配，修身剪裁，注重面料质感与层次。'
  },
  {
    id: 'm2',
    name: '大地色系套装',
    category: ClothingCategory.MINIMALIST,
    image: 'https://images.unsplash.com/photo-1574620021665-2771d999083f?q=80&w=2574&auto=format&fit=crop',
    description: '燕麦色亚麻套装，线条流畅，设计极简。'
  },

  // 晚礼服 (Evening)
  {
    id: 'e1',
    name: '红色天鹅绒礼服',
    category: ClothingCategory.EVENING,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2548&auto=format&fit=crop',
    description: '奢华的深红色天鹅绒长裙，露背设计，适合晚宴。'
  },
  {
    id: 'e2',
    name: '经典黑领结燕尾服',
    category: ClothingCategory.EVENING,
    image: 'https://images.unsplash.com/photo-1550246140-29f40b909e5a?q=80&w=2574&auto=format&fit=crop',
    description: '黑色缎面翻领燕尾服，搭配黑色领结。'
  },
  
  // 街头 (Streetwear)
  {
    id: 'st1',
    name: 'Oversize 卫衣 & 工装',
    category: ClothingCategory.STREETWEAR,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2644&auto=format&fit=crop',
    description: '图案印花大廓形卫衣，搭配多口袋工装束脚裤。'
  },
  {
    id: 'st2',
    name: '棒球夹克 & 运动裤',
    category: ClothingCategory.STREETWEAR,
    image: 'https://images.unsplash.com/photo-1551852384-a8e1b5435062?q=80&w=2644&auto=format&fit=crop',
    description: '美式复古棒球夹克，搭配侧条纹运动裤。'
  },

  // 复古 (Vintage)
  {
    id: 'v1',
    name: '波点连衣裙',
    category: ClothingCategory.VINTAGE,
    image: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=2574&auto=format&fit=crop',
    description: '50年代风格波点收腰连衣裙，搭配红色腰带。'
  },
  {
    id: 'v2',
    name: '灯芯绒西装',
    category: ClothingCategory.VINTAGE,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=2679&auto=format&fit=crop',
    description: '棕色灯芯绒西装外套，搭配高腰阔腿裤。'
  },

  // 波西米亚 (Bohemian)
  {
    id: 'b1',
    name: '印花长裙',
    category: ClothingCategory.BOHEMIAN,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=2576&auto=format&fit=crop',
    description: '飘逸的民族风印花长裙，搭配流苏配饰。'
  }
];

export const SCENES: Scene[] = [
  {
    id: 'sc1',
    name: '摄影棚',
    prompt: '在专业的极简主义摄影棚内，光线柔和，背景是纯净的灰色',
    image: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: 'sc2',
    name: '城市街道',
    prompt: '白天繁忙的现代城市街道上，背景有模糊的摩天大楼和车流',
    image: 'https://picsum.photos/id/10/200/200'
  },
  {
    id: 'sc3',
    name: '豪华酒店',
    prompt: '在豪华五星级酒店大堂，金色的温暖灯光，大理石地面',
    image: 'https://picsum.photos/id/20/200/200'
  },
  {
    id: 'sc4',
    name: '海滩日落',
    prompt: '在海边的沙滩上，金色的夕阳，海浪轻轻拍打，度假氛围',
    image: 'https://picsum.photos/id/30/200/200'
  },
  {
    id: 'sc5',
    name: '现代办公室',
    prompt: '在时尚的现代科技公司办公室，落地玻璃窗，明亮通透',
    image: 'https://picsum.photos/id/40/200/200'
  },
  {
    id: 'sc6',
    name: '阿尔卑斯雪山',
    prompt: '在壮丽的雪山顶上，背景是连绵的白雪和蓝天，寒冷清新的氛围',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc7',
    name: '冬季雪地',
    prompt: '在积雪覆盖的森林小径，松树上挂满白雪，冬日静谧',
    image: 'https://images.unsplash.com/photo-1457269449834-928af6406ed3?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc8',
    name: '热带雨林',
    prompt: '在郁郁葱葱的热带雨林中，阳光透过巨大的绿色叶子洒下斑驳光影',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc9',
    name: '赛博朋克霓虹',
    prompt: '在未来的赛博朋克街道，夜晚，到处是紫色和蓝色的霓虹灯牌，雨后湿润的地面',
    image: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc10',
    name: '日式庭院',
    prompt: '在宁静的传统日式庭院，有枯山水、樱花树和木质走廊',
    image: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc11',
    name: '巴黎咖啡馆',
    prompt: '在巴黎街头的露天咖啡馆，藤编椅子，浪漫的法式建筑背景',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'sc12',
    name: '黄昏屋顶',
    prompt: '在城市高楼的屋顶露台，背景是黄昏时分绚丽的城市天际线',
    image: 'https://images.unsplash.com/photo-1533414417583-f07094726f6e?q=80&w=1000&auto=format&fit=crop'
  }
];

export const INITIAL_ANALYSIS: AnalysisData = {
  bodyType: "等待分析...",
  skinTone: "等待分析...",
  styleAdvice: "上传照片以获取个性化建议。",
  currentOutfitCritique: "暂无。",
  trendingNow: "正在加载趋势...",
  suggestedItemIds: [],
};
