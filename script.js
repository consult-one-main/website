
// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Photo carousel with auto-play
const carouselTrack = document.getElementById('carouselTrack');
if (carouselTrack) {
  const slides = carouselTrack.querySelectorAll('.photo-carousel__slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  let currentIndex = 0;
  let autoPlayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'photo-carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Bild ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    carouselTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dotsContainer.querySelectorAll('.photo-carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goTo(currentIndex + 1), 3500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoPlay(); });

  startAutoPlay();
}

// Partner spotlight carousel
const partnerCarousel = document.getElementById('partnerCarousel');
if (partnerCarousel) {
  const items   = Array.from(partnerCarousel.querySelectorAll('.partner-carousel__item'));
  const nameEl  = document.getElementById('partnerName');
  const descEl  = document.getElementById('partnerDesc');
  const prevBtn = document.getElementById('partnerPrev');
  const nextBtn = document.getElementById('partnerNext');
  const total   = items.length;
  let current   = 0;
  let timer;

  function goTo(idx) {
    current = (idx + total) % total;
    const prev = (current - 1 + total) % total;
    const next = (current + 1) % total;

    items.forEach((item, i) => {
      item.classList.remove('partner-carousel__item--active',
                            'partner-carousel__item--prev',
                            'partner-carousel__item--next');
      if (i === current) item.classList.add('partner-carousel__item--active');
      else if (i === prev) item.classList.add('partner-carousel__item--prev');
      else if (i === next) item.classList.add('partner-carousel__item--next');
    });

    nameEl.textContent = items[current].querySelector('.partner-carousel__item-name').textContent;
    descEl.textContent = items[current].querySelector('.partner-carousel__item-desc').textContent;
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  // Klick auf Nachbar-Logo springt direkt dahin
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i !== current) { goTo(i); resetTimer(); }
    });
  });

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  goTo(0);
  resetTimer();
}

// Counter animation for stats — triggers when stats enter the viewport
function animateCounter(el, target, suffix, duration) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.stat__number:not(.stat__number--static)');
if (statEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const suffix = raw.includes('+') ? '+' : '';
        const target = parseInt(raw.replace('+', ''), 10);
        animateCounter(el, target, suffix, 2600);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  statEls.forEach(el => observer.observe(el));
}

// Kompetenz-Selector ("Das lernst du" – fuer-studierende.html)
const competencyTabs = document.querySelectorAll('.competency-btn');
if (competencyTabs.length > 0) {
  const panel = document.getElementById('competencyPanel');
  const panelText = document.getElementById('competencyPanelText');
  const trainingImgs = document.querySelectorAll('#trainingImgWrapper .training-img');

  // Reihenfolge muss zu den Buttons im Markup passen (data-panel 0-4)
  const competencyContent = [
    'Du übernimmst von Anfang an Verantwortung in echten Kundenprojekten: von der Angebotserstellung über die Zeitplanung bis zur Abschlusspräsentation. Erfahrene Mitglieder, die genau diesen Weg selbst gegangen sind, begleiten dich dabei.',
    'In internen Trainings und bei echten Kundenpräsentationen übst du, komplexe Inhalte klar rüberzubringen: vor Geschäftsführer:innen, vor ganzen Unternehmen. Für die nächste Uni-Präsentation hilft dir das ganz nebenbei auch.',
    'Ob bei der Kundengewinnung oder in internen Abstimmungen: Workshops zu Verhandlungstechniken und die Praxis in echten Projekten geben dir das Handwerkszeug für unbequeme Gespräche. Das zahlt sich später genauso bei Gehaltsverhandlungen oder Verhandlungen mit Unternehmen aus.',
    'Case Studies und die Arbeit an echten Problemstellungen zwingen dich, komplexe Themen in überschaubare Teile zu zerlegen. Genau das setzen Beratungen beim Jobeinstieg voraus.',
    'Du arbeitest in wechselnden Projektteams mit Kommiliton:innen aus ganz unterschiedlichen Studiengängen zusammen und lernst, wie Zusammenarbeit auch dann funktioniert, wenn nicht alle gleich ticken.'
  ];

  function activateCompetency(tab) {
    competencyTabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    const index = parseInt(tab.dataset.panel, 10);
    panelText.textContent = competencyContent[index];
    panel.setAttribute('aria-labelledby', tab.id);
    trainingImgs.forEach(img => {
      img.classList.toggle('is-active', parseInt(img.dataset.panel, 10) === index);
    });
  }

  const tabList = Array.from(competencyTabs);
  tabList.forEach((tab, i) => {
    tab.addEventListener('click', () => activateCompetency(tab));
    tab.addEventListener('keydown', (e) => {
      let nextTab = null;
      if (e.key === 'ArrowDown') nextTab = tabList[(i + 1) % tabList.length];
      else if (e.key === 'ArrowUp') nextTab = tabList[(i - 1 + tabList.length) % tabList.length];
      else if (e.key === 'Home') nextTab = tabList[0];
      else if (e.key === 'End') nextTab = tabList[tabList.length - 1];
      if (nextTab) {
        e.preventDefault();
        nextTab.focus();
        activateCompetency(nextTab);
      }
    });
  });
}

