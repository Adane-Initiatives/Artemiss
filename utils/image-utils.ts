export async function imageToBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = () => {
      reject(null)
    }
    reader.readAsDataURL(file)
  })
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}
