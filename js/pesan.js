/* KOPIGO, halaman pesan: keranjang + checkout ke WhatsApp */
(function () {
    'use strict';

    var WA_NUMBER = '6282187164364';
    var CART_KEY = 'kopigo_pesanan_v1';
    var PROFILE_KEY = 'kopigo_pemesan_v1';      // nama, alamat, lokasi, metode: hanya di perangkat ini
    var LAST_KEY = 'kopigo_pesanan_terakhir';   // dibaca pesan-terkirim.html
    var MAX_QTY = 50;
    var BULK_FROM = 20;                          // mulai jumlah ini, tawarkan layanan katering

    var products = {};
    var order = [];   // urutan id sesuai menu
    var cart = {};    // id -> jumlah

    function $(id) { return document.getElementById(id); }

    var els = {
        cart: $('cart'), backdrop: $('backdrop'), close: $('cart-close'),
        empty: $('cart-empty'), items: $('cart-items'), form: $('order-form'),
        foot: $('cart-foot'), count: $('cart-count'), total: $('cart-total'),
        bar: $('cartbar'), barCount: $('bar-count'), barTotal: $('bar-total'),
        menu: $('menu'), tools: $('cart-tools'), bulk: $('bulk-hint'),
        btnClear: $('btn-clear'), clearConfirm: $('clear-confirm'),
        clearYes: $('clear-yes'), clearNo: $('clear-no'),
        fsOutlet: $('fs-outlet'), fsMethod: $('fs-method'), pickupAt: $('pickup-at'),
        fieldPlace: $('field-place'), btnGeo: $('btn-geo'), geoStatus: $('geo-status'),
        fName: $('f-name'), fPlace: $('f-place'), fNote: $('f-note')
    };

    var desktop = window.matchMedia('(min-width: 960px)');

    function rupiah(n) { return 'Rp' + n.toLocaleString('id-ID'); }

    function read(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
    }
    function write(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* penyimpanan tidak tersedia */ }
    }

    function checked(name) {
        var el = els.form.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : '';
    }

    // ---------- data ----------
    var nodes = document.querySelectorAll('.product');
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i], pid = n.getAttribute('data-id');
        products[pid] = {
            name: n.getAttribute('data-name'),
            price: parseInt(n.getAttribute('data-price'), 10),
            node: n
        };
        order.push(pid);
    }

    function loadCart() {
        var saved = read(CART_KEY) || {};
        for (var id in saved) {
            var q = parseInt(saved[id], 10);
            if (products[id] && q > 0) cart[id] = Math.min(q, MAX_QTY);
        }
    }

    function loadProfile() {
        var p = read(PROFILE_KEY);
        if (!p || typeof p !== 'object') return;
        if (typeof p.name === 'string') els.fName.value = p.name;
        if (typeof p.place === 'string') els.fPlace.value = p.place;
        ['outlet', 'method'].forEach(function (name) {
            var radios = els.form.querySelectorAll('input[name="' + name + '"]');
            for (var i = 0; i < radios.length; i++) if (radios[i].value === p[name]) radios[i].checked = true;
        });
    }

    function saveProfile() {
        write(PROFILE_KEY, {
            name: els.fName.value.trim(),
            place: els.fPlace.value.trim(),
            outlet: checked('outlet'),
            method: checked('method')
        });
    }

    function setQty(id, qty) {
        qty = Math.max(0, Math.min(MAX_QTY, qty));
        if (qty === 0) delete cart[id]; else cart[id] = qty;
        write(CART_KEY, cart);
        render();
    }

    function totals() {
        var count = 0, sum = 0;
        for (var id in cart) {
            count += cart[id];
            sum += cart[id] * products[id].price;
        }
        return { count: count, sum: sum };
    }

    // ---------- render ----------
    function stepper(id, name, qty) {
        var wrap = document.createElement('div');
        wrap.className = 'stepper';
        var dec = document.createElement('button');
        dec.type = 'button'; dec.className = 'stepper-btn'; dec.textContent = '−';
        dec.setAttribute('aria-label', 'Kurangi ' + name);
        dec.setAttribute('data-cart-dec', id);
        var out = document.createElement('output');
        out.className = 'stepper-qty'; out.textContent = qty;
        out.setAttribute('aria-label', 'Jumlah ' + name);
        var inc = document.createElement('button');
        inc.type = 'button'; inc.className = 'stepper-btn'; inc.textContent = '+';
        inc.setAttribute('aria-label', 'Tambah ' + name);
        inc.setAttribute('data-cart-inc', id);
        wrap.appendChild(dec); wrap.appendChild(out); wrap.appendChild(inc);
        return wrap;
    }

    function resetClearConfirm() {
        els.btnClear.hidden = false;
        els.clearConfirm.hidden = true;
    }

    function renderDelivery() {
        var outlet = checked('outlet'), method = checked('method');
        els.fsMethod.hidden = !outlet;
        els.pickupAt.textContent = outlet ? 'Ambil di ' + outlet : 'Ambil di lokasi yang kamu pilih';
        els.fieldPlace.hidden = !(outlet && method === 'kirim');
    }

    function render() {
        var t = totals();
        var has = t.count > 0;

        // kartu menu
        order.forEach(function (id) {
            var p = products[id], qty = cart[id] || 0;
            p.node.classList.toggle('is-in-cart', qty > 0);
            p.node.querySelector('[data-add]').hidden = qty > 0;
            p.node.querySelector('.stepper').hidden = qty === 0;
            p.node.querySelector('.stepper-qty').textContent = qty;
        });

        // daftar pesanan (pertahankan fokus tombol + / − saat daftar dibangun ulang)
        var active = document.activeElement, refocus = null;
        if (active && els.items.contains(active)) {
            refocus = active.hasAttribute('data-cart-inc')
                ? '[data-cart-inc="' + active.getAttribute('data-cart-inc') + '"]'
                : '[data-cart-dec="' + active.getAttribute('data-cart-dec') + '"]';
        }
        els.items.textContent = '';
        order.forEach(function (id) {
            if (!cart[id]) return;
            var p = products[id];
            var li = document.createElement('li');
            li.className = 'cart-item';
            var name = document.createElement('span');
            name.className = 'cart-item-name'; name.textContent = p.name;
            var sub = document.createElement('span');
            sub.className = 'cart-item-sub';
            sub.textContent = cart[id] + ' × ' + rupiah(p.price) + ' = ' + rupiah(cart[id] * p.price);
            li.appendChild(name);
            li.appendChild(stepper(id, p.name, cart[id]));
            li.appendChild(sub);
            els.items.appendChild(li);
        });
        if (refocus) {
            var target = els.items.querySelector(refocus) || els.close;
            if (target && target.offsetParent !== null) target.focus();
        }

        els.empty.hidden = has;
        els.form.hidden = !has;
        els.foot.hidden = !has;
        els.tools.hidden = !has;
        els.bulk.hidden = t.count < BULK_FROM;
        if (!has) resetClearConfirm();

        var countText = t.count + ' gelas';
        els.count.textContent = countText;
        els.total.textContent = rupiah(t.sum);
        els.barCount.textContent = countText;
        els.barTotal.textContent = rupiah(t.sum);
        els.bar.hidden = !has;
        els.bar.setAttribute('aria-label', 'Lihat pesanan: ' + countText + ', total ' + rupiah(t.sum));

        renderDelivery();
    }

    // ---------- panel pesanan (HP) ----------
    function openCart() {
        if (desktop.matches) return;
        els.cart.classList.add('is-open');
        els.cart.setAttribute('role', 'dialog');
        els.cart.setAttribute('aria-modal', 'true');
        els.backdrop.hidden = false;
        els.menu.inert = true;
        els.bar.inert = true;
        document.body.style.overflow = 'hidden';
        els.close.focus();
    }

    function closeCart() {
        if (!els.cart.classList.contains('is-open')) return;
        els.cart.classList.remove('is-open');
        els.cart.removeAttribute('role');
        els.cart.removeAttribute('aria-modal');
        els.backdrop.hidden = true;
        els.menu.inert = false;
        els.bar.inert = false;
        document.body.style.overflow = '';
        if (!els.bar.hidden) els.bar.focus();
        else { var first = els.menu.querySelector('.cats a'); if (first) first.focus(); }
    }

    // Tab tetap di dalam panel saat terbuka
    els.cart.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !els.cart.classList.contains('is-open')) return;
        var f = els.cart.querySelectorAll('button, input, textarea, a[href]');
        var list = [];
        for (var i = 0; i < f.length; i++) if (f[i].offsetParent !== null) list.push(f[i]);
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    els.bar.addEventListener('click', openCart);
    els.close.addEventListener('click', closeCart);
    els.backdrop.addEventListener('click', closeCart);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCart();
    });
    desktop.addEventListener('change', function () { if (desktop.matches) closeCart(); });

    // ---------- klik menu ----------
    els.menu.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var card = btn.closest('.product');
        if (!card) return;
        var id = card.getAttribute('data-id'), qty = cart[id] || 0;
        if (btn.hasAttribute('data-add')) {
            setQty(id, 1);
            card.querySelector('[data-inc]').focus();
        } else if (btn.hasAttribute('data-inc')) {
            setQty(id, qty + 1);
        } else if (btn.hasAttribute('data-dec')) {
            setQty(id, qty - 1);
            if (qty - 1 === 0) card.querySelector('[data-add]').focus();
        }
    });

    els.items.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var inc = btn.getAttribute('data-cart-inc'), dec = btn.getAttribute('data-cart-dec');
        if (inc) setQty(inc, (cart[inc] || 0) + 1);
        if (dec) {
            setQty(dec, (cart[dec] || 0) - 1);
            if (totals().count === 0) closeCart();
        }
    });

    // ---------- kosongkan pesanan ----------
    els.btnClear.addEventListener('click', function () {
        els.btnClear.hidden = true;
        els.clearConfirm.hidden = false;
        els.clearNo.focus();
    });
    els.clearNo.addEventListener('click', function () {
        resetClearConfirm();
        els.btnClear.focus();
    });
    els.clearYes.addEventListener('click', function () {
        cart = {};
        write(CART_KEY, cart);
        render();
        closeCart();
    });

    // ---------- lokasi KOPIGO & metode ----------
    function setInvalid(fieldset, errorId, invalid) {
        fieldset.classList.toggle('is-invalid', invalid);
        $(errorId).hidden = !invalid;
    }

    els.form.addEventListener('change', function (e) {
        if (e.target.name === 'outlet') setInvalid(els.fsOutlet, 'e-outlet', false);
        if (e.target.name === 'method') setInvalid(els.fsMethod, 'e-method', false);
        renderDelivery();
        saveProfile();
    });

    // ---------- pakai lokasi saya ----------
    var MAPS_LINK = /https:\/\/maps\.google\.com\/\?q=-?[\d.]+,-?[\d.]+/;

    els.btnGeo.addEventListener('click', function () {
        if (!navigator.geolocation) {
            els.geoStatus.textContent = 'HP ini tidak mendukung lokasi. Tulis alamatmu secara manual.';
            return;
        }
        els.btnGeo.disabled = true;
        els.geoStatus.textContent = 'Mencari lokasimu…';
        navigator.geolocation.getCurrentPosition(function (pos) {
            var link = 'https://maps.google.com/?q=' + pos.coords.latitude.toFixed(6) + ',' + pos.coords.longitude.toFixed(6);
            var text = els.fPlace.value.trim();
            if (MAPS_LINK.test(text)) text = text.replace(MAPS_LINK, link);
            else text = text ? text + '\n' + link : link;
            els.fPlace.value = text;
            els.btnGeo.disabled = false;
            els.geoStatus.textContent = 'Titik lokasi ditambahkan. Tambahkan patokan kalau perlu.';
            validateField(els.fPlace, 'e-place');
            saveProfile();
        }, function (err) {
            els.btnGeo.disabled = false;
            els.geoStatus.textContent = err && err.code === 1
                ? 'Izin lokasi ditolak. Tulis alamatmu secara manual.'
                : 'Lokasi tidak ditemukan. Coba lagi atau tulis alamatmu secara manual.';
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    });

    // ---------- kirim ----------
    function validateField(field, errorId) {
        var ok = field.value.trim() !== '';
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        $(errorId).hidden = ok;
        return ok;
    }

    els.fName.addEventListener('input', function () {
        if (els.fName.getAttribute('aria-invalid') === 'true') validateField(els.fName, 'e-name');
    });
    els.fPlace.addEventListener('input', function () {
        if (els.fPlace.getAttribute('aria-invalid') === 'true') validateField(els.fPlace, 'e-place');
    });
    els.fName.addEventListener('change', saveProfile);
    els.fPlace.addEventListener('change', saveProfile);

    function orderCode() {
        var d = new Date();
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', tail = '';
        for (var i = 0; i < 3; i++) tail += chars.charAt(Math.floor(Math.random() * chars.length));
        return 'KG-' + ('0' + d.getDate()).slice(-2) + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + tail;
    }

    els.form.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = totals();
        if (t.count === 0) return;

        var outlet = checked('outlet'), method = checked('method');
        if (!outlet) {
            setInvalid(els.fsOutlet, 'e-outlet', true);
            els.fsOutlet.querySelector('input').focus();
            return;
        }
        if (!method) {
            setInvalid(els.fsMethod, 'e-method', true);
            els.fsMethod.querySelector('input').focus();
            return;
        }
        if (!validateField(els.fName, 'e-name')) { els.fName.focus(); return; }
        if (method === 'kirim' && !validateField(els.fPlace, 'e-place')) { els.fPlace.focus(); return; }

        var code = orderCode();
        var methodText = method === 'kirim' ? 'Dikirim (ojek online)' : 'Ambil sendiri';
        var summary = [];
        var lines = ['Halo KOPIGO, saya mau pesan (#' + code + '):', ''];
        var no = 1;
        order.forEach(function (id) {
            if (!cart[id]) return;
            var p = products[id];
            lines.push(no++ + '. ' + p.name + ' x' + cart[id] + ' = ' + rupiah(cart[id] * p.price));
            summary.push({ name: p.name, qty: cart[id], sum: rupiah(cart[id] * p.price) });
        });
        lines.push('');
        lines.push('Total: ' + rupiah(t.sum) + ' (' + t.count + ' gelas)');
        lines.push('');
        lines.push('Dari: ' + outlet);
        lines.push('Metode: ' + methodText);
        lines.push('Nama: ' + els.fName.value.trim());
        if (method === 'kirim') lines.push('Alamat kirim: ' + els.fPlace.value.trim());
        if (els.fNote.value.trim()) lines.push('Catatan: ' + els.fNote.value.trim());

        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

        saveProfile();
        write(LAST_KEY, {
            code: code, url: url, items: summary,
            total: rupiah(t.sum), count: t.count,
            outlet: outlet, method: methodText
        });
        cart = {};
        write(CART_KEY, cart);

        // WhatsApp dibuka di tab baru; halaman ini pindah ke ringkasan pesanan
        // (kunjungan ke pesan-terkirim.html = satu pesanan yang sampai ke WhatsApp).
        var win = window.open(url, '_blank');
        if (win) win.opener = null;
        window.location.href = 'pesan-terkirim.html' + (win ? '' : '?wa=tertutup');
    });

    loadCart();
    loadProfile();
    render();
})();
