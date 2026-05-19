import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Método não permitido" });

    const { nome, cpf, itens, total } = req.body;

    if (!nome || !cpf || !itens || itens.length === 0) {
        return res.status(400).json({ error: "Dados do pedido incompletos" });
    }

    try {
        const { data, error } = await supabase
            .from("pedidos")
            .insert([
                {
                    nome_cliente: nome,
                    cpf_cliente: cpf,
                    itens: itens,
                    total: total,
                    status: "confirmado",
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return res
            .status(201)
            .json({ pedido: data, mensagem: "Pedido realizado com sucesso!" });
    } catch (err) {
        console.error("Erro ao salvar pedido:", err);
        return res.status(500).json({ error: "Erro interno ao salvar pedido" });
    }
}
