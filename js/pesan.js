/* KOPIGO, halaman pesan: keranjang + checkout ke WhatsApp */
(function () {
    'use strict';

    var WA_NUMBER = '6282187164364';
    var STORAGE_KEY = 'kopigo_pesanan_v1';
    var MAX_QTY = 50;

    var products = {};
    var order = [];   // urutan id sesuai menu
    var cart = {};    // id -> jumlah

    var els = {
        cart: document.getElementById('cart'),
        backdrop: document.getElementById('backdrop'),
        close: document.getElementById('cart-close'),
        empty: document.getElementById('cart-empty'),
        items: document.getElementById('cart-items'),
        form: document.getElementById('order-form'),
        foot: document.getElementById('cart-foot'),
        count: document.getElementById('cart-count'),
        total: document.getElementById('cart-total'),
        bar: document.getElementById('cartbar'),
        barCount: document.getElementById('bar-count'),
        barTotal: document.getElementById('bar-total'),
        menu: document.getElementById('menu')
    };

    var desktop = window.matchMedia('(min-width: 960px)');

    function rupiah(n) {
        return 'Rp' + n.toLocaleString('id-ID');
    }

    // ---------- data ----------
    var nodes = document.querySelectorAll('.product');
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var id = n.getAttribute('data-id');
        products[id] = {
            name: n.getAttribute('data-name'),
            price: parseInt(n.getAttribute('data-price'), 10),
            node: n
        };
        order.push(id);
    }

    function load() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            for (var id in saved) {
                var q = parseInt(saved[id], 10);
                if (products[id] && q > 0) cart[id] = Math.min(q, MAX_QTY);
            }
        } catch (e) { /* penyimpanan tidak tersedia: mulai dari kosong */ }
    }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { }
    }

    function setQty(id, qty) {
        qty = Math.max(0, Math.min(MAX_QTY, qty));
        if (qty === 0) delete cart[id]; else cart[id] = qty;
        save();
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

        var countText = t.count + ' gelas';
        els.count.textContent = countText;
        els.total.textContent = rupiah(t.sum);
        els.barCount.textContent = countText;
        els.barTotal.textContent = rupiah(t.sum);
        els.bar.hidden = !has;
        els.bar.setAttribute('aria-label', 'Lihat pesanan: ' + countText + ', total ' + rupiah(t.sum));
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

    // ---------- kirim ----------
    function validate(field, errorId) {
        var ok = field.value.trim() !== '';
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        document.getElementById(errorId).hidden = ok;
        return ok;
    }

    var fName = document.getElementById('f-name');
    var fPlace = document.getElementById('f-place');
    var fNote = document.getElementById('f-note');

    fName.addEventListener('input', function () { if (fName.getAttribute('aria-invalid') === 'true') validate(fName, 'e-name'); });
    fPlace.addEventListener('input', function () { if (fPlace.getAttribute('aria-invalid') === 'true') validate(fPlace, 'e-place'); });

    els.form.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = totals();
        if (t.count === 0) return;

        var okName = validate(fName, 'e-name');
        var okPlace = validate(fPlace, 'e-place');
        if (!okName) { fName.focus(); return; }
        if (!okPlace) { fPlace.focus(); return; }

        var lines = ['Halo KOPIGO, saya mau pesan:', ''];
        var no = 1;
        order.forEach(function (id) {
            if (!cart[id]) return;
            var p = products[id];
            lines.push(no++ + '. ' + p.name + ' x' + cart[id] + ' = ' + rupiah(cart[id] * p.price));
        });
        lines.push('');
        lines.push('Total: ' + rupiah(t.sum) + ' (' + t.count + ' gelas)');
        lines.push('');
        lines.push('Nama: ' + fName.value.trim());
        lines.push('Lokasi: ' + fPlace.value.trim());
        if (fNote.value.trim()) lines.push('Catatan: ' + fNote.value.trim());

        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
        window.location.href = url;
    });

    load();
    render();
})();
