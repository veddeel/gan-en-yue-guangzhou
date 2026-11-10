(() => {
  const gifts = {
    'featured-orange': {
      title: '贝贝南瓜·脐橙水果礼盒',
      script: `您好～十一月感恩月，丽兹行广州团队为您准备了一份贝贝南瓜·脐橙水果礼盒，想把对您的感谢，郑重地送到您身边💜

礼盒中有贝贝南瓜和脐橙。我们喜欢这份礼物明亮、丰盈的样子：圆润的南瓜与金黄的脐橙放在一起，让人想到家中温暖的灯光，也想到与家人分享好时光的喜悦。愿它来到您家时，能为平常的一天添上一点值得微笑的心意。

您的选择，让我们有机会参与您生活中重要的事；您的信任，也让我们不断提醒自己，要把每一次倾听、每一项服务都做得更认真。能得到这份信任，我们始终心怀感谢。

愿您和家人常有相聚的温暖，也常有明朗、顺心的日子。感谢您让我们有机会陪伴和服务您💜`,
      posters: ['orange-soft.jpg', 'orange-guangzhou.jpg']
    },
    'featured-wreath': {
      title: '感恩花环礼',
      script: `您好～感恩月里，我们特别为您准备了一份感恩花环礼，想让这一声“谢谢”，从我们的问候中走出来，留在您每天都会经过的地方💜

礼物中有一只感恩节门挂花环和一只稻草人公仔。花环可以挂在门口，迎接每一次归家；小公仔则为这份感恩节装饰添了一点轻松可爱的气息。希望您推开家门时，能看见这份为您准备的心意，也感受到这个节日里被惦记的温暖。

我们感谢您给予我们的选择与信任。正是因为您愿意与我们交流、让我们了解您在意的事，我们才有机会把服务做得更贴近您的需要。这份信任，我们会放在往后的每一次行动里认真回应。

愿您出门时心怀期待，归家时总有温暖相迎；愿您与家人自在相伴，平安喜乐。感恩有您💜`,
      posters: ['wreath-soft.jpg', 'wreath-guangzhou.jpg']
    },
    'featured-home': {
      title: '感恩节暖心行动·到家装饰',
      script: `您好～这个感恩月，我们为您准备了一份特别的心意，想让温暖的节日祝福，从您每天推开的家门开始💜

我们准备了门口藤条、南瓜灯笼、稻草人小摆饰、感恩主题拉旗、门挂和窗贴等装饰。如果您愿意，伙伴会选在您方便的时间，带上适合您家空间的几样元素，亲手为您布置。我们希望它自然地融入您的家，也希望您每次归来，都能感受到一点被惦记的温暖。

感谢您愿意与我们分享想法，给予我们了解您、服务您的机会。您的选择与信任，我们一直珍惜，也会继续用认真细致的行动来回应。

愿您与家人每次归家都有暖意相迎，在这个感恩月自在相伴、常有欢喜💜`,
      posters: ['home-soft.jpg', 'home-guangzhou.jpg']
    },
    'featured-pear': {
      title: '贝贝南瓜·秋月梨水果礼盒',
      script: `您好～感恩月里，我们为您准备了一份贝贝南瓜·秋月梨水果礼盒。想用一份温柔、丰盈的心意，感谢您一路以来的信任与陪伴💜

礼盒中有贝贝南瓜和秋月梨。两种果实相伴，带着一份朴实而美好的祝愿：愿您的生活充实从容，也愿您与家人总有可以坐下来、慢慢分享的时光。我们希望这份礼物来到您身边时，带去的不只有一份节日问候，还有我们认真记挂着您的心意。

因为您的选择，我们有机会做自己热爱的豪宅服务；因为您的信任，我们也更清楚，每一次沟通与陪伴都值得用心。您给予我们的肯定，我们会珍惜，并用今后更细致的服务来回应。

愿往后的日子，您和家人平安顺遂，所盼皆有回响，生活里常有清甜与欢喜。感恩有您💜`,
      posters: ['pear-soft.jpg', 'pear-guangzhou.jpg']
    },
    'featured-chestnut': {
      title: '感恩栗薯礼盒',
      script: `您好～十一月感恩月，丽兹行广州团队为您准备了一份感恩栗薯礼盒。想把一份踏实、温厚的心意送给您，也借这个机会，认真说一声谢谢💜

礼盒中是板栗和红薯。我们选择这份礼物，想到的是冬日里与家人相聚的温暖：不必有特别的安排，彼此在身边，就已经是一段很好的时光。愿这份礼物能陪您和家人留下这样轻松、亲近的片刻。

您给予我们的信任，让我们有机会被需要，也让我们明白服务的意义，要从关心您真正需要什么开始，落在每一次认真回应中。您的选择与托付，我们一直珍惜，也会继续用行动来感谢。

愿您在忙碌的日子里，始终有人相伴、有暖意可依；愿您和家人平安自在，日日都能收获一点小小的幸福。感谢一路有您💜`,
      posters: ['chestnut-soft.jpg', 'chestnut-guangzhou.jpg']
    }
  };

  const posterLabels = ['暖光版', '广州夜景版'];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  let dialog;
  let currentGift;

  function buildDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'gift-materials-dialog';
    dialog.setAttribute('aria-labelledby', 'gift-materials-title');
    dialog.innerHTML = `<div class="gift-materials-shell">
      <div class="gift-materials-heading"><div><p>感恩月 · 赠礼素材</p><h2 id="gift-materials-title"></h2></div><button class="gift-materials-close" type="button" aria-label="关闭话术与海报">×</button></div>
      <section class="gift-materials-section"><h3>送礼话术</h3><div class="gift-materials-copy" id="gift-materials-copy"></div><div class="gift-materials-tools"><button class="btn primary" type="button" data-copy-gift-script>复制话术</button><span class="gift-materials-status" role="status" aria-live="polite"></span></div></section>
      <section class="gift-materials-section"><h3>赠礼海报</h3><p class="gift-materials-hint">点击图片可查看原图；手机上可长按图片保存，也可以使用下方的下载按钮。</p><div class="gift-materials-posters" id="gift-materials-posters"></div></section>
    </div>`;
    document.body.append(dialog);
    dialog.querySelector('.gift-materials-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.querySelector('[data-copy-gift-script]').addEventListener('click', copyScript);
  }

  async function copyScript() {
    const status = dialog.querySelector('.gift-materials-status');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentGift.script);
      } else {
        const field = document.createElement('textarea');
        field.value = currentGift.script;
        field.style.cssText = 'position:fixed;left:-9999px';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('copy failed');
      }
      status.textContent = '话术已复制，可以按顾客情况调整后发送。';
    } catch {
      status.textContent = '复制失败，请长按上方文字复制。';
    }
  }

  window.openGiftMaterials = giftId => {
    currentGift = gifts[giftId];
    if (!currentGift) return;
    if (!dialog) buildDialog();
    dialog.querySelector('#gift-materials-title').textContent = currentGift.title;
    dialog.querySelector('#gift-materials-copy').innerHTML = currentGift.script.split(/\n\s*\n/).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
    dialog.querySelector('.gift-materials-status').textContent = '';
    dialog.querySelector('#gift-materials-posters').innerHTML = currentGift.posters.map((file, index) => {
      const src = `assets/gift-posters/${file}`;
      const label = posterLabels[index];
      return `<figure class="gift-materials-poster"><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="查看${escapeHtml(currentGift.title)}${label}原图"><img src="${src}" alt="${escapeHtml(currentGift.title)}${label}海报" loading="lazy"></a><figcaption>${label}</figcaption><div class="gift-materials-poster-actions"><a class="btn primary" href="${src}" download="${escapeHtml(currentGift.title)}-${label}.jpg">下载海报</a><a class="btn" href="${src}" target="_blank" rel="noopener noreferrer">查看／保存原图</a></div></figure>`;
    }).join('');
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('.gift-materials-close').focus();
  };
})();