// Anstehende Termine (fuer-studierende.html)
const eventsGrid = document.getElementById('eventsGrid');
if (eventsGrid) {
  const events = [
    { title: 'Infoveranstaltung', date: '2026-11-03', hour: 18, minute: 30, timeLabel: '18:30 Uhr', location: null, desc: 'Lern Consult One und aktive Mitglieder unverbindlich kennen.' },
    { title: 'Infoveranstaltung', date: '2026-11-11', hour: 18, minute: 30, timeLabel: '18:30 Uhr', location: null, desc: 'Zweiter Termin in diesem Semester, falls der erste bei dir nicht passt.' },
    { title: 'Offenes Wochentreffen', date: '2026-11-17', hour: 20, minute: 10, timeLabel: '20:10 Uhr', location: null, desc: 'Unser reguläres Treffen steht allen Interessierten offen. Einfach vorbeikommen.' },
    { title: "Women's Brunch", date: null, hour: null, minute: null, timeLabel: null, location: null, desc: 'Ein entspannter Brunch für alle Frauen, die Consult One in lockerer Atmosphäre kennenlernen möchten.' }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter(ev => !ev.date || new Date(ev.date) >= today);
  const emptyState = document.getElementById('eventsEmpty');

  function pad(n) { return String(n).padStart(2, '0'); }

  function icsEscape(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  // Baut einen data:-Link mit .ics-Inhalt; DTSTART/DTEND bleiben ohne 'Z'/TZID
  // (floating time), da alle Termine in Braunschweig stattfinden.
  function buildIcsHref(ev, slug) {
    const [y, m, d] = ev.date.split('-').map(Number);
    const start = new Date(y, m - 1, d, ev.hour, ev.minute);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = (dt) => dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate())
      + 'T' + pad(dt.getHours()) + pad(dt.getMinutes()) + '00';
    const now = new Date();
    const dtstamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate())
      + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    const locationText = ev.location || 'Ort wird noch bekannt gegeben';

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Consult One//Termine//DE',
      'BEGIN:VEVENT',
      'UID:' + slug + '@consult-one.de',
      'DTSTAMP:' + dtstamp,
      'DTSTART:' + stamp(start),
      'DTEND:' + stamp(end),
      'SUMMARY:' + icsEscape(ev.title),
      'DESCRIPTION:' + icsEscape(ev.desc),
      'LOCATION:' + icsEscape(locationText),
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n'));
  }

  if (upcoming.length === 0) {
    eventsGrid.hidden = true;
    if (emptyState) emptyState.hidden = false;
  } else {
    const formatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: 'long' });
    eventsGrid.innerHTML = upcoming.map((ev) => {
      const dateTimeLabel = ev.date
        ? formatter.format(new Date(ev.date)) + ', ' + (ev.timeLabel || 'Zeit wird noch bekannt gegeben')
        : 'Termin folgt';
      const locationLabel = ev.location || 'Ort wird noch bekannt gegeben';
      let icsButton = '';
      if (ev.date) {
        const slug = ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + ev.date;
        icsButton = '<a class="event-card__ics" href="' + buildIcsHref(ev, slug) + '" download="' + slug + '.ics">In Kalender speichern</a>';
      } else {
        icsButton = '<span class="event-card__ics event-card__ics--disabled">Termin folgt</span>';
      }
      return '<div class="event-card">'
        + '<p class="event-card__datetime">' + dateTimeLabel + '</p>'
        + '<h3>' + ev.title + '</h3>'
        + '<p class="event-card__location">' + locationLabel + '</p>'
        + '<p class="event-card__desc">' + ev.desc + '</p>'
        + icsButton
        + '</div>';
    }).join('');
  }
}

// Akkordeon: sanftes Auf-/Zuklappen per Web Animations API, nur ein Panel pro Gruppe offen
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createAccordionItem(details, onExpand) {
  const summary = details.querySelector(':scope > summary');
  const content = details.querySelector(':scope > .accordion-content');
  let animation = null;
  let isExpanding = false;
  let isClosing = false;

  function runAnimation(opening) {
    const startHeight = details.offsetHeight + 'px';
    const endHeight = opening
      ? (summary.offsetHeight + content.offsetHeight) + 'px'
      : summary.offsetHeight + 'px';

    isExpanding = opening;
    isClosing = !opening;
    details.style.overflow = 'hidden';

    if (animation) animation.cancel();
    animation = details.animate(
      { height: [startHeight, endHeight] },
      { duration: reduceMotion ? 0 : 280, easing: 'ease' }
    );
    animation.onfinish = () => {
      details.open = opening;
      animation = null;
      isExpanding = false;
      isClosing = false;
      details.style.height = '';
      details.style.overflow = '';
    };
    animation.oncancel = () => { isExpanding = false; isClosing = false; };
  }

  function expand() {
    details.style.overflow = 'hidden';
    details.style.height = details.offsetHeight + 'px';
    details.open = true;
    requestAnimationFrame(() => runAnimation(true));
  }

  function collapse() {
    runAnimation(false);
  }

  summary.addEventListener('click', e => {
    e.preventDefault();
    if (isClosing || !details.open) {
      onExpand(item);
      expand();
    } else if (isExpanding || details.open) {
      collapse();
    }
  });

  const item = { details, collapse, get isExpanding() { return isExpanding; } };
  return item;
}

document.querySelectorAll('.accordion').forEach(group => {
  const items = [];
  group.querySelectorAll(':scope > .accordion-item').forEach(details => {
    items.push(createAccordionItem(details, opened => {
      items.forEach(other => {
        if (other !== opened && (other.details.open || other.isExpanding)) other.collapse();
      });
    }));
  });
});
