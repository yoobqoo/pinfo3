/* ========================================================
   babyti shared code — used by index.html and result.html
   ======================================================== */

/* Kakao SDK init (실제 키로 교체 필요) */
const KAKAO_JS_KEY = 'KAKAO_JS_KEY_PLACEHOLDER';
if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_JS_KEY && KAKAO_JS_KEY !== 'KAKAO_JS_KEY_PLACEHOLDER') {
  window.Kakao.init(KAKAO_JS_KEY);
}

const SHARE_BASE = 'https://momplan.site/babyti/';
let resultType = null;

const PERSONALITIES = {
  LL: { // Low Surgency · Low Sensitivity
    title:'평온한 현자형', subTitle:'느긋한 아기거북', subTitleEn:'Relaxed Baby Turtle',
    intro:'서두르는 법이 없어요. 자기만의 속도로 한 걸음씩, 단단하게 세상을 걸어가요.',
    emoji:'🧘', color:'#D4F25C',
    catch:'흔들림 없이 자기 페이스를 지키는 아기',
    rarity:'전체 인구 중 약 10% 수준',
    tags:['#평온함','#안정감','#자기조절','#집중력'],
    desc:'자극에 쉽게 흔들리지 않고 자기만의 페이스로 세상을 살아가는 아기예요. 시끄러운 환경에서도 평온함을 유지하고 변화 앞에서도 의연하게 대처해요. Pluess(2015)의 환경 민감성 모델에서 \'Dandelion(민들레)\' 그룹에 해당하며, 안정적인 정서 기반 위에서 차분히 발달하는 타입이에요.',
    traits:['🧘 안정감','💎 인내심','🎯 자기조절','🔍 집중력'],
    famous:[
      { name:'워렌 버핏', role:'투자가' },
      { name:'김연아', role:'피겨선수' },
      { name:'키아누 리브스', role:'배우' }
    ],
    tip:'자극을 의식적으로 늘려주는 것이 발달에 도움이 돼요. 새로운 경험을 부드럽게 제안하고, 차분한 성격을 답답해하지 마세요. 안정성은 평생의 자산이에요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'자기 페이스를 존중해주세요. 다른 아기보다 반응이 늦거나 작아 보여도 \'느린 것\'이 아니라 \'깊이 처리하는 중\'이에요. 차분한 모습을 답답해하지 말고, 안정적인 환경 속에서 스스로 탐색할 시간을 충분히 주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'자극에 둔감한 편이라 의식적인 노출이 필요해요. 다양한 질감의 장난감, 부드러운 음악, 짧은 산책 등 단계적인 새 경험을 주 2~3회 정도 시도해보세요. 변화는 천천히, 한 번에 하나씩이 좋아요.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'블록 쌓기, 끼우기 놀이, 그림책 읽기처럼 차분히 집중할 수 있는 놀이가 잘 맞아요. 야외에서는 모래놀이·물놀이처럼 자기 페이스로 탐색 가능한 활동을 추천해요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'표현이 적어 부모가 아기의 욕구를 놓치기 쉬워요. 표정·몸짓 변화를 자주 관찰해주세요. 또한 과한 자극(시끄러운 키즈카페, 긴 외출)은 오히려 위축을 부를 수 있으니 컨디션에 맞춰 조절해주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'이 기질의 아기는 어릴 적엔 평범해 보여도 성장하면서 \'단단한 내면\'이 진가를 발휘해요. 김연아·워렌 버핏처럼 자기 페이스를 지키는 힘이 곧 평생의 자산이 됩니다.' }
    ],
    compat:['HH','MM'],
    citation:'Pluess (2015) Child Development Perspectives · Thomas & Chess (1977) "Easy temperament" + Low activity'
  },

  LM: { // Low Surgency · Mid Sensitivity
    title:'조용한 탐구자형', subTitle:'생각하는 도토리', subTitleEn:'Thinking Acorn',
    intro:'작은 머릿속에 넓은 우주를 품고 있어요. 관찰하고 깊이 생각하며 자신만의 세상을 그려나갑니다.',
    emoji:'🦉', color:'#B8B0E0',
    catch:'깊이 생각하고 차분히 행동하는 아기',
    rarity:'전체 인구 중 약 12% 수준',
    tags:['#사고력','#관찰력','#신중함','#깊이있음'],
    desc:'행동보다 관찰을 먼저 하는, 머릿속에서 많은 일이 일어나는 아기예요. 익숙해질 때까지 충분히 살피고 한 가지에 깊이 빠져드는 경향이 있어요. Rothbart IBQ-R 연구에서 낮은 Surgency + 중간 Orienting 패턴에 해당하며, 사고력이 일찍 발달하는 타입이에요.',
    traits:['🦉 관찰력','🧠 사고력','⚖️ 신중함','🎯 집중력'],
    famous:[
      { name:'아인슈타인', role:'물리학자' },
      { name:'빌 게이츠', role:'MS 창업자' },
      { name:'봉준호', role:'영화감독' }
    ],
    tip:'강요하지 말고 충분히 관찰할 시간을 주세요. 책, 퍼즐, 블록 등 사고력을 자극하는 놀이가 잘 맞아요. 깊이 있는 1:1 상호작용을 좋아해요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'\'먼저 관찰하는 시간\'을 충분히 보장해주세요. 새 상황에서 바로 행동하지 않는 것은 신중함이지 소극성이 아니에요. 충분히 관찰하면 누구보다 정확하게 움직이는 아이입니다. 빠르게 결정하라고 재촉하지 말고 \'천천히 봐도 괜찮아\'라는 안전 메시지를 자주 전해주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'사고력·언어 발달이 일찍 꽃피는 타입이에요. 매일 그림책 2~3권 읽어주기, 사물 이름 설명하기, \'왜?\' 질문에 진지하게 답해주기 같은 인지 자극이 큰 도움이 됩니다. 단, 새 활동은 1:1 환경에서 천천히 소개해주세요.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'퍼즐, 도형 맞추기, 색칠 놀이, 그림책 함께 보기, 자연관찰(곤충·식물 관찰) 등이 잘 맞아요. 또래보다 부모와의 깊이 있는 1:1 놀이를 더 좋아하는 경향이 있으니 매일 15~20분 \'우리 둘만의 집중 놀이 시간\'을 만들어주세요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'시끄러운 키즈카페·대규모 모임에선 빠르게 지칠 수 있어요. 너무 많은 또래 자극보단 소규모(2~3명) 만남이 더 즐거워요. 또 표현이 적은 편이라 욕구를 놓치기 쉬우니 \'지금 어떤 기분이야?\'라고 자주 언어로 짚어주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'\'우리 애는 왜 적극적이지 않을까\' 걱정하지 마세요. 빌 게이츠·아인슈타인·봉준호처럼 깊이 있게 사고하는 사람은 이 기질에서 자주 나옵니다. 신중함은 약점이 아니라 \'더 좋은 결정을 만드는 힘\'이에요.' }
    ],
    compat:['HM','MH'],
    citation:'Putnam, Helbig, Gartstein, Rothbart, & Leerkes (2014) — IBQ-R Very Short Form'
  },

  LH: { // Low Surgency · High Sensitivity
    title:'섬세한 예술가형', subTitle:'꿈꾸는 선인장', subTitleEn:'Dreaming Cactus',
    intro:'단단한 껍질 속, 누구보다 다정한 마음을 품고 있어요. 세상 작은 빛조차 놓치지 않고 마음에 소중히 담을 줄 알아요.',
    emoji:'🎨', color:'#9DDDD9',
    catch:'세상을 깊이 느끼고 표현하는 아기',
    rarity:'전체 인구 중 약 8% 수준',
    tags:['#감수성','#섬세함','#예술가기질','#직관력'],
    desc:'작은 소리, 미세한 표정 변화까지 모두 느끼는 풍부한 감수성의 소유자예요. 자극에 예민한 건 세상을 깊이 느낀다는 증거예요. Aron et al.(2012)의 Sensory Processing Sensitivity 연구에서 \'Orchid(난초)\' 그룹에 해당하며, 적절한 환경에서는 누구보다 풍부한 정서·창의력을 꽃피워요.',
    traits:['🎨 풍부한 감수성','💝 깊은 공감','✨ 미적감각','🌸 직관력'],
    famous:[
      { name:'빈센트 반 고흐', role:'화가' },
      { name:'아이유', role:'가수/작곡가' },
      { name:'박찬욱', role:'영화감독' }
    ],
    tip:'안정적인 루틴과 조용한 환경이 핵심이에요. 음악, 그림, 자연 등 부드러운 감각 자극이 정서 발달에 큰 도움이 됩니다. 예민함을 \'재능\'으로 인정해주세요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'\'예민함\'을 단점으로 보지 말고 \'재능의 씨앗\'으로 받아주세요. 작은 소리·표정·분위기까지 모두 흡수하는 아기는 풍부한 감수성을 가진 것이며, 그만큼 안정적이고 예측 가능한 환경이 필요합니다. 매일 비슷한 루틴(수유·낮잠·잠자리)을 유지해주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'\'양\'이 아니라 \'질\'이에요. 부드러운 클래식 음악, 자연의 색감(잎·꽃·물), 따뜻한 그림책 같은 부드러운 감각 자극이 정서·창의력 발달의 토대가 됩니다. 자극은 짧고 깊게, 사이사이 충분한 휴식을 함께 주세요.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'그림 그리기, 점토놀이, 음악 듣기, 동화책 읽기, 자연 산책 같은 \'느리고 감각적인 놀이\'가 잘 맞아요. 미술·음악 영역에서 일찍 재능이 보일 수 있으니 어릴 때부터 다양한 예술 자극에 노출시켜주세요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'시끄러운 곳, 갑작스러운 변화, 강한 야단은 깊은 상처가 됩니다. 훈육은 단호하되 \'부드러운 톤\'으로, 이유를 충분히 설명해주세요. 또 \'예민하다\'는 표현을 부정적으로 쓰지 말고 \'잘 느끼는 거야\'라고 긍정 라벨링을 해주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'Aron 박사의 연구에 따르면 이 아기들은 \'좋은 환경에서 가장 크게 꽃피우는\' 그룹입니다. 아이유·고흐·박찬욱처럼 세상을 깊이 느끼는 예술가들이 이 기질에서 자주 나옵니다. 따뜻한 환경만 만들어주면 아이는 스스로 빛납니다.' }
    ],
    compat:['HL','ML'],
    citation:'Aron, Aron, & Jagiellowicz (2012) PSPR · Lionetti et al. (2018) Translational Psychiatry'
  },

  ML: { // Mid Surgency · Low Sensitivity
    title:'자유로운 모험가형', subTitle:'파도타는 고래', subTitleEn:'Wave-riding Whale',
    intro:'거친 파도도 두렵지 않아요. 신나게 물살을 가르며 새로운 세상을 탐험하는 용감한 아이예요.',
    emoji:'🌊', color:'#9CB6F0',
    catch:'두려움 없이 즐기며 사는 아기',
    rarity:'전체 인구 중 약 13% 수준',
    tags:['#적응력','#낙천성','#도전정신','#회복력'],
    desc:'새로운 상황에도 금세 적응하고 변화를 즐기는 아기예요. 잘 울지 않고 어디서나 즐거움을 찾아요. Thomas & Chess의 \'Easy baby\' 패턴에 적당한 활동성이 더해진 타입으로, 양육자에게 큰 안정감을 주는 기질이에요.',
    traits:['🌊 높은 적응력','☀️ 낙천성','🎢 도전정신','🌈 회복력'],
    famous:[
      { name:'박세리', role:'골퍼' },
      { name:'강호동', role:'방송인' },
      { name:'송강호', role:'배우' }
    ],
    tip:'다양한 환경에 노출시켜주세요. 활동적인 놀이와 새로운 도전이 잘 맞아요. 다만 감정을 너무 잘 숨길 수 있으니 마음 상태도 자주 확인해주세요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'타고난 \'쉬운 아기(Easy baby)\' 타입이에요. 어떤 환경에도 잘 적응하고 잘 웃어 양육자에게 큰 안정감을 줍니다. 다만 \'알아서 잘 큰다\'고 방치되기 쉬우니 의도적으로 새로운 자극과 도전 과제를 주세요. 활동량이 많은 만큼 충분한 신체놀이 시간을 확보하는 게 핵심입니다.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'몸을 쓰는 자극이 큰 도움이 돼요. 야외 활동(공원·놀이터·물놀이), 다양한 운동기구, 다양한 또래 만남을 풍부하게 제공해주세요. 자극에 둔감한 편이라 \'조금 더 강한 자극\'도 잘 견디고 즐깁니다.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'미끄럼틀, 자전거, 공놀이, 술래잡기, 트램폴린 같은 \'몸 쓰는 놀이\'가 잘 맞아요. 새로운 장소·새 또래도 즐겁게 받아들이니 다양한 환경을 경험하게 해주세요. 정적인 놀이만 하면 금세 지루해할 수 있어요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'감정을 너무 잘 숨길 수 있어요. \'우리 애는 항상 괜찮다\'고 안심하지 말고, \'오늘 속상한 일 있었어?\'처럼 마음을 짚어주는 질문을 자주 해주세요. 또 활동성이 높아 안전사고 위험이 있으니 환경 안전 점검은 꼼꼼하게.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'양육자가 가장 편하게 키울 수 있는 기질이에요. 잘 웃고 잘 자고 잘 적응하는 모습이 부모의 자존감도 함께 올려줍니다. 박세리·강호동처럼 강인한 회복력과 낙천성이 평생의 자산이 됩니다.' }
    ],
    compat:['LH','MH'],
    citation:'Putnam et al. (2014) IBQ-R · Shiner et al. (2012) Child Development Perspectives'
  },

  MM: { // Mid · Mid
    title:'조화로운 균형가형', subTitle:'균형의 두루미', subTitleEn:'Crane of Balance',
    intro:'한 발로 서 있어도 흔들림이 없어요. 어떤 상황에도 흔들리지 않고 중심을 지키는 단단한 아이에요.',
    emoji:'⚖️', color:'#C9E2EA',
    catch:'모든 면에서 균형 잡힌 만능 아기',
    rarity:'전체 인구 중 약 18% 수준',
    tags:['#균형감','#유연성','#사회성','#만능형'],
    desc:'외향성과 민감성이 모두 적당한, 어떤 환경에서도 무난히 잘 어울리는 만능형 아기예요. Lionetti et al.(2018)의 \'Tulip(튤립)\' 그룹과 일치하며, 가장 흔하면서도 가장 유연한 기질로 알려져 있어요.',
    traits:['⚖️ 균형감','🌷 유연성','🤝 사회성','🎯 안정성'],
    famous:[
      { name:'손흥민', role:'축구선수' },
      { name:'박보검', role:'배우' },
      { name:'BTS 진', role:'가수' }
    ],
    tip:'다양한 영역에 골고루 노출시켜 강점을 발견해주세요. 평범하다고 느낄 수 있지만 유연함이 큰 강점이에요. 어떤 친구와도 잘 어울리는 사회성의 토대를 가진 타입이에요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'\'평범하다\'고 느끼기 쉽지만 사실은 가장 강력한 카드인 \'유연성\'을 가진 타입입니다. 어떤 환경에도 적응하고 어떤 사람과도 잘 어울리는 만능형이에요. 강점이 두드러지지 않아 보일 수 있으니 다양한 영역에 골고루 노출시켜 진짜 좋아하는 분야를 발견하게 도와주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'운동·예술·언어·인지 등 다양한 영역을 골고루 경험시켜주세요. 한 가지에 너무 일찍 몰입시키기보단 \'골고루 경험 → 점차 좋아하는 것 발견\' 흐름이 잘 맞아요. 또래 친구와의 만남도 풍부하게 제공해주세요.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'협동 놀이, 역할 놀이, 다양한 친구와의 그룹 활동에 잘 어울려요. 손흥민·박보검처럼 \'단체에서 빛나는\' 사회성을 가진 타입이라 어린이집·유치원 적응이 빠르고 친구도 잘 사귑니다.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'\'특별한 게 없다\'고 비교하지 마세요. 유연성은 보이지 않는 강점이에요. 또 너무 무난해서 자기 주장을 양보하는 경우가 잦을 수 있으니 \'네가 원하는 건 뭐야?\'라고 의견을 묻는 습관을 들여주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'Lionetti(2018) 연구에서 \'Tulip\' 그룹으로 분류되는 가장 유연한 타입입니다. 어디서든 잘 적응하고 어떤 친구와도 잘 어울리는 능력은 평생 가는 사회적 자산이에요. 평범함은 사실 가장 강력한 무기입니다.' }
    ],
    compat:['LL','HH'],
    citation:'Lionetti et al. (2018) "Dandelions, Tulips and Orchids" — Translational Psychiatry'
  },

  MH: { // Mid Surgency · High Sensitivity
    title:'다정한 공감가형', subTitle:'들어주는 부엉이', subTitleEn:'Listening Owl',
    intro:'곁에 있어 주는 것만으로도 위로가 돼요. 사람의 마음을 가장 잘 이해하는 아이입니다.',
    emoji:'💝', color:'#B4D838',
    catch:'사람 마음을 잘 읽고 위로하는 아기',
    rarity:'전체 인구 중 약 10% 수준',
    tags:['#공감력','#정서지능','#사회성','#따뜻함'],
    desc:'다른 사람의 표정과 감정을 빠르게 감지하고 반응하는 정서 지능이 높은 아기예요. Pluess(2015)의 환경 민감성 모델에서 사회·정서적 단서에 특히 민감한 그룹이며, 좋은 환경에서는 뛰어난 사회성과 리더십으로 발달할 수 있어요.',
    traits:['💝 공감력','🤗 정서지능','✨ 따뜻함','🌹 섬세한 표현'],
    famous:[
      { name:'오프라 윈프리', role:'MC/작가' },
      { name:'김혜자', role:'배우' },
      { name:'BTS V', role:'가수' }
    ],
    tip:'부모의 감정 표현이 아기에게 큰 영향을 줘요. 안정적이고 따뜻한 상호작용을 의식적으로 만들어주세요. 부정적 자극은 최소화하고 칭찬은 자주.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'부모의 표정·말투·분위기를 가장 빠르게 흡수하는 아기예요. 부모가 안정되어 있으면 아기도 안정되고, 부모가 불안하면 아기도 불안합니다. \'부모의 정서가 곧 양육 환경\'이라는 점을 기억하고 본인 컨디션 관리도 함께 챙겨주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'\'공감 표현\'이 가장 큰 자극이 됩니다. 아기의 감정을 자주 언어로 짚어주세요. \"아, 인형이 떨어져서 속상했구나\", \"엄마가 옆에 있어서 안심됐어?\" 같은 정서 라벨링을 매일 반복하면 정서 지능이 폭발적으로 자랍니다.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'역할놀이, 인형놀이, 동물 돌보기, 가족과 함께하는 노래·율동 같은 \'관계 중심 놀이\'가 잘 맞아요. 책 속 인물의 감정을 함께 이야기하는 \'감정 그림책\' 읽기도 큰 도움이 됩니다.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'부부싸움·큰 소리·차가운 분위기는 깊은 상처가 됩니다. 갈등이 있을 땐 아기 앞이 아닌 곳에서 해소해주세요. 또 다른 사람의 감정을 너무 잘 흡수해 \'착한 아이 콤플렉스\'에 빠질 수 있으니 \'네 마음은 어때?\'를 자주 물어주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'오프라 윈프리·김혜자처럼 사람의 마음을 어루만지는 능력은 이 기질에서 나옵니다. 따뜻한 환경 속에서 자란 이 아이들은 최고의 공감 능력자가 됩니다. 따뜻함을 자주 표현해주세요 — 그게 가장 큰 영양분이에요.' }
    ],
    compat:['LM','ML'],
    citation:'Pluess (2015) · Pluess, Assary, Lionetti et al. (2018) Developmental Psychology'
  },

  HL: { // High Surgency · Low Sensitivity
    title:'거침없는 개척자형', subTitle:'바람을 가르는 사자', subTitleEn:'Wind-cutting Lion',
    intro:'\'겁\'이라는 단어를 모르는 듯해요. 가본 적 없는 길도 바람처럼 달려가는 용감한 아이입니다.',
    emoji:'🚀', color:'#F4DE3D',
    catch:'안 가본 길도 망설임 없이 가는 아기',
    rarity:'전체 인구 중 약 9% 수준',
    tags:['#추진력','#용기','#독립심','#리더십'],
    desc:'두려움이 적고 호기심은 강한, 어디든 먼저 뛰어드는 행동파 아기예요. 자극에 둔감해 좀처럼 위축되지 않아요. Rothbart의 Surgency 高 + Negative Affectivity 低 조합으로, 미래의 개척자 자질을 가진 기질이에요.',
    traits:['🚀 추진력','💪 용기','🦁 독립심','🎯 결단력'],
    famous:[
      { name:'일론 머스크', role:'테슬라 CEO' },
      { name:'정주영', role:'현대 창업자' },
      { name:'박지성', role:'축구선수' }
    ],
    tip:'안전한 한계 설정이 중요해요. 자기조절 능력을 키워주는 놀이(차례 지키기, 기다리기)를 의식적으로 포함해주세요. 도전 기회를 풍부하게.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'겁이 없고 추진력이 강한 \'타고난 개척자\' 기질입니다. 에너지를 발산할 무대를 충분히 만들어주는 게 핵심이에요. \'안 돼\' 위주의 양육은 답답해하니, \'어디까지는 괜찮고 어디부터는 안 돼\'라는 명확한 룰을 정하고 그 안에서 자유롭게 도전하게 해주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'\'한계에 도전하는 경험\'이 큰 영양분이에요. 클라이밍 키즈, 자전거, 수영, 트램폴린, 야외 캠핑 같은 활동적인 도전 기회를 자주 만들어주세요. 또래보다 한 단계 더 큰 도전도 거뜬히 해냅니다.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'몸을 격하게 쓰는 모든 놀이, 새로운 장소 탐험, 어려운 미션 게임, 리더 역할이 잘 맞아요. \'네가 대장이야\' 같은 역할 부여가 동기를 크게 키웁니다. 정적인 놀이에는 금세 지루해할 수 있으니 짧고 굵게 끊어주세요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'안전사고 위험이 가장 높은 타입이에요. 환경 안전 점검은 꼭 꼼꼼히. 또 \'기다리기·차례 지키기·양보\' 같은 자기조절 능력을 의식적으로 가르쳐주세요. 충동적으로 행동해 친구 마음을 다치게 할 수 있으니 \'친구는 어떤 기분일까?\'를 함께 이야기해주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'일론 머스크·정주영·박지성처럼 세상을 바꾸는 사람들이 이 기질에서 자주 나옵니다. 양육이 다소 힘들 수 있지만 \'세상을 바꿀 에너지\'를 키우는 중이라고 생각해주세요. 단단한 룰 + 풍부한 도전 = 미래의 리더가 됩니다.' }
    ],
    compat:['LH','LM'],
    citation:'Rothbart (2007) "Temperament, Development, and Personality" — Current Directions in Psychological Science'
  },

  HM: { // High Surgency · Mid Sensitivity
    title:'빛나는 리더형', subTitle:'밤하늘의 북극성', subTitleEn:'North Star of the Night Sky',
    intro:'어디에 있든 자연스럽게 시선을 사로잡아요. 사람들을 자기도 모르게 이끄는 매력을 가진 아이예요.',
    emoji:'👑', color:'#F4B5D0',
    catch:'사람들이 자연스레 따르는 아기',
    rarity:'전체 인구 중 약 11% 수준',
    tags:['#카리스마','#리더십','#표현력','#사교성'],
    desc:'활발하면서도 상황을 잘 파악하는, 타고난 리더 기질의 아기예요. 다른 사람의 관심을 받는 걸 즐기고 분위기를 잘 이끌어요. 높은 Surgency와 적당한 Sensitivity의 균형은 사회적 성공과 강한 상관을 보이는 패턴이에요.',
    traits:['👑 카리스마','🌟 리더십','🎤 표현력','🤝 사교성'],
    famous:[
      { name:'버락 오바마', role:'전 미 대통령' },
      { name:'BTS RM', role:'그룹 리더' },
      { name:'백종원', role:'요리연구가' }
    ],
    tip:'무대를 만들어주세요. 발표, 노래, 역할놀이 등 표현 기회를 자주 주면 카리스마가 더 발달해요. 다른 아이들의 마음을 함께 살피는 법도 함께 가르쳐주세요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'밝고 표현력 풍부한 \'타고난 리더\' 기질입니다. 관심을 받고 싶어 하는 욕구를 \'관종\'으로 보지 말고 \'카리스마의 씨앗\'으로 인정해주세요. 적당한 민감성이 있어 다른 사람의 반응을 잘 읽으므로 리더십 발달에 매우 유리합니다.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'\'무대\'를 자주 만들어주세요. 가족 앞에서 노래 부르기, 동화 낭독, 짧은 발표 같은 \'관객 있는 표현 기회\'가 카리스마를 키웁니다. 또래 그룹의 리더 역할도 자주 맡기면 자연스럽게 리더십이 자랍니다.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'역할극, 노래·춤, 동화 구연, 모형 만들기, 친구들과의 단체 놀이가 잘 맞아요. \'네가 안내해줘\', \'네가 선생님이야\' 같은 책임 역할을 자주 주면 자존감과 표현력이 함께 자랍니다.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'주목받는 걸 좋아해 친구를 누르고 자기 주장만 할 수 있어요. \'다른 친구도 말할 기회를 줘야 해\', \'친구 표정을 봐봐\' 같은 사회적 배려를 자주 가르쳐주세요. 또 인정 욕구가 크니 결과보단 노력을 칭찬하는 습관을 들여주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'오바마·BTS RM·백종원처럼 사람들을 자연스레 이끄는 리더가 이 기질에서 나옵니다. 밝은 에너지와 따뜻한 공감 능력을 모두 가진 보석 같은 아이예요. 표현할 무대만 충분히 만들어주면 스스로 빛납니다.' }
    ],
    compat:['LM','LL'],
    citation:'Putnam et al. (2014) IBQ-R Surgency dimension · Shiner et al. (2012)'
  },

  HH: { // High Surgency · High Sensitivity
    title:'열정적인 천재형', subTitle:'반짝이는 초신성', subTitleEn:'Twinkling Supernova',
    intro:'조용하다가도 단번에 세상을 밝히는 힘. 누구보다 강렬히 세상을 느끼고 표현하는 아이에요.',
    emoji:'💎', color:'#F87A6E',
    catch:'강렬한 감수성과 에너지를 모두 가진 아기',
    rarity:'전체 인구 중 약 9% 수준',
    tags:['#열정','#창의성','#깊은감정','#강한의지'],
    desc:'외향성과 민감성이 모두 높은 드문 조합! 강렬한 감정과 풍부한 표현력, 폭발적인 호기심을 가진 아기예요. Belsky & Pluess(2009)의 \'Differential Susceptibility\' 이론에 따르면 이 그룹은 환경에 가장 크게 영향받으며, 좋은 환경에서는 가장 뛰어난 성취를 보이는 \'고반응형\' 기질이에요.',
    traits:['💎 강한 열정','🎨 창의성','🌋 깊은 감정','⚡ 강한 의지'],
    famous:[
      { name:'스티브 잡스', role:'애플 창업자' },
      { name:'모차르트', role:'작곡가' },
      { name:'BTS 슈가', role:'프로듀서' }
    ],
    tip:'풍부한 자극과 깊이 있는 상호작용이 핵심이에요. 환경의 영향을 가장 크게 받는 타입이라 좋은 자극은 큰 성장으로 이어져요. 다만 감정 기복이 클 수 있어 충분한 휴식과 안정도 꼭 챙겨주세요.',
    tipSections:[
      { icon:'🎯', title:'핵심 양육 포인트', body:'외향성과 민감성이 모두 높은 드문 \'고반응형\' 기질입니다. Belsky & Pluess(2009)의 차별적 민감성 이론에 따르면 환경의 영향을 가장 크게 받는 그룹이에요. 좋은 환경 = 폭발적인 성장, 나쁜 환경 = 큰 어려움. 그만큼 양육 환경이 중요하니 풍부하면서도 안정적인 환경을 만드는 데 집중해주세요.' },
      { icon:'🌱', title:'발달을 위해 늘려줄 자극', body:'다양하고 깊이 있는 자극이 필요해요. 음악, 미술, 자연, 책, 다양한 사람과의 만남까지 폭넓게 노출시켜주세요. 단, 자극이 너무 강하지 않게 \'질 높은 1:1 상호작용\'을 매일 충분히 확보하는 게 핵심입니다.' },
      { icon:'🎨', title:'잘 맞는 놀이·활동', body:'창의력을 발휘하는 모든 놀이 — 그림, 음악, 만들기, 이야기 짓기, 역할극 — 가 잘 맞아요. 동시에 격렬한 운동, 야외 모험도 즐깁니다. 다양한 영역을 일찍 경험시켜 \'폭발적 재능\'이 어디서 터질지 발견해주세요.' },
      { icon:'⚠️', title:'이런 점은 주의해주세요', body:'감정 기복이 가장 큰 타입이에요. 강렬한 기쁨과 강렬한 슬픔이 짧은 시간에 오가니 \'왜 이러지?\' 당황하지 말고 \'네 감정이 강한 거 정상이야\'라고 받아주세요. 또 과한 자극이 누적되면 폭발할 수 있으니 매일 충분한 휴식과 혼자만의 시간을 확보해주세요.' },
      { icon:'💝', title:'부모를 위한 메시지', body:'스티브 잡스·모차르트·BTS 슈가처럼 세상을 강렬하게 흔드는 천재들이 이 기질에서 나옵니다. 키우기 가장 힘들 수 있지만 가장 큰 가능성을 가진 아이입니다. 따뜻한 환경 + 풍부한 자극 + 충분한 휴식 — 이 세 가지만 챙기면 아이는 누구보다 빛납니다.' }
    ],
    compat:['LL','MM'],
    citation:'Belsky & Pluess (2009) "Beyond Diathesis-Stress" Psychological Bulletin · Aron et al. (2012)'
  }
};


