import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, location, paymentStatus, notes, items } = body

    if (!name || !phone || !location || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    const itemsList = items
      .map((item: any) => `• ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`)
      .join("\n")

    const paymentDisplay = paymentStatus === "paid" ? "✅ KHQR Payment (Customer Confirmed)" : "💵 Pay on Delivery"

    const message = `
🧾 *NEW ORDER RECEIVED*

👤 *Customer:* ${name}
📱 *Phone:* ${phone}
📍 *Location:* ${location}

🛒 *Order Items:*
${itemsList}

💵 *Total Amount:* $${total.toFixed(2)}

💰 *Payment:* ${paymentDisplay}
📝 *Note:* ${notes || "None"}

_Sent from Coffee App_
    `.trim()

    if (!telegramToken || !telegramChatId) {
      console.log("[v0] Telegram credentials missing. Simulating order:", message)
      return NextResponse.json({ success: true, simulated: true })
    }

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Telegram API Error:", errorData)
      throw new Error("Failed to send Telegram message")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
