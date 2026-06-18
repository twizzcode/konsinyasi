import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Bagaimana cara menambahkan barang konsinyasi baru?',
    answer: 'Buka menu Barang dari bottom navigation, lalu tekan tombol (+) di pojok kanan bawah. Isi form dengan lengkap termasuk foto barang, nama, penitip, harga jual, dan persentase bagi hasil.'
  },
  {
    question: 'Bagaimana cara menghitung bagi hasil otomatis?',
    answer: 'Saat menambahkan barang, masukkan harga jual dan persentase bagian penitip. Sistem akan otomatis menghitung bagian toko. Setiap transaksi penjualan akan mencatat pembagian keuntungan secara otomatis.'
  },
  {
    question: 'Bagaimana cara melihat laporan penjualan per penitip?',
    answer: 'Buka menu Laporan, scroll ke bawah dan pilih "Laporan per Penitip". Pilih nama penitip dari dropdown untuk melihat detail penjualan dan keuntungan mereka.'
  },
  {
    question: 'Apa yang terjadi jika stok barang habis?',
    answer: 'Sistem akan mengirim notifikasi otomatis saat stok mencapai batas minimal yang Anda tentukan. Anda bisa melihat semua notifikasi di menu Notifikasi.'
  },
  {
    question: 'Bagaimana cara melakukan transaksi penjualan?',
    answer: 'Buka menu Transaksi, tekan tombol (+), pilih barang yang dijual, atur jumlahnya, lalu sistem akan menghitung total pembayaran dan bagi hasil otomatis. Tekan Simpan Transaksi untuk menyelesaikan.'
  },
  {
    question: 'Bisakah saya menambahkan admin atau kasir?',
    answer: 'Ya, buka menu Profil > Kelola User/Admin. Di sana Anda bisa menambahkan user baru dengan role Admin (akses penuh kecuali pengaturan) atau Kasir (hanya akses transaksi).'
  },
  {
    question: 'Bagaimana cara export laporan?',
    answer: 'Di halaman Laporan, tekan tombol "Export" untuk mengunduh laporan dalam format PDF atau Excel. Anda juga bisa export laporan per penitip dari halaman detail mereka.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, semua data Anda tersimpan dengan aman dan terenkripsi. Kami menggunakan sistem keamanan standar industri untuk melindungi informasi bisnis Anda.'
  }
];

const tutorialCategories = [
  {
    title: 'Memulai',
    items: [
      'Cara daftar akun baru',
      'Setup toko pertama kali',
      'Menambahkan penitip pertama'
    ]
  },
  {
    title: 'Manajemen Barang',
    items: [
      'Menambah barang konsinyasi',
      'Update stok barang',
      'Set minimal stok untuk notifikasi'
    ]
  },
  {
    title: 'Transaksi',
    items: [
      'Cara melakukan penjualan',
      'Cetak struk penjualan',
      'Lihat riwayat transaksi'
    ]
  },
  {
    title: 'Laporan',
    items: [
      'Membaca laporan penjualan',
      'Filter laporan per periode',
      'Export laporan ke PDF'
    ]
  }
];

export function BantuanScreen() {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-2xl">Bantuan & Dukungan</h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl">Pertanyaan Umum (FAQ)</h2>
            </div>

            <div className="space-y-2">
              {faqData.map((faq, index) => (
                <Card key={index} padding={false}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-muted/50 transition-colors rounded-2xl"
                  >
                    <div className="flex-1">
                      <h4 className="mb-1">{faq.question}</h4>
                      {expandedFAQ === index && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-6 h-6 text-primary" />
              <h2 className="text-xl">Panduan Tutorial</h2>
            </div>

            <div className="space-y-3">
              {tutorialCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <h3 className="mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <h3 className="mb-3">Informasi Aplikasi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versi:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build:</span>
                <span>2026.04.27</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <span>Android</span>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </MobileLayout>
  );
}
