/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SettingsProps {
  onClearData: () => void;
}

export const Settings = ({ onClearData }: SettingsProps) => {
  return (
    <div className="px-6 pt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ajustes</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Perfil</h3>
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
              R
            </div>
            <div>
              <p className="font-bold text-gray-900">Rafael Solitário</p>
              <p className="text-xs text-gray-500">rafael.solitario@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Dados da Conta</h3>
          <button 
            onClick={() => {
               if(confirm("Tem certeza que deseja apagar todos os dados locais?")) {
                 onClearData();
               }
            }}
            className="w-full text-left py-3 text-red-600 font-medium flex items-center justify-between"
          >
            <span>Limpar Dados do Aplicativo</span>
            <span className="text-[10px] bg-red-50 px-2 py-1 rounded-full">PERIGO</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Sobre o PoupaFácil</h3>
          <div className="space-y-4 text-sm text-gray-500">
             <div className="flex justify-between">
                <span>Versão</span>
                <span className="font-mono">1.2.0-beta</span>
             </div>
             <div className="flex justify-between">
                <span>Desenvolvido em</span>
                <span className="font-mono">AI Studio Build</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-gray-400">
         <p>Orgulhosamente brasileiro 🇧🇷</p>
      </div>
    </div>
  );
};
