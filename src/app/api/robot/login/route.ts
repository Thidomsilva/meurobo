import { NextRequest, NextResponse } from 'next/server';
import { iqOptionLogin } from '../../../../robot-backend/src/iqoption';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }
    // Chama a função real do backend (Puppeteer/IQOption)
    const result = await iqOptionLogin(email, password);
    return NextResponse.json({ success: result.success, message: result.message });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Erro inesperado.' }, { status: 500 });
  }
}
