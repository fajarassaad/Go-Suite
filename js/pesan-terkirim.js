/* KOPIGO, ringkasan pesanan setelah WhatsApp dibuka */
(function () {
    'use strict';

    var data = null;
    try { data = JSON.parse(localStorage.getItem('kopigo_pesanan_terakhir') || 'null'); } catch (e) { data = null; }

    var valid = data && typeof data.url === 'string' && data.url.indexOf('https://wa.me/') === 0 &&
        Array.isArray(data.items) && data.items.length > 0;

    var ready = document.getElementById('done-ready');
    var empty = document.getElementById('done-empty');

    if (!valid) {
        empty.hidden = false;
        return;
    }

    function text(id, value) { document.getElementById(id).textContent = value; }

    text('done-code', '#' + data.code);
    text('done-total', data.total);
    text('done-count', data.count + ' gelas');
    text('done-meta', data.method + ' · ' + data.outlet);

    var list = document.getElementById('done-list');
    data.items.forEach(function (item) {
        var li = document.createElement('li');
        var name = document.createElement('span');
        name.textContent = item.qty + ' × ' + item.name;
        var sum = document.createElement('span');
        sum.textContent = item.sum;
        li.appendChild(name); li.appendChild(sum);
        list.appendChild(li);
    });

    document.getElementById('done-wa').href = data.url;

    // Jika browser memblokir tab baru, WhatsApp belum terbuka: minta pelanggan menekan tombolnya.
    if (window.location.search.indexOf('wa=tertutup') !== -1) {
        text('done-title', 'Satu langkah lagi');
        text('done-lead', 'WhatsApp belum terbuka otomatis. Tekan tombol di bawah, lalu kirim pesannya.');
    }

    ready.hidden = false;
})();
