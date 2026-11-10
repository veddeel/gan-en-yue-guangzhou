(() => {
  let dialog;
  let activeGift;
  function buildDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'featured-request-dialog';
    if (window.GRATITUDE_JINSHUJU?.requestFormUrl) {
      dialog.classList.add('jinshuju-dialog');
      dialog.innerHTML = `<div class="jinshuju-dialog-shell"><div class="request-heading"><div><p>本月主推 · 需求登记</p><h2 id="request-gift-name"></h2></div><button type="button" class="request-close" aria-label="关闭弹窗">×</button></div><p id="request-gift-detail" class="request-gift-detail"></p><iframe class="jinshuju-form-frame" title="礼物需求登记" loading="eager"></iframe><a class="jinshuju-open-link" target="_blank" rel="noopener noreferrer">表单无法显示？在浏览器中打开</a></div>`;
      document.body.append(dialog);
      dialog.querySelector('.request-close').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      return;
    }
    dialog.innerHTML = `<form id="featured-request-form">
      <div class="request-heading"><div><p>本月主推 · 需求登记</p><h2 id="request-gift-name"></h2></div><button type="button" class="request-close" aria-label="关闭弹窗">×</button></div>
      <p id="request-gift-detail" class="request-gift-detail"></p>
      <label>所属店面 <span>*</span><select name="store" required><option value="">请选择店面</option><option>新世界店</option><option>汇悦台店</option><option>誉峰店</option><option>嘉裕店</option><option>珠城店</option><option>保利店</option></select></label>
      <label>所属店组 <span>*</span><select name="store_group" required><option value="">请选择店组</option><option>A组</option><option>B组</option><option>C组</option><option>D组</option></select></label>
      <label>您的姓名 <span>*</span><input name="name" required maxlength="40" autocomplete="name" placeholder="请输入姓名"></label>
      <label>需要份数 <span>*</span><input name="quantity" required type="number" min="1" max="999" step="1" inputmode="numeric" placeholder="请输入需要的份数"></label>
      <p id="request-status" class="request-status" role="status" aria-live="polite"></p>
      <div class="request-actions"><button class="btn primary" type="submit">提交需求</button><button class="btn request-cancel" type="button">取消</button></div>
    </form>`;
    document.body.append(dialog);
    dialog.querySelector('.request-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.request-cancel').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.querySelector('form').addEventListener('submit', submit);
  }
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const status = dialog.querySelector('#request-status');
    const button = form.querySelector('[type="submit"]');
    const values = new FormData(form);
    const payload = {
      gift_id: activeGift.id,
      gift_name: activeGift.name,
      store: String(values.get('store') || '').trim(),
      store_group: String(values.get('store_group') || '').trim(),
      name: String(values.get('name') || '').trim(),
      quantity: Number(values.get('quantity'))
    };
    if (!payload.store || !payload.store_group || !payload.name || !Number.isInteger(payload.quantity) || payload.quantity < 1 || payload.quantity > 999) {
      status.textContent = '请选择店面和店组，并填写姓名及 1–999 之间的份数。';
      return;
    }
    const endpoint = window.GRATITUDE_ORDER_ENDPOINT;
    if (!endpoint) {status.textContent='登记服务尚未开放，请稍后再试。';return;}
    button.disabled = true;
    status.textContent = '正在提交…';
    try {
      const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (!response.ok) throw new Error(`提交失败（${response.status}），请稍后重试。`);
      status.textContent = '需求已提交，项目组会与您确认。';
      form.reset();
    } catch (error) {
      status.textContent = error.message || '提交失败，请稍后重试。';
    } finally {
      button.disabled = false;
    }
  }
  window.openFeaturedRequest = giftId => {
    activeGift = (window.GRATITUDE_CONTENT?.gifts?.items || []).find(gift => gift.id === giftId && gift.requestOnly);
    if (!activeGift) return;
    if (!dialog) buildDialog();
    dialog.querySelector('#request-gift-name').textContent = activeGift.name;
    dialog.querySelector('#request-gift-detail').textContent = `${activeGift.estimatedPriceRange} · 包含：${activeGift.components}`;
    if (window.GRATITUDE_JINSHUJU?.requestFormUrl) {
      const giftLabels = {
        'featured-orange': '脐橙水果礼盒',
        'featured-wreath': '感恩花环礼',
        'featured-home': '到家装饰',
        'featured-pear': '秋月梨水果礼盒',
        'featured-chestnut': '栗薯礼盒'
      };
      const formUrl = new URL(window.GRATITUDE_JINSHUJU.requestFormUrl);
      formUrl.searchParams.set('x_field_1', giftLabels[activeGift.id] || activeGift.name);
      dialog.querySelector('.jinshuju-form-frame').src = formUrl.toString();
      dialog.querySelector('.jinshuju-open-link').href = formUrl.toString();
      dialog.showModal();
      return;
    }
    dialog.querySelector('#request-status').textContent = '';
    dialog.showModal();
    dialog.querySelector('[name="store"]').focus();
  };
})();
