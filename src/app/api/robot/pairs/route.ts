import { NextRequest, NextResponse } from 'next/server';
import { iqOptionLogin, getIqOptionPairs } from '../../../../robot-backend/src/iqoption';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }
    const login = await iqOptionLogin(email, password);
    if (!login.success || !login.page) {
      return NextResponse.json({ success: false, message: login.message }, { status: 401 });
    }
    const pairs = await getIqOptionPairs(login.page);
    await login.browser?.close();
    return NextResponse.json({ success: true, pairs });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Erro inesperado.' }, { status: 500 });
  }
}
