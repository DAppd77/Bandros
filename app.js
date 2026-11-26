/**
 * Bandros (Bandung Tour On Bus) - Multi-Step Application Logic
 * Distinct separation between Step 1 (Pemesanan) and Step 2 (Pembayaran)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Central State ---
  const state = {
    currentStep: 1, // 1: Pemesanan, 2: Pembayaran
    selectedDate: '2026-11-26',
    selectedDateLabel: 'Kamis, 26 Nov 2026',
    selectedBus: {
      id: 'bus-1',
      departure: '07.00',
      arrival: '07.30',
      price: 20000,
      serviceFee: 4000,
      tier: '1 TINGKAT',
      operator: 'Bandung Tour On Bus',
      origin: 'Halte Leuwipanjang',
      destination: 'Halte Leuwipanjang'
    },
    savedRoute: false,
    activePaymentMethod: 'qris',
    countdownSeconds: 6 * 60 + 55, // 06:55
    viewMode: 'desktop' // 'desktop' | 'mobile'
  };

  // --- View Switcher (Desktop vs Mobile) ---
  const desktopView = document.getElementById('desktop-view');
  const mobileView = document.getElementById('mobile-view');
  const viewDesktopBtn = document.getElementById('view-desktop-btn');
  const viewMobileBtn = document.getElementById('view-mobile-btn');

  function switchView(mode) {
    state.viewMode = mode;
    if (mode === 'desktop') {
      desktopView.style.display = 'block';
      mobileView.style.display = 'none';
      viewDesktopBtn.classList.add('active');
      viewMobileBtn.classList.remove('active');
    } else {
      desktopView.style.display = 'none';
      mobileView.style.display = 'flex';
      viewMobileBtn.classList.add('active');
      viewDesktopBtn.classList.remove('active');
      // In mobile mode, sync active screen with currentStep
      if (state.currentStep === 1) {
        screenJadwal.classList.add('active');
        screenPembayaran.classList.remove('active');
      } else {
        screenPembayaran.classList.add('active');
        screenJadwal.classList.remove('active');
      }
    }
  }

  viewDesktopBtn.addEventListener('click', () => switchView('desktop'));
  viewMobileBtn.addEventListener('click', () => switchView('mobile'));

  if (window.innerWidth < 768) {
    switchView('mobile');
  }

  // --- Toast Notification ---
  const toastNotif = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(message) {
    toastMsg.textContent = message;
    toastNotif.style.display = 'block';
    setTimeout(() => {
      toastNotif.style.display = 'none';
    }, 2800);
  }

  // --- DESKTOP STEP MANAGEMENT (Pemesanan <-> Pembayaran) ---
  const desktopStepPemesanan = document.getElementById('desktop-step-pemesanan');
  const desktopStepPembayaran = document.getElementById('desktop-step-pembayaran');
  const dStepNode1 = document.getElementById('d-step-node-1');
  const dStepNode2 = document.getElementById('d-step-node-2');
  const dStepConnector = document.getElementById('d-step-connector');
  const navJadwalLink = document.getElementById('nav-jadwal-link');
  const navBayarLink = document.getElementById('nav-bayar-link');

  const dBtnProceedPayment = document.getElementById('d-btn-proceed-payment');
  const dBtnBackToBooking = document.getElementById('d-btn-back-to-booking');

  function goToStep(step) {
    state.currentStep = step;

    if (step === 1) {
      // Show Step 1 Pemesanan, Hide Step 2
      desktopStepPemesanan.style.display = 'block';
      desktopStepPembayaran.style.display = 'none';

      // Update Stepper
      dStepNode1.className = 'step-node active';
      dStepNode2.className = 'step-node';
      dStepConnector.className = 'step-connector';

      // Update Navbar
      navJadwalLink.classList.add('active');
      navBayarLink.classList.remove('active');

      // Mobile sync
      screenJadwal.classList.add('active');
      screenPembayaran.classList.remove('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Show Step 2 Pembayaran, Hide Step 1
      desktopStepPemesanan.style.display = 'none';
      desktopStepPembayaran.style.display = 'block';

      // Update Stepper
      dStepNode1.className = 'step-node completed';
      dStepNode2.className = 'step-node active';
      dStepConnector.className = 'step-connector completed';

      // Update Navbar
      navBayarLink.classList.add('active');
      navJadwalLink.classList.remove('active');

      // Mobile sync
      screenPembayaran.classList.add('active');
      screenJadwal.classList.remove('active');

      // Refresh data on payment screen
      updateAllDetails();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Desktop Transition Triggers
  dBtnProceedPayment.addEventListener('click', () => {
    goToStep(2);
    showToast('Lanjut ke Langkah 2: Pembayaran Tiket');
  });

  dBtnBackToBooking.addEventListener('click', () => {
    goToStep(1);
  });

  dStepNode1.addEventListener('click', () => goToStep(1));
  dStepNode2.addEventListener('click', () => goToStep(2));
  navJadwalLink.addEventListener('click', (e) => { e.preventDefault(); goToStep(1); });
  navBayarLink.addEventListener('click', (e) => { e.preventDefault(); goToStep(2); });

  // Mobile Screen Transition Triggers
  const screenJadwal = document.getElementById('screen-jadwal');
  const screenPembayaran = document.getElementById('screen-pembayaran');
  const btnProceedOrder = document.getElementById('btn-proceed-order');
  const btnPaymentBack = document.getElementById('btn-payment-back');
  const btnJadwalBack = document.getElementById('btn-jadwal-back');
  const btnShare = document.getElementById('btn-share');
  const btnSaveRoute = document.getElementById('btn-save-route');
  const saveTitleText = document.getElementById('save-title-text');

  btnProceedOrder.addEventListener('click', () => {
    goToStep(2);
  });

  btnPaymentBack.addEventListener('click', () => {
    goToStep(1);
  });

  btnJadwalBack.addEventListener('click', () => {
    showToast('Kembali ke menu beranda');
  });

  btnShare.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Jadwal Bandros - Bandung Tour On Bus',
        text: 'Pesan tiket Bandros sekarang keliling Kota Bandung!',
        url: window.location.href
      }).catch(() => {});
    } else {
      showToast('Tautan berhasil disalin ke papan klip!');
    }
  });

  btnSaveRoute.addEventListener('click', () => {
    state.savedRoute = !state.savedRoute;
    if (state.savedRoute) {
      saveTitleText.textContent = 'Tersimpan!';
      showToast('Rute Bandung Tour disimpan ke favorit!');
    } else {
      saveTitleText.textContent = 'Simpan rute';
      showToast('Rute dihapus dari favorit');
    }
  });

  // --- SYNCHRONIZED DATE SELECTION ---
  const desktopDateItems = document.querySelectorAll('.desktop-date-item');
  const mobileDateCards = document.querySelectorAll('.date-card');

  function setDate(dateStr, labelStr) {
    state.selectedDate = dateStr;
    state.selectedDateLabel = labelStr;

    // Desktop date items
    desktopDateItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-date') === dateStr);
    });

    // Mobile date cards
    mobileDateCards.forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-date') === dateStr);
    });

    updateAllDetails();
    showToast(`Tanggal dipilih: ${labelStr}`);
  }

  desktopDateItems.forEach(item => {
    item.addEventListener('click', () => {
      setDate(item.getAttribute('data-date'), item.getAttribute('data-label'));
    });
  });

  mobileDateCards.forEach(card => {
    card.addEventListener('click', () => {
      setDate(card.getAttribute('data-date'), card.getAttribute('data-label'));
    });
  });

  // --- SYNCHRONIZED BUS SELECTION ---
  const desktopBusCards = document.querySelectorAll('.desktop-bus-card');
  const mobileBusCards = document.querySelectorAll('.bus-item-card');

  function selectBus(busId, departure, arrival, price, seats) {
    state.selectedBus.id = busId;
    state.selectedBus.departure = departure;
    state.selectedBus.arrival = arrival;
    state.selectedBus.price = price;

    // Update Desktop Bus Cards
    desktopBusCards.forEach(card => {
      const isSelected = card.getAttribute('data-bus-id') === busId;
      const btn = card.querySelector('.d-select-btn');
      card.classList.toggle('selected', isSelected);
      btn.classList.toggle('selected', isSelected);

      if (isSelected) {
        btn.innerHTML = `
          <img src="assets/check-circle.svg" alt="Terpilih" class="d-btn-check-icon">
          <span class="d-btn-text">Jadwal Terpilih</span>
        `;
      } else {
        btn.innerHTML = `<span class="d-btn-text">Pilih Jadwal Ini</span>`;
      }
    });

    // Update Mobile Bus Cards
    mobileBusCards.forEach(card => {
      const isSelected = card.getAttribute('data-bus-id') === busId;
      const badge = card.querySelector('.selected-check-badge');
      card.classList.toggle('selected', isSelected);

      if (badge) {
        if (isSelected) {
          badge.className = 'selected-check-badge';
          badge.innerHTML = '<img src="assets/check-circle.svg" alt="Terpilih">';
        } else {
          badge.className = 'selected-check-badge unselected-badge';
          badge.innerHTML = '<span class="empty-circle"></span>';
        }
      }
    });

    updateAllDetails();
  }

  desktopBusCards.forEach(card => {
    card.addEventListener('click', () => {
      selectBus(
        card.getAttribute('data-bus-id'),
        card.getAttribute('data-departure'),
        card.getAttribute('data-arrival'),
        parseInt(card.getAttribute('data-price'), 10),
        card.getAttribute('data-seats')
      );
    });
  });

  mobileBusCards.forEach(card => {
    card.addEventListener('click', () => {
      selectBus(
        card.getAttribute('data-bus-id'),
        card.getAttribute('data-departure'),
        card.getAttribute('data-arrival'),
        parseInt(card.getAttribute('data-price'), 10),
        card.getAttribute('data-seats')
      );
    });
  });

  // --- REFRESH ALL UI LABELS & DETAILS ---
  function updateAllDetails() {
    const total = state.selectedBus.price + state.selectedBus.serviceFee;
    const formattedPrice = `Rp${state.selectedBus.price.toLocaleString('id-ID')}`;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;
    const scheduleRange = `${state.selectedBus.departure} - ${state.selectedBus.arrival} WIB`;
    const scheduleFull = `${state.selectedBus.departure}–${state.selectedBus.arrival} · Leuwipanjang`;

    // Desktop Step 1 Booking Action Bar
    document.getElementById('d-action-bus-name').textContent = `Bandung Tour On Bus • ${state.selectedBus.departure}`;
    document.getElementById('d-action-date-str').textContent = `${state.selectedDateLabel} (1 Penumpang)`;
    document.getElementById('d-action-price').textContent = formattedPrice;

    // Desktop Step 2 Payment Screen Details
    document.getElementById('d-payment-date').textContent = state.selectedDateLabel;
    document.getElementById('d-payment-hour').textContent = scheduleRange;
    document.getElementById('d-tx-ticket-price').textContent = `${formattedPrice} × 1`;
    document.getElementById('d-tx-total').textContent = formattedTotal;
    document.getElementById('d-btn-amount').textContent = formattedTotal;

    // Mobile Step 1 & Step 2 Details
    document.getElementById('footer-selected-bus').textContent = `Jadwal Bandros · ${state.selectedBus.departure}`;
    document.getElementById('footer-selected-date').textContent = state.selectedDateLabel;
    document.getElementById('ticket-date-val').textContent = state.selectedDateLabel;
    document.getElementById('ticket-schedule-val').textContent = scheduleFull;
    document.getElementById('tx-ticket-price').textContent = `${formattedPrice} × 1`;
    document.getElementById('tx-total-price').textContent = formattedTotal;
    document.getElementById('footer-pay-amount').textContent = formattedTotal;

    // Modal Details
    document.getElementById('receipt-schedule').textContent = `${state.selectedDateLabel} · ${state.selectedBus.departure}`;
    document.getElementById('receipt-amount').textContent = formattedTotal;
  }

  // --- PAYMENT METHOD TOGGLE (QRIS vs DANA) ---
  const dMethodQris = document.getElementById('d-method-qris');
  const dMethodDana = document.getElementById('d-method-dana');
  const mMethodQris = document.getElementById('method-qris');
  const mMethodDana = document.getElementById('method-dana');

  function setPaymentMethod(method) {
    state.activePaymentMethod = method;
    if (method === 'qris') {
      // Desktop
      dMethodQris.classList.add('selected');
      dMethodDana.classList.remove('selected');
      dMethodQris.querySelector('.d-radio-state').innerHTML = `<img src="assets/qris-check.svg" alt="Dipilih" class="d-radio-icon">`;
      dMethodDana.querySelector('.d-radio-state').innerHTML = `<span class="d-empty-radio"></span>`;

      // Mobile
      mMethodQris.classList.add('selected');
      mMethodDana.classList.remove('selected');
      mMethodQris.querySelector('.method-radio-state').innerHTML = `<div class="radio-selected-circle"><img src="assets/qris-check.svg" alt="Dipilih"></div>`;
      mMethodDana.querySelector('.method-radio-state').innerHTML = `<div class="radio-empty-circle"></div>`;
    } else {
      // Desktop
      dMethodDana.classList.add('selected');
      dMethodQris.classList.remove('selected');
      dMethodDana.querySelector('.d-radio-state').innerHTML = `<img src="assets/qris-check.svg" alt="Dipilih" class="d-radio-icon">`;
      dMethodQris.querySelector('.d-radio-state').innerHTML = `<span class="d-empty-radio"></span>`;

      // Mobile
      mMethodDana.classList.add('selected');
      mMethodQris.classList.remove('selected');
      mMethodDana.querySelector('.method-radio-state').innerHTML = `<div class="radio-selected-circle"><img src="assets/qris-check.svg" alt="Dipilih"></div>`;
      mMethodQris.querySelector('.method-radio-state').innerHTML = `<div class="radio-empty-circle"></div>`;
    }
  }

  dMethodQris.addEventListener('click', () => setPaymentMethod('qris'));
  dMethodDana.addEventListener('click', () => setPaymentMethod('dana'));
  mMethodQris.addEventListener('click', () => setPaymentMethod('qris'));
  mMethodDana.addEventListener('click', () => setPaymentMethod('dana'));

  // --- COUNTDOWN TIMER ---
  const desktopCountdown = document.getElementById('desktop-countdown');
  const mobileCountdown = document.getElementById('countdown-val');

  setInterval(() => {
    if (state.countdownSeconds > 0) {
      state.countdownSeconds--;
      const mins = Math.floor(state.countdownSeconds / 60);
      const secs = state.countdownSeconds % 60;
      const str = `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
      desktopCountdown.textContent = str;
      mobileCountdown.textContent = str;
    } else {
      desktopCountdown.textContent = '00 : 00';
      mobileCountdown.textContent = '00 : 00';
    }
  }, 1000);

  // --- SEARCH & FILTER (Desktop) ---
  const desktopBusSearch = document.getElementById('desktop-bus-search');
  const desktopChips = document.querySelectorAll('.d-chip');

  desktopBusSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    desktopBusCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'block' : 'none';
    });
  });

  desktopChips.forEach(chip => {
    chip.addEventListener('click', () => {
      desktopChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const timeFilter = chip.getAttribute('data-time-filter');

      desktopBusCards.forEach(card => {
        const dep = card.getAttribute('data-departure');
        if (timeFilter === 'all') {
          card.style.display = 'block';
        } else if (timeFilter === 'pagi') {
          card.style.display = (dep === '07.00' || dep === '08.30') ? 'block' : 'none';
        } else {
          card.style.display = 'none';
        }
      });
      showToast(`Filter: ${chip.textContent}`);
    });
  });

  // --- CHECKOUT SIMULATION MODALS ---
  const dBtnPayNow = document.getElementById('d-btn-pay-now');
  const mBtnPayNow = document.getElementById('btn-pay-now');
  const paymentModal = document.getElementById('payment-modal');
  const btnClosePaymentModal = document.getElementById('btn-close-payment-modal');
  const modalPaymentTitle = document.getElementById('modal-payment-title');
  const modalPaymentBody = document.getElementById('modal-payment-body');
  const successModal = document.getElementById('success-modal');
  const btnDownloadTicket = document.getElementById('btn-download-ticket');
  const btnReturnHome = document.getElementById('btn-return-home');

  function openPaymentModal() {
    const total = state.selectedBus.price + state.selectedBus.serviceFee;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;

    if (state.activePaymentMethod === 'qris') {
      modalPaymentTitle.textContent = 'Scan QRIS Pembayaran';
      modalPaymentBody.innerHTML = `
        <div class="qris-simulation-box">
          <p style="font-size: 13px; font-weight: 700; color: #1c3158;">BANDROS KOTA BANDUNG</p>
          <p class="qris-merchant-info">NMID: ID1020083948291 &bull; Merchant Resmi</p>
          <div class="qris-qr-frame">
            <div class="simulated-qr"></div>
            <div class="qr-scan-line"></div>
          </div>
          <p style="font-size: 18px; font-weight: 800; color: #1c3158;">${formattedTotal}</p>
          <p style="font-size: 11px; color: #858d9b; margin: 6px 0 14px;">Buka aplikasi BCA Mobile, GoPay, OVO, ShopeePay atau mobile banking Anda untuk scan.</p>
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
          <p style="font-size: 14px; font-weight: 700; color: #1c3158;">Akun DANA Terhubung</p>
          <p style="font-size: 12px; color: #858d9b; margin: 4px 0 16px;">Nomor Ponsel: <strong>0812-****-4829</strong></p>
          <p style="font-size: 18px; font-weight: 800; color: #009ee3;">${formattedTotal}</p>
          <button class="btn-simulate-paid" id="btn-trigger-paid" type="button" style="background-color: #009ee3;">Konfirmasi Bayar DANA</button>
        </div>
      `;
    }

    paymentModal.style.display = 'flex';

    document.getElementById('btn-trigger-paid').addEventListener('click', () => {
      paymentModal.style.display = 'none';
      openSuccessModal();
    });
  }

  function openSuccessModal() {
    const randomCode = 'BDRS-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('receipt-booking-code').textContent = randomCode;
    document.getElementById('receipt-method').textContent = state.activePaymentMethod.toUpperCase();
    successModal.style.display = 'flex';
  }

  dBtnPayNow.addEventListener('click', openPaymentModal);
  mBtnPayNow.addEventListener('click', openPaymentModal);

  btnClosePaymentModal.addEventListener('click', () => {
    paymentModal.style.display = 'none';
  });

  btnDownloadTicket.addEventListener('click', () => {
    showToast('E-Tiket Bandros berhasil diunduh!');
    successModal.style.display = 'none';
  });

  btnReturnHome.addEventListener('click', () => {
    successModal.style.display = 'none';
    goToStep(1);
  });

  // Close modals on backdrop click
  [paymentModal, successModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Initialize
  updateAllDetails();
});
