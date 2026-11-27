/**
 * Bandros (Bandung Tour On Bus) - Multi-Step Application Logic
 * Implements:
 * 1. Ticket Quantity Counter (Beli > 1 tiket)
 * 2. Tab Informasi Terbaru (Empty State)
 * 3. Fitur Riwayat Pembelian (Purchase History List & Storage)
 * 4. Step 1 (Pemesanan) <-> Step 2 (Pembayaran) Multi-Step Flow
 * 5. Synchronized Desktop and Mobile Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. ALL DOM ELEMENT DECLARATIONS (Hoisted at top to prevent TDZ errors)
  // ==========================================================================

  // Containers & Views
  const desktopView = document.getElementById('desktop-view');
  const mobileView = document.getElementById('mobile-view');
  const viewDesktopBtn = document.getElementById('view-desktop-btn');
  const viewMobileBtn = document.getElementById('view-mobile-btn');
  const screenJadwal = document.getElementById('screen-jadwal');
  const screenPembayaran = document.getElementById('screen-pembayaran');

  // Desktop Steps & Navigation
  const desktopStepPemesanan = document.getElementById('desktop-step-pemesanan');
  const desktopStepPembayaran = document.getElementById('desktop-step-pembayaran');
  const dStepNode1 = document.getElementById('d-step-node-1');
  const dStepNode2 = document.getElementById('d-step-node-2');
  const dStepConnector = document.getElementById('d-step-connector');
  const navJadwalLink = document.getElementById('nav-jadwal-link');
  const navBayarLink = document.getElementById('nav-bayar-link');
  const dBtnProceedPayment = document.getElementById('d-btn-proceed-payment');
  const dBtnBackToBooking = document.getElementById('d-btn-back-to-booking');

  // Mobile Screen Action Buttons
  const btnProceedOrder = document.getElementById('btn-proceed-order');
  const btnPaymentBack = document.getElementById('btn-payment-back');
  const btnJadwalBack = document.getElementById('btn-jadwal-back');
  const btnShare = document.getElementById('btn-share');
  const btnSaveRoute = document.getElementById('btn-save-route');
  const saveTitleText = document.getElementById('save-title-text');
  const btnChooseSchedule = document.getElementById('btn-choose-schedule');

  // Quantity Stepper Elements
  const dQtyVal = document.getElementById('d-qty-val');
  const dQtyMinus = document.getElementById('d-qty-minus');
  const dQtyPlus = document.getElementById('d-qty-plus');
  const dQtyHint = document.getElementById('d-qty-hint');

  const mQtyVal = document.getElementById('m-qty-val');
  const mQtyMinus = document.getElementById('m-qty-minus');
  const mQtyPlus = document.getElementById('m-qty-plus');
  const mQtyHint = document.getElementById('m-qty-hint');

  // Mobile Tabs
  const tabTentang = document.getElementById('tab-tentang');
  const tabJadwal = document.getElementById('tab-jadwal');
  const tabInfo = document.getElementById('tab-info');
  const routeDescBox = document.getElementById('route-desc-box');
  const tabInfoContent = document.getElementById('tab-info-content');

  const mobileDateContainer = document.getElementById('mobile-date-container');
  const mobileQtyContainer = document.getElementById('mobile-qty-container');
  const mobileSearchFilter = document.getElementById('mobile-search-filter');
  const mobileBusList = document.getElementById('mobile-bus-list');

  // Information Modals
  const navInfoLink = document.getElementById('nav-info-link');
  const infoModal = document.getElementById('info-modal');
  const btnCloseInfoModal = document.getElementById('btn-close-info-modal');

  // Purchase History
  const navHistoryLink = document.getElementById('nav-history-link');
  const btnMobileHistory = document.getElementById('btn-mobile-history');
  const historyModal = document.getElementById('history-modal');
  const btnCloseHistoryModal = document.getElementById('btn-close-history-modal');
  const historyItemsContainer = document.getElementById('history-items-container');
  const historyCountBadge = document.getElementById('history-count-badge');

  // Date and Bus Collections
  const desktopDateItems = document.querySelectorAll('.desktop-date-item');
  const mobileDateCards = document.querySelectorAll('.date-card');
  const desktopBusCards = document.querySelectorAll('.desktop-bus-card');
  const mobileBusCards = document.querySelectorAll('.bus-item-card');

  // Search & Filter
  const desktopBusSearch = document.getElementById('desktop-bus-search');
  const desktopChips = document.querySelectorAll('.d-chip');
  const mobileBusSearch = document.getElementById('bus-search-input');
  const btnOpenFilter = document.getElementById('btn-open-filter');
  const filterModal = document.getElementById('filter-modal');
  const btnCloseFilterModal = document.getElementById('btn-close-filter-modal');
  const btnApplyFilter = document.getElementById('btn-apply-filter');
  const btnResetFilter = document.getElementById('btn-reset-filter');
  const filterChips = document.querySelectorAll('.filter-chip');
  const sortToggle = document.getElementById('sort-toggle');
  const currentSortText = document.getElementById('current-sort');

  // Payment Methods
  const dMethodQris = document.getElementById('d-method-qris');
  const dMethodDana = document.getElementById('d-method-dana');
  const mMethodQris = document.getElementById('method-qris');
  const mMethodDana = document.getElementById('method-dana');

  // Countdown
  const desktopCountdown = document.getElementById('desktop-countdown');
  const mobileCountdown = document.getElementById('countdown-val');

  // Checkout & Modals
  const dBtnPayNow = document.getElementById('d-btn-pay-now');
  const mBtnPayNow = document.getElementById('btn-pay-now');
  const paymentModal = document.getElementById('payment-modal');
  const btnClosePaymentModal = document.getElementById('btn-close-payment-modal');
  const modalPaymentTitle = document.getElementById('modal-payment-title');
  const modalPaymentBody = document.getElementById('modal-payment-body');
  const successModal = document.getElementById('success-modal');
  const btnDownloadTicket = document.getElementById('btn-download-ticket');
  const btnReturnHome = document.getElementById('btn-return-home');
  const toastNotif = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');


  // ==========================================================================
  // 2. CENTRAL APPLICATION STATE
  // ==========================================================================
  const state = {
    currentStep: 1, // 1: Pemesanan, 2: Pembayaran
    selectedDate: '2026-11-26',
    selectedDateLabel: 'Kamis, 26 Nov 2026',
    ticketQty: 1, // Fitur Tambah Tiket
    selectedBus: {
      id: 'bus-1',
      departure: '07.00',
      arrival: '07.30',
      basePrice: 20000,
      serviceFee: 4000,
      tier: '1 TINGKAT',
      seatsAvailable: 8,
      operator: 'Bandung Tour On Bus',
      origin: 'Halte Leuwipanjang',
      destination: 'Halte Leuwipanjang'
    },
    savedRoute: false,
    activePaymentMethod: 'qris',
    countdownSeconds: 6 * 60 + 55, // 06:55
    viewMode: window.innerWidth < 768 ? 'mobile' : 'desktop',
    sortAscending: true,
    activeTimeFilter: 'all',

    // Initial Purchase History
    purchaseHistory: [
      {
        id: 'BDRS-71934',
        dateLabel: 'Rabu, 25 Nov 2026',
        departure: '08.30',
        arrival: '09.00',
        pax: 2,
        totalAmount: 44000,
        method: 'QRIS',
        status: 'LUNAS (Aktif)'
      }
    ]
  };


  // ==========================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotif || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotif.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotif.style.display = 'none';
    }, 2600);
  }


  // ==========================================================================
  // 4. VIEW SWITCHER (Desktop vs Mobile)
  // ==========================================================================
  function switchView(mode) {
    state.viewMode = mode;
    if (mode === 'desktop') {
      if (desktopView) desktopView.style.display = 'block';
      if (mobileView) mobileView.style.display = 'none';
      if (viewDesktopBtn) viewDesktopBtn.classList.add('active');
      if (viewMobileBtn) viewMobileBtn.classList.remove('active');
    } else {
      if (desktopView) desktopView.style.display = 'none';
      if (mobileView) mobileView.style.display = 'flex';
      if (viewMobileBtn) viewMobileBtn.classList.add('active');
      if (viewDesktopBtn) viewDesktopBtn.classList.remove('active');

      if (screenJadwal && screenPembayaran) {
        if (state.currentStep === 1) {
          screenJadwal.classList.add('active');
          screenPembayaran.classList.remove('active');
        } else {
          screenPembayaran.classList.add('active');
          screenJadwal.classList.remove('active');
        }
      }
    }
  }

  if (viewDesktopBtn) viewDesktopBtn.addEventListener('click', () => switchView('desktop'));
  if (viewMobileBtn) viewMobileBtn.addEventListener('click', () => switchView('mobile'));

  // Synchronize on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768 && state.viewMode !== 'mobile') {
      switchView('mobile');
    }
  });


  // ==========================================================================
  // 5. STEP MANAGEMENT (Step 1 Pemesanan <-> Step 2 Pembayaran)
  // ==========================================================================
  function goToStep(step) {
    state.currentStep = step;

    if (step === 1) {
      if (desktopStepPemesanan) desktopStepPemesanan.style.display = 'block';
      if (desktopStepPembayaran) desktopStepPembayaran.style.display = 'none';

      if (dStepNode1) dStepNode1.className = 'step-node active';
      if (dStepNode2) dStepNode2.className = 'step-node';
      if (dStepConnector) dStepConnector.className = 'step-connector';

      if (navJadwalLink) navJadwalLink.classList.add('active');
      if (navBayarLink) navBayarLink.classList.remove('active');

      if (screenJadwal) screenJadwal.classList.add('active');
      if (screenPembayaran) screenPembayaran.classList.remove('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (desktopStepPemesanan) desktopStepPemesanan.style.display = 'none';
      if (desktopStepPembayaran) desktopStepPembayaran.style.display = 'block';

      if (dStepNode1) dStepNode1.className = 'step-node completed';
      if (dStepNode2) dStepNode2.className = 'step-node active';
      if (dStepConnector) dStepConnector.className = 'step-connector completed';

      if (navBayarLink) navBayarLink.classList.add('active');
      if (navJadwalLink) navJadwalLink.classList.remove('active');

      if (screenPembayaran) screenPembayaran.classList.add('active');
      if (screenJadwal) screenJadwal.classList.remove('active');

      updateAllDetails();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (dBtnProceedPayment) {
    dBtnProceedPayment.addEventListener('click', () => {
      goToStep(2);
      showToast(`Melanjutkan pemesanan ${state.ticketQty} tiket.`);
    });
  }

  if (dBtnBackToBooking) {
    dBtnBackToBooking.addEventListener('click', () => goToStep(1));
  }

  if (dStepNode1) dStepNode1.addEventListener('click', () => goToStep(1));
  if (dStepNode2) dStepNode2.addEventListener('click', () => goToStep(2));
  if (navJadwalLink) navJadwalLink.addEventListener('click', (e) => { e.preventDefault(); goToStep(1); });
  if (navBayarLink) navBayarLink.addEventListener('click', (e) => { e.preventDefault(); goToStep(2); });

  // Mobile transitions
  if (btnProceedOrder) {
    btnProceedOrder.addEventListener('click', () => goToStep(2));
  }

  if (btnPaymentBack) {
    btnPaymentBack.addEventListener('click', () => goToStep(1));
  }

  if (btnJadwalBack) {
    btnJadwalBack.addEventListener('click', () => {
      showToast('Halaman beranda Bandros');
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Jadwal Bandros - Bandung Tour On Bus',
          text: 'Pesan tiket Bandros sekarang keliling Kota Bandung!',
          url: window.location.href
        }).catch(() => {});
      } else {
        showToast('Tautan disalin ke papan klip!');
      }
    });
  }

  if (btnSaveRoute) {
    btnSaveRoute.addEventListener('click', () => {
      state.savedRoute = !state.savedRoute;
      if (saveTitleText) {
        saveTitleText.textContent = state.savedRoute ? 'Tersimpan!' : 'Simpan rute';
      }
      showToast(state.savedRoute ? 'Rute Bandung Tour disimpan ke favorit!' : 'Rute dihapus dari favorit');
    });
  }

  if (btnChooseSchedule) {
    btnChooseSchedule.addEventListener('click', () => {
      if (tabJadwal) tabJadwal.click();
      if (mobileDateContainer) {
        mobileDateContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  // ==========================================================================
  // 6. FEATURE 1: TICKET QUANTITY COUNTER (TAMBAH TIKET)
  // ==========================================================================
  function setTicketQty(newQty) {
    const maxSeats = state.selectedBus.seatsAvailable;
    if (newQty < 1) newQty = 1;
    if (newQty > maxSeats) {
      newQty = maxSeats;
      showToast(`Maksimal ${maxSeats} kursi tersedia untuk jam ini.`);
    }

    state.ticketQty = newQty;

    // Desktop
    if (dQtyVal) dQtyVal.textContent = newQty;
    if (dQtyMinus) dQtyMinus.disabled = newQty <= 1;
    if (dQtyPlus) dQtyPlus.disabled = newQty >= maxSeats;
    if (dQtyHint) dQtyHint.textContent = `Maks. ${maxSeats} tiket tersedia`;

    // Mobile
    if (mQtyVal) mQtyVal.textContent = newQty;
    if (mQtyMinus) mQtyMinus.disabled = newQty <= 1;
    if (mQtyPlus) mQtyPlus.disabled = newQty >= maxSeats;
    if (mQtyHint) mQtyHint.textContent = `Maks. ${maxSeats} kursi`;

    // Refresh pricing calculations across all elements
    updateAllDetails();
  }

  if (dQtyMinus) dQtyMinus.addEventListener('click', () => setTicketQty(state.ticketQty - 1));
  if (dQtyPlus) dQtyPlus.addEventListener('click', () => setTicketQty(state.ticketQty + 1));
  if (mQtyMinus) mQtyMinus.addEventListener('click', () => setTicketQty(state.ticketQty - 1));
  if (mQtyPlus) mQtyPlus.addEventListener('click', () => setTicketQty(state.ticketQty + 1));


  // ==========================================================================
  // 7. FEATURE 2: TAB INFORMASI TERBARU (EMPTY STATE)
  // ==========================================================================
  if (navInfoLink) {
    navInfoLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (infoModal) infoModal.style.display = 'flex';
    });
  }

  if (btnCloseInfoModal) {
    btnCloseInfoModal.addEventListener('click', () => {
      if (infoModal) infoModal.style.display = 'none';
    });
  }

  // Mobile Tabs
  if (tabTentang) {
    tabTentang.addEventListener('click', () => {
      tabTentang.classList.add('active');
      if (tabJadwal) tabJadwal.classList.remove('active');
      if (tabInfo) tabInfo.classList.remove('active');

      if (routeDescBox) routeDescBox.style.display = 'block';
      if (tabInfoContent) tabInfoContent.style.display = 'none';

      if (mobileDateContainer) mobileDateContainer.style.display = 'none';
      if (mobileQtyContainer) mobileQtyContainer.style.display = 'none';
      if (mobileSearchFilter) mobileSearchFilter.style.display = 'none';
      if (mobileBusList) mobileBusList.style.display = 'none';
    });
  }

  if (tabJadwal) {
    tabJadwal.addEventListener('click', () => {
      tabJadwal.classList.add('active');
      if (tabTentang) tabTentang.classList.remove('active');
      if (tabInfo) tabInfo.classList.remove('active');

      if (routeDescBox) routeDescBox.style.display = 'none';
      if (tabInfoContent) tabInfoContent.style.display = 'none';

      if (mobileDateContainer) mobileDateContainer.style.display = 'block';
      if (mobileQtyContainer) mobileQtyContainer.style.display = 'flex';
      if (mobileSearchFilter) mobileSearchFilter.style.display = 'flex';
      if (mobileBusList) mobileBusList.style.display = 'block';
    });
  }

  if (tabInfo) {
    tabInfo.addEventListener('click', () => {
      tabInfo.classList.add('active');
      if (tabTentang) tabTentang.classList.remove('active');
      if (tabJadwal) tabJadwal.classList.remove('active');

      if (routeDescBox) routeDescBox.style.display = 'none';
      if (tabInfoContent) tabInfoContent.style.display = 'flex';

      if (mobileDateContainer) mobileDateContainer.style.display = 'none';
      if (mobileQtyContainer) mobileQtyContainer.style.display = 'none';
      if (mobileSearchFilter) mobileSearchFilter.style.display = 'none';
      if (mobileBusList) mobileBusList.style.display = 'none';
    });
  }


  // ==========================================================================
  // 8. FEATURE 3: RIWAYAT PEMBELIAN (PURCHASE HISTORY)
  // ==========================================================================
  function renderPurchaseHistory() {
    if (historyCountBadge) {
      historyCountBadge.textContent = state.purchaseHistory.length;
    }

    if (!historyItemsContainer) return;

    if (state.purchaseHistory.length === 0) {
      historyItemsContainer.innerHTML = `
        <div class="history-empty-placeholder">
          <p>Belum ada riwayat pembelian tiket.</p>
        </div>
      `;
      return;
    }

    historyItemsContainer.innerHTML = state.purchaseHistory.map(item => `
      <div class="history-item-card">
        <div class="history-card-header">
          <span class="history-booking-code">${item.id}</span>
          <span class="history-status-badge">${item.status}</span>
        </div>
        <h4 class="history-title">Bandung Tour On Bus</h4>
        <p class="history-route-sub">${item.dateLabel} &bull; ${item.departure}–${item.arrival} WIB</p>
        
        <div class="history-card-details">
          <div>
            <div class="history-amount">Rp${item.totalAmount.toLocaleString('id-ID')}</div>
            <span class="history-pax-count">${item.pax} Penumpang &bull; ${item.method}</span>
          </div>
          <button class="btn-history-view-ticket" data-history-id="${item.id}" type="button">
            Lihat E-Tiket
          </button>
        </div>
      </div>
    `).join('');

    // Attach click listeners to "Lihat E-Tiket"
    historyItemsContainer.querySelectorAll('.btn-history-view-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-history-id');
        const record = state.purchaseHistory.find(h => h.id === id);
        if (record) {
          if (historyModal) historyModal.style.display = 'none';
          openSpecificTicketModal(record);
        }
      });
    });
  }

  function openSpecificTicketModal(record) {
    const elCode = document.getElementById('receipt-booking-code');
    const elSched = document.getElementById('receipt-schedule');
    const elPax = document.getElementById('receipt-pax');
    const elMethod = document.getElementById('receipt-method');
    const elAmount = document.getElementById('receipt-amount');

    if (elCode) elCode.textContent = record.id;
    if (elSched) elSched.textContent = `${record.dateLabel} · ${record.departure}`;
    if (elPax) elPax.textContent = `${record.pax} Penumpang`;
    if (elMethod) elMethod.textContent = record.method;
    if (elAmount) elAmount.textContent = `Rp${record.totalAmount.toLocaleString('id-ID')}`;

    if (successModal) successModal.style.display = 'flex';
  }

  if (navHistoryLink) {
    navHistoryLink.addEventListener('click', (e) => {
      e.preventDefault();
      renderPurchaseHistory();
      if (historyModal) historyModal.style.display = 'flex';
    });
  }

  if (btnMobileHistory) {
    btnMobileHistory.addEventListener('click', () => {
      renderPurchaseHistory();
      if (historyModal) historyModal.style.display = 'flex';
    });
  }

  if (btnCloseHistoryModal) {
    btnCloseHistoryModal.addEventListener('click', () => {
      if (historyModal) historyModal.style.display = 'none';
    });
  }


  // ==========================================================================
  // 9. SYNCHRONIZED DATE PICKER
  // ==========================================================================
  function setDate(dateStr, labelStr) {
    state.selectedDate = dateStr;
    state.selectedDateLabel = labelStr;

    desktopDateItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-date') === dateStr);
    });

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


  // ==========================================================================
  // 10. SYNCHRONIZED BUS SELECTION
  // ==========================================================================
  function selectBus(busId, departure, arrival, basePrice, seats) {
    state.selectedBus.id = busId;
    state.selectedBus.departure = departure;
    state.selectedBus.arrival = arrival;
    state.selectedBus.basePrice = basePrice;
    state.selectedBus.seatsAvailable = seats;

    // Check quantity bounds against available seats
    if (state.ticketQty > seats) {
      setTicketQty(seats);
    } else {
      setTicketQty(state.ticketQty);
    }

    // Update Desktop Cards
    desktopBusCards.forEach(card => {
      const isSelected = card.getAttribute('data-bus-id') === busId;
      const btn = card.querySelector('.d-select-btn');
      card.classList.toggle('selected', isSelected);
      if (btn) {
        btn.classList.toggle('selected', isSelected);
        if (isSelected) {
          btn.innerHTML = `
            <img src="assets/check-circle.svg" alt="Terpilih" class="d-btn-check-icon">
            <span class="d-btn-text">Jadwal Terpilih</span>
          `;
        } else {
          btn.innerHTML = `<span class="d-btn-text">Pilih Jadwal Ini</span>`;
        }
      }
    });

    // Update Mobile Cards
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
    showToast(`Jadwal dipilih: ${departure} WIB`);
  }

  desktopBusCards.forEach(card => {
    card.addEventListener('click', () => {
      selectBus(
        card.getAttribute('data-bus-id'),
        card.getAttribute('data-departure'),
        card.getAttribute('data-arrival'),
        parseInt(card.getAttribute('data-price'), 10),
        parseInt(card.getAttribute('data-seats'), 10)
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
        parseInt(card.getAttribute('data-seats'), 10)
      );
    });
  });


  // ==========================================================================
  // 11. REFRESH ALL LABELS, PRICES & TOTALS
  // ==========================================================================
  function updateAllDetails() {
    const qty = state.ticketQty;
    const ticketSubtotal = state.selectedBus.basePrice * qty;
    const total = ticketSubtotal + state.selectedBus.serviceFee;

    const formattedBase = `Rp${state.selectedBus.basePrice.toLocaleString('id-ID')}`;
    const formattedSubtotal = `Rp${ticketSubtotal.toLocaleString('id-ID')}`;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;

    const scheduleRange = `${state.selectedBus.departure} - ${state.selectedBus.arrival} WIB`;
    const scheduleFull = `${state.selectedBus.departure}–${state.selectedBus.arrival} · Leuwipanjang`;

    // 1. Desktop Step 1 Booking Action Bar
    const dActBus = document.getElementById('d-action-bus-name');
    const dActPax = document.getElementById('d-action-pax-count');
    const dActDate = document.getElementById('d-action-date-str');
    const dActPrice = document.getElementById('d-action-price');

    if (dActBus) dActBus.textContent = `Bandung Tour On Bus • ${state.selectedBus.departure}`;
    if (dActPax) dActPax.textContent = qty;
    if (dActDate) dActDate.textContent = `${state.selectedDateLabel} (${qty} Penumpang)`;
    if (dActPrice) dActPrice.textContent = formattedSubtotal;

    // 2. Desktop Step 2 Payment Screen Details
    const dPayDate = document.getElementById('d-payment-date');
    const dPayHour = document.getElementById('d-payment-hour');
    const dPayPaxStr = document.getElementById('d-payment-pax-str');
    const dTicketType = document.getElementById('d-ticket-type-label');
    const dTicketPax = document.getElementById('d-ticket-pax-count');
    const dTxTicketLbl = document.getElementById('d-tx-ticket-label');
    const dTxTicketPrice = document.getElementById('d-tx-ticket-price');
    const dTxTotal = document.getElementById('d-tx-total');
    const dBtnAmount = document.getElementById('d-btn-amount');

    if (dPayDate) dPayDate.textContent = state.selectedDateLabel;
    if (dPayHour) dPayHour.textContent = scheduleRange;
    if (dPayPaxStr) dPayPaxStr.textContent = `${qty} Penumpang`;
    if (dTicketType) dTicketType.textContent = `${qty}x TIKET BANDUNG TOUR`;
    if (dTicketPax) dTicketPax.textContent = `${qty} Penumpang`;
    if (dTxTicketLbl) dTxTicketLbl.textContent = `Harga Tiket Bus (${qty} Penumpang)`;
    if (dTxTicketPrice) dTxTicketPrice.textContent = `${formattedBase} × ${qty} = ${formattedSubtotal}`;
    if (dTxTotal) dTxTotal.textContent = formattedTotal;
    if (dBtnAmount) dBtnAmount.textContent = formattedTotal;

    // 3. Mobile Step 1 & Step 2 Details
    const mFooterBus = document.getElementById('footer-selected-bus');
    const mFooterPax = document.getElementById('m-footer-pax');
    const mFooterDate = document.getElementById('footer-selected-date');
    const mTicketDate = document.getElementById('ticket-date-val');
    const mTicketSched = document.getElementById('ticket-schedule-val');
    const mTicketPaxStrip = document.getElementById('m-ticket-strip-pax');
    const mTxCountLbl = document.getElementById('m-tx-ticket-count-label');
    const mTxPaxLbl = document.getElementById('m-tx-pax-label');
    const mTxPrice = document.getElementById('tx-ticket-price');
    const mTxTotal = document.getElementById('tx-total-price');
    const mFooterPayAmt = document.getElementById('footer-pay-amount');

    if (mFooterBus) mFooterBus.textContent = `Jadwal Bandros · ${state.selectedBus.departure}`;
    if (mFooterPax) mFooterPax.textContent = qty;
    if (mFooterDate) mFooterDate.textContent = `${state.selectedDateLabel} (${qty} Penumpang)`;
    if (mTicketDate) mTicketDate.textContent = state.selectedDateLabel;
    if (mTicketSched) mTicketSched.textContent = scheduleFull;
    if (mTicketPaxStrip) mTicketPaxStrip.textContent = `${qty} penumpang`;
    if (mTxCountLbl) mTxCountLbl.textContent = `${qty} TIKET`;
    if (mTxPaxLbl) mTxPaxLbl.textContent = `${qty} penumpang`;
    if (mTxPrice) mTxPrice.textContent = `${formattedBase} × ${qty} = ${formattedSubtotal}`;
    if (mTxTotal) mTxTotal.textContent = formattedTotal;
    if (mFooterPayAmt) mFooterPayAmt.textContent = formattedTotal;

    // 4. Receipt Modal Details
    const rSched = document.getElementById('receipt-schedule');
    const rPax = document.getElementById('receipt-pax');
    const rAmt = document.getElementById('receipt-amount');
    if (rSched) rSched.textContent = `${state.selectedDateLabel} · ${state.selectedBus.departure}`;
    if (rPax) rPax.textContent = `${qty} Penumpang`;
    if (rAmt) rAmt.textContent = formattedTotal;
  }


  // ==========================================================================
  // 12. PAYMENT METHOD SELECTION (QRIS vs DANA)
  // ==========================================================================
  function setPaymentMethod(method) {
    state.activePaymentMethod = method;

    if (method === 'qris') {
      if (dMethodQris) {
        dMethodQris.classList.add('selected');
        const s = dMethodQris.querySelector('.d-radio-state');
        if (s) s.innerHTML = `<img src="assets/qris-check.svg" alt="Dipilih" class="d-radio-icon">`;
      }
      if (dMethodDana) {
        dMethodDana.classList.remove('selected');
        const s = dMethodDana.querySelector('.d-radio-state');
        if (s) s.innerHTML = `<span class="d-empty-radio"></span>`;
      }

      if (mMethodQris) {
        mMethodQris.classList.add('selected');
        const s = mMethodQris.querySelector('.method-radio-state');
        if (s) s.innerHTML = `<div class="radio-selected-circle"><img src="assets/qris-check.svg" alt="Dipilih"></div>`;
      }
      if (mMethodDana) {
        mMethodDana.classList.remove('selected');
        const s = mMethodDana.querySelector('.method-radio-state');
        if (s) s.innerHTML = `<div class="radio-empty-circle"></div>`;
      }
    } else {
      if (dMethodDana) {
        dMethodDana.classList.add('selected');
        const s = dMethodDana.querySelector('.d-radio-state');
        if (s) s.innerHTML = `<img src="assets/qris-check.svg" alt="Dipilih" class="d-radio-icon">`;
      }
      if (dMethodQris) {
        dMethodQris.classList.remove('selected');
        const s = dMethodQris.querySelector('.d-radio-state');
        if (s) s.innerHTML = `<span class="d-empty-radio"></span>`;
      }

      if (mMethodDana) {
        mMethodDana.classList.add('selected');
        const s = mMethodDana.querySelector('.method-radio-state');
        if (s) s.innerHTML = `<div class="radio-selected-circle"><img src="assets/qris-check.svg" alt="Dipilih"></div>`;
      }
      if (mMethodQris) {
        mMethodQris.classList.remove('selected');
        const s = mMethodQris.querySelector('.method-radio-state');
        if (s) s.innerHTML = `<div class="radio-empty-circle"></div>`;
      }
    }
    showToast(`Metode: ${method.toUpperCase()}`);
  }

  if (dMethodQris) dMethodQris.addEventListener('click', () => setPaymentMethod('qris'));
  if (dMethodDana) dMethodDana.addEventListener('click', () => setPaymentMethod('dana'));
  if (mMethodQris) mMethodQris.addEventListener('click', () => setPaymentMethod('qris'));
  if (mMethodDana) mMethodDana.addEventListener('click', () => setPaymentMethod('dana'));


  // ==========================================================================
  // 13. COUNTDOWN TIMER
  // ==========================================================================
  setInterval(() => {
    if (state.countdownSeconds > 0) {
      state.countdownSeconds--;
      const mins = Math.floor(state.countdownSeconds / 60);
      const secs = state.countdownSeconds % 60;
      const str = `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
      if (desktopCountdown) desktopCountdown.textContent = str;
      if (mobileCountdown) mobileCountdown.textContent = str;
    } else {
      if (desktopCountdown) desktopCountdown.textContent = '00 : 00';
      if (mobileCountdown) mobileCountdown.textContent = '00 : 00';
    }
  }, 1000);


  // ==========================================================================
  // 14. SEARCH & FILTER (Desktop & Mobile)
  // ==========================================================================
  // Desktop Search
  if (desktopBusSearch) {
    desktopBusSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      desktopBusCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // Desktop Filter Chips
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

  // Mobile Search Input
  if (mobileBusSearch) {
    mobileBusSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      mobileBusCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // Mobile Filter Modal
  if (btnOpenFilter) {
    btnOpenFilter.addEventListener('click', () => {
      if (filterModal) filterModal.style.display = 'flex';
    });
  }

  if (btnCloseFilterModal) {
    btnCloseFilterModal.addEventListener('click', () => {
      if (filterModal) filterModal.style.display = 'none';
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeTimeFilter = chip.getAttribute('data-filter-time');
    });
  });

  if (btnApplyFilter) {
    btnApplyFilter.addEventListener('click', () => {
      if (filterModal) filterModal.style.display = 'none';
      mobileBusCards.forEach(card => {
        const dep = card.getAttribute('data-departure');
        if (state.activeTimeFilter === 'all') {
          card.style.display = 'block';
        } else if (state.activeTimeFilter === 'pagi') {
          card.style.display = (dep === '07.00' || dep === '08.30') ? 'block' : 'none';
        } else {
          card.style.display = 'none';
        }
      });
      showToast('Filter waktu diterapkan');
    });
  }

  if (btnResetFilter) {
    btnResetFilter.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      const defaultChip = document.querySelector('.filter-chip[data-filter-time="all"]');
      if (defaultChip) defaultChip.classList.add('active');
      state.activeTimeFilter = 'all';
      mobileBusCards.forEach(card => card.style.display = 'block');
      if (filterModal) filterModal.style.display = 'none';
      showToast('Filter direset');
    });
  }

  // Mobile Sort Toggle
  if (sortToggle) {
    sortToggle.addEventListener('click', () => {
      state.sortAscending = !state.sortAscending;
      if (currentSortText) {
        currentSortText.textContent = state.sortAscending ? 'Paling awal' : 'Paling akhir';
      }
      const busListContainer = document.getElementById('bus-cards');
      if (busListContainer) {
        const cards = Array.from(busListContainer.querySelectorAll('.bus-item-card'));
        cards.reverse().forEach(c => busListContainer.appendChild(c));
      }
      showToast(state.sortAscending ? 'Urutan: Paling awal' : 'Urutan: Paling akhir');
    });
  }


  // ==========================================================================
  // 15. CHECKOUT SIMULATION MODALS
  // ==========================================================================
  function openPaymentModal() {
    const total = (state.selectedBus.basePrice * state.ticketQty) + state.selectedBus.serviceFee;
    const formattedTotal = `Rp${total.toLocaleString('id-ID')}`;

    if (!modalPaymentTitle || !modalPaymentBody || !paymentModal) return;

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
          <p style="font-size: 18px; font-weight: 800; color: #1c3158;">${formattedTotal} (${state.ticketQty} Tiket)</p>
          <p style="font-size: 11px; color: #858d9b; margin: 6px 0 14px;">Buka aplikasi BCA Mobile, GoPay, OVO, ShopeePay atau mobile banking Anda untuk scan.</p>
          <button class="btn-simulate-paid" id="btn-trigger-paid" type="button">Simulasikan Pembayaran Berhasil</button>
        </div>
      `;
    } else {
      modalPaymentTitle.textContent = 'Bayar dengan DANA';
      modalPaymentBody.innerHTML = `
        <div class="qris-simulation-box">
          <div style="background: #edf8ff; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; margin-left: auto; margin-right: auto;">
            <img src="assets/dana-wallet.svg" alt="DANA" style="width: 28px; height: 28px;">
          </div>
          <p style="font-size: 14px; font-weight: 700; color: #1c3158;">Akun DANA Terhubung</p>
          <p style="font-size: 12px; color: #858d9b; margin: 4px 0 16px;">Nomor Ponsel: <strong>0812-****-4829</strong></p>
          <p style="font-size: 18px; font-weight: 800; color: #009ee3;">${formattedTotal} (${state.ticketQty} Tiket)</p>
          <button class="btn-simulate-paid" id="btn-trigger-paid" type="button" style="background-color: #009ee3;">Konfirmasi Bayar DANA</button>
        </div>
      `;
    }

    paymentModal.style.display = 'flex';

    const btnTriggerPaid = document.getElementById('btn-trigger-paid');
    if (btnTriggerPaid) {
      btnTriggerPaid.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        completePaymentAndSaveHistory();
      });
    }
  }

  function completePaymentAndSaveHistory() {
    const randomCode = 'BDRS-' + Math.floor(10000 + Math.random() * 90000);
    const total = (state.selectedBus.basePrice * state.ticketQty) + state.selectedBus.serviceFee;

    // Add new purchase to history array
    const newRecord = {
      id: randomCode,
      dateLabel: state.selectedDateLabel,
      departure: state.selectedBus.departure,
      arrival: state.selectedBus.arrival,
      pax: state.ticketQty,
      totalAmount: total,
      method: state.activePaymentMethod.toUpperCase(),
      status: 'LUNAS (Aktif)'
    };
    state.purchaseHistory.unshift(newRecord);
    renderPurchaseHistory();

    // Open success modal
    const elCode = document.getElementById('receipt-booking-code');
    const elMethod = document.getElementById('receipt-method');
    const elPax = document.getElementById('receipt-pax');
    const elSched = document.getElementById('receipt-schedule');
    const elAmt = document.getElementById('receipt-amount');

    if (elCode) elCode.textContent = randomCode;
    if (elMethod) elMethod.textContent = state.activePaymentMethod.toUpperCase();
    if (elPax) elPax.textContent = `${state.ticketQty} Penumpang`;
    if (elSched) elSched.textContent = `${state.selectedDateLabel} · ${state.selectedBus.departure}`;
    if (elAmt) elAmt.textContent = `Rp${total.toLocaleString('id-ID')}`;

    if (successModal) successModal.style.display = 'flex';
  }

  if (dBtnPayNow) dBtnPayNow.addEventListener('click', openPaymentModal);
  if (mBtnPayNow) mBtnPayNow.addEventListener('click', openPaymentModal);

  if (btnClosePaymentModal) {
    btnClosePaymentModal.addEventListener('click', () => {
      if (paymentModal) paymentModal.style.display = 'none';
    });
  }

  if (btnDownloadTicket) {
    btnDownloadTicket.addEventListener('click', () => {
      showToast('E-Tiket Bandros berhasil disimpan ke perangkat Anda!');
      if (successModal) successModal.style.display = 'none';
    });
  }

  if (btnReturnHome) {
    btnReturnHome.addEventListener('click', () => {
      if (successModal) successModal.style.display = 'none';
      renderPurchaseHistory();
      if (historyModal) historyModal.style.display = 'flex';
    });
  }

  // Close modals on backdrop click
  [paymentModal, successModal, historyModal, infoModal, filterModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  });


  // ==========================================================================
  // 16. INITIALIZE STATE & VIEW
  // ==========================================================================
  // Set initial ticket quantity and prices
  setTicketQty(1);

  // Render initial purchase history
  renderPurchaseHistory();

  // If initial load is mobile size, activate mobile view
  if (window.innerWidth < 768) {
    switchView('mobile');
  } else {
    switchView('desktop');
  }
});

