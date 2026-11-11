/* KOPIGO, ringkasan pengajuan Titik Jualan setelah WhatsApp dibuka */
(function () {
    'use strict';

    var data = null;
    try { data = JSON.parse(localStorage.getItem('kopigo_titik_terakhir') || 'null'); } catch (e) { data = null; }

    var valid = data && typeof data.url === 'string' && data.url.indexOf('https://wa.me/') === 0 &&
        typeof data.name === 'string' && data.name !== '';

    if (!valid) {
        document.getElementById('done-empty').hidden = false;
        return;
    }

    var list = document.getElementById('done-list');
    [['Nama', data.name], ['Jenis tempat', data.type], ['Alamat', data.place], ['Lemari pendingin', data.cooler]]
        .forEach(function (row) {
            if (!row[1]) return;
            var li = document.createElement('li');
            var label = document.createElement('span');
            label.textContent = row[0];
            var value = document.createElement('span');
            value.textContent = row[1];
            value.style.textAlign = 'right';
            value.style.overflowWrap = 'anywhere';
            li.appendChild(label); li.appendChild(value);
            list.appendChild(li);
        });

    document.getElementById('done-wa').href = data.url;

    // Jika browser memblokir tab baru, WhatsApp belum terbuka: minta menekan tombolnya.
    if (window.location.search.indexOf('wa=tertutup') !== -1) {
        document.getElementById('done-title').textContent = 'Satu langkah lagi';
        document.getElementById('done-lead').textContent =
            'WhatsApp belum terbuka otomatis. Tekan tombol di bawah, kirim pesannya, lalu lampirkan foto lokasimu.';
    }

    document.getElementById('done-ready').hidden = false;
})();
