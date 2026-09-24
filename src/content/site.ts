import type { SiteContent } from "@/types";

// Copy is stored in sentence case; display roles uppercase it via CSS (`lang="tr"` keeps i → İ correct),
// so headings still read as natural sentences to assistive tech and crawlers.
export const site: SiteContent = {
  metadata: {
    siteName: "Zubo Cafe",
    title: "Zubo Cafe · Moda, Kadıköy",
    description:
      "Moda'da haftada iki kez kavrulan çekirdekler, siparişle demlenen kahve. Menü, adres ve çalışma saatleri.",
  },
  skipLink: "İçeriğe geç",
  navLabel: "Bölümler",
  newTabNote: "(yeni sekmede açılır)",
  wordmark: "Zubo",
  location: "Moda, Kadıköy",
  hours: "Her gün 08:00–22:00",
  nav: [
    { label: "Hikâye", href: "#hikaye" },
    { label: "Menü", href: "#menu" },
    { label: "İletişim", href: "#iletisim" },
  ],
  hero: {
    rows: [
      { left: "Bu sabah", right: "kavruldu," },
      { left: "şimdi", right: "demlendi," },
      { left: "birazdan", right: "senin." },
    ],
    scrollCue: "Kaydır",
  },
  reveal: {
    title: "Hikâyemiz",
    paragraph:
      "Zubo, Moda'da küçük bir tezgâhla başladı. Çekirdeklerimizi haftada iki kez kavuruyor, her fincanı sipariş geldiğinde demliyoruz. Acelen varsa kapağını kapatıp yola çıkar, vaktin varsa kapağı aç, köpüğün üstündeki çizime bir bak. İkisi de aynı özenle hazırlanıyor.",
  },
  menu: {
    title: "Menü",
    categories: [
      {
        name: "Sıcak kahveler",
        items: [
          {
            slug: "espresso",
            name: "Espresso",
            description: "Çift shot, yoğun ve kısa.",
            price: 110,
            imageAlt: "Kalın kremalı çift shot espresso",
          },
          {
            slug: "flat-white",
            name: "Flat White",
            description: "İpeksi süt, güçlü espresso.",
            price: 150,
            imageAlt: "İpeksi mikro köpüklü flat white, seramik fincanda",
          },
          {
            slug: "latte",
            name: "Latte",
            description: "Bol köpüklü, yumuşak içim.",
            price: 155,
            imageAlt: "Bol köpüklü latte, uzun bardakta",
          },
        ],
      },
      {
        name: "Soğuk kahveler",
        items: [
          {
            slug: "cold-brew",
            name: "Cold Brew",
            description: "18 saat soğuk demleme.",
            price: 165,
            imageAlt: "Buz üstünde koyu cold brew, şeffaf bardakta",
          },
          {
            slug: "iced-latte",
            name: "Iced Latte",
            description: "Buz, süt ve çift shot.",
            price: 160,
            imageAlt: "Süt ve espressonun katman katman ayrıldığı iced latte",
          },
          {
            slug: "espresso-tonic",
            name: "Espresso Tonic",
            description: "Tonik, portakal kabuğu, espresso.",
            price: 170,
            imageAlt: "Portakal kabuklu espresso tonic, köpüren katmanlarıyla",
          },
        ],
      },
      {
        name: "Tatlılar",
        items: [
          {
            slug: "san-sebastian",
            name: "San Sebastian",
            description: "Yanık yüzlü, akışkan cheesecake.",
            price: 190,
            imageAlt: "Yanık yüzlü San Sebastian cheesecake dilimi, akışkan ortasıyla",
          },
          {
            slug: "brownie",
            name: "Brownie",
            description: "Bitter çikolata, deniz tuzu.",
            price: 140,
            imageAlt: "Deniz tuzu serpilmiş bitter çikolatalı brownie",
          },
          {
            slug: "kruvasan",
            name: "Kruvasan",
            description: "Tereyağlı, günlük pişirim.",
            price: 120,
            imageAlt: "Katmanları görünen tereyağlı kruvasan",
          },
        ],
      },
    ],
  },
  contact: {
    title: "Gel, otur.",
    addressLabel: "Adres",
    address: "Moda Cad. No: 12, Kadıköy / İstanbul",
    mapLabel: "Haritada aç",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Moda+Caddesi+12+Kad%C4%B1k%C3%B6y+%C4%B0stanbul",
    hoursLabel: "Saatler",
    reachLabel: "Bize ulaş",
    phone: "+90 216 000 00 00",
    instagram: {
      handle: "@zubocafe",
      url: "https://www.instagram.com/zubocafe",
    },
    copyright: "© 2026 Zubo Cafe",
  },
  errorPage: {
    title: "Bir şeyler ters gitti",
    text: "Beklenmedik bir hata oluştu. Sayfayı yeniden dene ya da ana sayfaya dön.",
    retry: "Tekrar dene",
    home: "Ana sayfaya dön",
  },
  notFoundPage: {
    title: "Bu sayfa yok",
    text: "Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.",
    home: "Ana sayfaya dön",
  },
};
