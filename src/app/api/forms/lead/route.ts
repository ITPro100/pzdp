import { NextResponse } from "next/server"
import { leadFormSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the data using Zod schema
    const validatedData = leadFormSchema.parse(body)
    
    // TODO: Here you would typically save to database or send to CRM
    // For now, we'll just log the data
    console.log("📝 New lead received:", {
      name: validatedData.name,
      phone: validatedData.phone,
      message: validatedData.message,
      service: validatedData.service,
      practice: validatedData.practice,
      timestamp: new Date().toISOString(),
    })

    // TODO: Send notification email to admins
    // TODO: Add to CRM system
    // TODO: Send confirmation SMS to client

    return NextResponse.json({
      success: true,
      message: "Заявка успішно відправлена",
    })
    
  } catch (error) {
    console.error("❌ Lead form submission error:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Помилка валідації даних",
          error: error.message 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Внутрішня помилка сервера" 
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}