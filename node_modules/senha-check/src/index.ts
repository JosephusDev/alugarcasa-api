// Definição da classe ValidadorSenha (sem mudanças no código principal)
type Regras = {
  min?: number;
  max?: number;
  maiusculas?: number;
  minusculas?: number;
  digitos?: number;
  carcateresEspeciais?: number;
};

type RegrasNegadas = {
  espaco?: boolean;
  digitos?: boolean;
};

type DetalhesOpcoes = {
  detalhes?: boolean;
};

class ValidadorSenha {
  private regras: Regras;
  private regrasNegadas: RegrasNegadas;

  constructor() {
      this.regras = {};
      this.regrasNegadas = {};
  }

  min(valor: number): this {
      this.regras.min = valor;
      return this;
  }

  max(valor: number): this {
      this.regras.max = valor;
      return this;
  }

  temMaiusculas(valor: number = 1): this {
      this.regras.maiusculas = valor;
      return this;
  }

  temMinusculas(valor: number = 1): this {
      this.regras.minusculas = valor;
      return this;
  }

  digitos(valor: number = 1): this {
      this.regras.digitos = valor;
      return this;
  }

  temCaracteresEspeciais(valor: number = 1): this {
      this.regras.carcateresEspeciais = valor;
      return this;
  }

  sem() {
      return {
          espaco: (): this => {
              this.regrasNegadas.espaco = true;
              return this;
          },
          digitos: (): this => {
              this.regrasNegadas.digitos = true;
              return this;
          }
      };
  }

  validar(senha: string, { detalhes = false }: DetalhesOpcoes = {}): string | boolean | string[] {
      const falhas: string[] = [];

      if (this.regras.min && senha.length < this.regras.min) {
          falhas.push(`A senha precisa ter pelo menos ${this.regras.min} caracteres.`);
      }
      if (this.regras.max && senha.length > this.regras.max) {
          falhas.push(`A senha deve ter no máximo ${this.regras.max} caracteres.`);
      }

      const maiusculas = senha.replace(/[^A-Z]/g, "").length;
      if (this.regras.maiusculas && maiusculas < this.regras.maiusculas) {
          falhas.push(`A senha precisa ter pelo menos ${this.regras.maiusculas} letra(s) maiúscula(s).`);
      }

      const minusculas = senha.replace(/[^a-z]/g, "").length;
      if (this.regras.minusculas && minusculas < this.regras.minusculas) {
          falhas.push(`A senha precisa ter pelo menos ${this.regras.minusculas} letra(s) minúscula(s).`);
      }

      const digitos = senha.replace(/[^0-9]/g, "").length;
      if (this.regras.digitos && digitos < this.regras.digitos) {
          falhas.push(`A senha precisa ter pelo menos ${this.regras.digitos} dígito(s).`);
      }

      const carcateresEspeciais = senha.replace(/[a-zA-Z0-9]/g, "").length;
      if (this.regras.carcateresEspeciais && carcateresEspeciais < this.regras.carcateresEspeciais) {
          falhas.push(`A senha precisa ter pelo menos ${this.regras.carcateresEspeciais} caractere(s) especial(is).`);
      }

      if (this.regrasNegadas.espaco && /\s/.test(senha)) {
          falhas.push("A senha não pode conter espaços.");
      }

      if (this.regrasNegadas.digitos && digitos > 0) {
          falhas.push("A senha não pode conter dígitos.");
      }

      if (detalhes) {
          return falhas.length > 0 ? falhas : "Senha válida!";
      }

      return falhas.length === 0;
  }

  forca(senha: string): number {
      let forca = 0;

      if (senha.length >= 8) forca++;
      if (senha.length >= 12) forca++;

      const maiusculas = /[A-Z]/.test(senha);
      const minusculas = /[a-z]/.test(senha);
      const digitos = /[0-9]/.test(senha);
      const especiais = /[^a-zA-Z0-9]/.test(senha);

      if (maiusculas) forca++;
      if (minusculas) forca++;
      if (digitos) forca++;
      if (especiais) forca++;

      const repetido = /(\w)\1\1/.test(senha);
      const sequencia = /123|234|345|456|567|678|789|012|abc|bcd|cde/.test(senha);

      if (repetido || sequencia) forca--;

      return Math.max(0, Math.min(4, forca));
  }
}

// Exportando de forma compatível com CommonJS e ES Modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ValidadorSenha;
  module.exports.default = ValidadorSenha; // Compatível com ESM
}
