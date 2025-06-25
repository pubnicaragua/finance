"use server"

export async function testAction(prevState: any, data: { testInput: string }) {
  console.log("--- Server Action: testAction called ---")
  console.log("Server: Received data:", data)

  // Simula una latencia
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (data.testInput === "error") {
    return { success: false, message: "Simulated error: Input was 'error'." }
  }

  return { success: true, message: `Server received: ${data.testInput}` }
}