/* ========================================================
   Shared helpers — page toggle, card image, result render,
   tip page, share, toast.
   ======================================================== */

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
}

function cardImg(type, className = '') {
  const p = PERSONALITIES[type];
  return `<img class="${className}" src="baby-cards/${type}.webp" alt="${p.subTitle} — ${p.title}" loading="lazy">`;
}

function renderMatrix(type) {
  // top→bottom: H, M, L sensitivity ; left→right: L, M, H surgency
  const order = ['LH','MH','HH','LM','MM','HM','LL','ML','HL'];
  const grid = document.getElementById('rMatrix');
  if (!grid) return;
  grid.innerHTML = order.map(t => {
    const active = t === type;
    return `<div class="matrix-cell${active ? ' active' : ''}" title="${PERSONALITIES[t].subTitle}">
      <span class="matrix-cell-dot"></span>
    </div>`;
  }).join('');
  const p = PERSONALITIES[type];
  document.getElementById('rMatrixLegend').innerHTML =
    `📍 ${p.subTitle} (${type})<span class="matrix-legend-sub">${p.title}</span>`;
}

function renderResult(type) {
  resultType = type;
  const p = PERSONALITIES[type];

  document.getElementById('rFace').innerHTML = cardImg(type, 'result-card-img');
  document.getElementById('rTypeLabel').textContent = `${type} · ${p.title} ${p.emoji}`;
  document.getElementById('rRarity').textContent = p.rarity;
  document.getElementById('rDesc').textContent = p.desc;
  document.getElementById('rCitation').textContent = p.citation;
  renderMatrix(type);

  document.getElementById('rHashtags').innerHTML = p.tags
    .map(t => `<span class="hashtag">${t}</span>`).join('');
  document.getElementById('rFamous').innerHTML = p.famous.map(f => `
    <div class="famous-item">
      <div class="famous-name">${f.name}</div>
      <div class="famous-role">${f.role}</div>
    </div>`).join('');

  showPage('page-result');
}

