import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function ProjectForm({ onUploadSuccess, projectToEdit, onCancelEdit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PLANEJADOS');
    const [clientName, setClientName] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (projectToEdit) {
            setTitle(projectToEdit.title);
            setDescription(projectToEdit.description);
            setCategory(projectToEdit.category);
            setClientName(projectToEdit.clientName);
            setCompletionDate(projectToEdit.completionDate || '');
        } else {
            clearForm();
        }
    }, [projectToEdit]);

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCategory('PLANEJADOS');
        setClientName('');
        setCompletionDate('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // O Segredo do Upload: FormData
        // O JSON e o Arquivo têm que ir embalados juntos
        const formData = new FormData();

        // 1. O JSON (como string)
        const projectData = JSON.stringify({
            title,
            description,
            category,
            clientName,
            completionDate
        });

        // Atenção: O backend espera uma parte chamada 'data' com content-type application/json
        const jsonBlob = new Blob([projectData], { type: 'application/json' });
        formData.append('data', jsonBlob);

        // 2. A Imagem (se tiver)
        if (image) {
            formData.append('images', image);
        }

        try {
            if (projectToEdit) {
                await api.put(`/projects/${projectToEdit.id}`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'},
                });
                alert('Projeto atualizado com sucesso!');
            } else {
                await api.post('/projects', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('Projeto criado com sucesso!');
            }

            clearForm();
            if (onUploadSuccess) onUploadSuccess();
            if (onCancelEdit) onCancelEdit();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar projeto. ');
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>{projectToEdit ? `Editando: ${projectToEdit.title}` : 'Novo Projeto'}</h2>
                {projectToEdit && (
                    <button onClick={onCancelEdit} style={{background: '#666', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>
                        Cancelar Edição
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder="Cliente" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} />
                <input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} style={inputStyle} />
                <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, minHeight: '80px' }} />
                
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMERCIAL">Comercial</option>
                    <option value="INTERIORES">Interiores</option>
                </select>

                <div style={{ border: '1px dashed #ccc', padding: '15px', textAlign: 'center', borderRadius: '4px' }}>
                    <label style={{ cursor: 'pointer', display: 'block', color: '#555' }}>
                        {image ? `Nova Imagem: ${image.name}` : (projectToEdit ? "Mudar foto atual? (Opcional)" : "📸 Adicionar Foto")}
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setImage(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                </div>

                <button type="submit" disabled={loading} style={{
                    padding: '12px', background: loading ? '#ccc' : (projectToEdit ? '#ffc107' : '#28a745'),
                    color: projectToEdit ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}>
                    {loading ? 'Salvando...' : (projectToEdit ? 'Atualizar Projeto' : 'Cadastrar Projeto')}
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
};

export default ProjectForm;