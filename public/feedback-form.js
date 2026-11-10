(() => {
  window.mountCentralFeedback = root => {
    if (!root) return;
    root.innerHTML = `<form class="surface central-feedback-form" id="central-feedback-form">
      <h3>把使用感受和建议留在这里</h3>
      <p>提交后直接进入项目组后台，不会打开邮件。</p>
      <label>反馈类型<select name="category" required><option value="优化建议">优化建议</option><option value="物料需求">物料需求</option><option value="使用问题">使用问题</option><option value="其他">其他</option></select></label>
      <label>姓名或所属店面（选填）<input name="author" maxlength="80" placeholder="便于项目组了解情况"></label>
      <label>反馈内容<textarea name="message" required minlength="5" maxlength="2000" rows="5" placeholder="请写下具体问题或建议"></textarea></label>
      <p class="feedback-submit-status" role="status" aria-live="polite"></p>
      <button class="btn primary" type="submit">提交反馈</button>
    </form>`;
    const form=root.querySelector('form'),status=root.querySelector('.feedback-submit-status');
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      if(!window.GRATITUDE_FEEDBACK_ENDPOINT){status.textContent='反馈服务尚未开放，请稍后再试。';return;}
      const values=new FormData(form);
      const payload={category:String(values.get('category')||''),author:String(values.get('author')||'').trim(),message:String(values.get('message')||'').trim()};
      const button=form.querySelector('[type="submit"]');button.disabled=true;status.textContent='正在提交…';
      try{
        const response=await fetch(window.GRATITUDE_FEEDBACK_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const result=await response.json().catch(()=>({}));
        if(!response.ok)throw Error(result.error||`提交失败（${response.status}）`);
        form.reset();status.textContent='已提交，项目组可在后台查看。';
      }catch(error){status.textContent=error.message||'提交失败，请稍后重试。';}
      finally{button.disabled=false;}
    });
  };
})();
