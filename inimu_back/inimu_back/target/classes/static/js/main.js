(() => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const weekdayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const workshopCapacity = 10;

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
      body.classList.toggle('menu-open', !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!isOpen));

      if (answer) {
        answer.hidden = isOpen;
      }
    });
  });

  const scheduleCards = document.querySelectorAll('[data-slot]');
  const dateSelect = document.querySelector('#date');
  const calendarModal = document.querySelector('[data-calendar-modal]');
  const calendarDays = document.querySelector('[data-calendar-days]');
  const calendarSubtitle = document.querySelector('[data-calendar-subtitle]');
  const calendarCloseButtons = document.querySelectorAll('[data-calendar-close]');
  const today = new Date();
  let reservationsBySlot = new Map();
  let calendarState = null;

  const getSlotStatus = (slotName) => {
    const booked = reservationsBySlot.get(slotName) || 0;
    const remaining = Math.max(workshopCapacity - booked, 0);

    if (remaining >= 5) {
      return { key: 'available', label: '空席あり', remaining };
    }

    if (remaining >= 2) {
      return { key: 'few', label: '残りわずか', remaining };
    }

    return { key: 'full', label: '満席', remaining };
  };

  const updateScheduleCards = () => {
    scheduleCards.forEach((card) => {
      const slotName = card.getAttribute('data-slot');
      const statusElement = card.querySelector('.slot-status');

      if (!slotName || !statusElement) return;

      const status = getSlotStatus(slotName);
      statusElement.classList.remove('available', 'few', 'full');
      statusElement.classList.add(status.key);
      statusElement.textContent = status.label;
      card.dataset.statusKey = status.key;
      card.dataset.remaining = String(status.remaining);
    });
  };

  const updateCalendarPanel = () => {
    if (!calendarDays || !calendarSubtitle || !calendarState) return;

    const { weekdayIndex, slotLabel, status } = calendarState;
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const totalDays = lastDate.getDate();
    const startOffset = firstDate.getDay();
    const targetLabel = weekdayNames[weekdayIndex];
    const monthLabel = `${year}年${month + 1}月`;

    calendarSubtitle.textContent = `${monthLabel}の${slotLabel}・${status.label}です。`;
    calendarDays.innerHTML = '';

    for (let i = 0; i < startOffset; i += 1) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day is-empty';
      calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day);
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      const dayNumber = document.createElement('span');
      dayNumber.className = 'calendar-day-number';
      dayNumber.textContent = String(day);
      cell.appendChild(dayNumber);

      if (date.getDay() === weekdayIndex) {
        cell.classList.add('is-match');
        const tag = document.createElement('span');
        tag.className = `calendar-day-label ${status.key}`;
        tag.textContent = `${targetLabel}曜 ${status.label}`;
        cell.appendChild(tag);
      }

      calendarDays.appendChild(cell);
    }
  };

  const openCalendar = (card) => {
    if (!calendarModal) return;
    const weekdayIndex = Number(card.getAttribute('data-weekday'));
    const slotLabel = card.querySelector('.slot-day')?.textContent || '';
    const statusKey = card.dataset.statusKey || 'available';
    const statusLabel = card.querySelector('.slot-status')?.textContent || '空席あり';

    calendarState = {
      weekdayIndex,
      slotLabel,
      status: { key: statusKey, label: statusLabel },
    };
    updateCalendarPanel();
    calendarModal.hidden = false;
    body.classList.add('menu-open');
  };

  const closeCalendar = () => {
    if (!calendarModal) return;
    calendarModal.hidden = true;
    body.classList.remove('menu-open');
  };

  if (calendarModal) {
    calendarCloseButtons.forEach((button) => {
      button.addEventListener('click', closeCalendar);
    });

    calendarModal.addEventListener('click', (event) => {
      const closeTrigger = event.target.closest('[data-calendar-close]');
      if (closeTrigger) {
        closeCalendar();
        return;
      }

      if (event.target === calendarModal) {
        closeCalendar();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !calendarModal.hidden) {
        closeCalendar();
      }
    });
  }

  scheduleCards.forEach((card) => {
    card.addEventListener('click', () => {
      const selectedSlot = card.getAttribute('data-slot');

      scheduleCards.forEach((item) => item.classList.remove('is-selected', 'is-active-day'));
      card.classList.add('is-selected', 'is-active-day');

      if (dateSelect && selectedSlot) {
        dateSelect.value = selectedSlot;
        dateSelect.focus({ preventScroll: true });
      }

      openCalendar(card);
    });
  });

  const refreshAvailability = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) return;

      const reservations = await response.json();
      const counts = new Map();

      reservations.forEach((reservation) => {
        const slotName = reservation.preferredDate;
        const current = counts.get(slotName) || 0;
        counts.set(slotName, current + Number(reservation.people || 0));
      });

      reservationsBySlot = counts;
      updateScheduleCards();

      if (calendarState) {
        const currentCard = [...scheduleCards].find((card) => card.classList.contains('is-selected'));
        if (currentCard) {
          openCalendar(currentCard);
        }
      }
    } catch (error) {
      // 予約一覧の取得に失敗してもLP表示は継続する
    }
  };

  updateScheduleCards();
  refreshAvailability();

  const reserveForm = document.querySelector('[data-reserve-form]');
  const formStatus = document.querySelector('[data-form-status]');

  if (reserveForm && formStatus) {
    reserveForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!reserveForm.checkValidity()) {
        formStatus.textContent = '未入力の項目があります。お名前、メールアドレス、希望日時、参加人数をご確認ください。';
        formStatus.classList.remove('is-success');
        formStatus.classList.add('is-error');
        reserveForm.reportValidity();
        return;
      }

      const formData = new FormData(reserveForm);
      const payload = {
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        preferredDate: String(formData.get('preferredDate') || ''),
        people: Number(formData.get('people') || 0),
        message: String(formData.get('message') || ''),
      };

      try {
        formStatus.textContent = '送信中です...';
        formStatus.classList.remove('is-error', 'is-success');

        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message
            ? data.message
            : '予約の送信に失敗しました。入力内容を確認してもう一度お試しください。';
          formStatus.textContent = message;
          formStatus.classList.add('is-error');
          return;
        }

        formStatus.textContent = '予約リクエストを受け付けました';
        formStatus.classList.add('is-success');
        reserveForm.reset();
        await refreshAvailability();
      } catch (error) {
        formStatus.textContent = '通信エラーが発生しました。しばらくしてからもう一度お試しください。';
        formStatus.classList.add('is-error');
      }
    });
  }
})();
