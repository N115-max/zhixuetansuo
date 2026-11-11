// 本地演示用的语文古诗数据（后续可替换为接口数据）
const CHINESE_POEMS = [
  {
    id: 'jingyesi',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    poem: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
    translation: [
      '明亮的月光洒在床前。',
      '好像地上泛起了一层白霜。',
      '我抬起头望着天上的明月。',
      '低下头不禁思念起远方的故乡。'
    ],
    appreciation: {
      主旨: '通过描写秋夜月光和望月思乡的动作，抒发诗人客居他乡的思乡之情。',
      写作手法: '借景抒情，以霜喻月光；通过“举头”“低头”的动作描写，把思乡之情写得含蓄自然。',
      重点字词: '疑：好像。举头：抬头。思：思念。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '浪漫主义诗人，被誉为“诗仙”',
      代表作品: '《将进酒》《蜀道难》《望庐山瀑布》',
      写作背景: '诗人客居他乡，夜深人静时望月思乡，写下这首诗。'
    }
  },
  {
    id: 'chunxiao',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    poem: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
    translation: [
      '春夜睡得香甜，不知不觉天就亮了。',
      '醒来后听到处处都是鸟儿的啼鸣。',
      '想起昨夜隐约传来的风雨声。',
      '不知有多少花儿被风雨吹落。'
    ],
    appreciation: {
      主旨: '描绘春天早晨的景色，表达诗人对春天的喜爱和对春光流逝的淡淡惋惜。',
      写作手法: '以听觉写景，从啼鸟声、风雨声落笔；语言平易自然，借景抒情。',
      重点字词: '晓：天亮。不觉晓：不知不觉天亮了。闻：听见。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '山水田园诗派代表诗人，与王维并称“王孟”',
      代表作品: '《过故人庄》《宿建德江》《春晓》',
      写作背景: '诗人隐居鹿门山时所作，写春日清晨醒来后的所见所感。'
    }
  },
  {
    id: 'minnong',
    title: '悯农',
    author: '李绅',
    dynasty: '唐',
    poem: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。'],
    translation: [
      '农民在正午烈日下给禾苗锄草松土。',
      '汗水一滴滴落进禾苗下的泥土里。',
      '有谁知道盘中的饭菜。',
      '每一粒都饱含着农民的辛苦。'
    ],
    appreciation: {
      主旨: '描绘农民劳作的艰辛，说明粮食来之不易，表达对农民的同情和珍惜粮食的劝诫。',
      写作手法: '白描手法，语言朴素；以“盘中餐”与“禾下土”形成对比，并用反问增强感染力。',
      重点字词: '锄禾：用锄头给禾苗松土除草。日当午：正午烈日当空。皆：都。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '诗人、政治家，曾官至宰相',
      代表作品: '《悯农二首》',
      写作背景: '诗人关注民生，有感于农民劳作的艰辛而作。'
    }
  },
  {
    id: 'yonge',
    title: '咏鹅',
    author: '骆宾王',
    dynasty: '唐',
    poem: ['鹅，鹅，鹅，', '曲项向天歌。', '白毛浮绿水，', '红掌拨清波。'],
    translation: [
      '鹅呀，鹅呀，鹅。',
      '弯着脖子向着天空欢叫。',
      '雪白的羽毛浮在碧绿的水面上。',
      '红色的脚掌拨动着清清的水波。'
    ],
    appreciation: {
      主旨: '生动描绘白鹅在水中嬉戏的画面，表达对鹅的喜爱和对自然的观察之情。',
      写作手法: '白描与色彩对比结合，“白毛”“绿水”“红掌”“清波”相映成趣；动静结合。',
      重点字词: '曲项：弯着脖子。歌：鸣叫。拨：划动。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '“初唐四杰”之一',
      代表作品: '《咏鹅》《在狱咏蝉》《讨武曌檄》',
      写作背景: '相传为诗人七岁时应客人之请即兴所作。'
    }
  }
];

function getPoemById(id) {
  return CHINESE_POEMS.find((poem) => poem.id === id);
}

function normalizeText(text) {
  return text.replace(/[，。！？、；：“”‘’《》\s]/g, '');
}

function findPoemByQuestion(question) {
  const q = normalizeText(question);
  if (!q) return null;

  let best = null;
  let bestScore = 0;
  for (const poem of CHINESE_POEMS) {
    let score = 0;
    const title = normalizeText(poem.title);
    if (q.includes(title)) {
      score += 6;
    } else {
      // 支持"沁园春·雪"这类词牌名 + 题目，只输入其中一部分也能命中
      const parts = title.split(/[·・\s]+/).filter((p) => p.length >= 2);
      if (parts.some((p) => q.includes(p))) score += 4;
    }
    if (q.includes(normalizeText(poem.author))) score += 3;
    if (poem.keywords && poem.keywords.some((k) => q.includes(normalizeText(k)))) score += 4;
    for (const line of poem.poem) {
      if (q.includes(normalizeText(line).slice(0, 4))) score += 2;
    }
    if (score > bestScore) { bestScore = score; best = poem; }
  }
  return bestScore >= 2 ? best : null;
}

// 本地演示用的数学题库（后续可替换为接口数据）
const MATH_PROBLEMS = [
  {
    id: 'quadratic',
    question: [
      '一元二次方程',
      '二次方程',
      'x²-5x+6',
      'x^2-5x+6',
      '求根公式',
      '配方法',
      '因式分解'
    ],
    brief:
      '方程 $x^2-5x+6=0$ 的解为 $x=2$ 或 $x=3$。思路：因式分解得 $(x-2)(x-3)=0$，也可以直接用求根公式。',
    formulas: [
      {
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        desc: '一元二次方程 ax² + bx + c = 0（a ≠ 0）的求根公式'
      },
      {
        latex: 'x^2 - 5x + 6 = (x - 2)(x - 3)',
        desc: '本题的因式分解形式，令每个因式为 0 即可得到解'
      }
    ],
    deepSteps: [
      {
        step: '什么是一元二次方程',
        content:
          '只含一个未知数，并且未知数的最高次数是 2 的整式方程，一般形式为 $ax^2+bx+c=0\\ (a \\ne 0)$。其中 $a$、$b$、$c$ 是常数，且 $a$ 不能为 0。'
      },
      {
        step: '确定本题的系数',
        content: '把 $x^2-5x+6=0$ 与一般形式对照，可得 $a=1$，$b=-5$，$c=6$。'
      },
      {
        step: '计算判别式',
        content:
          '$\\Delta = b^2-4ac = (-5)^2-4\\times1\\times6 = 25-24 = 1$。因为 $\\Delta > 0$，所以方程有两个不相等的实数根。'
      },
      {
        step: '代入求根公式',
        content:
          '$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{5 \\pm 1}{2}$，因此 $x_1 = 3$，$x_2 = 2$。'
      },
      {
        step: '得到最终解',
        content:
          '原方程的解为 $x=2$ 或 $x=3$。也可以直接因式分解：$x^2-5x+6=(x-2)(x-3)$，令 $x-2=0$ 或 $x-3=0$，同样得到 $x=2$ 或 $x=3$。'
      }
    ]
  },
  {
    id: 'pythagorean',
    question: [
      '勾股定理',
      '勾股',
      '直角三角形',
      '斜边',
      '3-4-5',
      '345',
      'a²+b²=c²',
      'a^2+b^2=c^2'
    ],
    brief:
      '直角三角形两直角边的平方和等于斜边的平方：$a^2+b^2=c^2$。例如直角边为 3 和 4 时，斜边 $c=\\sqrt{3^2+4^2}=5$。',
    formulas: [
      {
        latex: 'a^2 + b^2 = c^2',
        desc: '直角三角形中两条直角边的平方和等于斜边的平方，$c$ 为斜边'
      },
      {
        latex: 'c = \\sqrt{a^2 + b^2}',
        desc: '已知两条直角边时，求斜边长的常用变形'
      }
    ],
    deepSteps: [
      {
        step: '定理含义',
        content:
          '在直角三角形中，两条直角边长度的平方和，等于斜边长度的平方。三条边满足 $a^2+b^2=c^2$，其中 $c$ 是斜边。'
      },
      {
        step: '适用条件',
        content:
          '勾股定理只适用于直角三角形，并且公式中的 $c$ 必须是直角所对的斜边；如果题目没有说明是直角三角形，需要先证明或判断。'
      },
      {
        step: '完整例题',
        content:
          '已知一个直角三角形的两条直角边分别为 $a=3$，$b=4$，求斜边 $c$。代入公式：$c^2=3^2+4^2=9+16=25$，所以 $c=\\sqrt{25}=5$。'
      },
      {
        step: '结论与拓展',
        content:
          '因为 $3^2+4^2=5^2$，所以 3、4、5 是一组勾股数。反过来，若三角形三边满足 $a^2+b^2=c^2$，也可以判定它是直角三角形。'
      }
    ]
  },
  {
    id: 'vertex',
    question: [
      '二次函数',
      '顶点坐标',
      '顶点式',
      '抛物线',
      '对称轴',
      'x=-b/2a',
      '顶点'
    ],
    brief:
      '二次函数 $y=a(x-h)^2+k$ 的顶点为 $(h,k)$。一般式 $y=ax^2+bx+c$ 的顶点横坐标为 $x=-\\frac{b}{2a}$，纵坐标为 $\\frac{4ac-b^2}{4a}$。',
    formulas: [
      {
        latex: 'y = a(x-h)^2 + k',
        desc: '顶点式，直接读出顶点坐标 (h, k)，对称轴为 x = h'
      },
      {
        latex: 'x = -\\frac{b}{2a}',
        desc: '一般式 y = ax² + bx + c 的顶点横坐标（也是对称轴）'
      },
      {
        latex: 'y = \\frac{4ac-b^2}{4a}',
        desc: '一般式顶点的纵坐标，由 x = -b/2a 代入得到'
      }
    ],
    deepSteps: [
      {
        step: '什么是顶点式',
        content:
          '二次函数的顶点式为 $y=a(x-h)^2+k\\ (a \\ne 0)$，它的图像是抛物线，顶点坐标可以直接读出为 $(h,k)$，对称轴为直线 $x=h$。'
      },
      {
        step: '从一般式开始配方',
        content:
          '把一般式 $y=ax^2+bx+c$ 配方，得到 $y=a\\left(x+\\frac{b}{2a}\\right)^2+\\frac{4ac-b^2}{4a}$。'
      },
      {
        step: '推导对称轴',
        content:
          '因为 $\\left(x+\\frac{b}{2a}\\right)^2 \\ge 0$，当 $x=-\\frac{b}{2a}$ 时平方项为 0，函数取得最值，所以对称轴为 $x=-\\frac{b}{2a}$。'
      },
      {
        step: '得出顶点坐标',
        content:
          '把 $x=-\\frac{b}{2a}$ 代入函数，得到顶点坐标为 $\\left(-\\frac{b}{2a},\\ \\frac{4ac-b^2}{4a}\\right)$。'
      },
      {
        step: '举例验证',
        content:
          '以 $y=2x^2-8x+5$ 为例，$a=2$，$b=-8$，$c=5$，则 $x=-\\frac{-8}{2\\times2}=2$。代入得 $y=2\\times2^2-8\\times2+5=-3$，所以顶点为 $(2,-3)$。'
      }
    ]
  }
];

function getMathProblemById(id) {
  return MATH_PROBLEMS.find((problem) => problem.id === id);
}

function scoreTopics(topics, question) {
  const q = normalizeText(question).toLowerCase();
  if (!q) return null;

  let best = null;
  let bestScore = 0;
  for (const topic of topics) {
    let score = 0;
    if (topic.keywords) {
      for (const kw of topic.keywords) {
        const nk = normalizeText(kw).toLowerCase();
        if (!nk) continue;
        if (q.includes(nk)) score += nk.length >= 3 ? 3 : nk.length === 2 ? 2 : 1;
      }
    }
    if (topic.question) {
      for (const kw of topic.question) {
        const nk = normalizeText(kw).toLowerCase();
        if (!nk) continue;
        if (q.includes(nk)) score += nk.length >= 3 ? 3 : nk.length === 2 ? 2 : 1;
      }
    }
    if (topic.title && q.includes(normalizeText(topic.title).toLowerCase())) score += 5;
    if (score > bestScore) { bestScore = score; best = topic; }
  }
  return bestScore >= 2 ? best : null;
}

function findMathProblemByQuestion(question) {
  return scoreTopics(MATH_PROBLEMS, question);
}

// 本地演示用的地理题库（后续可替换为接口数据）
const GEO_TOPICS = [
  {
    id: 'yellowriver',
    showMap: true,
    keywords: ['黄河', '青海源头', '河套', '塞上江南', '黄土高原', '华北平原', '渤海'],
    brief:
      '黄河发源于青海，自西向东依次流经青藏高原、内蒙古高原、黄土高原和华北平原，最后注入渤海。',
    places: [
      {
        name: '青海源头',
        x: 17,
        y: 13,
        info: '位于青藏高原东北部，是黄河的发源地，海拔高、气温低，以冰雪融水补给为主。'
      },
      {
        name: '内蒙古河套平原',
        x: 50,
        y: 13,
        info: '位于内蒙古高原南部，黄河水流平缓，引水灌溉发达，素有“塞上江南”之称。'
      },
      {
        name: '黄土高原',
        x: 83,
        y: 13,
        info: '位于黄河中游，黄土覆盖深厚，水土流失严重，使黄河含沙量大幅增加。'
      },
      {
        name: '华北平原',
        x: 35,
        y: 48,
        info: '位于黄河下游，地势低平、流速减慢，泥沙淤积形成“地上河”。'
      },
      {
        name: '渤海入海口',
        x: 76,
        y: 48,
        info: '黄河在山东北部注入渤海，入海口不断向海推进，形成黄河三角洲。'
      }
    ],
    links: [
      [0, 1, '自西向东'],
      [1, 2, '流向'],
      [2, 3, '泥沙沉积'],
      [3, 4, '注入渤海']
    ],
    structure: [
      '黄河发源于青藏高原，上游流经第一级阶梯，落差大，水能资源丰富。',
      '中游进入第二级阶梯，穿过黄土高原，携带大量泥沙，含沙量显著增加。',
      '下游进入第三级阶梯的华北平原，地势平坦、流速减慢，泥沙大量沉积。',
      '最终在山东北部注入渤海，入海口不断向海推进，形成黄河三角洲。'
    ],
    localInfo: [
      '河套平原位于内蒙古高原南部，引黄河水灌溉，农业发达，素有“塞上江南”之称。',
      '当地气候干旱，降水较少，昼夜温差大，依靠黄河灌溉发展小麦、玉米等作物。',
      '河套地区是重要的商品粮基地，也是内蒙古人口和城镇较为集中的经济区域。'
    ]
  },
  {
    id: 'monsoon',
    showMap: true,
    keywords: [
      '季风',
      '冬季风',
      '夏季风',
      '西伯利亚',
      '蒙古高原',
      '太平洋',
      '雨热同期',
      '海陆热力'
    ],
    brief:
      '我国东部季风气候显著：冬季风来自西伯利亚和蒙古高原，寒冷干燥；夏季风来自太平洋，温暖湿润并带来降水。',
    places: [
      {
        name: '西伯利亚',
        x: 17,
        y: 12,
        info: '位于亚欧大陆北部，冬季严寒，是影响我国的冬季风主要源地。'
      },
      {
        name: '蒙古高原',
        x: 50,
        y: 12,
        info: '位于我国北部，冬季形成冷高压，冷空气由此南下影响我国大部分地区。'
      },
      {
        name: '中国东部',
        x: 42,
        y: 48,
        info: '位于季风区，冬季盛行西北风，夏季盛行东南风，降水集中在夏季。'
      },
      {
        name: '太平洋',
        x: 84,
        y: 56,
        info: '位于我国东南方向，夏季形成暖湿气流，是我国东部降水的主要水汽来源。'
      }
    ],
    links: [
      [0, 2, '西北风'],
      [1, 2, '冬季风'],
      [3, 2, '带来降水']
    ],
    structure: [
      '季风的形成主要源于海陆热力性质差异：夏季陆地升温快、气压低，风从海洋吹向陆地。',
      '冬季陆地降温快、气压高，风从大陆内部（西伯利亚—蒙古高原）吹向海洋。',
      '我国东部位于世界最大的大陆与最大的大洋之间，海陆热力差异显著，季风气候典型。',
      '冬季风寒冷干燥，夏季风温暖湿润，二者交替控制形成明显的季节变化。'
    ],
    localInfo: [
      '夏季风带来丰沛降水，与高温期一致，形成“雨热同期”，有利于农作物生长。',
      '我国东部季风区热量和水分条件较好，是水稻、小麦等主要农业区。',
      '季风不稳定也会带来旱涝灾害：夏季风强易洪涝，夏季风弱易干旱。'
    ]
  }
];

function getGeoTopicById(id) {
  return GEO_TOPICS.find((topic) => topic.id === id);
}

function findGeoTopicByQuestion(question) {
  return scoreTopics(GEO_TOPICS, question);
}

// 本地演示用的物理题库
const PHYSICS_TOPICS = [
  {
    id: 'newton2',
    keywords: ['牛顿第二定律', 'F=ma', '加速度'],
    brief: '物体加速度与合外力成正比、与质量成反比：F=ma。',
    formulas: [
      { latex: 'F = ma', desc: '牛顿第二定律：合外力等于质量与加速度的乘积' },
      { latex: 'a = \\frac{F}{m}', desc: '加速度等于合外力除以质量，方向与合外力相同' },
      { latex: 'G = mg', desc: '重力大小等于质量乘以重力加速度，g 约为 9.8 m/s²' },
      { latex: 'f = \\mu N', desc: '滑动摩擦力等于动摩擦因数乘以正压力' }
    ],
    structure: [
      '合外力是产生加速度的原因：没有合外力，物体保持静止或匀速直线运动。',
      '加速度是合外力作用的效果，大小由合外力和质量共同决定。',
      '质量是物体惯性大小的量度，质量越大，运动状态越难改变。',
      '方向关系：加速度的方向始终与合外力的方向相同。',
      '适用条件：适用于宏观、低速运动的惯性参考系。'
    ],
    deepSteps: [
      {
        step: '力改变运动状态',
        content:
          '物体受到合外力时，运动状态会发生改变，也就是产生加速度。力不是维持运动的原因，而是改变运动状态的原因。'
      },
      {
        step: '引入牛顿第二定律',
        content:
          '大量实验表明，加速度与合外力成正比、与质量成反比，写成公式就是 $F=ma$，其中 $F$ 表示物体受到的合外力。'
      },
      {
        step: '受力分析步骤',
        content:
          '先画受力图并明确研究对象；再把力沿运动方向和垂直方向分解；最后求出合力，代入 $a=\\frac{F}{m}$ 计算加速度。'
      },
      {
        step: '完整算例',
        content:
          '质量 $m=2\\,\\text{kg}$ 的物体受到水平拉力 $F=10\\,\\text{N}$，摩擦力 $f=2\\,\\text{N}$。合力 $F_{\\text{合}}=10-2=8\\,\\text{N}$，所以加速度 $a=\\frac{8}{2}=4\\,\\text{m/s}^2$。'
      }
    ]
  }
];

