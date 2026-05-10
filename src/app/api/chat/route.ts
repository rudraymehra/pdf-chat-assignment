import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string;

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    // TODO: Implement PDF parsing and RAG pipeline here
    return NextResponse.json({
      answer: `You asked: "${question}". The RAG pipeline is not yet implemented — wire up your PDF parser and LLM here.`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
