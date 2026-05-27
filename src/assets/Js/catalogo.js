function openProductModal(id, name, desc, price, stock, cat, img) {

    document.getElementById('modalImg').src = img;

    document.getElementById('modalTitle').textContent = name;

    document.getElementById('modalDesc').textContent =
        desc || 'Sin descripción.';

    document.getElementById('modalPrice').textContent =
        '$' + parseFloat(price).toLocaleString('es-CO');

    document.getElementById('modalCat').textContent = cat;

    var stockNum = parseInt(stock) || 0;

    var stockEl = document.getElementById('modalStock');

    if (stockNum > 0) {

        stockEl.textContent =
            '✅ ' + stockNum + ' disponible(s)';

        stockEl.style.color = '#16a34a';

        document.getElementById('modalAddBtn').disabled = false;

        document.getElementById('modalAddBtn').textContent =
            '+ Agregar al Pedido';

        document.getElementById('modalAddBtn').onclick =
            function () {

                addToCart(name, price, id, stockNum);

                closeProductModal();
            };

    } else {

        stockEl.textContent = '❌ Agotado';

        stockEl.style.color = '#dc2626';

        document.getElementById('modalAddBtn').disabled = true;

        document.getElementById('modalAddBtn').textContent =
            'Agotado';

        document.getElementById('modalAddBtn').onclick = null;
    }

    document.getElementById('productModal').style.display = 'flex';

    document.body.style.overflow = 'hidden';
}

function closeProductModal() {

    document.getElementById('productModal').style.display = 'none';

    document.body.style.overflow = '';
}