// 本地演示用的化学题库
const CHEMISTRY_TOPICS = [
  {
    id: 'neutralization',
    keywords: ['酸碱中和', '中和反应', '盐酸 氢氧化钠'],
    brief: '酸与碱反应生成盐和水，属于复分解反应。',
    equations: [
      {
        html: 'HCl + NaOH → NaCl + H<sub>2</sub>O',
        desc: '常温；放热，无明显现象，需借助指示剂判断反应终点。'
      },
      {
        html: '2H<sub>2</sub> + O<sub>2</sub> →(点燃) 2H<sub>2</sub>O',
        desc: '点燃；产生淡蓝色火焰，放热，干冷烧杯内壁出现水雾。'
      },
      {
        html: 'CH<sub>4</sub> + 2O<sub>2</sub> →(点燃) CO<sub>2</sub> + 2H<sub>2</sub>O',
        desc: '点燃；产生淡蓝色火焰，放热，生成能使澄清石灰水变浑浊的气体。'
      }
    ],
    structure: [
      '中和反应的本质是酸中的 H⁺ 与碱中的 OH⁻ 结合生成水：H⁺ + OH⁻ → H₂O。',
      '离子方程式只保留实际参加反应的离子，盐酸与氢氧化钠反应写作：H⁺ + OH⁻ → H₂O。',
      '反应过程中溶液的 pH 由酸性逐渐升高，恰好完全反应时 pH = 7。',
      '应用：用氢氧化铝等治疗胃酸过多，用熟石灰改良酸性土壤。'
    ],
    deepSteps: [
      {
        step: '认识酸和碱',
        content:
          '酸在水溶液中电离出 H⁺，碱在水溶液中电离出 OH⁻。例如盐酸电离出 H⁺ 和 Cl⁻，氢氧化钠电离出 Na⁺ 和 OH⁻。'
      },
      {
        step: '电离过程',
        content:
          'HCl → H⁺ + Cl⁻，NaOH → Na⁺ + OH⁻。溶液中的离子可以自由移动，这是中和反应发生的基础。'
      },
      {
        step: '离子结合',
        content:
          'H⁺ 与 OH⁻ 结合生成难电离的水：H⁺ + OH⁻ → H₂O，Na⁺ 和 Cl⁻ 留在溶液中。'
      },
      {
        step: '化学方程式配平',
        content:
          '写出反应物和生成物后配平：HCl + NaOH → NaCl + H₂O。各元素原子个数相等，系数均为 1。'
      },
      {
        step: '完整例题',
        content:
          '中和 50 g 质量分数为 7.3% 的盐酸，需要 NaOH 的质量为 4 g。计算：m(HCl)=50×7.3%=3.65 g，物质的量为 0.1 mol；按 1:1 反应需 NaOH 0.1 mol，质量为 0.1×40=4 g。'
      }
    ]
  }
];

// 本地演示用的生物题库
const BIOLOGY_TOPICS = [
  {
    id: 'photosynthesis',
    keywords: ['光合作用'],
    brief: '绿色植物利用光能，把CO₂和水合成有机物并释放氧气。',
    places: [
      {
        name: '叶绿体',
        x: 50,
        y: 10,
        info: '光合作用的场所，叶绿体中的色素能够吸收光能。'
      },
      {
        name: 'H₂O',
        x: 17,
        y: 10,
        info: '水在光反应中被分解，为光合作用提供氢和电子。'
      },
      {
        name: 'CO₂',
        x: 83,
        y: 10,
        info: '二氧化碳进入叶绿体，在暗反应中被固定并还原成有机物。'
      },
      {
        name: '光反应',
        x: 25,
        y: 40,
        info: '在类囊体薄膜上进行，利用光能产生 ATP 和 [H]，并释放氧气。'
      },
      {
        name: '暗反应（卡尔文循环）',
        lines: ['暗反应', '（卡尔文循环）'],
        x: 75,
        y: 40,
        info: '在叶绿体基质中进行，利用 ATP 和 [H] 固定 CO₂，合成有机物。'
      },
      {
        name: 'O₂',
        x: 17,
        y: 72,
        info: '光反应中水被分解产生氧气，经气孔释放到大气中。'
      },
      {
        name: '有机物',
        x: 50,
        y: 72,
        info: '暗反应把 CO₂ 还原成糖类等有机物，把能量储存在有机物中。'
      }
    ],
    links: [
      [3, 4, 'ATP和[H]'],
      [2, 4, '进入'],
      [1, 3, '参与'],
      [3, 5, '释放O₂'],
      [4, 6, '合成有机物']
    ],
    deepSteps: [
      {
        step: '光合作用的场所',
        content: '叶绿体是光合作用的场所：光反应在类囊体薄膜上进行，暗反应在叶绿体基质中进行。'
      },
      {
        step: '光合作用的条件',
        content: '需要光、色素和酶。色素负责吸收光能，酶催化光反应和暗反应中的一系列化学反应。'
      },
      {
        step: '光反应',
        content:
          '水在光下分解，产生 O₂、ATP 和 [H]。光反应为暗反应提供能量和还原剂。'
      },
      {
        step: '暗反应',
        content:
          '在叶绿体基质中，CO₂ 被固定，利用光反应产生的 ATP 和 [H] 将其还原成糖类等有机物，这一过程又称卡尔文循环。'
      },
      {
        step: '总反应式',
        content:
          '6CO<sub>2</sub> + 6H<sub>2</sub>O <span class="rxn-cond">光 / 叶绿体</span> → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>。'
      },
      {
        step: '影响因素',
        content: '光照强度、CO₂ 浓度和温度都会影响光合作用速率，其中温度主要影响酶的活性。'
      }
    ]
  }
];

const ENGLISH_TOPICS = [
  {
    id: 'present-perfect',
    title: '现在完成时',
    keywords: ['现在完成时', 'have done', '完成时'],
    brief: '现在完成时表示过去发生的动作对现在造成的影响，结构 have/has + 过去分词。',
    structures: [
      '肯定：主语 + have/has + 过去分词',
      '否定：主语 + have/has + not + 过去分词',
      '疑问：Have/Has + 主语 + 过去分词？'
    ],
    usages: [
      '已完成并对现在有影响：动作已经结束，但结果或影响仍持续到现在。',
      '经历：表示过去曾经有过的经历，常与 ever、never 连用。',
      '持续：动作从过去持续到现在，常与 for、since 连用。'
    ],
    examples: [
      { en: 'I have finished my homework.', zh: '我已经完成作业了。' },
      { en: 'She has visited Beijing twice.', zh: '她去过北京两次。' },
      { en: 'They have lived here for ten years.', zh: '他们在这里住了十年。' }
    ],
    mistake: '一般过去时只说明动作发生在过去；现在完成时强调动作对现在造成的影响。'
  }
];

const HISTORY_TOPICS = [
  {
    id: 'qin-unification',
    title: '秦朝统一',
    keywords: ['秦朝', '秦始皇', '统一六国'],
    brief: '公元前221年秦灭六国，建立中国历史上第一个统一的多民族中央集权国家。',
    time: '公元前221年',
    people: '秦始皇嬴政',
    measures: [
      '确立皇帝制度，皇帝总揽全国军政大权。',
      '在地方推行郡县制，郡县长官由中央直接任免。',
      '统一文字，以小篆作为标准文字。',
      '统一货币和度量衡，促进各地经济往来。',
      '修筑驰道和长城，加强交通与边防。'
    ],
    impacts: [
      '结束长期割据局面，实现国家统一。',
      '奠定此后两千多年中央集权政治格局。',
      '促进各地经济文化交流与发展。'
    ],
    mnemonic: '书同文、车同轨、行同伦'
  }
];

function findTopicByQuestion(topics, question) {
  return scoreTopics(topics, question);
}

function getPhysicsTopicById(id) {
  return PHYSICS_TOPICS.find((topic) => topic.id === id);
}

function getChemistryTopicById(id) {
  return CHEMISTRY_TOPICS.find((topic) => topic.id === id);
}

function getBiologyTopicById(id) {
  return BIOLOGY_TOPICS.find((topic) => topic.id === id);
}

function getEnglishTopicById(id) {
  return ENGLISH_TOPICS.find((topic) => topic.id === id);
}

function getHistoryTopicById(id) {
  return HISTORY_TOPICS.find((topic) => topic.id === id);
}

/**
 * 联网搜索：用 DuckDuckGo 官方 Instant Answer API（CORS 友好）拿定义/事实卡片。
 * 返回 { answer, source } 或 null。
 */
async function searchDuckDuckGoInstant(question) {
  try {
    const url =
      'https://api.duckduckgo.com/?q=' +
      encodeURIComponent(question) +
      '&format=json&no_redirect=1&no_html=1&skip_disambig=1';
    const resp = await fetch(url, { signal: AbortSignal.timeout?.(5000) });
    if (!resp.ok) return null;
    const data = await resp.json();

    const parts = [];
    if (data.AbstractText) parts.push(data.AbstractText);
    if (data.Definition) parts.push(data.Definition);
    if (data.RelatedTopics && data.RelatedTopics.length) {
      const rel = data.RelatedTopics
        .map((t) => t.Text)
        .filter(Boolean)
        .slice(0, 3);
      if (rel.length) parts.push(rel.join('；'));
    }

    if (!parts.length) return null;

    const source = data.AbstractSource || data.DefinitionSource || '';
    return {
      answer: parts.join('\n\n'),
      source: source ? `（来源：${source}）` : '（来源：DuckDuckGo）',
      sourceName: source || 'DuckDuckGo',
      sourceUrl: data.AbstractURL || ''
    };
  } catch {
    return null;
  }
}

/**
 * 百度百科（JSONP）：国内网络更容易连上，且不受浏览器跨域限制。
 * 返回词条摘要，作为中文内容的首要来源。
 */
function searchBaike(question) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }

    const cbName = 'baikeCb' + Math.random().toString(36).slice(2, 10);
    const script = document.createElement('script');
    let settled = false;

    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      try {
        delete window[cbName];
      } catch {
        window[cbName] = undefined;
      }
    };

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(value);
    };

    window[cbName] = (data) => {
      if (!data || !data.abstract) {
        finish(null);
        return;
      }
      finish({
        answer: String(data.abstract).replace(/\s+/g, ' ').trim(),
        source: '（来源：百度百科）',
        sourceName: '百度百科',
        sourceUrl: data.url || `https://baike.baidu.com/item/${encodeURIComponent(question)}`
      });
    };

    const timer = setTimeout(() => finish(null), 3000);
    script.onerror = () => finish(null);
    script.src =
      'https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020' +
      `&bk_key=${encodeURIComponent(question)}&bk_length=800&callback=${cbName}`;
    document.head.appendChild(script);
  });
}

/**
 * 联网搜索：用 Wikipedia REST API（CORS 友好）拿百科摘要。
 * 先尝试中文维基，再 fallback 英文。
 */
async function searchWikipedia(question) {
  const tryLang = async (lang) => {
    try {
      const url =
        `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` +
        encodeURIComponent(question);
      const resp = await fetch(url, { signal: AbortSignal.timeout?.(2000) });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data.extract) return null;
      return {
        answer: data.extract,
        source: `（来源：${lang === 'zh' ? '中文维基百科' : 'Wikipedia'}）`,
        sourceName: lang === 'zh' ? '中文维基百科' : 'Wikipedia',
        sourceUrl:
          (data.content_urls &&
            data.content_urls.desktop &&
            data.content_urls.desktop.page) ||
          `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(question)}`
      };
    } catch {
      return null;
    }
  };
  return (await tryLang('zh')) || (await tryLang('en'));
}

/**
 * 联网结果质量检查：过滤掉"单个英文单词""乱码""过短"等无效结果。
 */
