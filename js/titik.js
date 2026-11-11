/* KOPIGO, halaman Titik Jualan: kalkulator komisi + pengajuan lokasi ke WhatsApp */
(function () {
    'use strict';

    var WA_NUMBER = '6282187164364';

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

    function calc() {
        var perDay = parseInt(cups.value, 10);
        var d = parseInt(days.value, 10);
        cupsOut.textContent = perDay;
        var ok = d >= 1 && d <= 31;
        daysError.hidden = ok;
        days.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) {
            total.textContent = 'Rp0';
            detail.textContent = 'Isi jumlah hari jualan dulu.';
            return;
        }
        var r = rate(perDay), sum = perDay * d;
        total.textContent = rupiah(sum * r);
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

    form.addEventListener('change', function (e) {
        if (e.target.name === 'type') setInvalid('afs-type', 'ae-type', false);
        if (e.target.name === 'cooler') setInvalid('afs-cooler', 'ae-cooler', false);
        markSelected();
    });
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
        lines.push('');
        lines.push('Foto lokasi saya kirim setelah pesan ini.');

        window.location.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    });

    markSelected();
})();
