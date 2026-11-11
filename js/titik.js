/* KOPIGO, halaman Titik Jualan: kalkulator komisi + pengajuan lokasi ke WhatsApp */
(function () {
    'use strict';

    var WA_NUMBER = '6282187164364';
    var DRAFT_KEY = 'kopigo_titik_draf_v1';       // isian form, hanya di perangkat ini
    var LAST_KEY = 'kopigo_titik_terakhir';       // dibaca titik-terkirim.html
    var SHARE = 0.3;                              // bagi hasil mitra
    var GROSS_PER_CUP = 6000;                     // perkiraan laba kotor per gelas (dibulatkan)

    function read(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
    }
    function write(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* penyimpanan tidak tersedia */ }
    }

    function $(id) { return document.getElementById(id); }
    function rupiah(n) { return 'Rp' + n.toLocaleString('id-ID'); }

    // ---------- kalkulator komisi ----------
    // Tarif per gelas menurut rata-rata gelas terjual per hari (skema Komisi Per Cup).
    function rate(perDay) {
        if (perDay >= 50) return 2000;
        if (perDay >= 30) return 1500;
        return 1000;
    }

    var cups = $('c-cups'), cupsOut = $('c-cups-out'), days = $('c-days');
    var total = $('c-total'), detail = $('c-detail'), daysError = $('c-days-error');
    var komisiOut = $('c-komisi'), shareOut = $('c-share');

    function calc() {
        var perDay = parseInt(cups.value, 10);
        var d = parseInt(days.value, 10);
        cupsOut.textContent = perDay;
        var ok = d >= 1 && d <= 31;
        daysError.hidden = ok;
        days.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) {
            total.textContent = 'Rp0';
            komisiOut.textContent = 'Rp0';
            shareOut.textContent = 'Rp0';
            detail.textContent = 'Isi jumlah hari jualan dulu.';
            return;
        }
        var r = rate(perDay), sum = perDay * d;
        var komisi = sum * r;
        // Laba bersih titik = laba kotor - komisi (es batu dan listrik belum dikurangkan)
        var share = Math.round(sum * (GROSS_PER_CUP - r) * SHARE);
        komisiOut.textContent = rupiah(komisi);
        shareOut.textContent = rupiah(share);
        total.textContent = rupiah(komisi + share);
        detail.textContent = sum.toLocaleString('id-ID') + ' gelas × ' + rupiah(r);
    }

    cups.addEventListener('input', calc);
    days.addEventListener('input', calc);
    $('calc').addEventListener('submit', function (e) { e.preventDefault(); });
    calc();

    // ---------- pengajuan lokasi ----------
    var form = $('apply-form');
    var fName = $('a-name'), fPlace = $('a-place'), fTraffic = $('a-traffic'), fNote = $('a-note');
    var geoBtn = $('a-geo'), geoStatus = $('a-geo-status');

    function checked(name) {
        var el = form.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : '';
    }

    function markSelected() {
        var radios = form.querySelectorAll('.choice-item input');
        for (var i = 0; i < radios.length; i++) {
            radios[i].closest('.choice-item').classList.toggle('is-selected', radios[i].checked);
        }
    }

    function validateField(field, errorId) {
        var ok = field.value.trim() !== '';
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        $(errorId).hidden = ok;
        return ok;
    }

    function setInvalid(fieldsetId, errorId, invalid) {
        $(fieldsetId).classList.toggle('is-invalid', invalid);
        $(errorId).hidden = !invalid;
    }

    // Sumber kunjungan dari link, misalnya titik.html?dari=ig
    var source = '';
    try {
        source = (new URLSearchParams(window.location.search).get('dari') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
    } catch (e) { source = ''; }

    function saveDraft() {
        write(DRAFT_KEY, {
            name: fName.value, place: fPlace.value, traffic: fTraffic.value, note: fNote.value,
            type: checked('type'), cooler: checked('cooler')
        });
    }

    function loadDraft() {
        var d = read(DRAFT_KEY);
        if (!d || typeof d !== 'object') return;
        if (typeof d.name === 'string') fName.value = d.name;
        if (typeof d.place === 'string') fPlace.value = d.place;
        if (typeof d.traffic === 'string') fTraffic.value = d.traffic;
        if (typeof d.note === 'string') fNote.value = d.note;
        ['type', 'cooler'].forEach(function (name) {
            var radios = form.querySelectorAll('input[name="' + name + '"]');
            for (var i = 0; i < radios.length; i++) if (radios[i].value === d[name]) radios[i].checked = true;
        });
    }

    form.addEventListener('change', function (e) {
        if (e.target.name === 'type') setInvalid('afs-type', 'ae-type', false);
        if (e.target.name === 'cooler') setInvalid('afs-cooler', 'ae-cooler', false);
        markSelected();
        saveDraft();
    });
    form.addEventListener('input', saveDraft);
    fName.addEventListener('input', function () {
        if (fName.getAttribute('aria-invalid') === 'true') validateField(fName, 'ae-name');
    });
    fPlace.addEventListener('input', function () {
        if (fPlace.getAttribute('aria-invalid') === 'true') validateField(fPlace, 'ae-place');
    });

    var MAPS_LINK = /https:\/\/maps\.google\.com\/\?q=-?[\d.]+,-?[\d.]+/;

    geoBtn.addEventListener('click', function () {
        if (!navigator.geolocation) {
            geoStatus.textContent = 'HP ini tidak mendukung lokasi. Tulis alamatnya secara manual.';
            return;
        }
        geoBtn.disabled = true;
        geoStatus.textContent = 'Mencari lokasimu…';
        navigator.geolocation.getCurrentPosition(function (pos) {
            var link = 'https://maps.google.com/?q=' + pos.coords.latitude.toFixed(6) + ',' + pos.coords.longitude.toFixed(6);
            var text = fPlace.value.trim();
            if (MAPS_LINK.test(text)) text = text.replace(MAPS_LINK, link);
            else text = text ? text + '\n' + link : link;
            fPlace.value = text;
            geoBtn.disabled = false;
            geoStatus.textContent = 'Titik lokasi ditambahkan. Tambahkan patokan kalau perlu.';
            validateField(fPlace, 'ae-place');
            saveDraft();
        }, function (err) {
            geoBtn.disabled = false;
            geoStatus.textContent = err && err.code === 1
                ? 'Izin lokasi ditolak. Tulis alamatnya secara manual.'
                : 'Lokasi tidak ditemukan. Coba lagi atau tulis alamatnya secara manual.';
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateField(fName, 'ae-name')) { fName.focus(); return; }
        var type = checked('type');
        if (!type) {
            setInvalid('afs-type', 'ae-type', true);
            form.querySelector('input[name="type"]').focus();
            return;
        }
        if (!validateField(fPlace, 'ae-place')) { fPlace.focus(); return; }
        var cooler = checked('cooler');
        if (!cooler) {
            setInvalid('afs-cooler', 'ae-cooler', true);
            form.querySelector('input[name="cooler"]').focus();
            return;
        }

        var lines = [
            'Halo KOPIGO, saya mau mengajukan lokasi untuk Titik Jualan.',
            '',
            'Nama: ' + fName.value.trim(),
            'Jenis tempat: ' + type,
            'Alamat: ' + fPlace.value.trim(),
            'Lemari pendingin: ' + cooler
        ];
        if (fTraffic.value.trim()) lines.push('Keramaian: ' + fTraffic.value.trim());
        if (fNote.value.trim()) lines.push('Catatan: ' + fNote.value.trim());
        if (source) lines.push('Sumber: ' + source);
        lines.push('');
        lines.push('Foto lokasi saya kirim setelah pesan ini.');

        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
        saveDraft();
        write(LAST_KEY, {
            url: url, name: fName.value.trim(), type: type,
            place: fPlace.value.trim(), cooler: cooler
        });

        // WhatsApp dibuka di tab baru; halaman ini pindah ke ringkasan
        // (kunjungan ke titik-terkirim.html = satu pengajuan yang sampai ke WhatsApp).
        var win = window.open(url, '_blank');
        if (win) win.opener = null;
        window.location.href = 'titik-terkirim.html' + (win ? '' : '?wa=tertutup');
    });

    // ---------- tombol menempel: sembunyikan saat form terlihat ----------
    // Tombol disembunyikan saat form atau kalkulator terlihat, supaya tidak menutupi isinya.
    var sticky = $('stickybar');
    if (sticky && 'IntersectionObserver' in window) {
        var visible = {};
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
            sticky.classList.toggle('is-hidden', !!(visible.ajukan || visible.calc));
        }, { threshold: 0.05 });
        io.observe($('ajukan'));
        io.observe($('calc'));
    }

    loadDraft();
    markSelected();
})();
