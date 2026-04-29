import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, Input, Button, PasswordRequirements } from '../components/ui';
import { Save, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { validarSenha } from '../utils/password';
import { formatPhone } from '../utils/formatters';

export default function Perfil() {
    const { user, login } = useAuth();
    const [perfilForm, setPerfilForm] = useState({ email: '', telefone: '' });
    const [senhaForm, setSenhaForm] = useState({ senhaAtual: '', novaSenha: '', confirmaSenha: '' });
    const [salvandoPerfil, setSalvandoPerfil] = useState(false);
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [senhaErro, setSenhaErro] = useState('');

    useEffect(() => {
        const carregarPerfil = async () => {
            try {
                const res = await api.get('/perfil');
                setPerfilForm({
                    email: res.data.email || '',
                    telefone: res.data.telefone || ''
                });
            } catch (err) {
                toast.error('Erro ao carregar dados do perfil.');
            }
        };
        carregarPerfil();
    }, []);

    // Validar senha em tempo real
    useEffect(() => {
        if (senhaForm.novaSenha) {
            const erro = validarSenha(senhaForm.novaSenha);
            if (erro) {
                setSenhaErro(erro);
            } else if (senhaForm.novaSenha !== senhaForm.confirmaSenha && senhaForm.confirmaSenha) {
                setSenhaErro('As senhas não coincidem.');
            } else {
                setSenhaErro('');
            }
        } else {
            setSenhaErro('');
        }
    }, [senhaForm.novaSenha, senhaForm.confirmaSenha]);

    const handlePerfilChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'telefone') {
            value = formatPhone(value);
        }
        setPerfilForm(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleSenhaChange = (e) => {
        setSenhaForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSalvarPerfil = async (e) => {
        e.preventDefault();
        setSalvandoPerfil(true);
        try {
            await api.put('/perfil', perfilForm);
            toast.success('Perfil atualizado com sucesso!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erro ao atualizar perfil.');
        } finally {
            setSalvandoPerfil(false);
        }
    };

    const handleSalvarSenha = async (e) => {
        e.preventDefault();
        
        if (senhaErro) {
            toast.error('Corrija os erros na senha antes de salvar.');
            return;
        }

        if (senhaForm.novaSenha !== senhaForm.confirmaSenha) {
            toast.error('As senhas não coincidem.');
            return;
        }

        setSalvandoSenha(true);
        try {
            await api.put('/perfil/senha', {
                senhaAtual: senhaForm.senhaAtual,
                novaSenha: senhaForm.novaSenha
            });
            toast.success('Senha atualizada com sucesso!');
            setSenhaForm({ senhaAtual: '', novaSenha: '', confirmaSenha: '' });
            
            // Se o usuário tinha a flag de senha não alterada, atualiza o token
            if (!user.senha_alterada) {
                const res = await api.get('/perfil');
                const updateToken = await api.post('/auth/login', { nome: user.nome, senha: senhaForm.novaSenha });
                if (updateToken.data.token) {
                    login(updateToken.data.token, updateToken.data.usuario);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erro ao alterar a senha.');
        } finally {
            setSalvandoSenha(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <User className="text-primary-400" />
                Meu Perfil
            </h1>

            {!user?.senha_alterada && (
                <div className="bg-yellow-600 border border-yellow-500 p-4 rounded-xl flex gap-3 text-white shadow-lg">
                    <AlertCircle className="shrink-0" />
                    <div>
                        <h3 className="font-bold">Bem-vindo!</h3>
                        <p className="text-sm">Por segurança, solicitamos que você altere sua senha provisória neste primeiro acesso.</p>
                    </div>
                </div>
            )}

            <Card>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-gray-400" />
                    Informações de Contato (Opcional)
                </h2>
                <form onSubmit={handleSalvarPerfil} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={perfilForm.email}
                        onChange={handlePerfilChange}
                        placeholder="seu@email.com"
                    />
                    <Input
                        label="Telefone"
                        type="tel"
                        name="telefone"
                        value={perfilForm.telefone}
                        onChange={handlePerfilChange}
                        placeholder="(00) 00000-0000"
                    />
                    <Button type="submit" loading={salvandoPerfil} disabled={salvandoPerfil}>
                        <Save size={18} className="mr-2" /> Salvar Contato
                    </Button>
                </form>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-gray-400" />
                    Alterar Senha
                </h2>
                <form onSubmit={handleSalvarSenha} className="space-y-4">
                    <Input
                        label="Senha Atual"
                        type="password"
                        name="senhaAtual"
                        required
                        maxLength={20}
                        value={senhaForm.senhaAtual}
                        onChange={handleSenhaChange}
                    />
                    
                    <Input
                        label="Nova Senha"
                        type="password"
                        name="novaSenha"
                        required
                        maxLength={20}
                        preventSuggest={true}
                        autoComplete="off"
                        data-lpignore="true"
                        value={senhaForm.novaSenha}
                        onChange={handleSenhaChange}
                    />
                    
                    <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        name="confirmaSenha"
                        required
                        maxLength={20}
                        preventSuggest={true}
                        autoComplete="off"
                        data-lpignore="true"
                        value={senhaForm.confirmaSenha}
                        onChange={handleSenhaChange}
                    />
                    
                    {senhaErro && (
                        <p className="text-red-400 text-sm mt-1">{senhaErro}</p>
                    )}

                    <div className="pt-2">
                        <PasswordRequirements password={senhaForm.novaSenha} />
                    </div>

                    <Button type="submit" loading={salvandoSenha} disabled={salvandoSenha || !!senhaErro}>
                        <Lock size={18} className="mr-2" /> Atualizar Senha
                    </Button>
                </form>
            </Card>
        </div>
    );
}
