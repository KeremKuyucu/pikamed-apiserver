import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get("uid")

  if (!uid) {
    return NextResponse.json({ success: false, message: "UID eksik" }, { status: 400 })
  }

  // Gerçek implementasyonda burada kullanıcının bildirim tercihini false yapacak
  // Discord'dan dosyayı indirip güncelleme işlemi yapılacak

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bildirim İptali</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f7f6;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #3498db;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
        }
        .alert {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bildirim İptali Başarılı</h1>
        <p>Artık insülin aşı hatırlatmalarını almayacaksınız.</p>
        
        <div class="alert">
          <strong>Not:</strong> Uygulamanızı yeniden açtığınızda bildirimler tekrar aktif hale gelecektir. Bildirim almak istemiyorsanız, uygulamayı kullanmayınız.
        </div>
        
        <div class="footer">
          <p>Herhangi bir sorun yaşarsanız, bizimle iletişime geçebilirsiniz.</p>
          <p>© 2025 Pikamed. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
