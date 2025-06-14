import { writeFile, readFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { tmpdir } from "os"

// Vercel'de geçici dosyalar için güvenli klasör
export function getTempDir(): string {
  // Vercel'de /tmp kullanılır, local'de os.tmpdir()
  return process.env.VERCEL ? "/tmp" : tmpdir()
}

// Güvenli dosya yazma
export async function safeWriteFile(filePath: string, data: string | Buffer): Promise<void> {
  try {
    const dir = path.dirname(filePath)

    // Klasör yoksa oluştur
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }

    await writeFile(filePath, data)
    console.log(`✅ Dosya yazıldı: ${filePath}`)
  } catch (error) {
    console.error(`❌ Dosya yazma hatası: ${filePath}`, error)
    throw error
  }
}

// Güvenli dosya okuma
export async function safeReadFile(filePath: string): Promise<string> {
  try {
    if (!existsSync(filePath)) {
      throw new Error(`Dosya bulunamadı: ${filePath}`)
    }

    const data = await readFile(filePath, "utf8")
    console.log(`✅ Dosya okundu: ${filePath}`)
    return data
  } catch (error) {
    console.error(`❌ Dosya okuma hatası: ${filePath}`, error)
    throw error
  }
}

// Güvenli dosya silme
export async function safeDeleteFile(filePath: string): Promise<void> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath)
      console.log(`✅ Dosya silindi: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Dosya silme hatası: ${filePath}`, error)
    // Silme hatası kritik değil, devam et
  }
}

// Geçici dosya adı oluştur
export function createTempFileName(prefix: string, extension = ".json"): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${prefix}_${timestamp}_${random}${extension}`
}

// Güvenli JSON parse
export function safeJsonParse(data: string, defaultValue: any = {}): any {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.warn("❌ JSON parse hatası, default değer kullanılıyor:", error)
    return defaultValue
  }
}
