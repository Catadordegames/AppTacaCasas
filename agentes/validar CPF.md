# Validação de CPF

Documento técnico de referência para a implementação do algoritmo de validação do **Cadastro de Pessoas Físicas (CPF)** brasileiro.

---

## 1. Verificação Preliminar

Antes de aplicar o algoritmo matemático, realize as seguintes checagens:

- O CPF deve conter **11 dígitos numéricos**.
- CPFs com todos os dígitos iguais devem ser **rejeitados**.

> Exemplos de CPFs falsos (dígitos iguais):
>
> ```
> 111.111.111-11
> 222.222.222-22
> 000.000.000-00
> ```
>
> Embora sejam matematicamente válidos pelo algoritmo, esses números não correspondem a CPFs reais emitidos pela Receita Federal.

---

## 2. Cálculo do 1º Dígito Verificador (10º dígito)

Siga os passos abaixo para calcular o primeiro dígito verificador:

1. Considere os **9 primeiros dígitos** do CPF.
2. Multiplique cada dígito, da esquerda para a direita, por uma sequência decrescente começando em **10**:

   | Dígito | Multiplicador |
   |--------|--------------|
   | 1º     | 10           |
   | 2º     | 9            |
   | 3º     | 8            |
   | 4º     | 7            |
   | 5º     | 6            |
   | 6º     | 5            |
   | 7º     | 4            |
   | 8º     | 3            |
   | 9º     | 2            |

3. **Some** os resultados de todas as multiplicações.
4. Calcule o resto da divisão da soma por **11**:

   ```
   resto = soma mod 11
   ```

5. Aplique a regra:
   - Se `resto < 2`, o primeiro dígito verificador é **`0`**.
   - Caso contrário, o dígito é **`11 - resto`**.

---

## 3. Cálculo do 2º Dígito Verificador (11º dígito)

Após obter o 1º dígito verificador, calcule o segundo:

1. Considere os **9 primeiros dígitos** do CPF **mais** o **1º dígito verificador** calculado (total de 10 dígitos).
2. Multiplique cada dígito, da esquerda para a direita, por uma sequência decrescente começando em **11**:

   | Dígito | Multiplicador |
   |--------|--------------|
   | 1º     | 11           |
   | 2º     | 10           |
   | 3º     | 9            |
   | 4º     | 8            |
   | 5º     | 7            |
   | 6º     | 6            |
   | 7º     | 5            |
   | 8º     | 4            |
   | 9º     | 3            |
   | 10º    | 2            |

3. **Some** os resultados de todas as multiplicações.
4. Calcule o resto da divisão da soma por **11**:

   ```
   resto = soma mod 11
   ```

5. Aplique a regra:
   - Se `resto < 2`, o segundo dígito verificador é **`0`**.
   - Caso contrário, o dígito é **`11 - resto`**.

---

## 4. Validação Final

Compare os dígitos calculados com os dígitos informados no CPF:

- Se o **1º dígito verificador calculado** for igual ao **10º dígito** do CPF informado, **e**
- Se o **2º dígito verificador calculado** for igual ao **11º dígito** do CPF informado,

então o CPF é considerado **válido**.

> **Resumo:**
>
> ```
> válido = (digito_10_calculado == digito_10_informado) AND
>          (digito_11_calculado == digito_11_informado)
> ```
