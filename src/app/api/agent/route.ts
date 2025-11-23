// src/app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    
    // Configuración de la URL del backend (ya debe estar actualizada con tu URL de Cloud Run)
    const backendUrl = 'https://apicloudia-10225299185.us-west4.run.app/agent'; 
    
    // Captura los parámetros de la URL del frontend
    const queryString = new URL(request.url).searchParams.toString();
    const finalUrl = `${backendUrl}?${queryString}`;
    
    try {
        // Llama a tu API de Cloud Run
        const apiRes = await fetch(finalUrl);
        
        // **CORRECCIÓN CRÍTICA:** Leer la respuesta como JSON
        const data = await apiRes.json();
        
        // Devolver la respuesta JSON con el encabezado correcto
        return NextResponse.json(data, { status: apiRes.status });

    } catch (error) {
        // Manejar errores de conexión o parsing
        console.error("Error calling backend API:", error);
        return NextResponse.json({ 
            response: "Error interno del proxy al comunicarse con Cloud Run.", 
            status: "error" 
        }, { status: 500 });
    }
}