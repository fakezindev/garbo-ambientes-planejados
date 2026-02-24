import { useState, useEffect } from 'react';
import api from '../services/api';

function MeusProjetos() {
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Daqui a pouco vamos criar essa rota no Java para buscar só os projetos do cliente logado!
        // api.get('/projects/my-projects')
        //     .then(response => setProjetos(response.data))
        //     .catch(err => console.error("Erro ao buscar projetos", err))
        //     .finally(() => setLoading(false));
        
        // Simulação por enquanto
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <h2>Carregando seus projetos dos sonhos... ✨</h2>;
    }

    return (
        <div className="meus-projetos-container">
            <h2>Meus Projetos</h2>
            <p>Acompanhe a evolução do seu ambiente.</p>
            
            {/* Aqui vai entrar o grid e o carrossel na próxima etapa! */}
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc' }}>
                <p>O carrossel com as fotos da obra vai aparecer aqui.</p>
            </div>
        </div>
    );
}

export default MeusProjetos;