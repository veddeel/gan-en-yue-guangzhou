const { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } = window.LANDZ_CONFIG || {};

const el = (id) => document.getElementById(id);
let supabase = null, importRows = [], inventory = [];
const aliases = {
  name: ["name", "礼物名称", "名称"], category: ["category", "品类", "分类"], brand: ["brand", "品牌"], price_band: ["price_band", "预算档", "价格区间"],
  market_price: ["market_price", "参考价", "市场价"], scenarios: ["scenarios", "适用场景", "场景"], recommendation: ["recommendation", "推荐理由", "推荐语"],
  source_type: ["source_type", "来源类型", "特色"], purchase_url: ["purchase_url", "采购链接", "购买链接"], image_url: ["image_url", "图片链接", "图片"],
  published: ["published", "上架", "是否上架"], sort_order: ["sort_order", "排序"]
};
function setStatus(target, message, isError = false) { target.textContent = message; target.style.color = isError ? "#a52536" : "#2f665b"; }

async function init() {
  el("login-email").value = ADMIN_EMAIL; bindEvents();
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    el("setup-notice").hidden = false; el("send-magic-link").disabled = true;
    setStatus(el("login-status"), "线上数据库接入后即可发送管理员登录邮件。", true); return;
  }
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await supabase.auth.getSession(); await applySession(data.session);
    supabase.auth.onAuthStateChange((_event, session) => setTimeout(() => applySession(session), 0));
  } catch (error) { el("setup-notice").hidden = false; setStatus(el("login-status"), `数据库连接失败：${error.message}`, true); }
}
function bindEvents() {
  el("send-magic-link").addEventListener("click", sendMagicLink); el("logout-button").addEventListener("click", async () => supabase && supabase.auth.signOut());
  el("data-file").addEventListener("change", handleFile); el("confirm-import").addEventListener("click", confirmImport); el("gift-form").addEventListener("submit", saveGift);
  el("reset-form").addEventListener("click", resetForm); el("refresh-data").addEventListener("click", loadInventory); el("inventory-table").addEventListener("click", handleInventoryAction);
}
async function sendMagicLink() {
  if (!supabase) return; el("send-magic-link").disabled = true; setStatus(el("login-status"), "正在发送登录邮件…");
  const { error } = await supabase.auth.signInWithOtp({ email: ADMIN_EMAIL, options: { emailRedirectTo: `${location.origin}${location.pathname}`, shouldCreateUser: true } });
  el("send-magic-link").disabled = false; setStatus(el("login-status"), error ? `发送失败：${error.message}` : `登录邮件已发送到 ${ADMIN_EMAIL}，请点击邮件中的链接。`, Boolean(error));
}
async function applySession(session) {
  const allowed = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(); el("login-panel").hidden = allowed; el("admin-dashboard").hidden = !allowed;
  if (session && !allowed) { await supabase.auth.signOut(); setStatus(el("login-status"), "此邮箱没有管理员权限。", true); }
  if (allowed) { el("session-email").textContent = session.user.email; await loadInventory(); }
}
async function handleFile(event) {
  const file = event.target.files?.[0]; if (!file) return;
  if (file.size > 8 * 1024 * 1024) return setStatus(el("import-status"), "文件不能超过 8MB。", true);
  if (!window.XLSX) return setStatus(el("import-status"), "表格解析组件尚未加载，请检查网络后重试。", true);
  try {
    const workbook = window.XLSX.read(await file.arrayBuffer(), { type: "array" });
    importRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" }).map(normalizeRow);
    renderImportPreview(importRows, validateRows(importRows));
  } catch (error) { importRows = []; setStatus(el("import-status"), `无法读取文件：${error.message}`, true); }
}
function normalizeRow(raw) {
  const row = {}; Object.entries(aliases).forEach(([field, names]) => { const found = names.find((name) => Object.prototype.hasOwnProperty.call(raw, name)); row[field] = found ? raw[found] : ""; });
  row.market_price = Number(row.market_price || 0); row.sort_order = Number(row.sort_order || 100); row.published = ![false, "false", "否", "下架", 0, "0"].includes(row.published);
  row.price_band = String(row.price_band).replace(/[–—~至]/g, "-").replace(/以上|元|\s/g, ""); if (["60-", ">60", "60"].includes(row.price_band)) row.price_band = "60+"; return row;
}
function validateRows(rows) {
  const errors = []; rows.forEach((row, index) => { const line = index + 2; if (!row.name) errors.push(`第 ${line} 行缺少礼物名称`); if (!row.category) errors.push(`第 ${line} 行缺少品类`); if (!["20-30", "30-60", "60+"].includes(row.price_band)) errors.push(`第 ${line} 行预算档不正确`); if (!(row.market_price > 0)) errors.push(`第 ${line} 行参考价应大于 0`); if (row.purchase_url && !/^https?:\/\//i.test(row.purchase_url)) errors.push(`第 ${line} 行采购链接格式不正确`); }); return errors;
}
function renderImportPreview(rows, errors) {
  el("import-summary").hidden = false; el("import-preview").hidden = false;
  el("import-summary").innerHTML = errors.length ? `<strong>发现 ${errors.length} 个问题</strong><br>${errors.slice(0, 8).map(escapeHtml).join("<br>")}` : `<strong>校验通过</strong>：共 ${rows.length} 条，可确认导入。相同名称会更新原记录。`;
  el("import-preview").innerHTML = `<table class="data-table"><thead><tr><th>礼物名称</th><th>品类</th><th>预算档</th><th>参考价</th><th>状态</th></tr></thead><tbody>${rows.slice(0, 30).map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.price_band)}</td><td>¥${row.market_price}</td><td>${row.published ? "上架" : "下架"}</td></tr>`).join("")}</tbody></table>`;
  el("confirm-import").disabled = !rows.length || errors.length > 0 || !supabase; setStatus(el("import-status"), errors.length ? "请修正表格后重新选择文件。" : "预览完成，尚未写入数据库。", errors.length > 0);
}
async function confirmImport() {
  if (!supabase || !importRows.length) return; el("confirm-import").disabled = true; setStatus(el("import-status"), `正在导入 ${importRows.length} 条数据…`);
  const { error } = await supabase.from("gifts").upsert(importRows, { onConflict: "name" }); setStatus(el("import-status"), error ? `导入失败：${error.message}` : `成功导入 ${importRows.length} 条，前台刷新后即可看到。`, Boolean(error));
  if (!error) { importRows = []; el("data-file").value = ""; await loadInventory(); } el("confirm-import").disabled = false;
}
async function saveGift(event) {
  event.preventDefault(); if (!supabase) return; const submit = event.submitter; submit.disabled = true; setStatus(el("form-status"), "正在保存…");
  let imageUrl = inventory.find((item) => item.id === el("gift-id").value)?.image_url || ""; const image = el("gift-image").files?.[0];
  if (image) {
    if (image.size > 3 * 1024 * 1024) { setStatus(el("form-status"), "图片不能超过 3MB。", true); submit.disabled = false; return; }
    const path = `${Date.now()}-${crypto.randomUUID()}.${image.name.split(".").pop().toLowerCase()}`; const upload = await supabase.storage.from("gift-images").upload(path, image, { cacheControl: "3600" });
    if (upload.error) { setStatus(el("form-status"), `图片上传失败：${upload.error.message}`, true); submit.disabled = false; return; } imageUrl = supabase.storage.from("gift-images").getPublicUrl(path).data.publicUrl;
  }
  const record = { name: el("gift-name").value.trim(), category: el("gift-category").value.trim(), brand: el("gift-brand").value.trim(), price_band: el("gift-band").value, market_price: Number(el("gift-price").value), scenarios: el("gift-scenarios").value.trim(), recommendation: el("gift-recommendation").value.trim(), purchase_url: el("gift-url").value.trim(), image_url: imageUrl, published: el("gift-published").checked, sort_order: Number(el("gift-sort").value || 100), source_type: "管理员维护" };
  const id = el("gift-id").value; const query = id ? supabase.from("gifts").update(record).eq("id", id) : supabase.from("gifts").insert(record); const { error } = await query;
  setStatus(el("form-status"), error ? `保存失败：${error.message}` : "保存成功，前台刷新后即可同步。", Boolean(error)); if (!error) { resetForm(); await loadInventory(); } submit.disabled = false;
}
async function loadInventory() {
  if (!supabase) return; el("inventory-table").innerHTML = "正在读取…"; const { data, error } = await supabase.from("gifts").select("*").order("sort_order", { ascending: true });
  if (error) { el("inventory-table").textContent = `读取失败：${error.message}`; return; } inventory = data || [];
  el("inventory-table").innerHTML = inventory.length ? `<table class="data-table"><thead><tr><th>状态</th><th>礼物名称</th><th>品类</th><th>预算档</th><th>参考价</th><th>排序</th><th>操作</th></tr></thead><tbody>${inventory.map((item) => `<tr><td><span class="status-dot ${item.published ? "live" : "draft"}">${item.published ? "上架" : "下架"}</span></td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.price_band)}</td><td>¥${item.market_price}</td><td>${item.sort_order}</td><td><div class="row-actions"><button class="mini-button" data-action="edit" data-id="${item.id}">编辑</button><button class="mini-button danger" data-action="delete" data-id="${item.id}">删除</button></div></td></tr>`).join("")}</tbody></table>` : "暂无数据，请新增或导入。";
}
async function handleInventoryAction(event) {
  const button = event.target.closest("button[data-action]"); if (!button) return; const item = inventory.find((row) => row.id === button.dataset.id); if (!item) return;
  if (button.dataset.action === "edit") {
    const values = { "gift-id": item.id, "gift-name": item.name, "gift-category": item.category, "gift-brand": item.brand, "gift-band": item.price_band, "gift-price": item.market_price, "gift-scenarios": item.scenarios, "gift-recommendation": item.recommendation, "gift-url": item.purchase_url, "gift-sort": item.sort_order };
    Object.entries(values).forEach(([id, value]) => { el(id).value = value ?? ""; }); el("gift-published").checked = item.published; el("gift-form").scrollIntoView({ behavior: "smooth" }); setStatus(el("form-status"), `正在编辑：${item.name}`);
  } else { if (!window.confirm(`确定删除“${item.name}”吗？此操作无法撤销。`)) return; const { error } = await supabase.from("gifts").delete().eq("id", item.id); if (error) window.alert(`删除失败：${error.message}`); else await loadInventory(); }
}
function resetForm() { el("gift-form").reset(); el("gift-id").value = ""; el("gift-published").checked = true; el("gift-sort").value = 100; setStatus(el("form-status"), ""); }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
init();
