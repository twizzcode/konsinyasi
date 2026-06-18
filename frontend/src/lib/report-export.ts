import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { ReportOverview, SupplierReportDetail } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const formatDateTime = (value: string) => new Date(value).toLocaleString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const buildDocument = (title: string, subtitle: string, sections: string[]) => `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          color: #111827;
          padding: 24px;
          font-size: 12px;
          line-height: 1.5;
        }
        h1 {
          margin: 0 0 4px;
          color: #059669;
          font-size: 24px;
        }
        .subtitle {
          color: #6B7280;
          margin-bottom: 24px;
        }
        .section {
          margin-bottom: 20px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
        }
        .section h2 {
          margin: 0 0 12px;
          font-size: 16px;
        }
        .grid {
          width: 100%;
          border-collapse: collapse;
        }
        .grid td, .grid th {
          border-bottom: 1px solid #E5E7EB;
          padding: 8px 0;
          text-align: left;
          vertical-align: top;
        }
        .grid th {
          color: #6B7280;
          font-weight: 600;
          font-size: 11px;
        }
        .value {
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <div class="subtitle">${escapeHtml(subtitle)}</div>
      ${sections.join('')}
    </body>
  </html>
`;

const exportHtmlAsPdf = async (html: string) => {
  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
    });
  }
};

export const exportOverviewReportPdf = async (overview: ReportOverview) => {
  const html = buildDocument(
    'Laporan Toko',
    `Dibuat ${new Date().toLocaleString('id-ID')}`,
    [
      `
      <div class="section">
        <h2>Ringkasan</h2>
        <table class="grid">
          <tr><td>Total Penjualan</td><td class="value">${escapeHtml(formatRupiah(overview.totalSales))}</td></tr>
          <tr><td>Bagian Supplier</td><td class="value">${escapeHtml(formatRupiah(overview.supplierAmount))}</td></tr>
          <tr><td>Margin Toko</td><td class="value">${escapeHtml(formatRupiah(overview.storeAmount))}</td></tr>
          <tr><td>Barang Terjual</td><td class="value">${overview.soldItems}</td></tr>
          <tr><td>Jumlah Supplier</td><td class="value">${overview.supplierCount}</td></tr>
          <tr><td>Total Barang</td><td class="value">${overview.productCount}</td></tr>
          <tr><td>Sisa Stok</td><td class="value">${overview.currentStock}</td></tr>
        </table>
      </div>
      `,
      `
      <div class="section">
        <h2>Transaksi Terakhir</h2>
        <table class="grid">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Waktu</th>
              <th>Total</th>
              <th>Supplier</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            ${overview.recentTransactions.length === 0
              ? '<tr><td colspan="5">Belum ada transaksi.</td></tr>'
              : overview.recentTransactions.map((item) => `
                <tr>
                  <td>${escapeHtml(item.code)}</td>
                  <td>${escapeHtml(formatDateTime(item.createdAt))}</td>
                  <td>${escapeHtml(formatRupiah(Number(item.totalAmount)))}</td>
                  <td>${escapeHtml(formatRupiah(Number(item.supplierAmount)))}</td>
                  <td>${escapeHtml(formatRupiah(Number(item.storeAmount)))}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
      `,
    ],
  );

  await exportHtmlAsPdf(html);
};

export const exportSupplierReportPdf = async (report: SupplierReportDetail) => {
  const supplierName = report.supplier.businessName ?? report.supplier.name;
  const html = buildDocument(
    `Laporan Supplier - ${supplierName}`,
    `Dibuat ${new Date().toLocaleString('id-ID')}`,
    [
      `
      <div class="section">
        <h2>Ringkasan Supplier</h2>
        <table class="grid">
          <tr><td>Supplier</td><td class="value">${escapeHtml(supplierName)}</td></tr>
          <tr><td>Total Penjualan</td><td class="value">${escapeHtml(formatRupiah(report.totalSales))}</td></tr>
          <tr><td>Bagian Supplier</td><td class="value">${escapeHtml(formatRupiah(report.supplierAmount))}</td></tr>
          <tr><td>Margin Toko</td><td class="value">${escapeHtml(formatRupiah(report.storeAmount))}</td></tr>
          <tr><td>Sudah Dicairkan</td><td class="value">${escapeHtml(formatRupiah(report.paidOutAmount))}</td></tr>
          <tr><td>Saldo Siap Diambil</td><td class="value">${escapeHtml(formatRupiah(report.availableBalance))}</td></tr>
          <tr><td>Jenis Barang</td><td class="value">${report.productCount}</td></tr>
          <tr><td>Barang Terjual</td><td class="value">${report.soldItems}</td></tr>
          <tr><td>Sisa Stok</td><td class="value">${report.currentStock}</td></tr>
        </table>
      </div>
      `,
      `
      <div class="section">
        <h2>Riwayat Transaksi</h2>
        <table class="grid">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Waktu</th>
              <th>Qty</th>
              <th>Bagian Supplier</th>
              <th>Margin Toko</th>
            </tr>
          </thead>
          <tbody>
            ${report.transactions.length === 0
              ? '<tr><td colspan="5">Belum ada transaksi.</td></tr>'
              : report.transactions.map((item) => `
                <tr>
                  <td>${escapeHtml(item.code)}</td>
                  <td>${escapeHtml(formatDateTime(item.createdAt))}</td>
                  <td>${item.quantity}</td>
                  <td>${escapeHtml(formatRupiah(item.supplierAmount))}</td>
                  <td>${escapeHtml(formatRupiah(item.storeAmount))}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
      `,
    ],
  );

  await exportHtmlAsPdf(html);
};
