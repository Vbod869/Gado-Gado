let navbar = document.querySelector('.navbar');
    let menuBtn = document.querySelector('#menu-btn');

    menuBtn.onclick = () => {
        navbar.classList.toggle('active');
        menuBtn.classList.toggle('fa-times');
    };

    window.onscroll = () => {
        navbar.classList.remove('active');
        menuBtn.classList.remove('fa-times');
    };

    const orderList = [];
    let totalPrice = 0;

    function addToOrder(name, price, spicyId = null) {
        const spicyLevel = spicyId ? document.getElementById(spicyId).value : 'Tidak ada tingkat pedas';
        const orderItem = { name, price, spicyLevel };
        orderList.push(orderItem);
        totalPrice += price;
        updateCartButton();
        alert(`${name} ditambahkan ke pesanan!`);
    }

    function updateCartButton() {
        const cartBtn = document.getElementById('cart-btn');
        cartBtn.innerHTML = ` (${orderList.length})`;
        cartBtn.onclick = showOrderModal;
    }

    function showOrderModal() {
        const modal = document.getElementById('order-modal');
        const orderSummary = document.getElementById('order-summary');
        let summaryHTML = '<ul>';
        orderList.forEach((order, index) => {
            summaryHTML += `<li>${index + 1}. ${order.name} (${order.spicyLevel}) - Rp${order.price}</li>`;
        });
        summaryHTML += `</ul><p>Total: Rp${totalPrice}</p>`;
        orderSummary.innerHTML = summaryHTML;
        modal.style.display = 'block';
    }

    document.getElementById('send-order').onclick = function() {
        const customerName = document.getElementById('customer-name').value;
        if (!customerName) {
            alert('Mohon masukkan nama Anda');
            return;
        }
        
        document.getElementById('notification-modal').style.display = 'block';

        document.getElementById('confirm-send').onclick = function() {
            sendOrderToWhatsApp(customerName);
            document.getElementById('notification-modal').style.display = 'none';
        };

        document.getElementById('cancel-send').onclick = function() {
            document.getElementById('notification-modal').style.display = 'none';
        };
    };

    function sendOrderToWhatsApp(customerName) {
        if (orderList.length === 0) {
            alert("Pesanan Anda kosong!");
            return;
        }

        let message = `Pesanan untuk: ${customerName}\n\n`;
        let totalHarga = 0;
        orderList.forEach((order, index) => {
            message += `${index + 1}. ${order.name} - Rp${order.price} (${order.spicyLevel})\n`;
            totalHarga += order.price;
        });
        message += `\nTotal: Rp${totalHarga}`;
        
        let whatsappUrl = `https://wa.me/6289516149031?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    window.onclick = function(event) {
        const orderModal = document.getElementById('order-modal');
        const notificationModal = document.getElementById('notification-modal');
        if (event.target == orderModal) {
            orderModal.style.display = 'none';
        }
        if (event.target == notificationModal) {
            notificationModal.style.display = 'none';
        }
    };


    function checkOpeningHours() {
        const overlay = document.getElementById('overlay');
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Convert the current time to minutes since midnight
        const currentTimeInMinutes = hours * 60 + minutes;

        // Define the opening and closing times in minutes since midnight
        const openingTimeInMinutes = 10 * 60; // 09:00
        const closingTimeInMinutes = 10 * 60; // 13:00

        // Check if the current time is outside of opening hours
        if (currentTimeInMinutes < openingTimeInMinutes || currentTimeInMinutes >= closingTimeInMinutes) {
            overlay.style.display = 'block'; // Show the overlay
        } else {
            overlay.style.display = 'none'; // Hide the overlay
        }
    }

    // Initial check on page load
    checkOpeningHours();

    // Set interval to check every minute (60000 ms)
    setInterval(checkOpeningHours, 60000);
