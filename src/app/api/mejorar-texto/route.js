import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(request) {
    try {
        const { texto, tag, contexto } = await request.json();

        if (!texto) {
            return NextResponse.json(
                { error: 'El texto es requerido' },
                { status: 400 }
            );
        }

        // Crear prompt personalizado basado en el tag
        const prompts = {
            perfil_universitario: `Eres un experto en redacción de perfiles universitarios profesionales y académicos.

            Tu tarea es transformar el siguiente texto en un perfil universitario de la carrera que te den, de forma formal y profesional, siguiendo este estilo de ejemplo:
            "El Ingeniero de Software (por que ingresaron la carrera de ing de software) de la Universidad Surcolombiana es un profesional emprendedor con profundo conocimiento de las ciencias y las tecnologías de la información y comunicación, con capacidad para crear y liderar proyectos de desarrollo de software, con criterios de calidad internacional."

            El perfil debe:
            - Comenzar identificando la carrera/profesión y universidad (si se menciona)
            - Describir al profesional como "un profesional [característica principal]"
            - Incluir conocimientos específicos del campo
            - Mencionar capacidades y habilidades clave
            - Usar un lenguaje formal y académico
            - Ser conciso pero impactante
            - Mantener un tono profesional y serio

            Texto a transformar:
            "${texto}"

            Instrucciones específicas:
            1. Si no se menciona la universidad, usa "estudiante/profesional de [carrera]"
            2. Identifica la carrera o campo de estudio del texto original
            3. Crea un perfil formal de 1-2 oraciones máximo
            4. Usa terminología académica y profesional
            5. Mantén la estructura: [Profesión] + [institución] + "es un profesional" + [características] + [capacidades]
            6. Responde SOLO con el perfil mejorado, sin explicaciones

            Perfil profesional:`,

                        // Aquí puedes agregar más tags en el futuro
                        default: `Mejora el siguiente texto para que sea más claro, profesional y bien redactado:

            "${texto}"

            Responde solo con el texto mejorado:`
        };

        const prompt = prompts[tag] || prompts.default;

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const textoMejorado = completion.choices[0].message.content.trim();

        return NextResponse.json({
            textoMejorado,
            tag,
            textoOriginal: texto
        });

    } catch (error) {
        console.error('Error en la API de mejora de texto:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la mejora del texto' },
            { status: 500 }
        );
    }
}
