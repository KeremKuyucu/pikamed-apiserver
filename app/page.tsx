import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Shield, Mail, Bot, Users, Database, Zap, Heart, Activity, FileText, Bell, Lock, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const apiCategories = [
    {
      category: "🔐 Kimlik Doğrulama & Güvenlik",
      icon: <Shield className="h-6 w-6" />,
      description: "Kullanıcı girişi, çıkışı ve güvenlik işlemleri için API'ler",
      color: "from-red-500 to-pink-500",
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/authlog",
          description: "Kullanıcı giriş/çıkış işlemlerini Discord'a loglar",
          auth: "Herkese Açık",
          details: "Kullanıcı adı, UID ve profil fotoğrafı ile birlikte giriş/çıkış bilgilerini kaydeder",
          requestBody: {
            sebep: "string (Giriş/Çıkış)",
            uid: "string (Firebase UID)",
            name: "string (Kullanıcı adı)",
            profilUrl: "string (Profil fotoğrafı URL'si)",
          },
          response: {
            success: true,
            message: "Giriş işlemi başarıyla kaydedildi.",
          },
        },
        {
          method: "POST",
          path: "/api/pikamed/pikamedfeedback",
          description: "Kullanıcı geri bildirimlerini toplar ve Discord'a gönderir",
          auth: "Kullanıcı",
          details: "Feedback sebepleri, mesajlar ve kullanıcı bilgilerini organize eder",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          requestBody: {
            sebep: "string (Feedback sebebi)",
            message: "string (Feedback mesajı)",
            isim: "string (Kullanıcı adı)",
            eposta: "string (E-posta adresi)",
            uid: "string (Firebase UID)",
          },
          response: {
            success: true,
            message: "Mesaj başarıyla gönderildi!",
          },
        },
      ],
    },
    {
      category: "🤖 Yapay Zeka Entegrasyonu",
      icon: <Bot className="h-6 w-6" />,
      description: "Google Gemini AI ile endokrinoloji danışmanlığı",
      color: "from-blue-500 to-cyan-500",
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/ai",
          description: "AI endokrinoloji uzmanı ile sohbet",
          auth: "Kullanıcı",
          details: "Hasta bilgileri, insülin planı ve sağlık verilerini analiz ederek profesyonel tavsiyelerde bulunur",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          requestBody: {
            uid: "string (Firebase UID)",
            message: "string (Hastanın sorusu)",
            targetWater: "number (Günlük su hedefi ml)",
            availableWater: "number (İçilen su miktarı ml)",
            cupSize: "number (Bardak boyutu ml)",
            changeWaterDay: "string (Su takibi günü)",
            changeWaterClock: "string (Su takibi saati)",
            weight: "number (Kilo kg)",
            size: "number (Boy cm)",
            bmi: "number (BMI değeri)",
            bmiCategory: "string (BMI kategorisi)",
            name: "string (Hasta adı)",
            selectedLanguage: "string (Dil tercihi)",
            localTime: "string (Yerel saat)",
            insulinPlan: "array (İnsülin planı detayları)",
          },
          response: {
            aiResponse: "string (AI'dan gelen profesyonel tavsiye)",
          },
        },
      ],
    },
    {
      category: "👥 Kullanıcı Yönetimi",
      icon: <Users className="h-6 w-6" />,
      description: "Doktor, admin ve hasta yönetimi için kapsamlı API'ler",
      color: "from-purple-500 to-indigo-500",
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/add-doctor",
          description: "Kullanıcıya doktor rolü atar",
          auth: "Admin",
          details: "E-posta adresi ile kullanıcı bulur ve Firebase'de doktor yetkisi verir",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          requestBody: {
            uid: "string (Admin UID)",
            doctorEmail: "string (Doktor yapılacak kullanıcının e-postası)",
          },
          response: {
            success: true,
            message: "Doktor rolü başarıyla atandı!",
          },
        },
        {
          method: "POST",
          path: "/api/pikamed/delete-doctor",
          description: "Doktor rolünü kaldırır",
          auth: "Admin",
          details: "Mevcut doktor yetkilerini iptal eder ve normal kullanıcı statüsüne döndürür",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          requestBody: {
            uid: "string (Admin UID)",
            doctorEmail: "string (Doktor rolü kaldırılacak kullanıcının e-postası)",
          },
          response: {
            success: true,
            message: "Doktor başarıyla silindi!",
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/get-doctors",
          description: "Tüm doktorları listeler",
          auth: "Admin",
          details: "Sistemdeki tüm doktor rolüne sahip kullanıcıları e-posta ve isim bilgileriyle getirir",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          response: {
            success: true,
            doctors: [
              {
                email: "doktor@example.com",
                fullName: "Dr. Ahmet Yılmaz",
              },
            ],
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/get-admins",
          description: "Tüm adminleri listeler",
          auth: "Admin",
          details: "Admin yetkisine sahip kullanıcıların tam listesini sağlar",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          response: {
            success: true,
            admins: [
              {
                email: "admin@example.com",
                fullName: "Admin Kullanıcı",
              },
            ],
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/get-users",
          description: "Tüm kayıtlı kullanıcıları getirir",
          auth: "Doktor",
          details: "Hasta takibi için tüm kullanıcı bilgilerini UID, e-posta ve isim ile listeler",
          headers: {
            Authorization: "Bearer <Doctor_Firebase_ID_Token>",
          },
          response: {
            success: true,
            patients: [
              {
                email: "hasta@example.com",
                displayName: "Hasta Adı",
                uid: "firebase_uid_123",
              },
            ],
          },
        },
      ],
    },
    {
      category: "📊 Veri Yönetimi",
      icon: <Database className="h-6 w-6" />,
      description: "Hasta verileri ve sağlık bilgilerinin güvenli saklanması",
      color: "from-green-500 to-emerald-500",
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/userdata",
          description: "Discord'dan kullanıcı verilerini çeker",
          auth: "Kullanıcı",
          details: "Kişisel Discord kanalından sağlık verilerini güvenli şekilde indirir",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          requestBody: {
            uid: "string (Firebase UID - veri sahibinin)",
          },
          response: "Binary file data (JSON/Excel/PDF formatında sağlık verileri)",
        },
        {
          method: "POST",
          path: "/api/pikamed/info",
          description: "Kapsamlı kullanıcı bilgilerini kaydeder",
          auth: "Kullanıcı",
          details: "Su tüketimi, kilo, boy, BMI, insülin planı gibi detaylı sağlık verilerini Discord'a yükler",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          requestBody: {
            message: "string (Ek mesaj)",
            name: "string (Kullanıcı adı)",
            uid: "string (Firebase UID)",
            photoURL: "string (Profil fotoğrafı URL)",
            version: "string (Uygulama versiyonu)",
            country: "string (Ülke)",
            selectedLanguage: "string (Seçilen dil)",
            targetWater: "number (Günlük su hedefi ml)",
            availableWater: "number (İçilen su ml)",
            cupSize: "number (Bardak boyutu ml)",
            changeWaterClock: "string (Su takibi saati)",
            changeWaterDay: "string (Su takibi günü)",
            InsulinListData: "array (İnsülin listesi)",
            size: "number (Boy cm)",
            weight: "number (Kilo kg)",
            changeWeightClock: "string (Kilo takibi saati)",
            bmiCategory: "string (BMI kategorisi)",
            bmi: "number (BMI değeri)",
            notificationRequest: "boolean (Bildirim tercihi)",
          },
          response: {
            success: true,
            message: "Log mesajı başarıyla kaydedildi!",
          },
        },
      ],
    },
    {
      category: "📧 E-posta & Bildirimler",
      icon: <Mail className="h-6 w-6" />,
      description: "Otomatik e-posta bildirimleri ve hatırlatma sistemi",
      color: "from-orange-500 to-red-500",
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/send-notification",
          description: "Toplu e-posta bildirimi gönderir",
          auth: "Admin",
          details: "Belirli kullanıcı gruplarına (tümü, doktorlar, hastalar) veya bireysel olarak e-posta gönderir",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          requestBody: {
            message: "string (E-posta içeriği HTML formatında)",
            target: "string (all/doctor/user/specific)",
            targetId: "string (specific seçilirse hedef UID)",
            senderUid: "string (Gönderen admin UID)",
            title: "string (E-posta başlığı)",
          },
          response: {
            success: true,
            sentCount: "number (Gönderilen e-posta sayısı)",
          },
        },
        {
          method: "POST",
          path: "/api/pikamed/send-warning",
          description: "Hasta verilerine erişim uyarısı",
          auth: "Doktor",
          details: "Doktor hasta verilerine eriştiğinde güvenlik amaçlı otomatik uyarı e-postası gönderir",
          headers: {
            Authorization: "Bearer <Doctor_Firebase_ID_Token>",
          },
          requestBody: {
            doktorUid: "string (Doktor UID)",
            patientUid: "string (Hasta UID)",
          },
          response: {
            success: true,
            message: "E-posta ve Discord log başarıyla gönderildi!",
          },
        },
        {
          method: "POST",
          path: "/api/pikamed/notificationInfo",
          description: "Bildirim tercihlerini günceller",
          auth: "Kullanıcı",
          details: "İnsülin hatırlatma zamanları ve bildirim tercihlerini kaydeder",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          requestBody: {
            uid: "string (Firebase UID)",
            name: "string (Kullanıcı adı)",
            email: "string (E-posta adresi)",
            InsulinListData: "array (İnsülin zamanları listesi)",
            notificationRequest: "boolean (Bildirim almak istiyor mu)",
          },
          response: {
            success: true,
            message: "Veri başarıyla kaydedildi ve güncellendi!",
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/unsubscribe",
          description: "E-posta aboneliğinden çıkış",
          auth: "Herkese Açık",
          details: "Kullanıcıların insülin hatırlatma e-postalarından çıkış yapmasını sağlar",
          queryParams: {
            uid: "string (Firebase UID)",
          },
          response: "HTML sayfası (Abonelik iptal onay sayfası)",
        },
      ],
    },
    {
      category: "🔒 Erişim Kontrolü",
      icon: <Lock className="h-6 w-6" />,
      description: "Rol tabanlı yetkilendirme ve erişim kontrol sistemi",
      color: "from-gray-500 to-slate-600",
      endpoints: [
        {
          method: "GET",
          path: "/api/pikamed/superadmin-access",
          description: "Süper admin erişim kontrolü",
          auth: "Süper Admin",
          details: "En yüksek seviye yetkilendirme kontrolü",
          headers: {
            Authorization: "Bearer <Superadmin_Firebase_ID_Token>",
          },
          response: {
            access: true,
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/admin-access",
          description: "Admin erişim kontrolü",
          auth: "Admin",
          details: "Yönetici seviyesi yetkilendirme doğrulaması",
          headers: {
            Authorization: "Bearer <Admin_Firebase_ID_Token>",
          },
          response: {
            access: true,
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/doctor-access",
          description: "Doktor erişim kontrolü",
          auth: "Doktor",
          details: "Doktor seviyesi yetkilendirme kontrolü",
          headers: {
            Authorization: "Bearer <Doctor_Firebase_ID_Token>",
          },
          response: {
            access: true,
          },
        },
        {
          method: "GET",
          path: "/api/pikamed/user-access",
          description: "Kullanıcı erişim kontrolü",
          auth: "Kullanıcı",
          details: "Temel kullanıcı yetkilendirme doğrulaması",
          headers: {
            Authorization: "Bearer <Firebase_ID_Token>",
          },
          response: {
            access: true,
          },
        },
      ],
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case "Herkese Açık":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Kullanıcı":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Doktor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Admin":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Süper Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Sağlık Teknolojisi API'si
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">PikaMed API Server</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tip 1 diyabet hastaları için geliştirilmiş kapsamlı sağlık yönetim sistemi. Yapay zeka destekli
              danışmanlık, otomatik hatırlatmalar ve güvenli veri yönetimi.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Bot className="h-4 w-4 mr-2" />
                Google Gemini AI
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Firebase Auth
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                Mailjet Integration
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Database className="h-4 w-4 mr-2" />
                Discord Storage
              </Badge>
            </div>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-5 w-5 mr-2" />
                API Durumu: Aktif
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Dokümantasyon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* API Categories */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid gap-8">
          {apiCategories.map((category, index) => (
            <Card key={index} className="shadow-xl border-0 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>{category.icon}</div>
                  {category.category}
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {category.endpoints.map((endpoint, endpointIndex) => (
                    <div
                      key={endpointIndex}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getMethodColor(endpoint.method)} font-mono font-bold`}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border">
                            {endpoint.path}
                          </code>
                        </div>
                        <Badge className={getAuthColor(endpoint.auth)} variant="outline">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {endpoint.auth}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{endpoint.description}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {endpoint.details}
                      </p>

                      <Tabs defaultValue="request" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="request">Request</TabsTrigger>
                          <TabsTrigger value="response">Response</TabsTrigger>
                        </TabsList>

                        <TabsContent value="request" className="mt-4">
                          <div className="space-y-3">
                            {endpoint.headers && (
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Headers:</h5>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.headers, null, 2)}
                                </pre>
                              </div>
                            )}

                            {endpoint.queryParams && (
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  Query Parameters:
                                </h5>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.queryParams, null, 2)}
                                </pre>
                              </div>
                            )}

                            {endpoint.requestBody && (
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  Request Body:
                                </h5>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.requestBody, null, 2)}
                                </pre>
                              </div>
                            )}

                            {!endpoint.headers && !endpoint.queryParams && !endpoint.requestBody && (
                              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                                Bu endpoint herhangi bir parametre gerektirmez.
                              </p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="response" className="mt-4">
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Response:</h5>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                              {typeof endpoint.response === "string"
                                ? endpoint.response
                                : JSON.stringify(endpoint.response, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-16" />

        {/* Features & Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Güvenli Kimlik Doğrulama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Firebase Authentication ile rol tabanlı erişim kontrolü. 4 farklı yetki seviyesi: Kullanıcı, Doktor,
                Admin, Süper Admin.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>AI Destekli Danışmanlık</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Google Gemini AI ile endokrinoloji uzmanı seviyesinde kişiselleştirilmiş sağlık tavsiyeleri ve insülin
                yönetimi.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Otomatik Hatırlatmalar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Kişiselleştirilmiş insülin zamanları için e-posta hatırlatmaları. Cron job tabanlı otomatik bildirim
                sistemi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specs */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Teknik Özellikler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Teknoloji Stack
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Next.js 14 App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Firebase Admin SDK
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Google Gemini AI
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Mailjet Email Service
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Discord API Integration
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-500" />
                  Güvenlik Özellikleri
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    JWT Token Doğrulama
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Rol Tabanlı Erişim Kontrolü
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Şifrelenmiş Veri Aktarımı
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Audit Logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    GDPR Uyumlu Veri İşleme
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Footer */}
        <div className="text-center mt-16 p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 dark:text-green-300 font-semibold">Tüm Sistemler Aktif</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Server çalışıyor ve tüm API endpoint'leri kullanıma hazır
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Next.js ile geliştirildi • Vercel'de barındırılıyor • 7/24 aktif
          </p>
        </div>
      </div>
    </div>
  )
}
