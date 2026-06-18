# Audit Migrasi KonsinyasiKu

## Kondisi sumber

Kode sumber Figma adalah aplikasi web React berbasis Vite. Proyek menggunakan React Router, Tailwind CSS, elemen HTML, Lucide React, serta kumpulan komponen Radix/shadcn. Terdapat 20 layar, 9 komponen aplikasi utama, 46 komponen UI web, dan sekitar 2.618 baris kode layar. Tidak ditemukan integrasi API atau persistensi data. Sebagian besar isi merupakan mock data dan interaksi demonstratif.

## Konsekuensi teknis

React Native tidak merender DOM. Elemen seperti `div`, `form`, `input`, `select`, `button`, dan CSS Tailwind web tidak dapat dipindahkan langsung. React Router juga tidak digunakan pada aplikasi native. Oleh karena itu, migrasi yang benar memerlukan penggantian lapisan presentasi dan navigasi, bukan sekadar mengganti build tool.

## Keputusan stack

Stack utama adalah Expo SDK 56, React Native, TypeScript, dan Expo Router. Pemilihan ini mempertahankan paradigma React, menyediakan routing file-based, mendukung Android/iOS/web, dan mengurangi konfigurasi native awal. StyleSheet dipilih sebagai basis styling agar dependensi tetap kecil dan perilaku layout eksplisit.

## Alternatif yang dipertimbangkan

Ionic React + Capacitor akan memaksimalkan penggunaan ulang kode web karena tetap menggunakan HTML dan CSS di dalam WebView. Jalur tersebut lebih cepat untuk menghasilkan paket APK dari prototipe saat ini, tetapi hasilnya tetap berarsitektur web-native. Untuk aplikasi operasional dengan kamera, printer, notifikasi, performa daftar, dan UX mobile jangka panjang, Expo React Native lebih tepat.

## Batas implementasi

Implementasi ini adalah frontend fungsional dengan state in-memory. Data akan kembali ke kondisi awal setelah aplikasi dimuat ulang. Klaim keamanan, enkripsi, sinkronisasi, dan backup pada teks desain lama tidak dapat dianggap telah terimplementasi. Fitur tersebut membutuhkan backend, autentikasi, kontrol akses, penyimpanan aman, dan audit keamanan.