function showTipPage() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  document.getElementById('tipFace').innerHTML = cardImg(resultType, 'result-card-img');
  document.getElementById('tipHeroSub').textContent = `${p.subTitle} · ${p.title}`;
  const body = document.getElementById('tipBody');
  if (p.tipSections && p.tipSections.length) {
    body.innerHTML = p.tipSections.map(s => `
      <div class="tip-section">
        <div class="tip-section-head">
          <span class="tip-section-icon">${s.icon}</span>
          <span class="tip-section-title">${s.title}</span>
        </div>
        <div class="tip-section-body">${s.body}</div>
      </div>
    `).join('');
  } else {
    body.textContent = p.tip;
  }
  showPage('page-tip');
}

function backToResult() {
  showPage('page-result');
}

/* Share URL points to result page so recipients see same result */
function _shareUrl() {
  return resultType ? `${SHARE_BASE}result?type=${resultType}` : SHARE_BASE;
}

function shareToKakao() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  const url = _shareUrl();
  const imageUrl = `${SHARE_BASE}baby-cards/${resultType}.png`;
  const description = `${p.subTitle} (${p.title}) ${p.emoji}\n"${p.intro}"`;
  if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized() && window.Kakao.Share) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '우리 아기 성향 테스트 결과 🍼',
        description,
        imageUrl,
        link: { mobileWebUrl: url, webUrl: url }
      },
      buttons: [{ title: '나도 테스트하기', link: { mobileWebUrl: SHARE_BASE, webUrl: SHARE_BASE } }]
    });
  } else {
    copyShareLink();
  }
}

function copyShareLink() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  const url = _shareUrl();
  const text = `우리 아기는 ${p.subTitle}! ${p.emoji}\n${url}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(()=>showToast('링크가 복사되었어요'))
      .catch(()=>prompt('아래 링크를 복사하세요', text));
  } else {
    prompt('아래 링크를 복사하세요', text);
  }
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:rgba(0,0,0,0.82);color:#fff;padding:12px 22px;border-radius:24px;font-size:14px;font-weight:500;z-index:9999;opacity:0;transition:opacity .2s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.style.opacity = '0'; }, 1800);
}

/* "다시 테스트하기" — full nav back to quiz */
function restartQuiz() {
  location.href = './';
}

/* Dev helper */
window._showType = function(type) {
  if (!PERSONALITIES[type]) return console.warn('Unknown type:', type);
  renderResult(type);
};
