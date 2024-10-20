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
declare class ValidadorSenha {
    private regras;
    private regrasNegadas;
    constructor();
    min(valor: number): this;
    max(valor: number): this;
    temMaiusculas(valor?: number): this;
    temMinusculas(valor?: number): this;
    digitos(valor?: number): this;
    temCaracteresEspeciais(valor?: number): this;
    sem(): {
        espaco: () => this;
        digitos: () => this;
    };
    validar(senha: string, { detalhes }?: DetalhesOpcoes): string | boolean | string[];
    forca(senha: string): number;
}
