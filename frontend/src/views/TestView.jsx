import { useState } from 'react';

function TestView() {
    const [backendStatus, setBackendStatus] = useState('desconhecido');
    const [isChecking, setIsChecking] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    const projectVersion = '0.0.0';
    const projectName = 'Taça das Casas';

    const checks = [
        { id: 1, name: 'React carregado', status: true },
        { id: 2, name: 'TailwindCSS ativo', status: true },
        { id: 3, name: 'Vite em execução', status: true },
        { id: 4, name: 'Backend conectado', status: backendStatus === 'online' },
    ];

    const handleCheckConnection = async () => {
        setIsChecking(true);

        // Simula uma verificação de conexão com delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simula 80% de chance de sucesso
        const isOnline = Math.random() > 0.2;
        setBackendStatus(isOnline ? 'online' : 'offline');
        setLastCheck(new Date().toLocaleTimeString('pt-BR'));
        setIsChecking(false);
    };

    const getStatusColor = () => {
        switch (backendStatus) {
            case 'online':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'offline':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusText = () => {
        switch (backendStatus) {
            case 'online':
                return 'Online ✅';
            case 'offline':
                return 'Offline ❌';
            default:
                return 'Não verificado ⚪';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                        🏆 Página de Teste
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg">
                        Sistema de Gerenciamento de Gincanas Escolares
                    </p>
                </div>

                {/* Project Info Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        Informações do Sistema
                    </h2>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Projeto</span>
                            <span className="text-slate-800 font-semibold mt-1 sm:mt-0">{projectName}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Versão</span>
                            <span className="text-slate-800 font-semibold mt-1 sm:mt-0">v{projectVersion}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                            <span className="text-slate-600 font-medium">Status do Backend</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 sm:mt-0 w-fit ${getStatusColor()}`}>
                                {getStatusText()}
                            </span>
                        </div>

                        {lastCheck && (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-t border-slate-100">
                                <span className="text-slate-600 font-medium">Última verificação</span>
                                <span className="text-slate-500 text-sm mt-1 sm:mt-0">{lastCheck}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Checklist Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        Verificações do Sistema
                    </h2>

                    <ul className="space-y-3">
                        {checks.map((check) => (
                            <li
                                key={check.id}
                                className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50"
                            >
                                <span className="text-slate-700 font-medium">{check.name}</span>
                                <span className={`text-lg ${check.status ? 'text-green-500' : 'text-red-500'}`}>
                                    {check.status ? '✓' : '✗'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={handleCheckConnection}
                        disabled={isChecking}
                        className={`
              inline-flex items-center justify-center gap-2 
              px-8 py-4 rounded-xl font-semibold text-base
              transition-all duration-200
              ${isChecking
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                            }
            `}
                    >
                        {isChecking ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verificando...
                            </>
                        ) : (
                            <>
                                <span className="text-xl">🔌</span>
                                Verificar Conexão
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 text-sm mt-8">
                    Taça das Casas © {new Date().getFullYear()} - Todos os direitos reservados
                </p>
            </div>
        </div>
    );
}

export default TestView;