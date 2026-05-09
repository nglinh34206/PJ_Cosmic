// ==========================================
// 1. KẾT NỐI SUPABASE
// ==========================================

const supabaseUrl = 'https://xvwxryquxiphepyqatbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2d3hyeXF1eGlwaGVweXFhdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDcwMDEsImV4cCI6MjA4MjI4MzAwMX0.H5i14vJWotgWcTos6znXFHnUQXulKjpvR4gU4979VFA';

const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

const BUCKET_NAME = 'MVP bucket';


// ==========================================
// 2. TẢI VÀ RENDER DANH SÁCH TÀI LIỆU
// ==========================================

async function loadDocuments() {
    const container = document.getElementById('resource-list-container');
    container.innerHTML = '<p style="text-align: center; color: var(--neon-cyan); margin-top: 20px;">Đang quét radar tìm tài liệu...</p>';

    try {
        const { data, error } = await _supabase.storage.from(BUCKET_NAME).list();
        if (error) throw error;

        const files = data.filter(f => f.name !== '.emptyFolderPlaceholder' && f.name !== '');

        if (files.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-dim); margin-top: 20px;">Trạm tài liệu hiện đang trống.</p>';
            return;
        }

        container.innerHTML = '';

        files.forEach(file => {
            const { data: publicUrlData } = _supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
            const fileUrl = publicUrlData.publicUrl;

            // cleanName chỉ dùng để HIỂN THỊ — file.name gốc dùng để tách subject/docType
            const cleanName = file.name
                .replace('.pdf', '').replace('.doc', '').replace('.docx', '')
                .replaceAll('_', ' ');

            const sizeMB = file.metadata?.size
                ? (file.metadata.size / 1024 / 1024).toFixed(2) + ' MB'
                : 'N/A';

            const div = document.createElement('div');
            div.className = 'resource-item';

            // FIX BUG #1 & #3: Gọi đúng hàm openCosmicDocument, truyền file.name GỐC (có dấu _)
            div.onclick = () => openDocument(file.name, fileUrl, cleanName);

            div.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span class="res-icon">📄</span>
                    <div class="res-info">
                        <h3>${cleanName}</h3>
                        <p>Dung lượng: ${sizeMB}</p>
                    </div>
                </div>
                <div style="color: var(--neon-cyan); font-weight: bold;">Đọc ></div>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error("Lỗi radar:", err);
        container.innerHTML = '<p style="text-align: center; color: #FF4500; margin-top: 20px;">Mất kết nối với trạm Supabase. Vui lòng check lại quyền truy cập (RLS).</p>';
    }
}


// ==========================================
// 3. MỞ TÀI LIỆU + KÍCH HOẠT PANEL FEEDBACK
// ==========================================

function openDocument(fileName, fileUrl, docTitle) {
    // Ẩn danh sách, hiện viewer
    document.getElementById('list-view-wrapper').style.display = 'none';

    const viewer = document.getElementById('inline-viewer-container');
    viewer.style.display = 'flex';

    // Gán tên và link
    document.getElementById('inline-doc-title').innerText = docTitle;
    document.getElementById('inline-doc-iframe').src = fileUrl;

    // Phục hồi nút vote
    const voteContainer = document.getElementById('vote-buttons');
    if (voteContainer) {
        voteContainer.innerHTML = `
            <button onclick="voteDoc('like')" style="background: rgba(0, 221, 235, 0.1); border: 1px solid var(--neon-cyan); color: #fff; padding: 4px 15px; border-radius: 20px; cursor: pointer;">👍 Hữu ích</button>
            <button onclick="voteDoc('dislike')" style="background: rgba(255, 77, 77, 0.1); border: 1px solid #ff4d4d; color: #fff; padding: 4px 15px; border-radius: 20px; cursor: pointer;">👎 Chưa ổn</button>
        `;
    }

    // Tách subject và docType từ file.name GỐC (VD: "CTDLGT_TQ_1.pdf" → subject=CTDLGT, docType=TQ)
    const baseName = fileName.replace('.pdf', '').replace('.docx', '').replace('.doc', '');
    const parts = baseName.split('_');

    if (parts.length >= 2) {
        const subject = parts[0];
        const docType = parts[1];
        fetchAndShowFeedback(subject, docType);
    } else {
        // Không đúng cú pháp tên file → chỉ ẩn panel đi
        document.getElementById('doc-feedback-panel').style.display = 'none';
    }

    // Cuộn tới viewer
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.body.style.overflow = 'hidden';
}


// ==========================================
// 4. FETCH FEEDBACK TỪ SUPABASE VÀ HIỂN THỊ
// ==========================================

async function fetchAndShowFeedback(subject, docType) {
    const panel = document.getElementById('doc-feedback-panel');
    const contentDiv = document.getElementById('doc-feedback-content');

    panel.style.display = 'flex';
    contentDiv.innerHTML = `<div style="text-align: center; color: #aaa;">Đang quét dữ liệu... ⏳</div>`;

    // FIX BUG #2: Dùng _supabase (không phải supabaseClient)
    const { data, error } = await _supabase
        .from('cosmic_feedbacks')
        .select('*')
        .eq('subject', subject)
        .eq('doc_type', docType)
        .order('created_at', { ascending: false });

    if (error) {
        contentDiv.innerHTML = `<div style="color: #ff4d4d;">Lỗi đường truyền!</div>`;
        console.error("fetchAndShowFeedback error:", error);
        return;
    }

    if (data && data.length > 0) {
        contentDiv.innerHTML = data.map(item => `
            <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #00DDEB; padding: 10px; border-radius: 4px;">
                <div style="color: #00DDEB; font-size: 0.75rem; margin-bottom: 5px;">📍 ${new Date(item.created_at).toLocaleDateString('vi-VN')}</div>
                <div style="line-height: 1.4;">${item.feedback}</div>
            </div>
        `).join('');
    } else {
        contentDiv.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 2rem; margin: 0;">🛡️</p>
                <p style="color: #aaa; margin-top: 10px;">Tài liệu này an toàn, chưa có ai báo cáo vấn đề gì.</p>
            </div>
        `;
    }
}


// ==========================================
// 5. ĐÓNG TÀI LIỆU
// ==========================================

function closeDocument() {
    document.getElementById('inline-viewer-container').style.display = 'none';
    document.getElementById('doc-feedback-panel').style.display = 'none';
    document.getElementById('list-view-wrapper').style.display = 'block';
    document.getElementById('inline-doc-iframe').src = '';
    document.body.style.overflow = 'auto';
}


// ==========================================
// 6. VOTE TÀI LIỆU
// ==========================================

function voteDoc(voteType) {
    const docTitle = document.getElementById('inline-doc-title').innerText;

    if (typeof gtag === 'function') {
        gtag('event', 'document_vote', {
            'document_name': docTitle,
            'vote_type': voteType
        });
        console.log(`🚀 GA4: [${docTitle}] - Vote [${voteType}]`);
    }

    const voteContainer = document.getElementById('vote-buttons');
    if (voteContainer) {
        voteContainer.innerHTML = `<span style="color: var(--neon-cyan); font-size: 0.95rem; font-style: italic;">✨ Đã ghi nhận, cảm ơn bạn!</span>`;
    }
}


// ==========================================
// 7. CHIA SẺ TÀI LIỆU
// ==========================================

async function shareDocument() {
    const iframe = document.getElementById('inline-doc-iframe');
    if (!iframe || !iframe.src) {
        alert("Không tìm thấy tài liệu để chia sẻ!");
        return;
    }

    const cleanUrl = iframe.src.split('#')[0];
    const shareUrl = window.location.origin + window.location.pathname + '?viewDoc=' + encodeURIComponent(cleanUrl);

    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Tài liệu từ Cosmic Base',
                text: 'Vào đọc tài liệu này cùng mình nhé!',
                url: shareUrl
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('✅ Đã copy link tài liệu! Bạn có thể dán để gửi cho bạn bè.');
        }
    } catch (err) {
        console.error('Lỗi chia sẻ:', err);
    }
}


// ==========================================
// 8. POP-UP GÓP Ý TOÀN CỤC
// ==========================================

function openGlobalFeedback() {
    document.getElementById('global-feedback-modal').style.display = 'flex';
}

function closeGlobalFeedback() {
    document.getElementById('global-feedback-modal').style.display = 'none';
}

async function submitGlobalFeedback(btnElement) {
    const rawSubject = document.getElementById('global-input-subject').value;
    const subject = rawSubject.split(' - ')[0].trim().toUpperCase();
    const docType = document.getElementById('global-input-doctype').value;
    const content = document.getElementById('global-input-content').value.trim();

    if (!subject || !docType || !content) {
        alert("Khoan đã! Bạn điền thiếu môn, phân loại hoặc nội dung rồi kìa.");
        return;
    }

    const originalText = btnElement.innerText;
    btnElement.innerText = "Đang xử lý... 🛸";
    btnElement.disabled = true;
    btnElement.style.opacity = "0.7";

    const { error } = await _supabase
        .from('cosmic_feedbacks')
        .insert([{ subject, doc_type: docType, feedback: content }]);

    if (!error) {
        alert("Ghi nhận thành công! Đội ngũ Cosmic sẽ xử lý sớm nhất. 🚀");
        document.getElementById('global-input-content').value = "";
        document.getElementById('global-input-subject').value = "";
        document.getElementById('global-input-doctype').value = "";
        closeGlobalFeedback();
    } else {
        alert("Hệ thống nghẽn mạng! Hãy thử lại sau nhé.");
        console.error(error);
    }

    btnElement.innerText = originalText;
    btnElement.disabled = false;
    btnElement.style.opacity = "1";
}


// ==========================================
// 9. XỬ LÝ LINK CHIA SẺ KHI VÀO WEB
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const docToOpen = urlParams.get('viewDoc');

    if (docToOpen) {
        const decodedUrl = decodeURIComponent(docToOpen);

        const hubMain = document.getElementById('resource-hub-main');
        if (hubMain) hubMain.style.display = 'none';

        document.querySelectorAll('#resource-list-container').forEach(el => {
            el.style.display = 'none';
        });

        document.getElementById('inline-viewer-container').style.display = 'flex';
        document.getElementById('inline-doc-iframe').src = decodedUrl + '#toolbar=0';
        document.getElementById('inline-doc-title').innerText = "Tài liệu được chia sẻ";

        setTimeout(() => {
            document.getElementById('inline-viewer-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
});


// ==========================================
// 10. KHỞI ĐỘNG
// ==========================================

window.onload = loadDocuments;
