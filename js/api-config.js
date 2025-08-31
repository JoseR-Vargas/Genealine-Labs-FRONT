class ApiConfig {
    static getBaseUrl() {
        // Para desarrollo local, siempre usar localhost:3001
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '' ||
            window.location.port === '3000' ||
            window.location.port === '5500' ||
            window.location.port === '5501') {
            return 'http://localhost:3001';
        }
        
        return 'https://your-genealina-backend.herokuapp.com';
    }
}

class ApiService {
    static get BASE_URL() {
        const url = ApiConfig.getBaseUrl();
        console.log('🌐 API Base URL:', url);
        console.log('🌐 Current location:', window.location.href);
        return url;
    }
    
    static async getMessages() {
        try {
            console.log('🔄 Haciendo petición GET a:', `${this.BASE_URL}/contacts`);
            
            const response = await fetch(`${this.BASE_URL}/contacts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('📡 Respuesta recibida:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📦 Datos recibidos:', data);
            
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Error en getMessages:', error);
            
            // Verificar si es un error de red
            if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
                throw new Error('Error de conexión: No se puede conectar al servidor. Verifica que esté ejecutándose en ' + this.BASE_URL);
            }
            
            throw error;
        }
    }
    
    static async createMessage(data) {
        try {
            console.log('🔄 Enviando mensaje:', data);
            
            const response = await fetch(`${this.BASE_URL}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: data.nombre || data.name,
                    apellido: data.apellido || data.lastname || '',
                    email: data.email,
                    celular: data.celular || data.phone || '',
                    mensaje: data.mensaje || data.message
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Mensaje creado:', result);
            return result;
        } catch (error) {
            console.error('❌ Error al crear mensaje:', error);
            throw error;
        }
    }
    
    static async deleteMessage(id) {
        try {
            console.log('🗑️ Eliminando mensaje:', id);
            
            const response = await fetch(`${this.BASE_URL}/contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            console.log('✅ Mensaje eliminado');
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar mensaje:', error);
            throw error;
        }
    }
    
    // Método para verificar si el servidor está disponible
    static async checkServerHealth() {
        try {
            const response = await fetch(`${this.BASE_URL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}


