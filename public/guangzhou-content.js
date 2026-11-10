(() => {
  const data = window.GRATITUDE_CONTENT;
  if (!data) return;
  const cityWords = value => typeof value === 'string'
    ? value.replaceAll('陆家嘴', '珠江新城').replaceAll('外滩', '珠江').replaceAll('申城', '羊城').replaceAll('海派', '岭南').replaceAll('上海', '广州')
      .replaceAll('秋冬鲜果', '当季水果').replaceAll('秋季', '日常').replaceAll('秋雨', '雨天')
      .replaceAll('深秋', '感恩月').replaceAll('秋意渐深', '感恩月里').replaceAll('秋意渐浓', '感恩相伴')
      .replaceAll('秋日', '感恩月').replaceAll('秋天', '感恩月')
    : Array.isArray(value) ? value.map(cityWords)
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cityWords(item)]))
    : value;
  const updated = cityWords(data);
  const cardNames = {champagne:'羊城鎏金', haipai:'岭南雅紫', amber:'木棉暖杏', jade:'花城青绿', bluegold:'珠江蓝金'};
  for (const card of updated.action.cards.online || []) if (cardNames[card.theme]) card.styleName = cardNames[card.theme];
  const gifts = updated.gifts.items;
  updated.gifts.items = gifts.filter(gift => gift.id !== 'g04');
  const byId = id => updated.gifts.items.find(gift => gift.id === id);
  Object.assign(byId('g01'), {
    name: '广州地标光影书签',
    platform: '京东',
    purchaseUrl: 'https://www.jd.com/brand/167209667ed24a7026be.html?page=2',
    linkType: '京东选款页',
    selectionNote: '选择广州地标款；下单前核对实物材质、礼盒包装与到货价格。'
  });
  Object.assign(byId('g02'), {
    name: '广州陈家祠金属冰箱贴',
    platform: '京东',
    purchaseUrl: 'https://item.jd.com/10125963216034.html',
    linkType: '京东商品页',
    selectionNote: '选择广州陈家祠款；下单前核对价格和广州地址配送。'
  });
  Object.assign(byId('g15'), {
    name: '真丝睡眠眼罩',
    platform: '京东',
    purchaseUrl: 'https://item.jd.com/product/-7AhPq7N1ew2wLK8CGYI5A.html',
    linkType: '京东商品页',
    category: '日常品质生活',
    scenario: '适合重视出行休息、日常睡眠品质的顾客。',
    selectionNote: '购买前核对是否为桑蚕丝、包装、实时价格和配送。'
  });
  const featuredGifts = [
    {id:'featured-orange',name:'贝贝南瓜·脐橙水果礼盒',category:'本月主推',components:'贝贝南瓜、脐橙',estimatedPriceRange:'预计 30 元起',image:'assets/featured/orange-pumpkin.webp',freshGift:true},
    {id:'featured-wreath',name:'感恩花环礼',category:'本月主推',components:'感恩节花环、稻草人公仔',estimatedPriceRange:'预计 20–30 元',image:'assets/featured/wreath-doll.webp'},
    {id:'featured-home',name:'感恩节暖心行动·到家装饰',category:'本月主推',components:'门口藤条、南瓜灯笼、稻草人小摆饰、感恩主题装饰拉旗、感恩节门挂、窗户静电贴等，按业主家实际空间选择',estimatedPriceRange:'预计 50 元',image:'assets/featured/home-decoration.webp'},
    {id:'featured-pear',name:'贝贝南瓜·秋月梨水果礼盒',category:'本月主推',components:'贝贝南瓜、秋月梨',estimatedPriceRange:'预计 30 元起',image:'assets/featured/pear-pumpkin.webp',freshGift:true},
    {id:'featured-chestnut',name:'感恩栗薯礼盒',category:'本月主推',components:'板栗、红薯',estimatedPriceRange:'预计 20–30 元',image:'assets/featured/chestnut-sweet-potato.webp'}
  ].map(gift => ({...gift,priority:true,requestOnly:true,scenario:'由伙伴登记需求，项目组统一确认和准备。'}));
  updated.gifts.items.forEach(gift => { gift.priority = false; });
  updated.gifts.items = [...featuredGifts,...updated.gifts.items];
  updated.gifts.recommendedIds = featuredGifts.map(gift => gift.id);
  updated.gifts.freshFruitGuide = undefined;
  window.GRATITUDE_CONTENT = updated;
})();

