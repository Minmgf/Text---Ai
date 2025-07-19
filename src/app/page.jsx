"use client";
import Image from "next/image";
import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function Home() {
  const [perfilText, setPerfilText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mejorarTextoConAI = async () => {
    if (!perfilText.trim()) {
      alert("Por favor, escribe algo en el campo de perfil antes de usar AI");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/mejorar-texto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: perfilText,
          tag: "perfil_universitario",
          contexto: "Mejorar y optimizar un perfil universitario para que sea más profesional, claro y atractivo"
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setPerfilText(data.textoMejorado);
    } catch (error) {
      console.error('Error al mejorar texto:', error);
      alert('Error al conectar con AI. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl underline mb-6">Perfil Universitario AI</h1>

      <div className="w-full max-w-2xl">
        <label htmlFor="perfil" className="block text-lg font-medium mb-2">
          Ingrese su perfil universitario
        </label>
        <textarea
          id="perfil"
          value={perfilText}
          onChange={(e) => setPerfilText(e.target.value)}
          placeholder="Escribe tu perfil universitario aquí... Por ejemplo: estudiante de ingeniería, experiencia en proyectos, habilidades, etc."
          className="border border-black p-3 rounded mt-2 w-full h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={mejorarTextoConAI}
          disabled={isLoading}
          className={`
            flex justify-center items-center gap-2 mt-4 p-3 rounded font-medium transition-all duration-200
            ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-100 hover:bg-blue-200 active:scale-95'
            }
            border border-black
          `}
        >
          {isLoading ? 'Mejorando con AI...' : <><FaWandMagicSparkles />  AI</>}
        </button>

        <div className="mt-2 text-sm text-gray-600">
          <span className="inline-block bg-blue-100 px-2 py-1 rounded text-blue-800">
            Tag: perfil_universitario
          </span>
        </div>
      </div>
    </div>
  );
}
