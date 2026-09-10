        // 1. VOID CHAT LOGIC
        window.initVoidChat = function() {
            // 1. Tạo ID tạm thời nếu chưa có
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const userRank = window.currentUserRank || "Cadet";
            window.voidIdentity = `${userRank}#${randomNum}`;
            
            const identityDisplay = document.getElementById('void-user-identity');
            if (identityDisplay) identityDisplay.innerText = "ID: " + window.voidIdentity;

            // 2. Truy vấn dữ liệu (Sắp xếp theo thời gian tạo)
            const q = query(collection(db, "void_messages"), orderBy("createdAt", "asc"), limit(50));
            
            onSnapshot(q, (snapshot) => {
                const chatBox = document.getElementById('void-messages');
                chatBox.innerHTML = '<div style="text-align: center; color: #444; margin-bottom: 15px; font-style: italic; font-size: 0.8rem;">-- Kênh đã được mã hóa --</div>';
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // So sánh ID để biết tin nhắn nào là của mình
                    const isMe = data.identity === window.voidIdentity;
                    window.appendVoidMessage(data.identity, data.text, isMe);
                });
            });
        };

        window.appendVoidMessage = function(identity, text, isMe) {
            const chatBox = document.getElementById('void-messages');
            const row = document.createElement('div');
            row.className = `void-msg-row ${isMe ? 'me' : ''}`;
            const idDiv = document.createElement('div'); idDiv.className = 'void-identity'; idDiv.innerText = identity;
            const contentDiv = document.createElement('div'); contentDiv.className = 'void-content'; contentDiv.innerText = text;
            row.appendChild(idDiv); row.appendChild(contentDiv);
            chatBox.appendChild(row);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        //2. HÀM NHẬP TIN NHẮN -> ENTER ĐỂ ĐẨY TIN NHẮN LÊN
        window.sendVoidMessage = async function() {
            const input = document.getElementById('void-input-field');
            const text = input.value.trim();
            
            if (!text) return; // Không gửi tin nhắn rỗng

            try {
                await addDoc(collection(db, "void_messages"), {
                    identity: window.voidIdentity || "Unknown Pilot",
                    text: text,
                    createdAt: serverTimestamp(), // Dùng cái này để sắp xếp tin nhắn chính xác
                    timestamp: serverTimestamp() // Dùng cho hiển thị thời gian
                });
                
                input.value = ''; // Gửi xong thì xóa chữ trong ô nhập
            } catch (e) {
                console.error("Lỗi truyền tín hiệu:", e);
            }
        };

        // Lắng nghe phím Enter để gửi tin cho nhanh
        document.getElementById('void-input-field').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendVoidMessage();
            }
        });