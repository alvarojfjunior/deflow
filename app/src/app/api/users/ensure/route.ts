import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

/**
 * Rota de API para garantir que o usuário autenticado exista no banco de dados.
 * Se o usuário não existir, ele será criado.
 */
export async function POST(req: NextRequest) {
  try {
    // Verifica se o usuário está autenticado via Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();
    
    // Obtém os dados do corpo da requisição
    const body = await req.json();
    const { authId, email } = body;
    
    // Verifica se os dados necessários foram fornecidos
    if (!authId || !email) {
      return NextResponse.json(
        { error: 'authId e email são obrigatórios' }, 
        { status: 400 }
      );
    }
    
    // Verifica se o authId da requisição corresponde ao userId autenticado
    if (authId !== userId) {
      return NextResponse.json(
        { error: 'ID de autenticação inválido' }, 
        { status: 403 }
      );
    }

    // Verifica se o usuário já existe no banco de dados
    let user = await User.findOne({ authId });
    
    // Se o usuário não existir, cria um novo
    if (!user) {
      user = new User({
        authId,
        email
      });
      
      await user.save();
      return NextResponse.json({ message: 'Usuário criado com sucesso', user }, { status: 201 });
    }
    
    // Se o usuário já existir, retorna sucesso
    return NextResponse.json({ message: 'Usuário já existe', user }, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao processar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}