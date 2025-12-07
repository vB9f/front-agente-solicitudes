// src/app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    
    // Configuración de la URL del backend (ya debe estar actualizada con tu URL de Cloud Run)
    const backendUrl = 'https://apicloudia-10225299185.us-west4.run.app/agent'; 
    
    // Captura los parámetros de la URL del frontend
    // const queryString = new URL(request.url).searchParams.toString();
    // const finalUrl = `${backendUrl}?${queryString}`;
    
    try {
        const requestBody = await request.json();
        
        const apiRes = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // El cuerpo del frontend se reenvía al backend de Cloud Run
            body: JSON.stringify(requestBody), 
        });

        // Leer la respuesta como JSON
        const data = await apiRes.json();
        
        // Devolver la respuesta JSON con el encabezado correcto
        return NextResponse.json(data, { status: apiRes.status });

    } catch (error) {
        // Manejar errores de conexión o parsing
        console.error("Error al llamar al backend API:", error);
        return NextResponse.json({ 
            response: "Error interno del proxy al comunicarse con Cloud Run.", 
            status: "error" 
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({ 
        error: "Método de solicitud no permitido. Use POST.", 
        status: "error" 
    }, { status: 405 });
}