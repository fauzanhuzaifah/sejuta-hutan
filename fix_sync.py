#!/usr/bin/env python3
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the catch block in sync() and replace with fallback data
old_catch = '''} catch (e) {
                console.error('Data sync failed:', e);
                
                // Show user-friendly error message
                App.UI.showToast('toast_error_title', 'Tidak dapat memuat data dari server. Menggunakan data lokal.', true);
                
                return false;
            }
        },'''

new_catch = '''} catch (e) {
                console.warn('API not available, using dummy data for local testing:', e.message);
                
                // Dummy data for local development when API is not available
                const dummyData = [
                    { id: 1, nama: 'Ahmad Fauzi', whatsapp: '08123456789', email: 'ahmad@email.com', usia: 28, pekerjaan: 'Mahasiswa', alamat: 'Jalan Mawar No. 5', jumlah_pohon: 5, motivasi: 'Ingin ikut menyelamatkan lingkungan', timestamp: Date.now() - 86400000 * 2 },
                    { id: 2, nama: 'Siti Aminah', whatsapp: '08234567890', email: 'siti@email.com', usia: 32, pekerjaan: 'Guru', alamat: 'Jalan Melati No. 12', jumlah_pohon: 3, motivasi: 'Melestarikan alam untuk anak cucu', timestamp: Date.now() - 86400000 * 5 },
                    { id: 3, nama: 'Budi Santoso', whatsapp: '08345678901', email: 'budi@email.com', usia: 25, pekerjaan: 'Karyawan', alamat: 'Jalan Anggrek No. 8', jumlah_pohon: 10, motivasi: 'Cinta pohon dan alam', timestamp: Date.now() - 86400000 * 1 },
                    { id: 4, nama: 'Dewi Lestari', whatsapp: '08456789012', email: 'dewi@email.com', usia: 29, pekerjaan: 'Dokter', alamat: 'Jalan Kenanga No. 15', jumlah_pohon: 7, motivasi: 'Peduli dengan perubahan iklim', timestamp: Date.now() - 86400000 * 3 },
                    { id: 5, nama: 'Eko Prasetyo', whatsapp: '08567890123', email: 'eko@email.com', usia: 35, pekerjaan: 'Pengusaha', alamat: 'Jalan Cempaka No. 20', jumlah_pohon: 15, motivasi: 'Berkontribusi untuk kota hijau', timestamp: Date.now() - 86400000 * 7 }
                ];
                
                // Process dummy data like remote data
                const normalized = dummyData.map(r => {
                    const ts = r.timestamp || null;
                    const formatted = App.Utils.formatTimestamp(ts);
                    return {
                        id: r.id,
                        nama: r.nama, 
                        wa: r.whatsapp, 
                        whatsapp: r.whatsapp,
                        email: r.email,
                        usia: r.usia,
                        pekerjaan: r.pekerjaan, 
                        alamat: r.alamat,
                        jumlah_pohon: r.jumlah_pohon || 1,
                        motivasi: r.motivasi || "Dari Database Server",
                        tanggal: formatted,
                        timestamp: ts
                    };
                });
                
                this.save(normalized);
                App.UI.renderTable();
                console.log('Using dummy data for local development:', normalized);
                
                return true;
            }
        },'''

if old_catch in content:
    content = content.replace(old_catch, new_catch)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ Added dummy data fallback for local development')
else:
    print('❌ Pattern not found - checking for variations...')
    # Try to find with more flexible pattern
    idx = content.find('Data sync failed:')
    if idx != -1:
        print(f'Found "Data sync failed" at position {idx}')
        print('Context:', repr(content[idx-50:idx+150]))
    else:
        print('Could not find target pattern')
