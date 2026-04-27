// ============================================================
// utils/password.js
// Utilitários para validação de força de senha
// ============================================================

export function validarSenha(senha) {
  if (!senha) return 'A senha é obrigatória.';
  if (senha.length < 6 || senha.length > 20) return 'A senha deve ter entre 6 e 20 caracteres.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
  if (!/[0-9]/.test(senha)) return 'A senha deve conter pelo menos um número.';
  return null; // Retorna null se for válida
}
