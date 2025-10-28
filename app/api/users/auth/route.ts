import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔄 Proxying request to backend:', body);
    
    const backendUrl = 'https://unloyal-grayce-nonnecessitously.ngrok-free.dev/api/users/auth';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('Backend response:', responseText);

    if (!response.ok) {
      console.error('❌ Backend error:', responseText);
      return NextResponse.json(
        { error: 'Backend request failed', details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('✅ Success:', data);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy failed', message: error.message },
      { status: 500 }
    );
  }
}