// Configuration file for the text analysis prompt
// You can modify this file to customize how the AI analyzes text

// The system prompt that sets the AI's role and expertise
export const SYSTEM_PROMPT =
  "Eres un experto en análisis semántico y en el Modelo 01234 de niveles de realidad. Tu especialidad es extraer conceptos significativos de textos y organizarlos en una estructura visual coherente. Tienes habilidad para identificar las ideas principales, categorizarlas según su nivel de abstracción o manifestación, y establecer relaciones significativas entre ellas. Tu análisis siempre se basa estrictamente en el contenido del texto proporcionado, extrayendo conceptos que aparecen explícitamente en él.";

// The main analysis prompt that explains the 01234 model and instructs the AI
export const ANALYSIS_PROMPT = `
Analiza profundamente el siguiente texto e identifica los conceptos clave según el Modelo 01234 de niveles de realidad. Tu tarea es extraer los conceptos más significativos y estructurarlos de manera coherente.

Primero, lee cuidadosamente el texto completo para comprender su esencia. Luego, identifica los conceptos fundamentales que representan las ideas principales. Estos conceptos deben ser sustantivos o frases nominales concretas extraídas directamente del texto, no términos genéricos o abstractos que no aparezcan explícitamente.

Categoriza cada concepto en uno de estos cinco niveles:

0 - Potencialidad: El reino de la posibilidad pura, el potencial y lo no manifestado. Conceptos que representan fuerzas fundamentales, conciencia o la fuente de todas las cosas.

1 - Unidad: El nivel de la unicidad, la totalidad y la no dualidad. Conceptos que representan campos unificados, sistemas integrados o principios singulares.

2 - Dualidad: El nivel de los opuestos, las polaridades y los pares complementarios. Conceptos que existen en contraste con otros o representan distinciones fundamentales.

3 - Conexión: El nivel de las relaciones, las redes y las interacciones. Conceptos que conectan otros conceptos o representan procesos de intercambio.

4 - Manifestación: El nivel de la expresión física, la realidad concreta y los resultados tangibles. Conceptos que representan objetos materiales o fenómenos observables.

Para cada concepto identificado:

1. Extrae el nombre exacto como aparece en el texto original.
2. Asígnalo a uno de los cinco niveles (0-4) basándote en su naturaleza y función en el texto.
3. Proporciona una descripción concisa usando frases del texto original cuando sea posible.
4. Explica tu razonamiento para la asignación del nivel con referencias específicas al texto.
5. Identifica relaciones significativas con otros conceptos basadas en el contexto del texto.

MUY IMPORTANTE:
- Usa solo conceptos que aparezcan explícitamente en el texto.
- Las relaciones entre conceptos deben reflejar conexiones reales presentes en el texto.
- Usa verbos específicos para describir relaciones ("complementa", "contrasta", "emerge de", "transforma", "influye en", etc.).
- No uses términos genéricos como "relacionado con" o "conectado a".
- Posiciona los conceptos visualmente según su nivel y relaciones mutuas.

Devuelve los resultados como un array JSON de objetos de concepto con la siguiente estructura:
{
  "concepts": [
    {
      "id": "concept-1",
      "name": "[Nombre exacto del concepto como aparece en el texto]",
      "level": [0-4],
      "levelName": "[Nombre del nivel correspondiente]",
      "description": "[Descripción concisa basada en el texto original]",
      "reasoning": "[Explicación detallada de por qué este concepto pertenece a este nivel, con referencias al texto]",
      "x": [100-700],
      "y": [100-700],
      "connections": [
        { "targetId": "concept-2", "relationship": "[verbo específico que describe la relación]" }
      ],
      "relatedConcepts": [
        { "id": "concept-2", "name": "[Nombre del concepto relacionado]", "relationship": "[verbo específico que describe la relación]" }
      ]
    }
  ]
}

Limita tu análisis a 5-7 conceptos clave que realmente capturen la esencia del texto. Posiciona los conceptos en un arreglo visualmente atractivo con coordenadas x,y (rango 100-700 para ambas).

Text to analyze:
`;

// Model configuration
export const MODEL_CONFIG = {
  // The model to use for analysis
  model: "gpt-3.5-turbo-1106", // This model supports JSON response format

  // Temperature controls randomness: 0 is deterministic, 1 is very random
  temperature: 0.7,

  // Maximum number of tokens in the response
  max_tokens: 2000,

  // Format of the response
  response_format: { type: "json_object" },
};