function isGoodWebAnswer(question, answer) {
  if (!answer) return false;
  const text = String(answer).replace(/\s+/g, ' ').trim();
  if (text.length < 40) return false;

  const hasCJK = /[\u4e00-\u9fa5]/.test(question);
  const cjkCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  if (hasCJK) {
    // 中文提问却搜回英文结果，直接丢弃
    if (cjkCount < 15) return false;
    if (cjkCount / text.length < 0.2) return false;
  }

  // 明显乱码：大量替换符或不可读字符
  const bad = (text.match(/[\uFFFD\u0000-\u0008\u000E-\u001F]/g) || []).length;
  if (bad > 0) return false;

  // 纯网址/纯符号
  if (/^[\s\w.:/-]+$/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return false;

  // 相关性校验：答案里必须真的出现所问的词，防止"内环境稳态"被当成查汉字"内"
  const qq = String(question || '').replace(/\s+/g, '');
  const isQuestion = /[的了吗呢吧嘛]|什么|怎么|为什么|如何|哪些|多少|是谁/.test(qq);
  if (qq && !isQuestion) {
    const compact = text.replace(/\s+/g, '');
    let hit = compact.indexOf(qq) >= 0;
    if (!hit) {
      for (let i = 0; !hit && i + 3 <= qq.length; i++) {
        hit = compact.indexOf(qq.substr(i, 3)) >= 0;
      }
    }
    if (!hit && qq.length <= 2) hit = compact.indexOf(qq[0]) >= 0;
    if (!hit) return false;
  }

  return true;
}

/**
 * 服务端搜索代理：由网站后端（server.js）代为请求百度百科/必应，
 * 不受浏览器跨域、被墙、JSONP 失效影响。国内网络下最可靠的首选来源。
 */
function apiShareCode() {
  try {
    var v = new URLSearchParams(window.location.search).get('sharecode');
    if (v) return v;
  } catch (e) { /* 忽略 */ }
  return '6XPB2BZATX';
}

async function searchViaServer(question) {
  try {
    var url = '/api/search?q=' + encodeURIComponent(question) +
      '&sharecode=' + encodeURIComponent(apiShareCode());
    const resp = await fetch(url, {
      signal: (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) ? AbortSignal.timeout(12000) : undefined
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data || !data.ok || !data.answer) return null;
    return {
      answer: String(data.answer),
      source: data.source || '（来源：网络）',
      sourceName: data.provider || '网络',
      sourceUrl: data.sourceUrl || ''
    };
  } catch {
    return null;
  }
}

/**
 * 综合联网搜索：服务端代理优先，再并行调百度百科 + DuckDuckGo + Wikipedia。
 * 选质量最好、内容最长的那个。结果不合格时返回 null，交由本地题库兜底。
 */
async function tryWebSearch(question) {
  try {
    // 首选：服务端代理（国内最可靠，通常 1~2 秒就能返回完整百科/搜索摘要）
    const viaServer = await searchViaServer(question);
    if (viaServer && isGoodWebAnswer(question, viaServer.answer)) return viaServer;

    // 服务端没搜到时，才并行尝试浏览器端其他源
    // （维基百科在国内基本不通，超时设短，避免白等）
    const results = await Promise.all([
      searchBaike(question),
      searchDuckDuckGoInstant(question),
      searchWikipedia(question)
    ]);
    const valid = results
      .filter(Boolean)
      .filter((item) => isGoodWebAnswer(question, item.answer));
    if (!valid.length) return null;
    valid.sort((a, b) => b.answer.length - a.answer.length);
    return valid[0];
  } catch {
    return null;
  }
}

/**
 * 学科问答主函数。
 * 流程：本地题库优先（内容更完整）→ 联网搜索 → 学科专属兜底。
 */
async function askSmartAI(question, subjectId) {
  // 1. 命中本地题库
  if (subjectId === 'chinese') {
    const poem = findPoemByQuestion(question);
    if (poem) return { type: 'poem', poem };
  } else if (subjectId === 'math') {
    const problem = findMathProblemByQuestion(question);
    if (problem) return { type: 'math', problem };
  } else if (subjectId === 'geography') {
    const topic = findGeoTopicByQuestion(question);
    if (topic) return { type: 'geo', topic };
  } else {
    const maps = {
      physics: PHYSICS_TOPICS, chemistry: CHEMISTRY_TOPICS,
      biology: BIOLOGY_TOPICS, english: ENGLISH_TOPICS, history: HISTORY_TOPICS
    };
    if (maps[subjectId]) {
      const topic = findTopicByQuestion(maps[subjectId], question);
      if (topic) return { type: subjectId, topic };
    }
  }

  // 2. 本地知识库（联网时学到的内容，离线同样可用）
  //    命中前先做相关性校验：早期误学的无效内容（如把"内环境稳态"当成查汉字"内"）自动作废
  if (typeof Knowledge !== 'undefined' && Knowledge.find) {
    const learned = Knowledge.find(subjectId, question);
    if (learned && isGoodWebAnswer(question, learned.answer)) {
      return {
        type: 'text',
        answer: learned.answer,
        source: `（来自我的知识库${learned.source ? ' · ' + learned.source : ''}）`,
        learnedFrom: learned.id
      };
    }
  }

  // 3. 共享知识库（多人共建，所有访问者可见；断网时使用已缓存内容）
  if (typeof SharedKnowledge !== 'undefined' && SharedKnowledge.find) {
    try {
      const shared = await SharedKnowledge.find(subjectId, question);
      if (shared && isGoodWebAnswer(question, shared.content)) {
        return {
          type: 'text',
          answer: shared.content,
          source: `（来自共享知识库${shared.author ? ' · ' + shared.author : ''}）`,
          learnedFrom: `shared:${shared.id}`
        };
      }
    } catch (err) {
      console.warn('[ai] 共享知识库查询失败：', err);
    }
  }

  // 4. 联网搜索（浏览器能上网才执行，且结果必须通过质量检查）
  const online = typeof navigator !== 'undefined' && navigator.onLine;
  if (online) {
    let web = await tryWebSearch(question);
    // 短词（人名/地名/名词）第一轮没搜到时，换个问法自动重试一次
    if (!web && /^[\u4e00-\u9fa5A-Za-z0-9]{2,6}$/.test(question.trim())) {
      web = await tryWebSearch(question.trim() + ' 是谁 简介');
    }
    if (web) {
      // 按学科特点组织回答：公式类学科核心内容优先，叙述类学科保留百科叙述
      const answer = composeSubjectWebAnswer(question, subjectId, web.answer);
      let learned = null;
      if (typeof Knowledge !== 'undefined' && Knowledge.saveLearned) {
        learned = await Knowledge.saveLearned({
          subject: subjectId,
          question,
          answer,
          source: web.sourceName || web.source,
          sourceUrl: web.sourceUrl || ''
        });
      }
      // 同步到共享知识库：所有访问者都能在本地命中，断网也查得到
      if (typeof SharedKnowledge !== 'undefined' && SharedKnowledge.create) {
        try {
          SharedKnowledge.create({
            subject: subjectId,
            title: question,
            question: question,
            content: answer,
            author: '智学探索',
            source: web.sourceName || web.source || '',
            sourceUrl: web.sourceUrl || ''
          }).catch(function () {});
        } catch (e) { /* 共享保存失败不影响本次回答 */ }
      }
      return {
        type: 'text',
        answer,
        source: web.source,
        learned: !!learned
      };
    }
  }

  // 5. 兜底回答。像「曹操」这类具体人物/名词，套学科模板毫无意义，
  //    如实告知是联网搜索暂时失败，并引导重试（成功一次就会学到并记住）。
  const qTrim = String(question || '').trim();
  const looksLikeEntity = /^[\u4e00-\u9fa5A-Za-z0-9]{2,6}$/.test(qTrim) &&
    !/[的了吗呢吧嘛]|什么|怎么|为什么|如何|哪些|多少|解释|介绍/.test(qTrim);
  if (looksLikeEntity) {
    return {
      type: 'text',
      answer: `关于「${qTrim}」，我刚才尝试联网搜索但没有成功，暂时给不出准确、完整的资料。\n\n别急，请再问一次试试——只要有一次搜索成功，我就会立刻把内容学下来存进知识库，以后就算断网也能答出来。\n\n也可以把问题问得更具体，比如：${qTrim}是谁 / ${qTrim}的生平和主要成就 / ${qTrim}有什么影响。`,
      source: '（联网搜索暂时不可用 · 请重试）'
    };
  }
  // 学科专属兜底回答（generateFallback 已返回 {type, answer}，勿再包一层）
  return generateFallback(question, subjectId);
}

/**
 * 把联网返回的百科文本按句子拆成"核心内容"与"背景来源"两部分。
 * 公式类学科（数学/物理/化学）用户要的是定义和用法，历史沿革压到最后。
 */
function splitCoreAndBackground(answer) {
  const text = String(answer || '').replace(/\s+/g, ' ').trim();
  const parts = text.match(/[^。！？!?]+[。！？!?]?/g) || [text];
  const historyRe = /(公元前|公元|[12]\d{3}\s*年|\d{4}\s*[—－\-–]\s*\d{4}|提出|创立|命名|纪念|之父|出生于|生于|卒于|逝世|数学家|物理学家|化学家|生物学家|天文学家|医学家|科学家|学者|古希腊|法国|德国|英国|美国|瑞士|意大利|奥地利|荷兰|瑞典|丹麦)/;
  const core = [];
  const background = [];
  parts.forEach(function (s, i) {
    s = s.trim();
    if (!s) return;
    // 第一句永远是核心（通常是定义）
    if (i === 0 || !historyRe.test(s)) core.push(s);
    else background.push(s);
  });
  return { core: core.join(''), background: background.join('') };
}

/**
 * 按学科"该有的回答方式"组织联网搜索到的内容：
 *  - 数学/物理/化学：公式与用法优先，背景压底部；
 *  - 英语：用法 + 练习建议；
 *  - 语文：内容 + 赏析路径；
 *  - 历史/地理/生物：百科式叙述本身就是合适的呈现，只补一句学科引导。
 */
function composeSubjectWebAnswer(question, subjectId, webAnswer) {
  const text = String(webAnswer || '').trim();

  if (subjectId === 'math' || subjectId === 'physics' || subjectId === 'chemistry') {
    const parts = splitCoreAndBackground(text);
    let out = '🎯 核心内容\n' + (parts.core || text);
    if (parts.background && parts.background.length > 20) {
      out += '\n\n📜 背景与来源（了解即可）\n' + parts.background;
    }
    return out;
  }

  if (subjectId === 'english') {
    return '📖 核心用法\n' + text + '\n\n✍️ 练习建议：把核心结构抄一遍，照着造 2 个自己的句子，再各改写一个否定句和一个疑问句，这个知识点就吃透了。';
  }

  if (subjectId === 'chinese') {
    return '📖 内容要点\n' + text + '\n\n🔍 赏析路径：主旨情感 → 语言修辞 → 写作背景，按这个顺序逐层体会，答题时条理最清楚。';
  }

  // 历史 / 地理 / 生物等叙述型学科：百科式内容即合适呈现，补一句学科视角引导
  const guide = generateSubjectAugment(question, subjectId, text);
  return guide || text;
}

/**
 * 给联网搜索结果加学科视角的引导和补充。
 * 比如搜出来一段关于「牛顿第二定律」的维基摘要，加上物理学习建议。
 */
function generateSubjectAugment(question, subjectId, webAnswer) {
  const subjectHint = {
    chinese: '语文学习中', math: '数学学习中', english: '英语学习中',
    physics: '物理学习中', chemistry: '化学学习中', biology: '生物学习中',
    geography: '地理学习中', history: '历史学习中'
  }[subjectId] || '学习中';

  const addOns = {
    chinese: `\n\n💡 ${subjectHint}的小建议：可以从"主旨情感、语言修辞、背景风格"三个角度来深挖这段内容。`,
    math: `\n\n💡 ${subjectHint}的小建议：试着把这里的关键信息用数学符号写出来，再用"已知→求→解→检验"四步法做一遍。`,
    english: `\n\n💡 ${subjectHint}的小建议：注意里面的核心句式和关键词，自己造一个类似的句子能帮你记得更牢。`,
    physics: `\n\n💡 ${subjectHint}的小建议：这对应哪个物理模型？能写出相关的公式吗？试试改变一个条件，看结论怎么变。`,
    chemistry: `\n\n💡 ${subjectHint}的小建议：把宏观现象和微观本质联系起来——分子/原子层面发生了什么变化？`,
    biology: `\n\n💡 ${subjectHint}的小建议：试试沿着"个体→器官→组织→细胞→分子"的层次往下追，每个层次有什么特点？`,
    geography: `\n\n💡 ${subjectHint}的小建议：可以用地理"三板斧"（位置、气候、地形）来分析——它位于哪里？气候怎样？地形如何？`,
    history: `\n\n💡 ${subjectHint}的小建议：用"背景—经过—影响"三段式来梳理这段历史，想想它和今天有什么联系。`
  };

  return webAnswer + (addOns[subjectId] || '');
}

/**
 * 兜底回答：没联网也没命中硬编码数据时，按学科和关键词生成一段像样的学习指导。
 */
function generateFallback(question, subjectId) {
  const sampleTopic = {
    chinese: ['静夜思', '春晓', '悯农', '咏鹅', '登鹳雀楼', '江南春', '送元二使安西'],
    math: ['一元二次方程', '勾股定理', '二次函数', '三角形相似', '概率计算', '导数入门', '圆与圆的位置关系'],
    english: ['现在完成时', '被动语态', '定语从句', '虚拟语气', '主谓一致'],
    physics: ['牛顿第二定律', '欧姆定律', '能量守恒', '万有引力', '动量守恒', '简谐振动'],
    chemistry: ['酸碱中和', '氧化还原', '化学平衡', '原电池', '化学反应速率'],
    biology: ['光合作用', '细胞呼吸', 'DNA 复制', '减数分裂', '生态系统能量流动'],
    geography: ['黄河', '季风气候', '等高线', '地壳运动', '城市热岛效应'],
    history: ['秦朝统一', '汉武帝大一统', '鸦片战争', '辛亥革命', '改革开放']
  }[subjectId] || [];

  const subjectLabel = {
    chinese: '语文', math: '数学', english: '英语', physics: '物理',
    chemistry: '化学', biology: '生物', geography: '地理', history: '历史'
  }[subjectId] || '该学科';

  const tips = sampleTopic.length
    ? `你可以试试提问：${sampleTopic.slice(0, 4).join(' / ')} 等。`
    : '';

  const templates = {
    chinese: (q) => `关于「${q}」：\n\n这是一个很好的语文问题。理解一个文本可以从以下几个角度入手：\n\n• 主旨与情感：作品通过什么意象、什么手法，表达了作者怎样的心情或思考？\n• 语言与修辞：用词是否精准？有没有比喻、拟人、排比等修辞？\n• 背景与风格：了解作者的生平和写作时代，能帮助我们读懂作品背后的含义。\n\n如果你想深入某一首古诗，可以直接问诗名，比如"静夜思"。${tips}`,

    math: (q) => `关于「${q}」的数学思考：\n\n在数学中，遇到一个新问题通常按下面的步骤推进：\n\n① 先明确已知条件是什么、要求的是什么——把题意用数学符号写出来；\n② 联想相关的公式或定理，看看哪些条件可以用上；\n③ 选择合适的方法（方程、构造、转化、反证等）一步步推演；\n④ 最后检验答案是否合理（单位、数量级、极端情况）。\n\n数学的核心是"从条件到结论的逻辑链"，多练多总结方法，感觉会越来越好。${tips}`,

    english: (q) => `Regarding "${q}":\n\nWhen learning English grammar or vocabulary, try this approach:\n\n1. Pattern first — memorize the core structure (e.g. "have/has + done" for present perfect).\n2. Example sentences — see how it works in real contexts.\n3. Mistake points — watch out for common traps (tense agreement, preposition choice).\n4. Your own sentence — write one sentence using the pattern.\n\nLanguage learning is all about input + practice. Keep reading and speaking! ${tips}`,

    physics: (q) => `关于「${q}」的物理理解：\n\n物理学习的关键是建立"物理模型"——遇到问题可以这样想：\n\n① 这是什么物理现象？属于力学 / 热学 / 电磁学 / 光学 / 近代物理？\n② 对应的基本规律是什么？（牛顿定律、能量守恒、电磁感应定律……）\n③ 能用什么公式定量描述？单位和量纲对不对？\n④ 做定性分析：如果某个条件变大 / 变小，结果会怎么变？\n\n物理不是背公式，而是用几个简单的原理去解释大千世界。${tips}`,

    chemistry: (q) => `关于「${q}」的化学解读：\n\n化学可以从三个层次理解同一个问题：\n\n① 宏观层面——我们能看到什么现象（颜色变化、沉淀、气体生成、温度变化）；\n② 微观层面——分子 / 原子 / 离子是怎么重新组合的；\n③ 符号层面——用化学方程式和化学用语准确表达这个变化。\n\n把宏观现象和微观本质联系起来，化学就会变得清晰。${tips}`,

    biology: (q) => `关于「${q}」的生物学视角：\n\n生物是有层次的系统——理解一个问题可以沿着层次往下追：\n\n个体 → 器官 → 组织 → 细胞 → 分子（蛋白质、核酸、酶）\n\n同时也要向上看：生物与生物之间、生物与环境之间如何相互作用，维持生态系统的稳态。\n\n每一个生命现象背后，都有分子机制在驱动；每一个细胞活动，都遵循能量守恒。${tips}`,

    geography: (q) => `关于「${q}」的地理分析：\n\n地理学的"三板斧"：位置、气候、地形。\n\n① 位置（经纬度 / 海陆位置）决定了一个地方的热量和水分条件；\n② 气候（气温、降水、季节变化）决定了植被、土壤、河流的基本面貌；\n③ 地形（高低、走向、板块位置）影响河流流向、交通线路、聚落分布。\n\n把这三点结合起来，很多地理现象都能说清楚。${tips}`,

    history: (q) => `关于「${q}」的历史思考：\n\n历史事件可以用"为什么、是什么、怎么样"三个追问来理解：\n\n① 背景：之前发生了什么？有哪些长期和短期的原因？\n② 经过：事件的关键节点、主要人物、转折点在哪里？\n③ 影响：改变了什么？对当时和后世分别有什么意义？\n\n读历史不只是记年份和人名，而是从中看到人类社会演变的规律。${tips}`
  };

  const tmpl = templates[subjectId];
  const text = tmpl ? tmpl(question.trim()) : `${question.trim() || '这个问题'}——可以从 ${subjectLabel} 的基本概念、核心方法和典型例题三个方面来思考。${tips}`;
  return { type: 'text', answer: text };
}

/**
 * 远程调用 AI 服务。失败时抛出异常，由 askAI 统一回退。
 */
async function askRemoteAI(question, subjectId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(AI_CONFIG.chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId: AI_CONFIG.unitId,
        robotId: AI_CONFIG.robotId,
        question,
        subject: subjectId
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`AI 接口返回 HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('AI 接口返回的不是 JSON');
    }

    const data = await response.json();
    const answer =
      data.answer ||
      data.content ||
      data.result ||
      (data.data && (data.data.answer || data.data.content));

    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('AI 响应中没有有效回答');
    }

    return { type: 'text', answer };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 统一 AI 问答入口。
 * 流程：远程智能体（若启用）→ 联网搜索 + 本地硬编码 + 学科兜底。
 */
async function askAI(question, subjectId) {
  const config = typeof AI_CONFIG === 'undefined' ? null : AI_CONFIG;

  // 远程 AI 模式（如果启用且配了 unitId/robotId）
  if (config && config.enabled && config.unitId && config.robotId) {
    try {
      return await askRemoteAI(question, subjectId);
    } catch (error) {
      console.warn('[AI] 远程 AI 失败，切换到联网+本地模式：', error);
      const local = await askSmartAI(question, subjectId);
      return { ...local, notice: '远程 AI 未响应，已切换到联网+本地模式' };
    }
  }

  // 默认：联网优先 + 本地兜底
  return askSmartAI(question, subjectId);
}

/* ============================================================
 * 扩充题库（拼音 / 现代诗文 / 各学科知识点 / 学科联动）
 * ============================================================ */

// ---- 古诗拼音 ----
const POEM_PINYIN = {
  jingyesi: [
    'chuáng qián míng yuè guāng',
    'yí shì dì shàng shuāng',
    'jǔ tóu wàng míng yuè',
    'dī tóu sī gù xiāng'
  ],
  chunxiao: [
    'chūn mián bù jué xiǎo',
    'chù chù wén tí niǎo',
    'yè lái fēng yǔ shēng',
    'huā luò zhī duō shǎo'
  ],
  minnong: [
    'chú hé rì dāng wǔ',
    'hàn dī hé xià tǔ',
    'shuí zhī pán zhōng cān',
    'lì lì jiē xīn kǔ'
  ],
  yonge: [
    'é é é',
    'qū xiàng xiàng tiān gē',
    'bái máo fú lǜ shuǐ',
    'hóng zhǎng bō qīng bō'
  ]
};
CHINESE_POEMS.forEach((poem) => {
  if (POEM_PINYIN[poem.id]) poem.pinyin = POEM_PINYIN[poem.id];
});

// ---- 扩充课文：现代诗词与名篇 ----
CHINESE_POEMS.push(
  {
    id: 'qinyuanchunxue',
    title: '沁园春·雪',
    author: '毛泽东',
    dynasty: '现代',
    keywords: ['沁园春', '北国风光', '数风流人物', '长城', '雪'],
    poem: [
      '北国风光，千里冰封，万里雪飘。',
      '望长城内外，惟余莽莽；大河上下，顿失滔滔。',
      '山舞银蛇，原驰蜡象，欲与天公试比高。',
      '须晴日，看红装素裹，分外妖娆。',
      '江山如此多娇，引无数英雄竞折腰。',
      '惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。',
      '一代天骄，成吉思汗，只识弯弓射大雕。',
      '俱往矣，数风流人物，还看今朝。'
    ],
    pinyin: [
      'běi guó fēng guāng，qiān lǐ bīng fēng，wàn lǐ xuě piāo',
      'wàng cháng chéng nèi wài，wéi yú mǎng mǎng；dà hé shàng xià，dùn shī tāo tāo',
      'shān wǔ yín shé，yuán chí là xiàng，yù yǔ tiān gōng shì bǐ gāo',
      'xū qíng rì，kàn hóng zhuāng sù guǒ，fèn wài yāo ráo',
      'jiāng shān rú cǐ duō jiāo，yǐn wú shù yīng xióng jìng zhé yāo',
      'xī qín huáng hàn wǔ，lüè shū wén cǎi；táng zōng sòng zǔ，shāo xùn fēng sāo',
      'yī dài tiān jiāo，chéng jí sī hán，zhǐ shí wān gōng shè dà diāo',
      'jù wǎng yǐ，shǔ fēng liú rén wù，hái kàn jīn zhāo'
    ],
    translation: [
      '北方的风光，千里冰封冻，万里雪花飘。',
      '远望长城内外，只剩下白茫茫一片；黄河上下，顿时失去了滔滔水势。',
      '群山像银蛇舞动，高原似蜡象奔驰，仿佛想与天公比高低。',
      '等到晴天，红日与白雪交相辉映，格外娇艳美好。',
      '江山如此壮丽，引得无数英雄为之倾倒。',
      '可惜秦始皇、汉武帝文采稍差；唐太宗、宋太祖也略逊风采。',
      '称雄一世的成吉思汗，也只知道弯弓射大雕。',
      '这些都过去了，真正称得上英雄人物的人，还要看今天。'
    ],
    appreciation: {
      主旨: '上阕描绘北国壮丽雪景，下阕评论历代英雄，抒发对祖国山河的热爱和建功立业的豪情。',
      写作手法: '写景、议论、抒情相结合；运用比喻、拟人、对偶，气势磅礴；以“惜”字领起，评点历史人物。',
      重点字词: '惟余莽莽：只剩下白茫茫一片。妖娆：娇艳美好。折腰：倾倒、敬慕。风流人物：建功立业的英雄人物。'
    },
    authorIntro: {
      朝代: '现代',
      身份: '无产阶级革命家、战略家、诗人',
      代表作品: '《沁园春·雪》《七律·长征》《卜算子·咏梅》',
      写作背景: '1936年2月，红军长征到达陕北，毛泽东面对壮丽雪景写下此词。'
    },
    related: [
      { subject: 'history', keyword: '辛亥革命' },
      { subject: 'geography', keyword: '黄河' }
    ]
  },
  {
    id: 'tianjingsha',
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元',
    keywords: ['天净沙', '秋思', '枯藤老树昏鸦', '断肠人在天涯'],
    poem: [
      '枯藤老树昏鸦，',
      '小桥流水人家，',
      '古道西风瘦马。',
      '夕阳西下，',
      '断肠人在天涯。'
    ],
    pinyin: [
      'kū téng lǎo shù hūn yā',
      'xiǎo qiáo liú shuǐ rén jiā',
      'gǔ dào xī fēng shòu mǎ',
      'xī yáng xī xià',
      'duàn cháng rén zài tiān yá'
    ],
    translation: [
      '枯藤缠绕的老树上，栖息着黄昏归巢的乌鸦。',
      '小桥下流水潺潺，旁边是几户人家。',
      '荒凉的古道上，西风中走来一匹瘦马。',
      '夕阳渐渐落下。',
      '漂泊天涯的游子愁肠寸断。'
    ],
    appreciation: {
      主旨: '通过一组萧瑟的秋景，抒发天涯游子的羁旅之愁和思乡之情。',
      写作手法: '白描手法，纯用名词意象叠加，九个意象构成一幅秋郊夕照图；以乐景写哀情。',
      重点字词: '昏鸦：黄昏时的乌鸦。古道：已经废弃不堪再用的古老驿道。断肠人：形容伤心悲痛到极点的人。'
    },
    authorIntro: {
      朝代: '元代',
      身份: '元曲四大家之一，被誉为“曲状元”',
      代表作品: '《天净沙·秋思》《汉宫秋》',
      写作背景: '作者一生漂泊，仕途失意，此曲写羁旅漂泊中的思乡之苦。'
    }
  },
  {
    id: 'guancanghai',
    title: '观沧海',
    author: '曹操',
    dynasty: '东汉',
    keywords: ['观沧海', '曹操', '东临碣石', '日月之行'],
    poem: [
      '东临碣石，以观沧海。',
      '水何澹澹，山岛竦峙。',
      '树木丛生，百草丰茂。',
      '秋风萧瑟，洪波涌起。',
      '日月之行，若出其中；',
      '星汉灿烂，若出其里。',
      '幸甚至哉，歌以咏志。'
    ],
    pinyin: [
      'dōng lín jié shí，yǐ guān cāng hǎi',
      'shuǐ hé dàn dàn，shān dǎo sǒng zhì',
      'shù mù cóng shēng，bǎi cǎo fēng mào',
      'qiū fēng xiāo sè，hóng bō yǒng qǐ',
      'rì yuè zhī xíng，ruò chū qí zhōng',
      'xīng hàn càn làn，ruò chū qí lǐ',
      'xìng shèn zhì zāi，gē yǐ yǒng zhì'
    ],
    translation: [
      '向东登上碣石山，来观赏苍茫的大海。',
      '海水多么宽阔浩荡，山岛高高地挺立。',
      '树木郁郁葱葱地生长，各种草长得很茂盛。',
      '秋风吹来，发出萧瑟的声音，海上掀起巨浪。',
      '太阳和月亮的运行，好像从这大海中升起。',
      '银河星光灿烂，好像也从这大海里产生。',
      '幸运得很，就用诗歌来表达自己的志向吧。'
    ],
    appreciation: {
      主旨: '描绘大海雄浑壮阔的景象，抒发诗人统一天下的雄心壮志和博大胸襟。',
      写作手法: '借景抒情、虚实结合；由实景写到想象，以夸张和想象表现大海的吞吐宇宙之势。',
      重点字词: '澹澹：水波荡漾的样子。竦峙：高高地挺立。萧瑟：形容风吹树木的声音。星汉：银河。'
    },
    authorIntro: {
      朝代: '东汉末年',
      身份: '政治家、军事家、诗人，建安文学代表人物',
      代表作品: '《观沧海》《龟虽寿》《短歌行》',
      写作背景: '建安十二年，曹操北征乌桓胜利后登临碣石山，写下此诗。'
    },
    related: [{ subject: 'geography', keyword: '黄河' }]
  },
  {
    id: 'cibeigushanxia',
    title: '次北固山下',
    author: '王湾',
    dynasty: '唐',
    keywords: ['次北固山下', '海日生残夜', '江春入旧年', '乡书何处达'],
    poem: [
      '客路青山外，行舟绿水前。',
      '潮平两岸阔，风正一帆悬。',
      '海日生残夜，江春入旧年。',
      '乡书何处达？归雁洛阳边。'
    ],
    pinyin: [
      'kè lù qīng shān wài，xíng zhōu lǜ shuǐ qián',
      'cháo píng liǎng àn kuò，fēng zhèng yī fān xuán',
      'hǎi rì shēng cán yè，jiāng chūn rù jiù nián',
      'xiāng shū hé chù dá，guī yàn luò yáng biān'
    ],
    translation: [
      '旅途在青山之外，行船在绿水之前。',
      '潮水涨满，两岸显得开阔；顺风行船，一叶白帆高悬。',
      '残夜未尽，海上已升起红日；旧年未过，江上已有春意。',
      '寄出的家书什么时候才能到达？希望北归的大雁捎到洛阳。'
    ],
    appreciation: {
      主旨: '描绘长江下游开阔秀丽的早春景色，表达诗人漂泊他乡的思乡之情。',
      写作手法: '寓情于景、景中含理；“海日生残夜，江春入旧年”蕴含新事物必将取代旧事物的哲理。',
      重点字词: '次：停宿。客路：旅途。残夜：夜将尽未尽之时。乡书：家书。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '诗人，此诗为其代表作',
      代表作品: '《次北固山下》',
      写作背景: '诗人往来于吴楚之间，途经北固山时停宿，写下这首羁旅思乡之作。'
    },
    related: [{ subject: 'geography', keyword: '季风' }]
  },
  {
    id: 'shizhisaishang',
    title: '使至塞上',
    author: '王维',
    dynasty: '唐',
    keywords: ['使至塞上', '大漠孤烟直', '长河落日圆', '王维'],
    poem: [
      '单车欲问边，属国过居延。',
      '征蓬出汉塞，归雁入胡天。',
      '大漠孤烟直，长河落日圆。',
      '萧关逢候骑，都护在燕然。'
    ],
    pinyin: [
      'dān chē yù wèn biān，shǔ guó guò jū yán',
      'zhēng péng chū hàn sài，guī yàn rù hú tiān',
      'dà mò gū yān zhí，cháng hé luò rì yuán',
      'xiāo guān féng hòu qí，dū hù zài yān rán'
    ],
    translation: [
      '轻车简从去慰问边关，途中经过居延。',
      '像随风飘飞的蓬草出了汉塞，像北归的大雁飞入胡天。',
      '浩瀚沙漠中一缕孤烟笔直升起，黄河上一轮落日浑圆。',
      '在萧关遇到侦察骑兵，得知都护正在燕然前线。'
    ],
    appreciation: {
      主旨: '描绘塞外奇特壮丽的风光，表达诗人被排挤出朝廷的孤寂之情和豁达胸襟。',
      写作手法: '以“征蓬”“归雁”自比，借景抒情；“大漠孤烟直，长河落日圆”构图精妙，画面感极强。',
      重点字词: '单车：一辆车，形容轻车简从。征蓬：飘飞的蓬草。孤烟：烽烟。长河：黄河。'
    },
    authorIntro: {
      朝代: '唐代',
      身份: '山水田园诗人，被誉为“诗佛”',
      代表作品: '《使至塞上》《山居秋暝》《相思》',
      写作背景: '开元二十五年，王维以监察御史身份出塞慰问边军，途中写下此诗。'
    },
    related: [
      { subject: 'geography', keyword: '季风' },
      { subject: 'geography', keyword: '黄河' }
    ]
  },
  {
    id: 'shuidiaogetou',
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋',
    keywords: ['水调歌头', '明月几时有', '但愿人长久', '千里共婵娟'],
    poem: [
      '明月几时有？把酒问青天。',
      '不知天上宫阙，今夕是何年。',
      '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。',
      '起舞弄清影，何似在人间。',
      '人有悲欢离合，月有阴晴圆缺，此事古难全。',
      '但愿人长久，千里共婵娟。'
    ],
    pinyin: [
      'míng yuè jǐ shí yǒu，bǎ jiǔ wèn qīng tiān',
      'bù zhī tiān shàng gōng què，jīn xī shì hé nián',
      'wǒ yù chéng fēng guī qù，yòu kǒng qióng lóu yù yǔ，gāo chù bù shèng hán',
      'qǐ wǔ nòng qīng yǐng，hé sì zài rén jiān',
      'rén yǒu bēi huān lí hé，yuè yǒu yīn qíng yuán quē，cǐ shì gǔ nán quán',
      'dàn yuàn rén cháng jiǔ，qiān lǐ gòng chán juān'
    ],
    translation: [
      '明月从什么时候开始有的？端起酒杯遥问青天。',
      '不知道天上的宫殿，今天晚上是哪一年。',
      '我想乘着风回到天上去，又怕那美玉砌成的楼宇太高，经受不住寒冷。',
      '起身舞蹈，玩赏着清冷的月影，哪里比得上人间呢。',
      '人有悲欢离合的变迁，月有阴晴圆缺的转换，这种事自古难以周全。',
      '只希望人们都能长久平安，即使相隔千里，也能共享这美好的月光。'
    ],
    appreciation: {
      主旨: '借中秋望月，表达对亲人的思念和美好祝愿，同时展现旷达乐观的人生态度。',
      写作手法: '想象丰富，虚实结合；由问月到问人生，情景理交融；“人有悲欢离合”三句议论精辟。',
      重点字词: '把酒：端起酒杯。宫阙：宫殿。琼楼玉宇：美玉砌成的楼宇。婵娟：指月亮。'
    },
    authorIntro: {
      朝代: '北宋',
      身份: '文学家、书画家，“唐宋八大家”之一',
      代表作品: '《水调歌头·明月几时有》《念奴娇·赤壁怀古》《赤壁赋》',
      写作背景: '宋神宗熙宁九年中秋，苏轼在密州任上，怀念弟弟苏辙而作。'
    }
  }
);

// ---- 扩充数学题库 ----
MATH_PROBLEMS.push(
  {
    id: 'triangle-area',
    question: ['三角形面积', '底乘高', '海伦公式', '三角形'],
    brief:
      '三角形面积 = 底 × 高 ÷ 2，即 $S=\\frac{1}{2}ah$。已知三边时可用海伦公式 $S=\\sqrt{p(p-a)(p-b)(p-c)}$，其中 $p$ 为半周长。',
    formulas: [
      { latex: 'S = \\frac{1}{2}ah', desc: '底 × 高 ÷ 2，$a$ 为底，$h$ 为该底上的高' },
      { latex: 'S = \\frac{1}{2}ab\\sin C', desc: '已知两边及其夹角时的面积公式' },
      { latex: 'S = \\sqrt{p(p-a)(p-b)(p-c)}', desc: '海伦公式，$p=\\frac{a+b+c}{2}$ 为半周长' }
    ],
    deepSteps: [
      {
        step: '最常用的底高公式',
        content: '任取三角形的一条边作为底 $a$，从对角顶点向这条边作垂线，垂线段长度就是高 $h$，面积 $S=\\frac{1}{2}ah$。'
      },
      {
        step: '已知两边夹角',
        content: '若已知 $a$、$b$ 及夹角 $C$，可先用高 $h=b\\sin C$，再代入得 $S=\\frac{1}{2}ab\\sin C$，在解斜三角形时很常用。'
      },
      {
        step: '已知三边（海伦公式）',
        content: '例：三边为 3、4、5，半周长 $p=6$，$S=\\sqrt{6\\times3\\times2\\times1}=\\sqrt{36}=6$，与直角三角形面积 $\\frac{1}{2}\\times3\\times4=6$ 一致。'
      }
    ],
    related: [{ subject: 'physics', keyword: '功与功率' }]
  },
  {
    id: 'circle',
    question: ['圆', '圆的面积', '周长', '半径', '直径', '圆周率'],
    brief:
      '圆的周长 $C=2\\pi r$，面积 $S=\\pi r^2$。圆的直径 $d=2r$，同圆中所有半径相等。',
    formulas: [
      { latex: 'C = 2\\pi r = \\pi d', desc: '圆的周长等于圆周率乘以直径' },
      { latex: 'S = \\pi r^2', desc: '圆的面积等于圆周率乘以半径的平方' },
      { latex: 'S_{扇形} = \\frac{n}{360}\\pi r^2', desc: '圆心角为 $n$ 度的扇形面积' }
    ],
    deepSteps: [
      {
        step: '认识半径、直径',
        content: '连接圆心与圆上任意一点的线段叫半径 $r$；经过圆心且两端在圆上的线段叫直径 $d$，有 $d=2r$。'
      },
      {
        step: '周长与面积的来源',
        content: '把圆平均分成许多小扇形再拼成近似长方形，长约为周长的一半 $\\pi r$，宽为 $r$，于是 $S=\\pi r\\cdot r=\\pi r^2$。'
      },
      {
        step: '完整算例',
        content: '半径 $r=5\\,\\text{cm}$：周长 $C=2\\pi\\times5=10\\pi\\approx31.4\\,\\text{cm}$；面积 $S=\\pi\\times5^2=25\\pi\\approx78.5\\,\\text{cm}^2$。'
      }
    ]
  },
  {
    id: 'probability',
    question: ['概率', '可能性', '古典概型', '掷骰子', '摸球'],
    brief:
      '古典概型的概率 $P(A)=\\frac{\\text{事件 }A\\text{ 包含的结果数}}{\\text{所有可能结果数}}$，且每个结果出现的可能性相同。',
    formulas: [
      { latex: 'P(A) = \\frac{m}{n}', desc: '$m$ 为事件 $A$ 包含的结果数，$n$ 为所有等可能结果数' },
      { latex: '0 \\le P(A) \\le 1', desc: '概率的取值范围，必然事件为 1，不可能事件为 0' },
      { latex: 'P(\\bar{A}) = 1 - P(A)', desc: '对立事件的概率之和为 1' }
    ],
    deepSteps: [
      {
        step: '什么是古典概型',
        content: '试验的所有可能结果只有有限个，且每个结果出现的可能性相等，这样的概率模型叫古典概型。'
      },
      {
        step: '完整算例',
        content: '掷一枚均匀骰子，所有结果共 6 种；掷出偶数点包含 2、4、6 三种，所以 $P=\\frac{3}{6}=\\frac{1}{2}$。'
      },
      {
        step: '画树状图或列表',
        content: '涉及两步试验（如掷两次骰子）时，用列表或树状图列出所有等可能结果，再数出符合条件的结果数，避免遗漏和重复。'
      }
    ]
  },
  {
    id: 'linear-function',
    question: ['一次函数', '正比例函数', 'y=kx+b', '斜率', '截距'],
    brief:
      '一次函数为 $y=kx+b\\ (k\\ne0)$，图象是一条直线，$k$ 决定倾斜方向，$b$ 是与 $y$ 轴交点的纵坐标。',
    formulas: [
      { latex: 'y = kx + b\\ (k \\ne 0)', desc: '一次函数的一般形式' },
      { latex: 'y = kx', desc: '当 $b=0$ 时为正比例函数，图象过原点' },
      { latex: 'k = \\frac{y_2-y_1}{x_2-x_1}', desc: '已知直线上两点求斜率' }
    ],
    deepSteps: [
      {
        step: 'k 与 b 的几何意义',
        content: '当 $k>0$ 时，$y$ 随 $x$ 增大而增大，直线向右上倾斜；当 $k<0$ 时，$y$ 随 $x$ 增大而减小。$b$ 是直线与 $y$ 轴交点的纵坐标。'
      },
      {
        step: '待定系数法求解析式',
        content: '已知直线上两点，设 $y=kx+b$，把两点坐标代入得到关于 $k$、$b$ 的方程组，解出即可。例：过 $(0,1)$ 和 $(2,5)$，得 $b=1$，$2k+1=5$，所以 $k=2$，解析式为 $y=2x+1$。'
      }
    ],
    related: [{ subject: 'physics', keyword: '欧姆定律' }]
  }
);

// ---- 扩充数学题库（公式考点）----
MATH_PROBLEMS.push(
  {
    id: 'vieta',
    question: ['韦达定理', '根与系数的关系', '两根之和', '两根之积', 'x1+x2', 'x1x2', '不解方程'],
    brief:
      '韦达定理：若 $ax^2+bx+c=0\\ (a\\ne0)$ 的两根为 $x_1, x_2$，则 $x_1+x_2=-\\frac{b}{a}$，$x_1 x_2=\\frac{c}{a}$。核心用途是"不解方程"直接求两根的和、积以及相关的对称式。',
    formulas: [
      { latex: 'x_1 + x_2 = -\\frac{b}{a}', desc: '两根之和 = 一次项系数 ÷ 二次项系数的相反数' },
      { latex: 'x_1 x_2 = \\frac{c}{a}', desc: '两根之积 = 常数项 ÷ 二次项系数' },
      { latex: '\\Delta = b^2 - 4ac > 0', desc: '使用前提：方程有两个不相等的实数根' },
      { latex: 'x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2', desc: '最常用的对称式变形' }
    ],
    deepSteps: [
      {
        step: '定理内容',
        content: '一元二次方程 $ax^2+bx+c=0\\ (a\\ne0)$ 中，两根之和 $x_1+x_2=-\\frac{b}{a}$，两根之积 $x_1x_2=\\frac{c}{a}$。使用前先确认 $\\Delta\\ge0$。'
      },
      {
        step: '为什么成立',
        content: '由求根公式 $x_{1,2}=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}$，两式相加时 $\\pm\\sqrt{\\Delta}$ 抵消得 $-\\frac{b}{a}$，相乘时平方差消去根号得 $\\frac{c}{a}$。'
      },
      {
        step: '典型例题',
        content: '已知 $x^2-5x+6=0$ 的两根为 $x_1,x_2$，不解方程求 $x_1+x_2$ 与 $x_1x_2$。解：$a=1, b=-5, c=6$，则 $x_1+x_2=5$，$x_1x_2=6$。验证：方程的根是 2 和 3，$2+3=5$，$2\\times3=6$，正确。'
      },
      {
        step: '进阶应用',
        content: '求 $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2=25-12=13$；求 $\\frac{1}{x_1}+\\frac{1}{x_2}=\\frac{x_1+x_2}{x_1x_2}=\\frac{5}{6}$。这类对称式都不用求出具体的根。'
      }
    ]
  },
  {
    id: 'sequences',
    question: ['等差数列', '等比数列', '通项公式', '前n项和', '前N项和', '公差', '公比'],
    brief:
      '等差数列：$a_n=a_1+(n-1)d$，$S_n=\\frac{n(a_1+a_n)}{2}$；等比数列：$a_n=a_1 q^{n-1}$，$S_n=\\frac{a_1(1-q^n)}{1-q}\\ (q\\ne1)$。',
    formulas: [
      { latex: 'a_n = a_1 + (n-1)d', desc: '等差数列通项公式，$d$ 为公差' },
      { latex: 'S_n = \\frac{n(a_1+a_n)}{2} = na_1 + \\frac{n(n-1)}{2}d', desc: '等差数列前 n 项和' },
      { latex: 'a_n = a_1 q^{n-1}', desc: '等比数列通项公式，$q$ 为公比且 $q\\ne0$' },
      { latex: 'S_n = \\frac{a_1(1-q^n)}{1-q} \\ (q\\ne1)', desc: '等比数列前 n 项和；$q=1$ 时 $S_n=na_1$' }
    ],
    deepSteps: [
      {
        step: '等差数列算例',
        content: '数列 1, 3, 5, 7, … 中 $a_1=1$，$d=2$，则 $a_{10}=1+9\\times2=19$；$S_{10}=\\frac{10(1+19)}{2}=100$。'
      },
      {
        step: '等比数列算例',
        content: '数列 2, 6, 18, … 中 $a_1=2$，$q=3$，则 $a_5=2\\times3^4=162$；$S_4=\\frac{2(1-3^4)}{1-3}=80$。'
      },
      {
        step: '易错点',
        content: '等比数列求和必须讨论 $q=1$；等差数列中 $n$ 从 1 开始，$a_n=a_1+(n-1)d$ 里别漏了 $-1$；应用题先判断是"第几项"还是"前几项和"。'
      }
    ]
  },
  {
    id: 'sine-cosine-rule',
    question: ['正弦定理', '余弦定理', '解三角形'],
    brief:
      '解三角形两大工具：正弦定理 $\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R$；余弦定理 $a^2=b^2+c^2-2bc\\cos A$。',
    formulas: [
      { latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R', desc: '正弦定理，$R$ 为外接圆半径' },
      { latex: 'a^2 = b^2 + c^2 - 2bc\\cos A', desc: '余弦定理（已知两边及夹角求第三边）' },
      { latex: '\\cos A = \\frac{b^2+c^2-a^2}{2bc}', desc: '余弦定理变形（已知三边求角）' },
      { latex: 'S = \\frac{1}{2}ab\\sin C', desc: '两边及夹角求面积' }
    ],
    deepSteps: [
      {
        step: '选定理的口诀',
        content: '已知"两角+一边"或"两边+其中一边的对角"→ 用**正弦定理**；已知"两边+夹角"或"三边"→ 用**余弦定理**。'
      },
      {
        step: '典型例题',
        content: '已知 $a=3$，$b=4$，$C=60^\\circ$，求 $c$ 与面积。余弦定理：$c^2=9+16-2\\times3\\times4\\times\\frac{1}{2}=13$，所以 $c=\\sqrt{13}$；面积 $S=\\frac{1}{2}\\times3\\times4\\times\\frac{\\sqrt{3}}{2}=3\\sqrt{3}$。'
      }
    ]
  }
);

// ---- 扩充物理题库 ----
PHYSICS_TOPICS.push(
  {
    id: 'inertia',
    keywords: ['惯性', '牛顿第一定律', '惯性定律', '力与运动'],
    brief: '一切物体在没有受到外力作用时，总保持静止状态或匀速直线运动状态，这就是牛顿第一定律。',
    formulas: [
      { latex: '\\sum F = 0 \\Rightarrow v = \\text{常矢量}', desc: '合外力为零时，速度保持不变' }
    ],
    structure: [
      '牛顿第一定律揭示了力与运动的关系：力不是维持运动的原因，而是改变运动状态的原因。',
      '惯性是物体保持原来运动状态不变的性质，一切物体在任何情况下都有惯性。',
      '质量是惯性大小的唯一量度，质量越大惯性越大。',
      '不能用"受到惯性作用"来描述，惯性不是力。'
    ],
    deepSteps: [
      {
        step: '从斜面实验到定律',
        content: '伽利略通过理想斜面实验发现：表面越光滑，小球运动越远。推理出若表面绝对光滑，小球将永远运动下去，从而推翻"力是维持运动的原因"。'
      },
      {
        step: '正确理解惯性',
        content: '汽车急刹车时乘客身体前倾，是因为乘客由于惯性保持原来的运动状态，而不是受到了一个"向前的力"。'
      },
      {
        step: '与牛顿第二定律的联系',
        content: '$F=ma$ 中若 $F=0$，则 $a=0$，速度不变，正好与牛顿第一定律一致，第一定律可看作第二定律的特殊情况。'
      }
    ],
    related: [{ subject: 'physics', keyword: '牛顿第二定律' }]
  },
  {
    id: 'ohms-law',
    keywords: ['欧姆定律', '电流', '电压', '电阻', 'U=IR', '串联', '并联'],
    brief: '导体中的电流与导体两端电压成正比、与导体电阻成反比：$I=\\frac{U}{R}$。',
    formulas: [
      { latex: 'I = \\frac{U}{R}', desc: '欧姆定律：电流等于电压除以电阻' },
      { latex: 'R = \\frac{U}{I}', desc: '由电压和电流求电阻' },
      { latex: 'R_{串} = R_1 + R_2', desc: '串联电路总电阻等于各电阻之和' },
      { latex: '\\frac{1}{R_{并}} = \\frac{1}{R_1} + \\frac{1}{R_2}', desc: '并联电路总电阻的倒数等于各支路倒数之和' }
    ],
    structure: [
      '电流、电压、电阻是描述电路的三把"尺子"，欧姆定律把三者定量联系起来。',
      '串联电路电流处处相等，总电压等于各部分电压之和。',
      '并联电路各支路电压相等，干路电流等于各支路电流之和。',
      '使用欧姆定律时，三个物理量必须对应同一导体、同一时刻。'
    ],
    deepSteps: [
      {
        step: '三个物理量的含义',
        content: '电压 $U$ 是形成电流的原因，单位伏特（V）；电阻 $R$ 是导体对电流的阻碍作用，单位欧姆（Ω）；电流 $I$ 是单位时间内通过导体横截面的电荷量，单位安培（A）。'
      },
      {
        step: '完整算例',
        content: '某电阻两端电压 $U=6\\,\\text{V}$，电阻 $R=3\\,\\Omega$，则电流 $I=\\frac{U}{R}=\\frac{6}{3}=2\\,\\text{A}$。'
      },
      {
        step: '控制变量思想',
        content: '研究电流与电压关系时保持电阻不变；研究电流与电阻关系时保持电压不变。这是典型的控制变量法。'
      }
    ],
    related: [
      { subject: 'math', keyword: '一次函数' },
      { subject: 'chemistry', keyword: '原电池' }
    ]
  },
  {
    id: 'buoyancy',
    keywords: ['浮力', '阿基米德原理', '漂浮', '沉浮', '排开液体'],
    brief: '浸在液体中的物体受到向上的浮力，大小等于它排开的液体所受的重力：$F_{浮}=\\rho_{液}gV_{排}$。',
    formulas: [
      { latex: 'F_{浮} = \\rho_{液} g V_{排}', desc: '阿基米德原理，浮力等于排开液体的重力' },
      { latex: 'F_{浮} = G_{物} - F_{示}', desc: '称重法：浮力等于物体重力减弹簧测力计示数' },
      { latex: 'F_{浮} > G \\Rightarrow \\text{上浮}', desc: '浮力与重力比较判断物体沉浮' }
    ],
    structure: [
      '浮力产生的原因是液体对物体下表面的压力大于上表面的压力。',
      '阿基米德原理说明浮力只与液体密度和排开液体的体积有关。',
      '物体漂浮时 $F_{浮}=G_{物}$，悬浮时同样 $F_{浮}=G_{物}$，沉底时 $F_{浮}<G_{物}$。',
      '浮力与物体本身的重力、形状、深度（浸没后）无关。'
    ],
    deepSteps: [
      {
        step: '浮力从哪来',
        content: '液体内部压强随深度增加而增大，物体下表面受到的向上压力大于上表面受到的向下压力，二者之差就是浮力。'
      },
      {
        step: '完整算例',
        content: '体积 $V=2\\times10^{-3}\\,\\text{m}^3$ 的物体浸没在水中，$F_{浮}=\\rho_{水}gV=1.0\\times10^3\\times10\\times2\\times10^{-3}=20\\,\\text{N}$。'
      },
      {
        step: '判断沉浮',
        content: '比较浮力与重力，或比较物体密度与液体密度：$\\rho_{物}<\\rho_{液}$ 上浮，$\\rho_{物}=\\rho_{液}$ 悬浮，$\\rho_{物}>\\rho_{液}$ 下沉。'
      }
    ],
    related: [{ subject: 'geography', keyword: '长江' }]
  },
  {
    id: 'work-power',
    keywords: ['功', '功率', '机械效率', 'W=Fs', 'P=W/t'],
    brief: '功等于力与物体在力的方向上移动距离的乘积 $W=Fs$；功率是做功的快慢 $P=\\frac{W}{t}$。',
    formulas: [
      { latex: 'W = Fs', desc: '功等于力乘以沿力方向的位移' },
      { latex: 'P = \\frac{W}{t}', desc: '功率等于功除以时间，单位瓦特（W）' },
      { latex: 'P = Fv', desc: '功率等于力乘以速度' },
      { latex: '\\eta = \\frac{W_{有用}}{W_{总}} \\times 100\\%', desc: '机械效率等于有用功与总功之比' }
    ],
    structure: [
      '做功的两个必要因素：有力作用在物体上，且物体在力的方向上移动了距离。',
      '有力无距离、有距离无力、力的方向与运动方向垂直，都不做功。',
      '功率表示做功的快慢，功率大不代表做功多。',
      '机械效率总小于 1，因为总有额外功存在。'
    ],
    deepSteps: [
      {
        step: '判断是否做功',
        content: '提水桶水平行走时，提力竖直向上，位移水平，力的方向与位移垂直，提力不做功；只有竖直提起水桶时提力才做功。'
      },
      {
        step: '完整算例',
        content: '用 $F=50\\,\\text{N}$ 的力推物体前进 $s=4\\,\\text{m}$，用时 $t=2\\,\\text{s}$：$W=Fs=200\\,\\text{J}$，$P=\\frac{W}{t}=100\\,\\text{W}$。'
      }
    ]
  }
);

// ---- 扩充物理题库（公式考点）----
PHYSICS_TOPICS.push(
  {
    id: 'density',
    keywords: ['密度', 'ρ=m/V', '密度公式', '质量与体积'],
    brief: '密度是单位体积物质的质量：$\\rho=\\frac{m}{V}$。水的密度为 $1.0\\times10^3\\,\\text{kg/m}^3$，即 $1\\,\\text{g/cm}^3$。',
    formulas: [
      { latex: '\\rho = \\frac{m}{V}', desc: '密度 = 质量 ÷ 体积' },
      { latex: 'm = \\rho V', desc: '求质量：密度乘以体积' },
      { latex: 'V = \\frac{m}{\\rho}', desc: '求体积：质量除以密度' },
      { latex: '1\\,\\text{g/cm}^3 = 1000\\,\\text{kg/m}^3', desc: '密度单位换算' }
    ],
    structure: [
      '密度是物质本身的特性，与物体的质量、体积大小无关，同种物质密度一般相同。',
      '测密度实验：天平测质量 $m$，量筒排水法测体积 $V$，代入 $\\rho=m/V$。',
      '鉴别物质：算出密度对照密度表，可判断物质种类或是否空心。',
      '典型例题：一个金属块质量 540 g、体积 200 cm³，密度 $\\rho=540/200=2.7\\,\\text{g/cm}^3$，对照密度表可知是铝。'
    ]
  },
  {
    id: 'lens-imaging',
    keywords: ['凸透镜', '透镜成像', '焦距', '照相机原理', '放大镜', '投影仪', '物距', '像距'],
    brief: '凸透镜成像规律口诀：一倍焦距分虚实，二倍焦距分大小。$u>2f$ 缩小实像（照相机），$f<u<2f$ 放大实像（投影仪），$u<f$ 放大虚像（放大镜）。',
    formulas: [
      { latex: 'u > 2f', desc: '成倒立、缩小的实像 → 照相机、眼睛' },
      { latex: 'u = 2f', desc: '成倒立、等大的实像（分界点）' },
      { latex: 'f < u < 2f', desc: '成倒立、放大的实像 → 投影仪、幻灯机' },
      { latex: 'u < f', desc: '成正立、放大的虚像 → 放大镜' }
    ],
    structure: [
      '实像由实际光线会聚而成，能呈现在光屏上，都是倒立的；虚像不能用光屏承接，是正立的。',
      '动态规律：成实像时"物近像远像变大"——物距减小，像距增大，像也变大。',
      '实验要点：烛焰、凸透镜、光屏三者中心大致在同一高度，才能使像成在光屏中央。',
      '典型例题：焦距 10 cm 的凸透镜，物体放在 25 cm 处（$u>2f$），光屏上成倒立缩小的实像，是照相机的原理。'
    ]
  },
  {
    id: 'thermal-calorimetry',
    keywords: ['比热容', '热值', '吸热', '放热', 'Q=cmΔt', '热传递', '冷却剂'],
    brief: '物体吸收/放出的热量：$Q=cm\\Delta t$。水的比热容大（$4.2\\times10^3\\,\\text{J/(kg\\cdot℃)}$），所以水常用作冷却剂和取暖介质。',
    formulas: [
      { latex: 'Q_{吸} = cm\\Delta t', desc: '吸热公式：比热容 × 质量 × 升高的温度' },
      { latex: 'Q_{放} = qm', desc: '燃料燃烧放热：热值 × 质量' },
      { latex: 'c_{水} = 4.2\\times10^3\\,\\text{J/(kg\\cdot℃)}', desc: '水的比热容，常见常考常数' }
    ],
    structure: [
      '比热容是物质特性：质量相同、升温相同时，比热容大的吸热多；水比热容大，同条件下升温慢、降温也慢。',
      '典型例题：2 kg 水从 20 ℃ 加热到 70 ℃，$Q_{吸}=cm\\Delta t=4.2\\times10^3\\times2\\times50=4.2\\times10^5\\,\\text{J}$。',
      '解释现象：沿海地区昼夜温差小，是因为海水的比热容大，吸放热时温度变化小。'
    ]
  }
);

// ---- 扩充化学题库 ----
CHEMISTRY_TOPICS.push(
  {
    id: 'mass-conservation',
    keywords: ['质量守恒', '质量守恒定律', '化学反应前后', '原子守恒'],
    brief: '参加化学反应的各物质质量总和，等于反应后生成的各物质质量总和。本质是反应前后原子的种类、数目、质量均不变。',
    equations: [
      { html: '2H<sub>2</sub>O<sub>2</sub> →(MnO<sub>2</sub>) 2H<sub>2</sub>O + O<sub>2</sub>↑', desc: '分解反应，反应前后原子种类和数目不变' },
      { html: 'C + O<sub>2</sub> →(点燃) CO<sub>2</sub>', desc: '1 个碳原子和 1 个氧分子恰好生成 1 个二氧化碳分子' }
    ],
    structure: [
      '化学反应的本质是原子的重新组合，原子本身没有消失也没有创生。',
      '因此反应前后原子的种类不变、数目不变、质量不变，总质量必然守恒。',
      '质量守恒适用于所有化学反应，不能解释物理变化。',
      '书写化学方程式时必须配平，正是质量守恒定律的体现。'
    ],
    deepSteps: [
      {
        step: '为什么守恒',
        content: '化学变化中分子破裂成原子，原子重新组合成新分子。原子的种类、数目、质量在反应前后都没有变化，所以物质总质量不变。'
      },
      {
        step: '常见应用',
        content: '可用于推断未知物质的组成、进行有关质量计算，也可用于解释"镁条燃烧后质量变大"等现象（因为结合了空气中的氧气）。'
      }
    ],
    related: [{ subject: 'physics', keyword: '能量守恒' }]
  },
  {
    id: 'redox',
    keywords: ['氧化还原', '氧化反应', '还原反应', '化合价升降', '电子转移'],
    brief: '有元素化合价升降的化学反应是氧化还原反应，本质是电子的转移（得失或偏移）。',
    equations: [
      { html: 'Fe<sub>2</sub>O<sub>3</sub> + 3CO →(高温) 2Fe + 3CO<sub>2</sub>', desc: '炼铁反应，铁元素化合价降低被还原' },
      { html: '2Na + Cl<sub>2</sub> →(点燃) 2NaCl', desc: '钠失电子被氧化，氯得电子被还原' }
    ],
    structure: [
      '氧化反应：物质失去电子、化合价升高的反应。',
      '还原反应：物质得到电子、化合价降低的反应。',
      '氧化剂得电子被还原，还原剂失电子被氧化。',
      '氧化还原反应中，得失电子总数相等。'
    ],
    deepSteps: [
      {
        step: '从化合价判断',
        content: '标出反应前后各元素化合价，若某元素化合价升高，说明它被氧化；化合价降低，说明它被还原。有升降即氧化还原反应。'
      },
      {
        step: '电子转移的表示',
        content: '在方程式中可用单线桥或双线桥表示电子转移方向和数目，注意得失电子总数必须相等。'
      }
    ],
    related: [{ subject: 'physics', keyword: '欧姆定律' }]
  },
  {
    id: 'chemical-formula',
    keywords: ['化学式', '化合价', '化学式书写', '相对分子质量'],
    brief: '化学式用元素符号表示物质组成，书写时依据化合价代数和为零的原则确定原子个数比。',
    equations: [
      { html: 'H<sub>2</sub>O', desc: '氢为 +1 价、氧为 -2 价，2×(+1)+(-2)=0' },
      { html: 'Al<sub>2</sub>O<sub>3</sub>', desc: '铝为 +3 价、氧为 -2 价，2×(+3)+3×(-2)=0' }
    ],
    structure: [
      '常见化合价：H +1，O -2，Na +1，Mg +2，Al +3，Cl -1。',
      '书写步骤：正价元素在前、负价元素在后，交叉法确定下标，再约简。',
      '单质化学式：金属、稀有气体直接用元素符号，氧气、氢气等写为 O₂、H₂。',
      '相对分子质量等于化学式中各原子相对原子质量之和。'
    ],
    deepSteps: [
      {
        step: '化合价口诀',
        content: '一价氢氯钾钠银，二价氧钙镁钡锌，三铝四硅五价磷，二三铁、二四碳，铜汞二价最常见。'
      },
      {
        step: '完整示例',
        content: '写氧化铝：铝 +3 价、氧 -2 价，交叉得 Al₂O₃；检验 2×(+3)+3×(-2)=0，化合价代数和为零，书写正确。'
      }
    ],
    related: [{ subject: 'math', keyword: '比例' }]
  },
  {
    id: 'solution',
    keywords: ['溶液', '溶解度', '溶质质量分数', '饱和溶液', '结晶'],
    brief: '溶液是溶质溶解在溶剂中形成的均一、稳定的混合物；溶质质量分数 $=\\frac{\\text{溶质质量}}{\\text{溶液质量}}\\times100\\%$。',
    equations: [
      { html: 'NaCl + H<sub>2</sub>O → NaCl 溶液', desc: '氯化钠溶于水形成均一稳定的溶液' },
      { html: 'Ca(OH)<sub>2</sub> 的溶解度随温度升高而减小', desc: '多数固体溶解度随温度升高而增大，氢氧化钙例外' }
    ],
    structure: [
      '溶液由溶质和溶剂组成，水是最常用的溶剂。',
      '饱和溶液是在一定温度下不能再溶解某种溶质的溶液。',
      '溶解度指一定温度下 100 g 溶剂中达到饱和时所溶解的溶质质量。',
      '溶质质量分数 = 溶质质量 ÷ 溶液质量 × 100%（注意分母是溶液质量）。'
    ],
    deepSteps: [
      {
        step: '完整算例',
        content: '将 20 g 食盐溶于 80 g 水中，溶液质量 100 g，溶质质量分数 $=\\frac{20}{100}\\times100\\%=20\\%$。'
      },
      {
        step: '溶解度曲线',
        content: '溶解度曲线可读出某温度下的溶解度，比较不同物质溶解度大小，判断提纯方法：陡升型用降温结晶，平缓型用蒸发结晶。'
      }
    ]
  }
);

// ---- 扩充化学题库（公式考点）----
CHEMISTRY_TOPICS.push(
  {
    id: 'valence',
    keywords: ['化合价', '正负价', '原子团', '化学式书写', '交叉法'],
    brief: '化合价是元素成键时表现的价态。规则：单质为 0；氢 +1、氧 -2；金属通常正价；化合物中正负化合价代数和为 0。',
    formulas: [
      { latex: 'H_2O：H(+1)、O(-2)', desc: '化合物中各元素化合价代数和为零' },
      { latex: 'OH(-1)、NO_3(-1)、SO_4(-2)、CO_3(-2)', desc: '常见原子团的化合价，必须记牢' },
      { latex: 'Al_2O_3：Al(+3)、O(-2)', desc: '交叉法：价数交叉写在对方元素右下角' }
    ],
    structure: [
      '常见口诀：一价钾钠氯氢银，二价氧钙钡镁锌，三铝四硅五价磷，二三铁、二四碳。',
      '书写化学式用"交叉法"：正价元素在前、负价元素在后，把价数的绝对值交叉写到对方右下角，再约简。',
      '检验方法：把写好的化学式里各元素化合价乘以原子个数再相加，等于 0 就写对了。',
      '典型例题：硫酸铝的化学式——Al 为 +3，SO₄ 为 -2，交叉得 $Al_2(SO_4)_3$。'
    ]
  },
  {
    id: 'carbon-dioxide',
    keywords: ['二氧化碳', 'CO2', 'CO₂', '碳酸钙', '石灰水变浑浊', '实验室制取'],
    brief: '二氧化碳：无色无味、密度比空气大、能溶于水、不燃烧也不支持燃烧。检验方法是通入澄清石灰水，变浑浊即含 CO₂。',
    formulas: [
      { latex: 'CO_2 + Ca(OH)_2 = CaCO_3\\downarrow + H_2O', desc: '检验 CO₂：使澄清石灰水变浑浊' },
      { latex: 'CaCO_3 + 2HCl = CaCl_2 + H_2O + CO_2\\uparrow', desc: '实验室制取 CO₂：大理石（石灰石）与稀盐酸反应' },
      { latex: 'C + O_2 \\xrightarrow{\\text{点燃}} CO_2', desc: '碳在氧气中充分燃烧生成 CO₂' }
    ],
    structure: [
      '实验室制法：药品用大理石（或石灰石）和稀盐酸，发生装置"固+液 不加热"，用向上排空气法收集（密度比空气大）。',
      '注意：不能用稀硫酸代替稀盐酸——生成的硫酸钙微溶，会覆盖在大理石表面使反应停止；也不宜用碳酸钠——反应太快难收集。',
      '验满方法：把燃着的木条放在集气瓶口，木条熄灭说明已集满。',
      '用途：灭火、人工降雨（干冰）、气体肥料、制碳酸饮料。'
    ]
  }
);

// ---- 扩充生物题库 ----
BIOLOGY_TOPICS.push(
  {
    id: 'cell-structure',
    keywords: ['细胞', '细胞结构', '细胞膜', '细胞核', '线粒体', '叶绿体'],
    brief: '细胞是生物体结构和功能的基本单位。植物细胞有细胞壁、细胞膜、细胞质、细胞核、液泡、叶绿体和线粒体。',
    places: [
      { name: '细胞壁', x: 50, y: 9, info: '位于最外层，起支持和保护作用，植物细胞特有。' },
      { name: '细胞膜', x: 17, y: 26, info: '控制物质进出，保护细胞内部，所有细胞都有。' },
      { name: '细胞核', x: 50, y: 30, info: '内含遗传物质 DNA，是细胞的控制中心。' },
      { name: '线粒体', x: 83, y: 26, info: '呼吸作用的场所，分解有机物释放能量，被称为细胞的"动力车间"。' },
      { name: '叶绿体', x: 50, y: 50, info: '光合作用的场所，含叶绿素，能把光能转化为化学能，植物细胞特有。' }
    ],
    links: [
      [0, 1, '保护'],
      [1, 2, '控制中心'],
      [1, 3, '供能'],
      [1, 4, '光合作用']
    ],
    structure: [
      '细胞壁：植物细胞特有，主要成分是纤维素，起支持和保护作用。',
      '细胞膜：控制物质进出，保持细胞内部环境稳定。',
      '细胞质：细胞内的液态部分，是许多生命活动进行的场所。',
      '细胞核：含有遗传物质，控制生物的发育和遗传。',
      '线粒体和叶绿体：分别是呼吸作用和光合作用的场所，都是能量转换器。'
    ],
    deepSteps: [
      {
        step: '动植物细胞的区别',
        content: '植物细胞有细胞壁、液泡和叶绿体，动物细胞没有；二者都有细胞膜、细胞质、细胞核和线粒体。'
      },
      {
        step: '结构与功能相适应',
        content: '细胞核有核膜保护遗传物质，线粒体内膜折叠增大面积以提高能量转换效率，结构总是与功能相适应。'
      }
    ],
    related: [
      { subject: 'chemistry', keyword: '化学式' },
      { subject: 'physics', keyword: '能量守恒' }
    ]
  },
  {
    id: 'respiration',
    keywords: ['呼吸作用', '细胞呼吸', '有氧呼吸', '无氧呼吸', '线粒体'],
    brief: '细胞呼吸是有机物在细胞内被氧化分解、释放能量的过程，主要场所是线粒体。',
    places: [
      { name: '有机物', x: 17, y: 14, info: '主要是葡萄糖，为呼吸作用提供原料。' },
      { name: '氧气', x: 83, y: 14, info: '有氧呼吸的原料，参与有机物的彻底氧化分解。' },
      { name: '线粒体', x: 50, y: 32, info: '有氧呼吸的主要场所，把有机物中的化学能释放出来。' },
      { name: '能量', x: 17, y: 50, info: '一部分储存在 ATP 中供生命活动利用，一部分以热能散失。' },
      { name: '二氧化碳和水', x: 83, y: 50, info: '有氧呼吸的产物，通过气孔等排出体外。' }
    ],
    links: [
      [0, 2, '分解'],
      [1, 2, '参与'],
      [2, 3, '释放'],
      [2, 4, '生成']
    ],
    structure: [
      '有氧呼吸：有机物 + 氧气 → 二氧化碳 + 水 + 能量，主要在线粒体中进行。',
      '无氧呼吸：缺氧时有机物分解为酒精和二氧化碳（或乳酸），释放少量能量。',
      '呼吸作用释放的能量一部分用于各项生命活动，一部分以热能形式散失。',
      '呼吸作用与光合作用相互依存：光合作用储存能量，呼吸作用释放能量。'
    ],
    deepSteps: [
      {
        step: '呼吸作用的实质',
        content: '分解有机物、释放能量，为细胞的生命活动提供动力。它与燃烧的本质相似，但反应温和、分步进行、能量逐步释放。'
      },
      {
        step: '与光合作用的区别',
        content: '光合作用在叶绿体中进行，吸收二氧化碳、释放氧气、储存能量；呼吸作用主要在线粒体中进行，吸收氧气、释放二氧化碳、释放能量。二者方向相反、相互依存。'
      }
    ],
    related: [
      { subject: 'chemistry', keyword: '氧化还原' },
      { subject: 'physics', keyword: '功与功率' }
    ]
  },
  {
    id: 'genetics',
    keywords: ['遗传', '变异', 'DNA', '基因', '染色体', '显性', '隐性'],
    brief: '遗传信息储存在 DNA 上，基因是有遗传效应的 DNA 片段，染色体是 DNA 的主要载体。',
    places: [
      { name: '细胞核', x: 50, y: 10, info: '遗传信息库，控制生物的遗传和代谢。' },
      { name: '染色体', x: 50, y: 27, info: '细胞核中易被碱性染料染成深色的物质，主要由 DNA 和蛋白质组成。' },
      { name: 'DNA', x: 30, y: 44, info: '双螺旋结构，是主要的遗传物质，储存遗传信息。' },
      { name: '基因', x: 70, y: 44, info: '有遗传效应的 DNA 片段，控制生物的性状。' },
      { name: '性状', x: 50, y: 58, info: '生物体的形态、结构和生理特征，由基因和环境共同决定。' }
    ],
    links: [
      [0, 1, '含有'],
      [1, 2, '组成'],
      [2, 3, '片段'],
      [3, 4, '控制']
    ],
    structure: [
      '染色体在体细胞中成对存在，生殖细胞中成单存在。',
      '基因有显性和隐性之分，显性基因用大写字母表示，隐性用小写字母表示。',
      '基因型决定表现型，但表现型还受环境因素影响。',
      '变异分为可遗传变异（由遗传物质改变引起）和不可遗传变异（仅由环境引起）。'
    ],
    deepSteps: [
      {
        step: '从 DNA 到性状',
        content: 'DNA 上的基因通过控制蛋白质的合成来控制生物的性状，这一过程称为基因的表达。'
      },
      {
        step: '杂交实验分析',
        content: 'Aa × Aa 的后代基因型比例为 AA : Aa : aa = 1 : 2 : 1，表现型比例为显性 : 隐性 = 3 : 1。'
      }
    ],
    related: [{ subject: 'chemistry', keyword: '化学式' }]
  },
  {
    id: 'ecosystem',
    keywords: ['生态系统', '食物链', '食物网', '生产者', '消费者', '分解者'],
    brief: '生态系统由生物部分和非生物部分组成，生物部分包括生产者、消费者和分解者。',
    places: [
      { name: '生产者', x: 17, y: 14, info: '绿色植物，通过光合作用制造有机物，是生态系统的基础。' },
      { name: '消费者', x: 50, y: 14, info: '动物，直接或间接以植物为食。' },
      { name: '分解者', x: 83, y: 14, info: '细菌和真菌，把动植物遗体分解为无机物，促进物质循环。' },
      { name: '非生物部分', x: 50, y: 32, info: '阳光、空气、水、土壤等，为生物提供物质和能量。' },
      { name: '食物链与食物网', x: 50, y: 50, info: '生物之间通过吃与被吃的关系形成食物链，多条食物链交错构成食物网。' }
    ],
    links: [
      [0, 1, '被食'],
      [1, 2, '遗体'],
      [3, 0, '提供'],
      [0, 4, '构成']
    ],
    structure: [
      '生态系统的组成：非生物部分 + 生产者 + 消费者 + 分解者。',
      '食物链从生产者开始，箭头指向捕食者，不包括分解者和非生物部分。',
      '能量沿食物链单向流动、逐级递减，传递效率约为 10%～20%。',
      '生态系统具有一定的自我调节能力，但这种能力是有限的。'
    ],
    deepSteps: [
      {
        step: '写一条食物链',
        content: '例：草 → 兔 → 狐。起点必须是生产者，箭头表示能量流动方向，不能写成"狐 → 兔 → 草"。'
      },
      {
        step: '能量为什么递减',
        content: '每一营养级的生物都会通过呼吸作用消耗一部分能量，还有一部分未被利用，因此能传递到下一营养级的能量只有约 10%～20%。'
      }
    ],
    related: [
      { subject: 'geography', keyword: '季风' },
      { subject: 'chemistry', keyword: '质量守恒' }
    ]
  }
);

// ---- 扩充英语题库 ----
ENGLISH_TOPICS.push(
  {
    id: 'passive-voice',
    title: '被动语态',
    keywords: ['被动语态', 'be done', '被动', 'is made'],
    brief: '被动语态表示主语是动作的承受者，基本结构为 be + 过去分词。',
    structures: [
      '一般现在时：am/is/are + 过去分词',
      '一般过去时：was/were + 过去分词',
      '一般将来时：will be + 过去分词',
      '情态动词：can/must/should + be + 过去分词'
    ],
    usages: [
      '不知道或不必说明动作的执行者时使用。',
      '强调动作的承受者而非执行者时使用。',
      '科技说明、新闻报道中常使用被动语态，显得客观。'
    ],
    examples: [
      { en: 'The bridge was built in 1990.', zh: '这座桥建于 1990 年。' },
      { en: 'English is spoken all over the world.', zh: '全世界都在说英语。' },
      { en: 'The homework must be finished today.', zh: '作业必须今天完成。' }
    ],
    mistake: '只有及物动词才有被动语态；不及物动词（如 happen、appear）没有被动形式。'
  },
  {
    id: 'attributive-clause',
    title: '定语从句',
    keywords: ['定语从句', '关系代词', 'which', 'who', 'that'],
    brief: '定语从句用来修饰名词或代词，由关系代词（who、which、that、whose）或关系副词引导。',
    structures: [
      '先行词指人：who / that / whom',
      '先行词指物：which / that',
      '表示所属关系：whose',
      '关系副词：when（时间）、where（地点）、why（原因）'
    ],
    usages: [
      '限定性定语从句：紧跟先行词，不能省略，不用逗号隔开。',
      '非限定性定语从句：用逗号隔开，起补充说明作用，不能用 that。',
      '关系代词在从句中作主语时不能省略。'
    ],
    examples: [
      { en: 'The man who is talking to Tom is my uncle.', zh: '正在和汤姆说话的那个人是我叔叔。' },
      { en: 'This is the book that I bought yesterday.', zh: '这就是我昨天买的那本书。' },
      { en: 'I live in a city which has a long history.', zh: '我住在一个历史悠久的城市。' }
    ],
    mistake: '先行词是 all、everything、nothing 等不定代词时，关系代词一般用 that 而不用 which。'
  },
  {
    id: 'simple-past',
    title: '一般过去时',
    keywords: ['一般过去时', '过去式', 'yesterday', 'last week'],
    brief: '一般过去时表示过去某个时间发生的动作或存在的状态，动词用过去式。',
    structures: [
      '肯定：主语 + 动词过去式',
      '否定：主语 + didn’t + 动词原形',
      '疑问：Did + 主语 + 动词原形？'
    ],
    usages: [
      '表示过去某一具体时间发生的动作，常与 yesterday、last week、in 2020 等连用。',
      '表示过去一段时间内经常或反复发生的动作。',
      '叙述过去的故事或经历。'
    ],
    examples: [
      { en: 'I visited my grandparents last weekend.', zh: '我上周末去看望了祖父母。' },
      { en: 'She didn’t go to school yesterday.', zh: '她昨天没去上学。' },
      { en: 'Did you finish your homework?', zh: '你完成作业了吗？' }
    ],
    mistake: 'didn’t 后面必须用动词原形，不能再加过去式；不规则动词的过去式需要单独记忆。'
  }
);

// ---- 扩充历史题库 ----
HISTORY_TOPICS.push(
  {
    id: 'xinhai',
    title: '辛亥革命',
    keywords: ['辛亥革命', '孙中山', '武昌起义', '中华民国'],
    brief: '1911 年武昌起义爆发，推翻清朝统治，结束中国两千多年的君主专制制度。',
    time: '1911 年',
    people: '孙中山、黄兴等',
    measures: [
      '1911 年 10 月 10 日武昌起义爆发，各省纷纷响应。',
      '1912 年 1 月 1 日中华民国临时政府在南京成立，孙中山就任临时大总统。',
      '颁布《中华民国临时约法》，确立主权在民、三权分立等原则。',
      '1912 年 2 月清帝退位，清朝统治结束。'
    ],
    impacts: [
      '推翻了清王朝的反动统治，结束了两千多年的君主专制制度。',
      '建立了亚洲第一个资产阶级共和国，使民主共和观念深入人心。',
      '促进了民族资本主义的发展和社会习俗的变革。',
      '没有改变中国半殖民地半封建的社会性质。'
    ],
    mnemonic: '武昌起义一声枪，千年帝制被推翻'
  },
  {
    id: 'yapian',
    title: '鸦片战争',
    keywords: ['鸦片战争', '林则徐', '虎门销烟', '南京条约'],
    brief: '1840—1842 年英国发动鸦片战争，中国战败签订《南京条约》，开始沦为半殖民地半封建社会。',
    time: '1840—1842 年',
    people: '林则徐、道光帝、英国侵略者',
    measures: [
      '1839 年林则徐虎门销烟，成为英国发动战争的借口。',
      '1840 年英国舰队封锁珠江口，鸦片战争爆发。',
      '1842 年中国战败，被迫签订《南京条约》。',
      '条约规定割香港岛、赔款 2100 万银元、开放五处通商口岸、协定关税。'
    ],
    impacts: [
      '中国开始沦为半殖民地半封建社会，是中国近代史的开端。',
      '中国的领土完整和关税主权遭到破坏。',
      '促使中国社会主要矛盾发生变化，中国人民开始反侵略斗争。'
    ],
    mnemonic: '割地赔款开商埠，协定关税丧主权'
  },
  {
    id: 'gaige',
    title: '改革开放',
    keywords: ['改革开放', '十一届三中全会', '邓小平', '经济特区', '家庭联产承包'],
    brief: '1978 年十一届三中全会作出改革开放的伟大决策，中国进入社会主义现代化建设新时期。',
    time: '1978 年',
    people: '邓小平',
    measures: [
      '1978 年 12 月召开十一届三中全会，重新确立解放思想、实事求是的思想路线。',
      '农村推行家庭联产承包责任制，调动农民生产积极性。',
      '设立深圳等经济特区，作为对外开放的窗口。',
      '逐步建立社会主义市场经济体制。'
    ],
    impacts: [
      '使中国经济迅速发展，综合国力显著增强。',
      '人民生活水平大幅提高，实现了从温饱到总体小康的跨越。',
      '推动了中国的现代化进程，提升了国际地位。'
    ],
    mnemonic: '三中全会定方向，改革开放富起来'
  },
  {
    id: 'sichou',
    title: '丝绸之路',
    keywords: ['丝绸之路', '张骞', '西域', '汉朝', '一带一路'],
    brief: '西汉张骞出使西域，开辟了连接中国与中亚、欧洲的陆上贸易通道，史称丝绸之路。',
    time: '公元前 138 年、公元前 119 年',
    people: '张骞、汉武帝',
    measures: [
      '公元前 138 年张骞第一次出使西域，历时十三年返回。',
      '公元前 119 年张骞第二次出使西域，加强了汉朝与西域的联系。',
      '汉朝设立西域都护，标志新疆地区正式归属中央政权。',
      '中国的丝绸、瓷器等经此运往西方，西方的香料、良种马等传入中国。'
    ],
    impacts: [
      '促进了东西方经济文化交流，是古代最重要的国际商路之一。',
      '推动了沿线地区的繁荣，佛教等文化由此传入中国。',
      '为今天的"一带一路"倡议提供了历史渊源。'
    ],
    mnemonic: '张骞凿空通西域，丝绸西去文化来'
  }
);

// ---- 扩充地理题库 ----
GEO_TOPICS.push(
  {
    id: 'yangtze',
    showMap: true,
    keywords: ['长江', '三峡', '黄金水道', '长江三角洲', '水能'],
    brief: '长江发源于唐古拉山，自西向东流经 11 个省级行政区，注入东海，是我国第一长河。',
    places: [
      { name: '唐古拉山', x: 17, y: 13, info: '长江发源地，位于青藏高原，冰川融水是长江的重要补给。' },
      { name: '三峡', x: 50, y: 13, info: '位于长江上游，落差大、水能资源丰富，建有世界最大的三峡水电站。' },
      { name: '中下游平原', x: 83, y: 13, info: '江面宽阔、水流平缓，是重要的农业区和航运区。' },
      { name: '长江三角洲', x: 35, y: 48, info: '长江入海口，地势低平、河网密布，是我国经济最发达的地区之一。' },
      { name: '东海', x: 76, y: 48, info: '长江最终注入东海，每年携带大量泥沙在入海口沉积形成三角洲。' }
    ],
    links: [
      [0, 1, '自西向东'],
      [1, 2, '水能'],
      [2, 3, '泥沙沉积'],
      [3, 4, '注入东海']
    ],
    structure: [
      '长江发源于青藏高原唐古拉山，全长约 6300 千米，是我国第一长河。',
      '上游落差大、水流急，水能资源丰富，水电站多集中于此。',
      '中游河道弯曲，湖泊众多，荆江河段有"九曲回肠"之称。',
      '下游江阔水深，航运价值高，被誉为"黄金水道"。',
      '长江流域面积广，是我国重要的农业区和工业区。'
    ],
    localInfo: [
      '长江三角洲地势低平、水网密布，是典型的"鱼米之乡"。',
      '长江中下游夏季高温多雨，雨热同期，适宜水稻种植。',
      '长江航运条件优越，干流航道可通达多个省市。',
      '长江流域需注意防洪，中下游是洪涝灾害多发区。'
    ]
  },
  {
    id: 'contour',
    keywords: ['等高线', '等高线地形图', '山峰', '山谷', '山脊', '鞍部', '陡崖'],
    brief: '等高线是把海拔相同的点连接成的线，等高线地形图可以表示地面的高低起伏。',
    places: [
      { name: '山峰', x: 50, y: 12, info: '等高线闭合且数值由中心向四周递减，中心为最高点。' },
      { name: '山脊', x: 17, y: 30, info: '等高线由高处向低处凸出，是分水岭。' },
      { name: '山谷', x: 83, y: 30, info: '等高线由低处向高处凸出，是集水线，易形成河流。' },
      { name: '鞍部', x: 50, y: 46, info: '两个山峰之间的低地，形似马鞍，常是交通要道。' },
      { name: '陡崖', x: 50, y: 58, info: '多条等高线重合处，坡度极陡，常形成瀑布。' }
    ],
    links: [
      [0, 1, '凸出方向'],
      [0, 2, '凸出方向'],
      [1, 3, '相邻'],
      [2, 4, '坡度']
    ],
    structure: [
      '等高线密集处坡度陡，稀疏处坡度缓。',
      '等高线闭合，数值内高外低为山峰，内低外高为盆地。',
      '等高线向高处凸出为山谷（集水线），向低处凸出为山脊（分水岭）。',
      '多条等高线重合处为陡崖，适合攀岩但要注意安全。',
      '两个山顶之间的低地为鞍部，常是修建公路、铁路的通道。'
    ],
    localInfo: [
      '修建水库大坝一般选在峡谷处，工程量小、蓄水量大。',
      '引水路线应尽量沿等高线修建，减少工程量。',
      '登山路线宜选择等高线稀疏处，坡度较缓、省力。',
      '山区公路常呈"之"字形盘旋而上，以降低坡度。'
    ]
  },
  {
    id: 'plate',
    showMap: true,
    keywords: ['板块运动', '板块构造', '地震带', '火山', '喜马拉雅山', '海沟'],
    brief: '地球的岩石圈由六大板块组成，板块运动引起地壳变动，形成山脉、海沟和地震火山带。',
    places: [
      { name: '亚欧板块', x: 50, y: 12, info: '面积最大的板块之一，与印度洋板块碰撞形成喜马拉雅山脉。' },
      { name: '印度洋板块', x: 17, y: 30, info: '向北挤压亚欧板块，使青藏高原不断抬升。' },
      { name: '太平洋板块', x: 83, y: 30, info: '向亚欧板块俯冲，形成日本海沟和岛弧。' },
      { name: '非洲板块', x: 50, y: 48, info: '与亚欧板块碰撞形成阿尔卑斯山脉。' },
      { name: '环太平洋地震带', x: 50, y: 60, info: '全球地震和火山活动最集中的地带，呈环状分布在太平洋周围。' }
    ],
    links: [
      [1, 0, '碰撞挤压'],
      [2, 0, '俯冲'],
      [3, 0, '碰撞'],
      [2, 4, '形成']
    ],
    structure: [
      '全球岩石圈分为六大板块：亚欧、非洲、印度洋、太平洋、美洲、南极洲板块。',
      '板块内部地壳比较稳定，板块交界处地壳活动活跃。',
      '板块碰撞挤压常形成高大山脉和海沟，如喜马拉雅山脉、马里亚纳海沟。',
      '板块张裂常形成裂谷和海洋，如东非大裂谷、红海。',
      '世界两大火山地震带：环太平洋火山地震带和地中海—喜马拉雅火山地震带。'
    ],
    localInfo: [
      '我国西南地区位于地中海—喜马拉雅地震带上，地震多发。',
      '喜马拉雅山脉由印度洋板块与亚欧板块碰撞挤压形成，至今仍在升高。',
      '台湾地处板块交界处，地震和火山活动频繁。',
      '板块运动是海陆变迁、山脉形成和地震发生的根本原因。'
    ]
  },
  {
    id: 'three-steps',
    showMap: true,
    keywords: ['三级阶梯', '中国地形', '青藏高原', '内蒙古高原', '华北平原', '西高东低'],
    brief: '我国地势西高东低，呈三级阶梯分布，对气候、河流和交通都有重要影响。',
    places: [
      { name: '第一级阶梯', x: 17, y: 14, info: '青藏高原，平均海拔 4000 米以上，被称为"世界屋脊"。' },
      { name: '第二级阶梯', x: 50, y: 14, info: '内蒙古高原、黄土高原、云贵高原和塔里木盆地等，海拔 1000—2000 米。' },
      { name: '第三级阶梯', x: 83, y: 14, info: '东北平原、华北平原、长江中下游平原，海拔多在 500 米以下。' },
      { name: '分界线一', x: 35, y: 40, info: '昆仑山—祁连山—横断山，是第一、二级阶梯的分界线。' },
      { name: '分界线二', x: 70, y: 40, info: '大兴安岭—太行山—巫山—雪峰山，是第二、三级阶梯的分界线。' }
    ],
    links: [
      [0, 3, '分界'],
      [3, 1, '过渡'],
      [1, 4, '分界'],
      [4, 2, '过渡']
    ],
    structure: [
      '第一级阶梯以青藏高原为主体，平均海拔 4000 米以上。',
      '第二级阶梯包括三大高原和三大盆地，海拔 1000—2000 米。',
      '第三级阶梯以平原和丘陵为主，海拔多在 500 米以下。',
      '西高东低的地势使河流自西向东流，沟通东西交通。',
      '阶梯交界处落差大，水能资源丰富，适合建水电站。'
    ],
    localInfo: [
      '西高东低有利于海洋湿润气流深入内陆，带来降水。',
      '地势阶梯交界处河流落差大，水能丰富，如三峡水电站。',
      '平原地区地势平坦、土壤肥沃，适宜发展农业和交通。',
      '青藏高原海拔高、气温低，形成独特的高原气候和高寒牧业。'
    ]
  }
);

/* ---------- 第二批：更精简的批量题库 ---------- */

MATH_PROBLEMS.push(
  {
    id: 'linear-equation',
    question: ['一元一次方程', '移项', '解方程', '去分母'],
    brief: '只含一个未知数、且未知数的次数是 1 的整式方程叫一元一次方程，一般形式为 $ax+b=0\\ (a\\ne0)$。',
    formulas: [{ latex: 'ax + b = 0 \\Rightarrow x = -\\frac{b}{a}', desc: '一元一次方程的一般解法' }],
    deepSteps: [
      { step: '解题五步', content: '去分母 → 去括号 → 移项 → 合并同类项 → 系数化为 1。移项时一定要改变符号。' },
      { step: '完整算例', content: '解 $2x+3=11$：移项得 $2x=8$，系数化为 1 得 $x=4$。代回检验：$2\\times4+3=11$，成立。' }
    ],
    related: [{ subject: 'physics', keyword: '欧姆定律' }]
  },
  {
    id: 'similar-triangles',
    question: ['相似三角形', '相似比', '对应边成比例', '相似判定'],
    brief: '对应角相等、对应边成比例的两个三角形叫做相似三角形，相似三角形对应边的比叫相似比。',
    formulas: [
      { latex: '\\frac{AB}{A\'B\'} = \\frac{BC}{B\'C\'} = \\frac{AC}{A\'C\'} = k', desc: '$k$ 为相似比' },
      { latex: '\\frac{S_1}{S_2} = k^2', desc: '相似三角形面积比等于相似比的平方' }
    ],
    deepSteps: [
      { step: '三个判定方法', content: '两角分别相等；两边成比例且夹角相等；三边成比例。三种方法都能判定两个三角形相似。' },
      { step: '常见应用', content: '测量旗杆高度、金字塔高度等无法直接测量的物体时，利用相似三角形对应边成比例求解。' }
    ],
    related: [{ subject: 'geography', keyword: '等高线' }]
  },
  {
    id: 'square-formulas',
    question: ['平方差公式', '完全平方公式', '因式分解', '乘法公式'],
    brief: '平方差公式 $a^2-b^2=(a+b)(a-b)$；完全平方公式 $(a\\pm b)^2=a^2\\pm2ab+b^2$。',
    formulas: [
      { latex: 'a^2 - b^2 = (a+b)(a-b)', desc: '平方差公式' },
      { latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2', desc: '完全平方公式' }
    ],
    deepSteps: [
      { step: '识别公式结构', content: '平方差：两项相减且都能写成平方；完全平方：三项式，首尾是平方项，中间是首尾乘积的 2 倍。' },
      { step: '完整算例', content: '$99^2=(100-1)^2=10000-200+1=9801$，用完全平方公式比直接计算更快。' }
    ]
  },
  {
    id: 'statistics',
    question: ['平均数', '中位数', '众数', '方差', '统计'],
    brief: '平均数反映总体水平，中位数反映中间位置，众数反映出现最多的数据，方差反映数据的波动大小。',
    formulas: [
      { latex: '\\bar{x} = \\frac{x_1+x_2+\\cdots+x_n}{n}', desc: '算术平均数' },
      { latex: 's^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\bar{x})^2', desc: '方差，方差越小数据越稳定' }
    ],
    deepSteps: [
      { step: '三个"数"的区别', content: '平均数受极端值影响大；中位数只看位置，不受极端值影响；众数可能不唯一，也可能不存在。' },
      { step: '完整算例', content: '数据 2、3、3、6 的平均数是 3.5，中位数是 3，众数是 3；说明这组数据整体水平约 3.5。' }
    ]
  },
  {
    id: 'inequality',
    question: ['一元一次不等式', '不等式', '解集', '数轴表示'],
    brief: '含一个未知数且未知数次数为 1 的不等式叫一元一次不等式，解集可以在数轴上表示。',
    formulas: [
      { latex: 'ax + b > 0 \\ (a > 0) \\Rightarrow x > -\\frac{b}{a}', desc: '一元一次不等式的解法' },
      { latex: 'a<b \\Rightarrow a+c < b+c', desc: '不等式两边同加同一个数，不等号方向不变' }
    ],
    deepSteps: [
      { step: '关键性质', content: '不等式两边同乘或同除以一个负数时，不等号方向必须改变，这是最常见的失分点。' },
      { step: '完整算例', content: '解 $-2x+1>5$：移项得 $-2x>4$，两边同除以 $-2$ 并变号，得 $x<-2$。' }
    ]
  }
);

PHYSICS_TOPICS.push(
  {
    id: 'pressure',
    keywords: ['压强', '压力', 'P=F/S', '液体压强', '大气压'],
    brief: '压强是物体单位面积上受到的压力，$p=\\frac{F}{S}$；液体压强随深度增加而增大，$p=\\rho gh$。',
    formulas: [
      { latex: 'p = \\frac{F}{S}', desc: '压强等于压力除以受力面积，单位帕斯卡（Pa）' },
      { latex: 'p = \\rho gh', desc: '液体内部压强与液体密度和深度有关' }
    ],
    structure: [
      '压力垂直作用在物体表面上，方向垂直于受力面。',
      '受力面积越小、压力越大，压强越大。',
      '液体内部向各个方向都有压强，同一深度处各方向压强相等。',
      '大气压强随海拔升高而减小，标准大气压约为 $1.01\\times10^5\\,\\text{Pa}$。'
    ],
    deepSteps: [
      { step: '增大或减小压强', content: '刀刃磨薄、图钉尖细是减小受力面积增大压强；书包宽肩带、坦克履带是增大受力面积减小压强。' },
      { step: '完整算例', content: '重 $500\\,\\text{N}$ 的人双脚站立，受力面积 $0.04\\,\\text{m}^2$，压强 $p=\\frac{500}{0.04}=12500\\,\\text{Pa}$。' }
    ],
    related: [{ subject: 'geography', keyword: '长江' }]
  },
  {
    id: 'reflection',
    keywords: ['光的反射', '光的折射', '反射定律', '平面镜', '折射规律'],
    brief: '光遇到物体表面会反射，反射角等于入射角；光从一种介质斜射入另一种介质时会发生折射。',
    formulas: [
      { latex: '\\angle i = \\angle r', desc: '反射定律：反射角等于入射角' },
      { latex: 'n = \\frac{\\sin i}{\\sin r}', desc: '折射定律，$n$ 为折射率' }
    ],
    structure: [
      '反射定律：反射光线、入射光线和法线在同一平面内，反射光线与入射光线分居法线两侧，反射角等于入射角。',
      '平面镜成的是等大的虚像，像与物关于镜面对称。',
      '光从空气斜射入水中时，折射光线向法线偏折，折射角小于入射角。',
      '光垂直入射时传播方向不变，折射角等于入射角，都等于 0°。'
    ],
    deepSteps: [
      { step: '作图要领', content: '先作法线（虚线），标出入射角和反射角，注意角是光线与法线的夹角，不是与镜面的夹角。' },
      { step: '生活现象', content: '水中的筷子看起来"折断"是折射；平静水面倒映景物是反射；海市蜃楼是光的折射。' }
    ]
  },
  {
    id: 'electric-power',
    keywords: ['电功率', '电能', 'P=UI', '千瓦时', '额定功率'],
    brief: '电功率表示电流做功的快慢，$P=UI$；电功 $W=Pt$，生活中常用千瓦时（度）作单位。',
    formulas: [
      { latex: 'P = UI', desc: '电功率等于电压乘电流' },
      { latex: 'P = \\frac{U^2}{R} = I^2R', desc: '纯电阻电路中电功率的其他形式' },
      { latex: 'W = Pt', desc: '电功等于电功率乘时间' }
    ],
    structure: [
      '额定电压是用电器正常工作的电压，额定功率是额定电压下的功率。',
      '实际电压低于额定电压时，实际功率小于额定功率。',
      '$1\\,\\text{kW}\\cdot\\text{h}=3.6\\times10^6\\,\\text{J}$，即平时说的 1 度电。',
      '电能表测量用电器消耗的电能，读数单位是千瓦时。'
    ],
    deepSteps: [
      { step: '完整算例', content: '一个"220V 100W"的灯泡正常工作时，电流 $I=\\frac{P}{U}=\\frac{100}{220}\\approx0.45\\,\\text{A}$，电阻 $R=\\frac{U^2}{P}=484\\,\\Omega$。' },
      { step: '安全用电', content: '总功率过大或用电器短路会导致电流过大，保险丝熔断或空气开关跳闸，起到保护作用。' }
    ],
    related: [{ subject: 'math', keyword: '一次函数' }]
  },
  {
    id: 'lever',
    keywords: ['杠杆', '杠杆平衡', '力臂', '省力杠杆', '滑轮'],
    brief: '杠杆在动力和阻力作用下保持平衡时，满足 $F_1L_1=F_2L_2$，其中力臂是支点到力的作用线的距离。',
    formulas: [
      { latex: 'F_1L_1 = F_2L_2', desc: '杠杆平衡条件：动力×动力臂=阻力×阻力臂' }
    ],
    structure: [
      '杠杆的五要素：支点、动力、动力臂、阻力、阻力臂。',
      '动力臂大于阻力臂是省力杠杆，省力但费距离，如撬棍、羊角锤。',
      '动力臂小于阻力臂是费力杠杆，费力但省距离，如钓鱼竿、镊子。',
      '定滑轮不省力但能改变力的方向，动滑轮省一半力但不能改变方向。'
    ],
    deepSteps: [
      { step: '画力臂', content: '先找支点，再画力的作用线（可延长），从支点向力的作用线作垂线，垂线段长度就是力臂。' },
      { step: '完整算例', content: '撬棍动力臂 $1.2\\,\\text{m}$，阻力臂 $0.2\\,\\text{m}$，阻力 $600\\,\\text{N}$，则动力 $F_1=\\frac{600\\times0.2}{1.2}=100\\,\\text{N}$。' }
    ]
  }
);

CHEMISTRY_TOPICS.push(
  {
    id: 'acid-base-salt',
    keywords: ['酸碱盐', '中和反应', '复分解反应', 'pH', '指示剂'],
    brief: '酸与碱作用生成盐和水的反应叫中和反应；复分解反应是两种化合物互相交换成分生成另外两种化合物。',
    equations: [
      { html: 'HCl + NaOH → NaCl + H<sub>2</sub>O', desc: '盐酸与氢氧化钠发生中和反应' },
      { html: 'Na<sub>2</sub>CO<sub>3</sub> + 2HCl → 2NaCl + H<sub>2</sub>O + CO<sub>2</sub>↑', desc: '碳酸盐与酸反应生成二氧化碳' }
    ],
    structure: [
      '酸能使紫色石蕊溶液变红，碱能使紫色石蕊变蓝，酚酞遇碱变红。',
      'pH < 7 显酸性，pH = 7 显中性，pH > 7 显碱性。',
      '中和反应在生活中有广泛应用：改良酸性土壤、治疗胃酸过多等。',
      '复分解反应发生的条件：生成沉淀、气体或水。'
    ],
    deepSteps: [
      { step: '判断反应类型', content: '两种化合物互相交换成分，生成另外两种化合物，且生成物中有沉淀、气体或水，就是复分解反应。' },
      { step: '完整算例', content: '用 $20\\,\\text{g}$ 氢氧化钠溶液恰好中和 $20\\,\\text{g}$ 稀盐酸，反应后溶液呈中性，pH = 7。' }
    ],
    related: [{ subject: 'biology', keyword: '呼吸作用' }]
  },
  {
    id: 'metal-activity',
    keywords: ['金属活动性', '金属活动性顺序', '置换反应', '金属与酸'],
    brief: '金属活动性顺序：钾钙钠镁铝、锌铁锡铅氢、铜汞银铂金。排在氢前的金属能置换出酸中的氢。',
    equations: [
      { html: 'Zn + 2HCl → ZnCl<sub>2</sub> + H<sub>2</sub>↑', desc: '锌排在氢前，能与稀盐酸反应放出氢气' },
      { html: 'Fe + CuSO<sub>4</sub> → FeSO<sub>4</sub> + Cu', desc: '铁比铜活泼，能把铜从其盐溶液中置换出来' }
    ],
    structure: [
      '排在氢前面的金属能与稀盐酸、稀硫酸反应放出氢气。',
      '排在前面的金属能把排在后面的金属从其盐溶液中置换出来。',
      '钾、钙、钠非常活泼，会先与水反应，不能直接置换盐溶液中的金属。',
      '置换反应是一种单质和一种化合物反应生成另一种单质和另一种化合物。'
    ],
    deepSteps: [
      { step: '判断能否反应', content: '先看金属是否在氢前（与酸反应），再看金属是否比盐溶液中的金属活泼（金属间置换）。' },
      { step: '完整算例', content: '把铁片放入硫酸铜溶液，铁片表面覆盖红色物质，溶液由蓝色逐渐变为浅绿色，说明铁比铜活泼。' }
    ]
  },
  {
    id: 'oxygen',
    keywords: ['氧气', '空气', '燃烧', '燃烧条件', '灭火'],
    brief: '空气主要成分按体积计约氮气 78%、氧气 21%；燃烧需要可燃物、氧气和温度达到着火点三个条件。',
    equations: [
      { html: 'C + O<sub>2</sub> →(点燃) CO<sub>2</sub>', desc: '碳在氧气中充分燃烧' },
      { html: '4P + 5O<sub>2</sub> →(点燃) 2P<sub>2</sub>O<sub>5</sub>', desc: '红磷燃烧产生大量白烟，可用于测定空气中氧气含量' }
    ],
    structure: [
      '空气是混合物，按体积分数：氮气约 78%，氧气约 21%，稀有气体约 0.94%，二氧化碳约 0.03%。',
      '氧气能支持燃烧，本身不能燃烧，具有氧化性。',
      '燃烧的三个条件必须同时满足，缺一不可。',
      '灭火原理：清除可燃物、隔绝氧气、降低温度到着火点以下。'
    ],
    deepSteps: [
      { step: '测定空气中氧气含量', content: '用红磷在密闭容器中燃烧，消耗氧气，冷却后打开止水夹，进入瓶中的水约占瓶容积的 1/5，说明氧气约占空气体积的 1/5。' },
      { step: '燃烧与缓慢氧化', content: '燃烧是剧烈的发光发热的氧化反应；铁生锈、食物腐败是缓慢氧化，也会放热但不易察觉。' }
    ],
    related: [{ subject: 'biology', keyword: '呼吸作用' }]
  }
);

BIOLOGY_TOPICS.push(
  {
    id: 'digestion',
    keywords: ['消化', '消化系统', '消化腺', '吸收', '小肠'],
    brief: '人体消化系统由消化道和消化腺组成，小肠是消化和吸收的主要场所。',
    places: [
      { name: '口腔', x: 17, y: 12, info: '牙齿咀嚼、舌搅拌，唾液淀粉酶把淀粉初步分解为麦芽糖。' },
      { name: '胃', x: 50, y: 12, info: '暂时储存食物，胃液中的胃蛋白酶初步消化蛋白质。' },
      { name: '小肠', x: 83, y: 12, info: '消化和吸收的主要场所，内有肠液、胰液和胆汁。' },
      { name: '肝脏', x: 50, y: 34, info: '分泌胆汁，胆汁不含消化酶，但能乳化脂肪。' },
      { name: '大肠', x: 50, y: 52, info: '吸收少量水分和无机盐，形成粪便。' }
    ],
    links: [
      [0, 1, '食物下行'],
      [1, 2, '进入小肠'],
      [3, 2, '胆汁乳化脂肪'],
      [2, 4, '残渣']
    ],
    structure: [
      '消化道：口腔 → 咽 → 食道 → 胃 → 小肠 → 大肠 → 肛门。',
      '消化腺：唾液腺、胃腺、肝脏、胰腺、肠腺。',
      '淀粉最终分解为葡萄糖，蛋白质分解为氨基酸，脂肪分解为甘油和脂肪酸。',
      '小肠很长、内表面积大、有丰富的毛细血管，利于消化和吸收。'
    ],
    deepSteps: [
      { step: '三类营养物质的消化', content: '淀粉从口腔开始消化，蛋白质从胃开始消化，脂肪从小肠开始消化，最终都在小肠被彻底分解。' },
      { step: '为什么小肠是主场所', content: '小肠长约 5～6 米，内壁有环形皱襞和小肠绒毛，大大增加消化吸收面积，且消化液种类最多。' }
    ],
    related: [{ subject: 'chemistry', keyword: '溶液' }]
  },
  {
    id: 'immunity',
    keywords: ['免疫', '抗原', '抗体', '疫苗', '传染病'],
    brief: '免疫是人体识别和排除抗原性异物的功能；疫苗能刺激人体产生抗体，获得特异性免疫。',
    places: [
      { name: '病原体', x: 17, y: 14, info: '引起传染病的细菌、病毒等微生物。' },
      { name: '抗原', x: 50, y: 14, info: '能引起人体产生抗体的物质，如病原体、疫苗。' },
      { name: '淋巴细胞', x: 83, y: 14, info: '产生抗体，参与特异性免疫。' },
      { name: '抗体', x: 50, y: 34, info: '与特定抗原结合，帮助清除病原体。' },
      { name: '免疫记忆', x: 50, y: 52, info: '再次接触同一抗原时能迅速产生大量抗体，这就是疫苗的原理。' }
    ],
    links: [
      [0, 1, '含有'],
      [1, 2, '刺激'],
      [2, 3, '产生'],
      [3, 4, '形成']
    ],
    structure: [
      '非特异性免疫：人生来就有，对多种病原体起作用，如皮肤和黏膜的屏障作用。',
      '特异性免疫：后天获得，只对特定病原体起作用，包括体液免疫和细胞免疫。',
      '传染病的三个环节：传染源、传播途径、易感人群。',
      '预防传染病：控制传染源、切断传播途径、保护易感人群。'
    ],
    deepSteps: [
      { step: '疫苗为什么有效', content: '疫苗通常是灭活或减毒的病原体，进入人体后刺激淋巴细胞产生抗体和记忆细胞，但不致病。' },
      { step: '区分两种免疫', content: '皮肤阻挡细菌是非特异性免疫；接种疫苗后产生抗体是特异性免疫。前者天生就有，后者后天获得。' }
    ]
  },
  {
    id: 'biodiversity',
    keywords: ['生物圈', '生物多样性', '生态系统多样性', '保护生物'],
    brief: '生物圈是地球上所有生物及其生存环境的总和，生物多样性包括物种、基因和生态系统三个层次。',
    places: [
      { name: '生物圈', x: 50, y: 10, info: '地球上所有生物与其环境的总和，是最大的生态系统。' },
      { name: '物种多样性', x: 17, y: 32, info: '生物种类的丰富程度，是生物多样性最直观的体现。' },
      { name: '基因多样性', x: 83, y: 32, info: '同一物种内不同个体之间的遗传差异，是物种进化的基础。' },
      { name: '生态系统多样性', x: 50, y: 52, info: '森林、草原、湿地、海洋等不同类型生态系统的多样程度。' }
    ],
    links: [
      [0, 1, '包含'],
      [0, 2, '包含'],
      [0, 3, '包含']
    ],
    structure: [
      '生物圈包括大气圈的底部、水圈的大部和岩石圈的表面。',
      '生物多样性包括物种多样性、基因多样性和生态系统多样性。',
      '保护生物多样性的根本措施是保护生物的栖息环境，保护生态系统的多样性。',
      '建立自然保护区是最有效的保护措施。'
    ],
    deepSteps: [
      { step: '三个层次的关系', content: '基因多样性是物种多样性的基础，物种多样性构成生态系统多样性，三者层层递进。' },
      { step: '保护措施', content: '就地保护（建立自然保护区）为主，迁地保护（动物园、植物园）为辅，同时加强法律和宣传教育。' }
    ],
    related: [{ subject: 'geography', keyword: '中国气候' }]
  }
);

ENGLISH_TOPICS.push(
  {
    id: 'present-continuous',
    title: '现在进行时',
    keywords: ['现在进行时', 'be doing', '正在进行'],
    brief: '现在进行时表示此刻正在进行的动作，结构为 am/is/are + 动词的现在分词。',
    structures: ['肯定：主语 + am/is/are + doing', '否定：主语 + am/is/are + not + doing', '疑问：Am/Is/Are + 主语 + doing?'],
    usages: ['表示说话时正在发生的动作。', '表示现阶段正在进行但说话时不一定正在发生的动作。', '常与 now、at the moment、look、listen 等连用。'],
    examples: [
      { en: 'Look! The children are playing football.', zh: '看！孩子们正在踢足球。' },
      { en: 'She is reading a book now.', zh: '她现在正在读书。' },
      { en: 'They are not sleeping.', zh: '他们没有在睡觉。' }
    ],
    mistake: '表示状态、感觉的动词（如 like、know、want）一般不用现在进行时。'
  },
  {
    id: 'modal-verbs',
    title: '情态动词',
    keywords: ['情态动词', 'can', 'must', 'should', 'may'],
    brief: '情态动词表示能力、许可、义务、推测等语气，后面必须接动词原形。',
    structures: ['can / could：能力、许可', 'must：必须（主观）', 'have to：不得不（客观）', 'should：应该', 'may / might：可能、许可'],
    usages: ['表示能力：I can swim.', '表示许可：May I come in?', '表示义务：You must finish it.', '表示推测：It may rain.'],
    examples: [
      { en: 'You should do more exercise.', zh: '你应该多锻炼。' },
      { en: 'He can speak three languages.', zh: '他会说三种语言。' },
      { en: 'It must be Tom’s bag.', zh: '这一定是汤姆的包。' }
    ],
    mistake: '情态动词没有人称和数的变化，后面直接跟动词原形，不能加 to（have to 除外）。'
  },
  {
    id: 'comparatives',
    title: '比较级与最高级',
    keywords: ['比较级', '最高级', 'than', 'the most'],
    brief: '比较级用于两者比较，常用 than 连接；最高级用于三者及以上比较，前面常加 the。',
    structures: ['单音节词：加 -er / -est', '多音节词：more / most + 原级', '不规则变化：good→better→best，bad→worse→worst'],
    usages: ['A is + 比较级 + than B：A 比 B 更……', 'A is the + 最高级 + of/in...：A 在……中最……', '比较级前可用 much、a lot、even 修饰。'],
    examples: [
      { en: 'Tom is taller than Jim.', zh: '汤姆比吉姆高。' },
      { en: 'This is the most interesting book I have ever read.', zh: '这是我读过的最有趣的书。' },
      { en: 'He runs much faster than me.', zh: '他跑得比我快得多。' }
    ],
    mistake: '比较级不能与 very 连用，要用 much / far / even；最高级前通常要加 the。'
  },
  {
    id: 'object-clause',
    title: '宾语从句',
    keywords: ['宾语从句', 'that', 'if', 'whether', '陈述语序'],
    brief: '宾语从句在句中作宾语，由 that、if/whether 或疑问词引导，从句必须用陈述语序。',
    structures: ['that 引导陈述句：I think (that) he is right.', 'if / whether 引导一般疑问句：I wonder if he will come.', '疑问词引导特殊疑问句：Do you know where he lives?'],
    usages: ['主句是现在时，从句时态根据实际情况选择。', '主句是过去时，从句通常用相应的过去时态。', '客观真理永远用一般现在时。'],
    examples: [
      { en: 'I don’t know whether he will come.', zh: '我不知道他是否会来。' },
      { en: 'Could you tell me where the station is?', zh: '你能告诉我车站在哪里吗？' },
      { en: 'The teacher said that the earth goes around the sun.', zh: '老师说地球绕着太阳转。' }
    ],
    mistake: '宾语从句必须用陈述语序，不能写成 "Do you know where is he?"'
  }
);

HISTORY_TOPICS.push(
  {
    id: 'tang-flourish',
    title: '唐朝盛世',
    keywords: ['唐朝', '贞观之治', '开元盛世', '唐太宗', '唐玄宗'],
    brief: '唐朝前期政治清明、经济繁荣、文化昌盛，出现"贞观之治"和"开元盛世"的繁荣局面。',
    time: '618—907 年',
    people: '唐太宗李世民、武则天、唐玄宗李隆基',
    measures: [
      '唐太宗吸取隋亡教训，轻徭薄赋，虚心纳谏，任用贤才。',
      '完善三省六部制，加强中央集权。',
      '武则天时期社会经济继续发展，为开元盛世奠定基础。',
      '唐玄宗前期任用姚崇、宋璟为相，整顿吏治，发展生产。'
    ],
    impacts: [
      '社会经济高度繁荣，国力强盛，出现"贞观之治""开元盛世"。',
      '民族关系和睦，对外交往频繁，玄奘西行、鉴真东渡影响深远。',
      '诗歌、书法、绘画等文化成就辉煌，形成开放包容的大唐气象。'
    ],
    mnemonic: '贞观开元两盛世，开放包容大唐风'
  },
  {
    id: 'anti-japanese',
    title: '抗日战争',
    keywords: ['抗日战争', '九一八事变', '七七事变', '南京大屠杀', '抗战胜利'],
    brief: '1931 年九一八事变后中国开始局部抗战，1937 年七七事变后进入全民族抗战，1945 年取得胜利。',
    time: '1931—1945 年',
    people: '杨靖宇、张自忠、彭德怀等',
    measures: [
      '1931 年九一八事变，日本侵占东北，中国人民开始局部抗战。',
      '1936 年西安事变和平解决，抗日民族统一战线初步形成。',
      '1937 年七七事变，全民族抗战爆发。',
      '平型关大捷、台儿庄战役、百团大战等重要战役打击日军。'
    ],
    impacts: [
      '是近代以来中国反抗外敌入侵第一次取得完全胜利的民族解放战争。',
      '洗雪了近代以来的民族耻辱，提高了中国的国际地位。',
      '为世界反法西斯战争的胜利作出了重大贡献。'
    ],
    mnemonic: '九一八起七七战，八年浴血终胜利'
  },
  {
    id: 'new-china',
    title: '新中国成立',
    keywords: ['新中国成立', '开国大典', '1949', '中华人民共和国'],
    brief: '1949 年 10 月 1 日，开国大典在北京天安门广场举行，中华人民共和国中央人民政府成立。',
    time: '1949 年 10 月 1 日',
    people: '毛泽东、周恩来、朱德等',
    measures: [
      '1949 年 9 月，中国人民政治协商会议第一届全体会议召开，通过《共同纲领》。',
      '1949 年 10 月 1 日，开国大典举行，毛泽东宣告中华人民共和国成立。',
      '1950—1952 年进行土地改革，废除封建土地制度。',
      '1953 年开始实施第一个五年计划，进行社会主义工业化建设。'
    ],
    impacts: [
      '结束了中国半殖民地半封建社会的历史，中国人民从此站起来了。',
      '开创了中国历史的新纪元，为社会主义现代化建设奠定基础。',
      '极大鼓舞了世界被压迫民族和被压迫人民争取解放的斗争。'
    ],
    mnemonic: '开国大典惊世界，中国人民站起来'
  },
  {
    id: 'zhenghe',
    title: '郑和下西洋',
    keywords: ['郑和下西洋', '明成祖', '宝船', '海上丝绸之路'],
    brief: '1405—1433 年，郑和七次下西洋，最远到达非洲东海岸和红海沿岸，是世界航海史上的壮举。',
    time: '1405—1433 年',
    people: '郑和、明成祖朱棣',
    measures: [
      '1405 年郑和率船队从刘家港出发，开始第一次下西洋。',
      '前后共七次远航，规模宏大，船队最多达 200 多艘、两万多人。',
      '到达亚非三十多个国家和地区，最远抵达非洲东海岸和红海沿岸。',
      '以和平友好的方式开展贸易和文化交流，赠送礼物、互市贸易。'
    ],
    impacts: [
      '加强了中国与亚非各国的友好往来和经济文化交流。',
      '是世界航海史上的空前壮举，比欧洲航海家的远航早半个多世纪。',
      '传播了中华文明，促进了海上丝绸之路的繁荣。'
    ],
    mnemonic: '七下西洋到非洲，和平友好扬国威'
  }
);

GEO_TOPICS.push(
  {
    id: 'china-climate',
    showMap: true,
    keywords: ['中国气候', '季风气候', '温度带', '干湿地区', '雨热同期'],
    brief: '我国气候复杂多样，季风气候显著，雨热同期，有利于农业生产。',
    places: [
      { name: '温带季风气候', x: 50, y: 12, info: '主要分布在秦岭—淮河以北，冬季寒冷干燥，夏季高温多雨。' },
      { name: '亚热带季风气候', x: 17, y: 32, info: '主要分布在秦岭—淮河以南，冬季温和少雨，夏季高温多雨。' },
      { name: '热带季风气候', x: 83, y: 32, info: '主要分布在海南、云南南部，全年高温，分旱雨两季。' },
      { name: '温带大陆性气候', x: 35, y: 50, info: '主要分布在西北内陆，冬冷夏热，降水稀少，气温年较差大。' },
      { name: '高原山地气候', x: 70, y: 50, info: '主要分布在青藏高原，气温低，昼夜温差大，空气稀薄。' }
    ],
    links: [
      [0, 1, '秦岭—淮河'],
      [1, 2, '纬度降低'],
      [0, 3, '向内陆'],
      [3, 4, '海拔升高']
    ],
    structure: [
      '我国气候类型复杂多样，主要有温带季风、亚热带季风、热带季风、温带大陆性和高原山地气候。',
      '季风气候显著，夏季盛行来自海洋的偏南风，冬季盛行来自内陆的偏北风。',
      '雨热同期是我国季风气候的显著特点，有利于农作物生长。',
      '秦岭—淮河一线是我国重要的地理分界线，与 1 月 0℃ 等温线、800 mm 等降水量线大致重合。',
      '我国分为五个温度带和四个干湿地区。'
    ],
    localInfo: [
      '我国东部地区夏季高温多雨，适宜种植水稻、玉米等作物。',
      '西北内陆降水少，发展灌溉农业和畜牧业。',
      '青藏高原气候高寒，发展高寒牧业和河谷农业。',
      '季风的不稳定性易造成旱涝灾害，需加强水利建设。'
    ]
  },
  {
    id: 'water-resources',
    showMap: true,
    keywords: ['水资源', '南水北调', '水资源分布', '节约用水', '时空分布'],
    brief: '我国水资源时空分布不均：南方多、北方少，夏秋多、冬春少，需通过跨流域调水等措施解决。',
    places: [
      { name: '南方水多', x: 17, y: 16, info: '南方降水丰富，水资源总量大，但存在季节性缺水。' },
      { name: '北方水少', x: 83, y: 16, info: '北方降水较少，人口和耕地多，水资源供需矛盾突出。' },
      { name: '南水北调', x: 50, y: 34, info: '把长江流域的水调往华北、西北地区，缓解北方缺水问题。' },
      { name: '三峡水利工程', x: 35, y: 52, info: '具有防洪、发电、航运、灌溉等综合效益。' },
      { name: '节水措施', x: 70, y: 52, info: '推广节水灌溉、工业循环用水、提高全民节水意识。' }
    ],
    links: [
      [0, 2, '调出'],
      [2, 1, '调入'],
      [3, 2, '调节'],
      [1, 4, '缓解']
    ],
    structure: [
      '我国水资源总量丰富，但人均占有量少，仅为世界平均水平的四分之一左右。',
      '空间分布：南多北少、东多西少。',
      '时间分布：夏秋多、冬春少，年际变化大。',
      '解决措施：跨流域调水（如南水北调）、修建水库、节约用水、防治水污染。'
    ],
    localInfo: [
      '华北平原是我国缺水最严重的地区之一，地下水超采严重。',
      '南方地区虽水资源丰富，但水污染问题不容忽视。',
      '农业用水占我国总用水量的大部分，推广喷灌、滴灌可大幅节水。',
      '节约用水是解决水资源短缺的重要途径。'
    ]
  },
  {
    id: 'population',
    showMap: true,
    keywords: ['人口分布', '胡焕庸线', '黑河腾冲线', '人口密度', '东部沿海'],
    brief: '我国人口分布不均，以黑河—腾冲线为界，东南部人口稠密，西北部人口稀疏。',
    places: [
      { name: '黑河', x: 70, y: 12, info: '黑龙江省黑河市，胡焕庸线的东北端点。' },
      { name: '腾冲', x: 30, y: 42, info: '云南省腾冲市，胡焕庸线的西南端点。' },
      { name: '东南部稠密', x: 75, y: 50, info: '面积约占全国 43%，人口约占 94%，地形平坦、气候适宜、经济发达。' },
      { name: '西北部稀疏', x: 20, y: 26, info: '面积约占全国 57%，人口仅约占 6%，多高原、山地和荒漠。' }
    ],
    links: [
      [0, 1, '胡焕庸线'],
      [1, 2, '东南一侧'],
      [1, 3, '西北一侧']
    ],
    structure: [
      '我国人口分布以黑河—腾冲一线为界，东南多、西北少。',
      '东南部地形以平原、丘陵为主，气候温暖湿润，经济发达，人口稠密。',
      '西北部多高原、山地和沙漠，气候干旱，人口稀疏。',
      '人口分布受自然条件、经济发展水平、历史因素等共同影响。'
    ],
    localInfo: [
      '东部沿海地区人口密集，城镇化水平高。',
      '长江三角洲、珠江三角洲、京津冀是我国人口最稠密的地区。',
      '西藏、青海、新疆等地人口密度小，但面积广大、资源丰富。',
      '近年来我国人口向城市和东部地区集聚的趋势明显。'
    ]
  },
  {
    id: 'agriculture',
    showMap: true,
    keywords: ['农业分布', '南稻北麦', '因地制宜', '种植业', '畜牧业'],
    brief: '我国农业分布呈现"南稻北麦、东耕西牧"的格局，因地制宜是发展农业的基本原则。',
    places: [
      { name: '南方水稻', x: 30, y: 46, info: '南方水热充足，以水田为主，主要种植水稻。' },
      { name: '北方小麦', x: 70, y: 16, info: '北方降水较少，以旱地为主，主要种植小麦、玉米。' },
      { name: '东部种植业', x: 80, y: 42, info: '东部平原地区地形平坦、土壤肥沃，是主要种植业区。' },
      { name: '西部畜牧业', x: 20, y: 20, info: '西部高原、山地草场广阔，以畜牧业为主。' }
    ],
    links: [
      [1, 0, '秦岭—淮河'],
      [2, 3, '东耕西牧'],
      [0, 1, '南稻北麦']
    ],
    structure: [
      '我国农业以种植业为主，林业、畜牧业和渔业也占有重要地位。',
      '南方以水田为主，主要种植水稻；北方以旱地为主，主要种植小麦、玉米。',
      '东部以种植业为主，西部以畜牧业为主。',
      '因地制宜：根据当地自然条件和社会经济条件合理安排农业生产。'
    ],
    localInfo: [
      '东北平原地势平坦、土壤肥沃，是我国重要的商品粮基地。',
      '华北平原是我国小麦、棉花的重要产区。',
      '长江中下游平原水热条件好，是著名的"鱼米之乡"。',
      '内蒙古、新疆等草原地区适宜发展畜牧业。'
    ]
  }
);
