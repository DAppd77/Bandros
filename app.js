/**
 * Bandros (Bandung Tour On Bus) - Application Logic
 * Interactive responsive web app ported from Figma design
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  const state = {
    selectedDate: '2026-11-26',
    selectedDateLabel: 'Kamis, 26 Nov 2026',
    selectedBus: {
      id: 'bus-1',
      departure: '07.00',
      arrival: '07.30',
      price: 20000,
      serviceFee: 4000,
      tier: '1 TINGKAT',
      operator: 'BANDUNG TOUR ON BUS',
      origin: 'BANDUNG TOUR ON BUS',
      destination: 'Leuwipanjang'
    },
    savedRoute: false,
    activeTab: 'jadwal',
    activePaymentMethod: 'qris',
    countdownSeconds: 6 * 60 + 55, // 06:55
    viewMode: 'mobile', // 'mobile' | 'responsive'
    filterTime: 'all',
    filterType: 'all',
    searchQuery: '',
    sortOrder: 'early' // 'early' | 'price'
  };

  // --- DOM Elements ---
  const appWrapper = document.getElementById('app-wrapper');
  const viewMobileBtn = document.getElementById('view-mobile-btn');
  const viewResponsiveBtn = document.getElementById('view-responsive-btn');

  const screenJadwal = document.getElementById('screen-jadwal');
  const screenPembayaran = document.getElementById('screen-pembayaran');

  const btnProceedOrder = document.getElementById('btn-proceed-order');
  const btnPaymentBack = document.getElementById('btn-payment-back');
  const btnJadwalBack = document.getElementById('btn-jadwal-back');
  const btnShare = document.getElementById('btn-share');
  const btnSaveRoute = document.getElementById('btn-save-route');
  const saveTitleText = document.getElementById('save-title-text');

  const tabTentang = document.getElementById('tab-tentang');
  const tabJadwal = document.getElementById('tab-jadwal');
  const routeDescBox = document.getElementById('route-desc-box');

  const dateCards = document.querySelectorAll('.date-card');
  const busCards = document.querySelectorAll('.bus-item-card');
  const busSearchInput = document.getElementById('bus-search-input');
  const btnOpenFilter = document.getElementById('btn-open-filter');
  const sortToggle = document.getElementById('sort-toggle');
  const currentSortText = document.getElementById('current-sort');

  const footerSelectedBus = document.getElementById('footer-selected-bus');
  const footerSelectedDate = document.getElementById('footer-selected-date');

  // Payment Screen Elements
  const countdownVal = document.getElementById('countdown-val');
  const ticketDateVal = document.getElementById('ticket-date-val');
  const ticketScheduleVal = document.getElementById('ticket-schedule-val');
  const txTicketPrice = document.getElementById('tx-ticket-price');
  const txTotalPrice = document.getElementById('tx-total-price');
  const footerPayAmount = document.getElementById('footer-pay-amount');
  const btnPayNow = document.getElementById('btn-pay-now');

  const methodQris = document.getElementById('method-qris');
  const methodDana = document.getElementById('method-dana');

  // Modals
  const paymentModal = document.getElementById('payment-modal');
  const btnClosePaymentModal = document.getElementById('btn-close-payment-modal');
  const modalPaymentTitle = document.getElementById('modal-payment-title');
  const modalPaymentBody = document.getElementById('modal-payment-body');

  const successModal = document.getElementById('success-modal');
  const btnDownloadTicket = document.getElementById('btn-download-ticket');
  const btnReturnHome = document.getElementById('btn-return-home');
  const receiptBookingCode = document.getElementById('receipt-booking-code');
  const receiptSchedule = document.getElementById('receipt-schedule');
  const receiptMethod = document.getElementById('receipt-method');
  const receiptAmount = document.getElementById('receipt-amount');

  const filterModal = document.getElementById('filter-modal');
  const btnCloseFilterModal = document.getElementById('btn-close-filter-modal');
  const btnApplyFilter = document.getElementById('btn-apply-filter');
  const btnResetFilter = document.getElementById('btn-reset-filter');
  const filterChips = document.querySelectorAll('.filter-chip');

  const toastNotif = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');

  // --- Toast Helper ---
  function showToast(message) {
    toastMsg.textContent = message;
    toastNotif.style.display = 'block';
    setTimeout(() => {
      toastNotif.style.display = 'none';
    }, 2800);
  }

  // --- View Mode Switcher ---
  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'mobile') {
      appWrapper.className = 'app-wrapper mode-mobile';
      viewMobileBtn.classList.add('active');
      viewResponsiveBtn.classList.remove('active');
      // When in mobile mode, ensure only current active screen is visible
      screenJadwal.classList.add('active');
      screenPembayaran.classList.remove('active');
    } else {
      appWrapper.className = 'app-wrapper mode-responsive';
      viewResponsiveBtn.classList.add('active');
      viewMobileBtn.classList.remove('active');
      screenJadwal.classList.add('active');
      screenPembayaran.classList.add('active');
    }
  }

  viewMobileBtn.addEventListener('click', () => setViewMode('mobile'));
  viewResponsiveBtn.addEventListener('click', () => setViewMode('responsive'));

  // Automatically activate responsive dual-pane on wide desktops (> 1024px)
  if (window.innerWidth >= 1024) {
    setViewMode('responsive');
  }

  // --- Screen Navigation ---
  function navigateToScreen(screenName) {
    if (state.viewMode === 'mobile') {
      if (screenName === 'pembayaran') {
        screenJadwal.classList.remove('active');
        screenPembayaran.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        screenPembayaran.classList.remove('active');
        screenJadwal.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // In responsive mode, scroll smoothly to the payment column
      if (screenName === 'pembayaran') {
        screenPembayaran.scrollIntoView({ behavior: 'smooth' });
      } else {
        screenJadwal.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  btnProceedOrder.addEventListener('click', () => {
    updatePaymentScreenDetails();
    navigateToScreen('pembayaran');
  });

  btnPaymentBack.addEventListener('click', () => {
    navigateToScreen('jadwal');
  });

  btnJadwalBack.addEventListener('click', () => {
    showToast('Kembali ke menu beranda');
  });

  btnShare.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Jadwal Bandros - Bandung Tour On Bus',
        text: 'Pesan tiket Bandros sekarang, amankan kursimu!',
        url: window.location.href
      }).catch(() => {});
    } else {
      showToast('Tautan jadwal disalin ke papan klip!');
    }
  });

  // --- Save Route Bookmark ---
  btnSaveRoute.addEventListener('click', () => {
    state.savedRoute = !state.savedRoute;
    if (state.savedRoute) {
      saveTitleText.textContent = 'Tersimpan!';
      btnSaveRoute.style.opacity = '1';
      showToast('Rute berhasil disimpan ke favorit!');
    } else {
      saveTitleText.textContent = 'Simpan rute';
      showToast('Rute dihapus dari favorit');
    }
  });

  // --- Tabs Interaction ---
  tabTentang.addEventListener('click', () => {
    tabTentang.classList.add('active');
    tabJadwal.classList.remove('active');
    routeDescBox.style.display = 'block';
  });

  tabJadwal.addEventListener('click', () => {
    tabJadwal.classList.add('active');
    tabTentang.classList.remove('active');
    routeDescBox.style.display = 'none';
  });

  // --- Date Selection ---
  dateCards.forEach(card => {
    card.addEventListener('click', () => {
      dateCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedDate = card.getAttribute('data-date');
      state.selectedDateLabel = card.getAttribute('data-label');

      footerSelectedDate.textContent = state.selectedDateLabel;
      ticketDateVal.textContent = state.selectedDateLabel;
      showToast(`Tanggal dipilih: ${state.selectedDateLabel}`);
    });
  });

  // --- Bus Schedule Selection ---
  busCards.forEach(card => {
    card.addEventListener('click', () => {
      busCards.forEach(c => {
        c.classList.remove('selected');
        const badge = c.querySelector('.selected-check-badge');
        if (badge) {
          badge.className = 'selected-check-badge unselected-badge';
          badge.innerHTML = '<span class="empty-circle"></span>';
        }
      });

      card.classList.add('selected');
      const badge = card.querySelector('.selected-check-badge');
      if (badge) {
        badge.className = 'selected-check-badge';
        badge.innerHTML = '<img src="assets/check-circle.svg" alt="Terpilih">';
      }

      state.selectedBus = {
        id: card.getAttribute('data-bus-id'),
        departure: card.getAttribute('data-departure'),
        arrival: card.getAttribute('data-arrival'),
        price: parseInt(card.getAttribute('data-price'), 10),
        serviceFee: 4000,
        tier: card.getAttribute('data-tier'),
        operator: 'BANDUNG TOUR ON BUS',
        origin: 'BANDUNG TOUR ON BUS',
        destination: 'Leuwipanjang'
      };

      footerSelectedBus.textContent = `Jadwal Bandros · ${state.selectedBus.departure}`;
      updatePaymentScreenDetails();
    });
  });

  function updatePaymentScreenDetails() {
    ticketDateVal.textContent = state.selectedDateLabel;
    ticketScheduleVal.textContent = `${state.selectedBus.departure}–${state.selectedBus.arrival} · ${state.selectedBus.destination}`;
    
    const formattedPrice = `Rp${state.selectedBus.price.toLocaleString('id-ID')}`;
    const total = state.selectedBus.price + state.selectedBus.serviceFee;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;

    txTicketPrice.textContent = `${formattedPrice} × 1`;
    txTotalPrice.textContent = formattedTotal;
    footerPayAmount.textContent = formattedTotal;
    receiptAmount.textContent = formattedTotal;
    receiptSchedule.textContent = `${state.selectedDateLabel} · ${state.selectedBus.departure}`;
  }

  // --- Payment Countdown Timer ---
  function startCountdown() {
    setInterval(() => {
      if (state.countdownSeconds > 0) {
        state.countdownSeconds--;
        const mins = Math.floor(state.countdownSeconds / 60);
        const secs = state.countdownSeconds % 60;
        countdownVal.textContent = `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
      } else {
        countdownVal.textContent = '00 : 00';
      }
    }, 1000);
  }
  startCountdown();

  // --- Payment Method Switcher ---
  methodQris.addEventListener('click', () => {
    state.activePaymentMethod = 'qris';
    methodQris.classList.add('selected');
    methodDana.classList.remove('selected');

    methodQris.querySelector('.method-radio-state').innerHTML = `
      <div class="radio-selected-circle">
        <img src="assets/qris-check.svg" alt="Dipilih">
      </div>`;
    methodDana.querySelector('.method-radio-state').innerHTML = `
      <div class="radio-empty-circle"></div>`;
  });

  methodDana.addEventListener('click', () => {
    state.activePaymentMethod = 'dana';
    methodDana.classList.add('selected');
    methodQris.classList.remove('selected');

    methodDana.querySelector('.method-radio-state').innerHTML = `
      <div class="radio-selected-circle">
        <img src="assets/qris-check.svg" alt="Dipilih">
      </div>`;
    methodQris.querySelector('.method-radio-state').innerHTML = `
      <div class="radio-empty-circle"></div>`;
  });

  // --- Payment Simulation Modal ---
  btnPayNow.addEventListener('click', () => {
    const total = state.selectedBus.price + state.selectedBus.serviceFee;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;

    if (state.activePaymentMethod === 'qris') {
      modalPaymentTitle.textContent = 'Scan QRIS Pembayaran';
      modalPaymentBody.innerHTML = `
        <div class="qris-simulation-box">
          <p style="font-size: 13px; font-weight: 600; color: #1c3158;">BANDROS KOTA BANDUNG</p>
          <p class="qris-merchant-info">NMID: ID1020083948291</p>
          <div class="qris-qr-frame">
            <div class="simulated-qr"></div>
            <div class="qr-scan-line"></div>
          </div>
          <p style="font-size: 16px; font-weight: 700; color: #1c3158;">${formattedTotal}</p>
          <p style="font-size: 11px; color: #858d9b; margin-top: 4px;">Buka BCA Mobile, GoPay, OVO, ShopeePay atau bank Anda untuk scan QR.</p>
          <button class="btn-simulate-paid" id="btn-trigger-paid" type="button">Simulasikan Pembayaran Berhasil</button>
        </div>
      `;
    } else {
      modalPaymentTitle.textContent = 'Bayar dengan DANA';
      modalPaymentBody.innerHTML = `
        <div class="qris-simulation-box">
          <div style="background: #edf8ff; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <img src="assets/dana-wallet.svg" alt="DANA" style="width: 28px; height: 28px;">
          </div>
          <p style="font-size: 14px; font-weight: 700; color: #1c3158;">Hubungkan Akun DANA</p>
          <p style="font-size: 12px; color: #858d9b; margin: 4px 0 16px;">Nomor Ponsel: <strong>0812-****-4829</strong></p>
          <p style="font-size: 17px; font-weight: 800; color: #009ee3;">${formattedTotal}</p>
          <button class="btn-simulate-paid" id="btn-trigger-paid" type="button" style="background-color: #009ee3;">Konfirmasi Bayar DANA</button>
        </div>
      `;
    }

    paymentModal.style.display = 'flex';

    document.getElementById('btn-trigger-paid').addEventListener('click', () => {
      paymentModal.style.display = 'none';
      openSuccessModal();
    });
  });

  btnClosePaymentModal.addEventListener('click', () => {
    paymentModal.style.display = 'none';
  });

  function openSuccessModal() {
    const randomCode = 'BDRS-' + Math.floor(10000 + Math.random() * 90000);
    receiptBookingCode.textContent = randomCode;
    receiptMethod.textContent = state.activePaymentMethod.toUpperCase();
    successModal.style.display = 'flex';
  }

  btnDownloadTicket.addEventListener('click', () => {
    showToast('E-Tiket Bandros berhasil diunduh ke perangkat Anda!');
    successModal.style.display = 'none';
  });

  btnReturnHome.addEventListener('click', () => {
    successModal.style.display = 'none';
    navigateToScreen('jadwal');
  });

  // --- Filter Modal ---
  btnOpenFilter.addEventListener('click', () => {
    filterModal.style.display = 'flex';
  });

  btnCloseFilterModal.addEventListener('click', () => {
    filterModal.style.display = 'none';
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const parent = chip.parentElement;
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  btnApplyFilter.addEventListener('click', () => {
    filterModal.style.display = 'none';
    showToast('Filter jadwal telah diterapkan.');
  });

  btnResetFilter.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-filter-time="all"]').classList.add('active');
    document.querySelector('[data-filter-type="all"]').classList.add('active');
    filterModal.style.display = 'none';
    showToast('Filter direset ke semula.');
  });

  // --- Search Input Filter ---
  busSearchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    let visibleCount = 0;
    busCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(q)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    document.getElementById('available-count').textContent = `${visibleCount} bus tersedia`;
  });

  // --- Sort Toggle ---
  sortToggle.addEventListener('click', () => {
    const container = document.getElementById('bus-cards');
    const cards = Array.from(busCards);
    if (state.sortOrder === 'early') {
      state.sortOrder = 'late';
      currentSortText.textContent = 'Paling akhir';
      cards.reverse().forEach(c => container.appendChild(c));
    } else {
      state.sortOrder = 'early';
      currentSortText.textContent = 'Paling awal';
      cards.reverse().forEach(c => container.appendChild(c));
    }
  });

  // Close modals when clicking backdrop
  [paymentModal, successModal, filterModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Initialize details
  updatePaymentScreenDetails();
});
