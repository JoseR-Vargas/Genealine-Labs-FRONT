class Dashboard {
    constructor() {
        this.messages = [];
        this.modal = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMessages();
    }

    bindEvents() {
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadMessages());
        document.addEventListener('click', (e) => {
            if (e.target.closest('.message-item')) {
                const id = e.target.closest('.message-item').dataset.id;
                this.openModal(this.messages.find(m => m._id === id));
            }
            if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            if (e.target.closest('#modalDeleteBtn')) {
                this.deleteMessage();
            }
        });
    }

    async loadMessages() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            console.log('🔄 Cargando mensajes desde:', ApiService.BASE_URL);
            this.messages = await ApiService.getMessages();
            console.log('✅ Mensajes cargados:', this.messages);
            
            if (this.messages && this.messages.length > 0) {
                this.renderMessages();
                this.updateStats();
            } else {
                this.showEmpty();
            }
        } catch (error) {
            console.error('❌ Error al cargar mensajes:', error);
            this.showError('Error al conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } finally {
            this.isLoading = false;
        }
    }

    renderMessages() {
        const container = document.getElementById('messagesList');
        if (!this.messages || !this.messages.length) {
            this.showEmpty();
            return;
        }
        
        try {
            container.innerHTML = this.messages.map(msg => `
                <div class="message-item" data-id="${msg._id}">
                    <div class="message-header">
                        <div class="message-info">
                            <h3 class="message-name">${this.escape(msg.nombre)} ${this.escape(msg.apellido)}</h3>
                            <p class="message-email">${this.escape(msg.email)}</p>
                        </div>
                        <div class="message-meta">
                            <span class="message-date">${this.formatDate(msg.createdAt)}</span>
                        </div>
                    </div>
                    <div class="message-preview">
                        ${this.escape(msg.mensaje.substring(0, 150))}${msg.mensaje.length > 150 ? '...' : ''}
                    </div>
                </div>
            `).join('');
            
            this.hideLoading();
        } catch (error) {
            console.error('Error al renderizar mensajes:', error);
            this.showError('Error al mostrar los mensajes');
        }
    }

    openModal(message) {
        if (!message) return;
        this.modal = message;
        document.getElementById('modalBody').innerHTML = `
            <div class="message-detail">
                <div class="detail-field">
                    <label>Nombre:</label>
                    <div>${this.escape(message.nombre)} ${this.escape(message.apellido)}</div>
                </div>
                <div class="detail-field">
                    <label>Email:</label>
                    <div>${this.escape(message.email)}</div>
                </div>
                <div class="detail-field">
                    <label>Celular:</label>
                    <div>${this.escape(message.celular)}</div>
                </div>
                <div class="detail-field">
                    <label>Fecha:</label>
                    <div>${this.formatDate(message.createdAt)}</div>
                </div>
                <div class="detail-field">
                    <label>Mensaje:</label>
                    <div>${this.escape(message.mensaje).replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `;
        document.getElementById('messageModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('messageModal').classList.remove('show');
        this.modal = null;
    }

    async deleteMessage() {
        if (!this.modal || !confirm('¿Eliminar este mensaje?')) return;
        try {
            await ApiService.deleteMessage(this.modal._id);
            this.closeModal();
            this.loadMessages();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el mensaje');
        }
    }

    updateStats() {
        const totalElement = document.getElementById('totalMessages');
        if (totalElement) {
            totalElement.textContent = this.messages ? this.messages.length : 0;
        }
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'flex';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('messagesList').style.display = 'none';
        this.hideError();
    }

    showEmpty() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('messagesList').style.display = 'none';
        this.hideError();
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('messagesList').style.display = 'block';
        this.hideError();
    }

    showError(message) {
        // Crear o mostrar elemento de error
        let errorElement = document.getElementById('errorState');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'errorState';
            errorElement.className = 'error-state';
            errorElement.innerHTML = `
                <div class="error-state__icon">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <h3 class="error-state__title">Error de Conexión</h3>
                <p class="error-state__description"></p>
                <button class="btn btn--primary" onclick="dashboard.loadMessages()">
                    <i class="bi bi-arrow-clockwise"></i>
                    Reintentar
                </button>
            `;
            document.getElementById('messagesContainer').appendChild(errorElement);
        }
        
        errorElement.querySelector('.error-state__description').textContent = message;
        errorElement.style.display = 'flex';
        
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('messagesList').style.display = 'none';
    }

    hideError() {
        const errorElement = document.getElementById('errorState');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    formatDate(date) {
        try {
            return new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(date));
        } catch {
            return 'Fecha inválida';
        }
    }

    escape(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Crear instancia global
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});
