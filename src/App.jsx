import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

/* ────────────────────────────────────────────────────────────
   CONFIG & DATA  (edit these to change content)
──────────────────────────────────────────────────────────── */
const STUDIO = { phone: '2349136338459', display: '+234 913 633 8459' }
const WEAR = {
  phone: '2347016171296',
  display: '+234 701 617 1296',
  handle: '@wear_zinny',
  tiktok: 'https://www.tiktok.com/@wear_zinny',
}
const STUDIO_TIKTOK = 'https://www.tiktok.com/@zinnys_beauty_studio'
const MAP_QUERY = 'Surulere, Lagos, Nigeria' // replace with the exact street address for a precise pin
const MAP = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=14&output=embed`
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

const wa = (text = "Hello Zinny's Beauty Studio, I'd like to book an appointment.", n = STUDIO) =>
  `https://wa.me/${n.phone}?text=${encodeURIComponent(text)}`

const EASE = [0.22, 1, 0.36, 1]
const SLIDE_MS = 5600

const navLinks = [
  ['Services', 'services'],
  ['Reel', 'reel'],
  ['Gallery', 'gallery'],
  ['Tattoos', 'tattoos'],
  ['Wear Zinny', 'wear'],
  ['Visit', 'location'],
]

const heroSlides = [
  { img: 'lash1', alt: 'Voluminous lash extensions', tag: 'Lash Extensions' },
  { img: 'lotus', alt: 'Lotus tattoo on forearm', tag: 'Tattoos' },
  { img: 'pierce5', alt: 'Face gem piercing', tag: 'Piercings' },
  { img: 'whiten', alt: 'Teeth whitening treatment', tag: 'Teeth Whitening' },
  { img: 'brow', alt: 'Shaped brows', tag: 'Brows' },
  { img: 'lash2', alt: 'Lashes with sleek bob', tag: 'Lash Extensions' },
]

const services = [
  { t: 'Tattoos & Drawing', d: 'Custom designs from fine-line florals to bold statement pieces, drawn and inked with care.', img: 'lotus', msg: 'a tattoo' },
  { t: 'Lash Extensions', d: 'Classic, hybrid, volume and dramatic sets - every kind of lash, shaped to your eyes.', img: 'lash1', msg: 'lash extensions' },
  { t: 'Brows', d: 'Clean, defined brows that frame your face perfectly.', img: 'brow', msg: 'brow services' },
  { t: 'Piercings', d: 'Ear, nose, brow, face gems, dermals and more - safely and stylishly done.', img: 'pierce3', msg: 'a piercing' },
  { t: 'Teeth Whitening', d: 'Brighten your smile with a professional LED whitening session.', img: 'whiten', msg: 'teeth whitening' },
]

const reel = [
  { img: 'lash1', t: 'Curly Lash Set', tag: 'Lashes' },
  { img: 'lotus', t: 'Lotus Tattoo', tag: 'Tattoos' },
  { img: 'pierce5', t: 'Face Gem', tag: 'Piercings' },
  { img: 'lash3', t: 'Natural Volume', tag: 'Lashes' },
  { img: 'rose', t: 'Rose Tattoo', tag: 'Tattoos' },
  { img: 'whiten', t: 'LED Whitening', tag: 'Whitening' },
  { img: 'pierce3', t: 'Industrial', tag: 'Piercings' },
  { img: 'lash7', t: 'Cat-Eye Lashes', tag: 'Lashes' },
]

const gallery = [
  { img: 'lotus', t: 'Lotus Tattoo', c: 'Tattoos' }, { img: 'lash1', t: 'Curly Lash Set', c: 'Lashes' },
  { img: 'pierce5', t: 'Face Gem Piercing', c: 'Piercings' }, { img: 'rose', t: 'Rose Tattoo', c: 'Tattoos' },
  { img: 'lash2', t: 'Wispy Lashes', c: 'Lashes' }, { img: 'whiten', t: 'LED Teeth Whitening', c: 'Whitening' },
  { img: 'pierce3', t: 'Industrial Piercing', c: 'Piercings' }, { img: 'fan', t: 'Fan Tattoo', c: 'Tattoos' },
  { img: 'brow', t: 'Brow Shaping', c: 'Brows' }, { img: 'lash3', t: 'Natural Volume Lashes', c: 'Lashes' },
  { img: 'pierce2', t: 'Brow, Cheek & Nose Piercings', c: 'Piercings' }, { img: 'lash4', t: 'Dramatic Lashes', c: 'Lashes' },
  { img: 'pierce4', t: 'Dermal Piercings', c: 'Piercings' }, { img: 'lash5', t: 'Bold Lash Set', c: 'Lashes' },
  { img: 'pierce1', t: 'Brow & Nose Piercings', c: 'Piercings' }, { img: 'lash6', t: 'Soft Lash Set', c: 'Lashes' },
  { img: 'lash7', t: 'Cat-Eye Lashes', c: 'Lashes' },
]
const cats = ['All', 'Tattoos', 'Lashes', 'Brows', 'Piercings', 'Whitening']

const marqueeWords = ['Tattoos', 'Lash Extensions', 'Brows', 'Piercings', 'Teeth Whitening', 'Custom Drawing', 'Wear Zinny']

const steps = [
  ['Pick your service', 'Browse the gallery and choose tattoo, lashes, brows, piercing or whitening.'],
  ['Message us', 'Tap WhatsApp, share your idea, your inspo and your preferred date.'],
  ['Visit the studio', 'Come to Surulere, relax and leave feeling amazing.'],
]

const wearPics = [['wz1', 'Pink slit maxi dress'], ['wz2', 'Red mini dress'], ['wz3', 'Halter maxi dress'], ['wz4', 'Denim jumpsuit']]

/* ────────────────────────────────────────────────────────────
   SHARED STYLE TOKENS
──────────────────────────────────────────────────────────── */
const BTN_WA =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c4a] font-semibold text-white shadow-lg shadow-green-900/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-500/30'
const BTN_DARK =
  'inline-flex items-center justify-center rounded-full bg-plum font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-rose'
const BTN_LINE =
  'inline-flex items-center justify-center rounded-full border border-current font-semibold transition duration-300 hover:bg-white hover:text-ink'
const EYEBROW = 'text-xs font-semibold uppercase tracking-[.3em] text-rose'
const H2 = 'font-display text-[clamp(2.1rem,5.6vw,4rem)] font-bold leading-[1.05]'
const NO_SCROLLBAR = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

/* ────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────── */
function WhatsAppIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.4.1.1.1.7-.1 1.3z" />
    </svg>
  )
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const f = () => setFine(mq.matches)
    f()
    mq.addEventListener?.('change', f)
    return () => mq.removeEventListener?.('change', f)
  }, [])
  return fine
}

/** Fade + rise on scroll. Same behaviour on phones and desktops. */
function Reveal({ children, className = '', delay = 0, y = 44, x = 0, as = 'div' }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/** Each line slides up out of a mask. */
function MaskLines({ lines, className = '', delay = 0, run = true }) {
  return (
    <>
      {lines.map(([text, cls], k) => (
        <span key={k} className={`block overflow-hidden pb-[.14em] ${className}`}>
          <motion.span
            className={`block origin-left ${cls || ''}`}
            initial={{ y: '110%', rotate: 4 }}
            {...(run ? { whileInView: { y: 0, rotate: 0 } } : {})}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: delay + k * 0.12, ease: EASE }}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </>
  )
}

function ScrubWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[.28em] inline-block">
      {children}
    </motion.span>
  )
}

/** Words light up as you scroll past. */
function ScrubText({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.55'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, k) => (
        <ScrubWord key={k} progress={scrollYProgress} range={[k / words.length, (k + 1) / words.length]}>
          {w}
        </ScrubWord>
      ))}
    </p>
  )
}

function Magnetic({ children, className = '' }) {
  const fine = useFinePointer()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const ref = useRef(null)
  const move = (e) => {
    if (!fine) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={move} onMouseLeave={leave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/** Soft ring that follows the mouse on desktop only. */
function CursorRing() {
  const fine = useFinePointer()
  const [big, setBig] = useState(false)
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const x = useSpring(mx, { stiffness: 380, damping: 32, mass: 0.4 })
  const y = useSpring(my, { stiffness: 380, damping: 32, mass: 0.4 })
  useEffect(() => {
    if (!fine) return
    const move = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setBig(!!e.target.closest?.('a,button,[role=button]'))
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [fine, mx, my])
  if (!fine) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[120] -ml-4 -mt-4 hidden lg:block"
    >
      <motion.div
        animate={{ scale: big ? 2.2 : 1, opacity: big ? 0.55 : 0.9 }}
        transition={{ duration: 0.25 }}
        className="h-8 w-8 rounded-full border border-rose bg-rose/10 mix-blend-multiply"
      />
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   PRELOADER  (counter + split curtain)
──────────────────────────────────────────────────────────── */
function Preloader({ show, count }) {
  const curtain = { duration: 1, ease: [0.76, 0, 0.24, 1] }
  return (
    <AnimatePresence>
      {show && [
        <motion.div key="top" exit={{ y: '-100%' }} transition={curtain} className="fixed inset-x-0 top-0 z-[100] h-1/2 bg-plum" />,
        <motion.div key="bot" exit={{ y: '100%' }} transition={curtain} className="fixed inset-x-0 bottom-0 z-[100] h-1/2 bg-plum" />,
        <motion.div
          key="txt"
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[101] flex flex-col items-center justify-center text-center text-white"
        >
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="font-display text-4xl font-bold sm:text-5xl">
            Zinny's <span className="italic text-rose-soft">Beauty</span>
          </motion.p>
          <p className="mt-2 text-[11px] uppercase tracking-[.4em] text-gold">Tattoos · Lashes · Piercings</p>
          <p className="mt-10 font-display text-6xl tabular-nums text-white/90">
            {String(count).padStart(2, '0')}
            <span className="text-2xl text-rose-soft">%</span>
          </p>
        </motion.div>,
      ]}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────────────────
   NAVBAR  (floating pill · hides on scroll down · slide-in menu)
──────────────────────────────────────────────────────────── */
function Navbar({ ready }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState('')
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const last = useRef(0)
  useBodyLock(open)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setHidden(y > last.current && y > 200)
    last.current = y
  })

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    navLinks.forEach(([, id]) => {
      const el = document.getElementById(id)
      el && io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: !ready || (hidden && !open) ? -100 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-3 z-[80] px-3 sm:top-4"
      >
        <div className="relative mx-auto flex h-14 max-w-5xl items-center justify-between overflow-hidden rounded-full border border-white/50 bg-cream/75 pl-5 pr-2 shadow-[0_8px_32px_-8px_rgba(42,22,32,.25)] backdrop-blur-xl">
          <a href="#home" onClick={() => setOpen(false)} className="font-display text-xl font-bold">
            Zinny's <span className="italic text-rose">Beauty</span>
          </a>

          <LayoutGroup>
            <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
              {navLinks.map(([t, id]) => (
                <a key={id} href={`#${id}`} className="relative rounded-full px-4 py-2 transition-colors hover:text-rose">
                  {active === id && <motion.span layoutId="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-blush" />}
                  <span className="relative">{t}</span>
                </a>
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-1">
            <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} hidden px-5 py-2.5 text-sm sm:inline-flex`}>
              Book Now
            </a>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-plum text-white lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[6px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[6px] -rotate-45' : 'top-[12px]'}`} />
              </span>
            </button>
          </div>
          <motion.div style={{ scaleX: progress }} className="absolute inset-x-6 bottom-0 h-[2px] origin-left bg-gradient-to-r from-rose to-gold" />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && [
          <motion.div key="shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm lg:hidden" />,
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-y-0 right-0 z-[75] flex w-[86%] max-w-sm flex-col justify-center overflow-y-auto bg-plum px-8 pb-10 pt-24 text-white lg:hidden"
          >
            {navLinks.map(([t, id], k) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + k * 0.06, duration: 0.6, ease: EASE }}
                className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-3xl font-semibold"
              >
                <span className="font-sans text-xs text-gold">0{k + 1}</span>
                {t}
              </motion.a>
            ))}
            <div className='flex justify-center'>
              <motion.a href={wa()} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className={`${BTN_WA} w-44 mt-6 py-4 text-lg`}>
              <WhatsAppIcon /> Book Now
            </motion.a>
            </div>
            <p className="mt-5 text-center text-sm text-white/60">{STUDIO.display}</p>
          </motion.aside>,
        ]}
      </AnimatePresence>
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   HERO  (editorial split · clip-path wipe · 3D tilt · rotating badge)
──────────────────────────────────────────────────────────── */
function Hero({ ready }) {
  const [i, setI] = useState(0)
  const [tick, setTick] = useState(0)
  const x0 = useRef(null)
  const ref = useRef(null)
  const fine = useFinePointer()
  const n = heroSlides.length
  const s = heroSlides[i]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  // tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })
  const onMove = (e) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const go = useCallback((k) => {
    setI(((k % n) + n) % n)
    setTick((t) => t + 1)
  }, [n])

  useEffect(() => {
    if (!ready) return
    const id = setInterval(() => setI((c) => (c + 1) % n), SLIDE_MS)
    return () => clearInterval(id)
  }, [tick, ready, n])

  const up = (delay) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.9, ease: EASE },
  })

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden bg-cream pb-10 md:pb-16 pt-28 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-14 lg:pt-28"
    >
      {/* soft background blobs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blush/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div style={{ y: titleY }}>
          <motion.p {...up(0.1)} className="hidden  md:block  items-center gap-2  px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.22em] text-plum backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25d366] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25d366]" />
            </span>
            Surulere, Lagos · Now booking
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,9.4vw,6.4rem)] font-extrabold leading-[.98] tracking-tight">
            <span className="block overflow-hidden pb-[.14em]">
              <motion.span className="block origin-left" initial={{ y: '110%', rotate: 4 }} animate={ready ? { y: 0, rotate: 0 } : {}} transition={{ duration: 1.1, delay: 0.15, ease: EASE }}>
                Skin, ink
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[.14em]">
              <motion.span className="block origin-left italic text-rose" initial={{ y: '110%', rotate: 4 }} animate={ready ? { y: 0, rotate: 0 } : {}} transition={{ duration: 1.1, delay: 0.27, ease: EASE }}>
                &amp; sparkle.
              </motion.span>
            </span>
          </h1>

          <motion.p {...up(0.75)} className="mt-6 max-w-md text-base text-plum/75 sm:text-lg">
            Tattoos, lash extensions, brows, piercings and teeth whitening - all under one roof at Zinny's Beauty Studio.
          </motion.p>

          <motion.div {...up(0.95)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} px-8 py-4`}>
                <WhatsAppIcon size={20} /> Book Now
              </a>
            </Magnetic>
            <a href="#gallery" className="group inline-flex items-center gap-2 px-4 py-4 font-semibold text-plum">
              See our work
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
          </motion.div>

          <motion.div {...up(1.1)} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-plum/70">
            {['Tattoos', 'Lashes', 'Brows', 'Piercings', 'Whitening'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-rose">✦</span>
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* image stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
          className="relative mx-auto w-full max-w-[420px] lg:mr-0 lg:max-w-[440px]"
          style={{ perspective: 1200 }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const d = e.changedTouches[0].clientX - x0.current
            if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1))
          }}
        >
          <motion.div style={{ rotateX: rx, rotateY: ry, y: imgY }} className="relative">
            <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-[2.2rem] border border-rose/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-plum shadow-2xl shadow-plum/30">
              <AnimatePresence initial={false}>
                <motion.img
                  key={s.img}
                  src={`/images/${s.img}.jpg`}
                  alt={s.alt}
                  initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.25 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                  exit={{ opacity: 1, transition: { duration: 1.3 } }}
                  transition={{ clipPath: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }, scale: { duration: 1.8, ease: EASE } }}
                  draggable="false"
                  className="absolute inset-0 h-full w-full select-none object-cover object-top"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-[.3em] text-white/70">Now showing</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="font-display text-xl font-semibold">
                      {s.tag}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <span className="font-display text-sm tracking-widest text-white/80">
                  0{i + 1}<span className="text-white/40"> / 0{n}</span>
                </span>
              </div>
            </div>

            {/* rotating badge */}
            <div className="absolute -left-5 -top-6 h-24 w-24 sm:-left-9 sm:h-28 sm:w-28">
              <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spinSlow">
                <defs>
                  <path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <circle cx="60" cy="60" r="58" fill="#2a1620" />
                <text fill="#f6d9de" fontSize="10.5" fontWeight="600" letterSpacing="3.2">
                  <textPath href="#circ">SURULERE · LAGOS · STUDIO ·</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl text-gold">✦</span>
            </div>
          </motion.div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, k) => (
                <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => go(k)} className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${k === i ? 'w-9 bg-plum/20' : 'w-2 bg-plum/35'}`}>
                  {k === i && (
                    <motion.span key={`${tick}-${i}`} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }} className="absolute inset-y-0 left-0 bg-rose" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {[['←', -1], ['→', 1]].map(([c, d]) => (
                <button key={c} aria-label={d < 0 ? 'Previous slide' : 'Next slide'} onClick={() => go(i + d)} className="h-11 w-11 rounded-full border border-plum/25 text-lg transition hover:bg-plum hover:text-white">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   MARQUEE  (speeds up with scroll velocity feel via reverse rows)
──────────────────────────────────────────────────────────── */
function Marquee() {
  const row = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords]
  return (
    <div className="overflow-hidden py-3" aria-hidden="true">
      <div className="-rotate-1 scale-[1.06] overflow-hidden bg-plum py-5 text-white shadow-xl">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl italic sm:text-2xl">
          {row.map((w, k) => (
            <span key={k} className="flex items-center gap-10">
              {w}
              <span className="not-italic text-rose-soft">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   SERVICES  (interactive index list + image reveal)
──────────────────────────────────────────────────────────── */
function Services() {
  const [a, setA] = useState(0)
  const fine = useFinePointer()
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-20 sm:py-32">
      <Reveal>
        <p className={EYEBROW}>What we do</p>
        <h2 className={`${H2} mt-3 max-w-2xl`}>
          Five ways to feel <span className="italic text-rose">like you</span>, only more.
        </h2>
      </Reveal>

      <div className="mt-10 md:mt-12 grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <ul className="divide-y divide-plum/15 border-y border-plum/15">
          {services.map((s, k) => {
            const on = a === k
            return (
              <li key={s.t} onMouseEnter={() => fine && setA(k)}>
                <button onClick={() => setA(k)} aria-expanded={on} className="group flex w-full items-center gap-4 py-6 text-left sm:py-7">
                  <span className={`font-display text-sm transition-colors ${on ? 'text-rose' : 'text-plum/40'}`}>0{k + 1}</span>
                  <span className={`flex-1 font-display text-2xl font-semibold transition-all duration-500 sm:text-4xl ${on ? 'translate-x-2 text-rose' : 'text-plum'}`}>{s.t}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${on ? 'rotate-45 border-rose bg-rose text-white' : 'border-plum/25'}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                      <div className="pb-6 pl-9 sm:pl-12">
                        <p className="max-w-md text-plum/75">{s.d}</p>
                        <img src={`/images/${s.img}.jpg`} alt={s.t} loading="lazy" className="mt-5 h-64 w-full rounded-2xl object-cover object-top lg:hidden" />
                        <a href={wa(`Hello Zinny's Beauty Studio, I'd like to book ${s.msg}.`)} target="_blank" rel="noreferrer" className={`${BTN_DARK} mt-5 px-6 py-3 text-sm`}>
                          Book {s.t.toLowerCase()} →
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>

        <div className="relative hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem] bg-plum shadow-2xl shadow-plum/25">
            <AnimatePresence initial={false}>
              <motion.img
                key={services[a].img}
                src={`/images/${services[a].img}.jpg`}
                alt={services[a].t}
                initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.2 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                exit={{ opacity: 1, transition: { duration: 0.9 } }}
                transition={{ clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }, scale: { duration: 1.4, ease: EASE } }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 rounded-full bg-cream/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-plum">{services[a].t}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   REEL  (pinned horizontal scroll – vertical scroll drives a film strip)
──────────────────────────────────────────────────────────── */
function Reel() {
  const ref = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)

  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 600)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const bigX = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])

  return (
    <section id="reel" ref={ref} className="relative bg-plum text-white" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.p
          style={{ x: bigX }}
          className="pointer-events-none absolute -top-2 left-0 whitespace-nowrap font-display text-[26vw] font-extrabold leading-none text-white/[.04] sm:text-[18vw]"
          aria-hidden="true"
        >
          THE STUDIO REEL
        </motion.p>

        <div className="relative mx-auto mb-10 w-full max-w-6xl px-5">
          <p className={`${EYEBROW} !text-rose-soft`}>The studio reel</p>
          <h2 className={`${H2} mt-3`}>
            Scroll through <span className="italic text-rose-soft">our favourites</span>
          </h2>
        </div>

        <motion.div ref={track} style={{ x }} className="relative flex w-max gap-5 pl-5 pr-[20vw] lg:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
          {reel.map((r, k) => (
            <a
              key={r.img}
              href={wa(`Hello Zinny's Beauty Studio, I'd like to book the "${r.t}" look.`)}
              target="_blank"
              rel="noreferrer"
              className={`group relative h-[52svh] w-[62vw] shrink-0 overflow-hidden rounded-[1.6rem] sm:h-[56svh] sm:w-[34vw] lg:w-[24vw] ${k % 2 ? 'mt-10' : ''}`}
            >
              <img src={`/images/${r.img}.jpg`} alt={r.t} loading="lazy" draggable="false" className="h-full w-full select-none object-cover object-top transition duration-[900ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <span className="absolute left-4 top-3 font-display text-4xl font-bold text-white/80">0{k + 1}</span>
              <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-plum">{r.tag}</span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <h3 className="font-display text-xl font-semibold leading-tight">{r.t}</h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-plum transition group-hover:bg-rose group-hover:text-white">→</span>
              </div>
            </a>
          ))}
        </motion.div>

        <div className="relative mx-auto mt-10 w-full max-w-6xl px-5">
          <div className="h-[3px] overflow-hidden rounded-full bg-white/15">
            <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-rose to-gold" />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[.25em] text-white/50">Keep scrolling →</p>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   GALLERY + LIGHTBOX
──────────────────────────────────────────────────────────── */
function Lightbox({ list, index, setIndex, onClose }) {
  const dragged = useRef(false)
  const item = list[index]
  const step = useCallback((d) => setIndex((s) => (s + d + list.length) % list.length), [list.length, setIndex])
  useBodyLock(true)

  useEffect(() => {
    const f = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [step, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !dragged.current && onClose()}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/95 p-4 text-white"
      role="dialog"
      aria-modal="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.img}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 80) step(info.offset.x < 0 ? 1 : -1)
            setTimeout(() => (dragged.current = false), 80)
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full cursor-grab text-center active:cursor-grabbing"
        >
          <img src={`/images/${item.img}.jpg`} alt={item.t} draggable="false" className="mx-auto max-h-[72svh] max-w-full select-none rounded-2xl object-contain" />
          <p className="mt-4 font-display text-xl">{item.t}</p>
          <p className="text-xs uppercase tracking-widest text-gold">{item.c} · {index + 1} / {list.length}</p>
          <a href={wa(`Hello Zinny's Beauty Studio, I love the "${item.t}". I'd like to book it.`)} target="_blank" rel="noreferrer" className={`${BTN_WA} mt-4 px-6 py-2.5 text-sm`}>
            Book this look
          </a>
        </motion.div>
      </AnimatePresence>
      <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30">✕</button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1) }} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30 sm:block">‹</button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1) }} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30 sm:block">›</button>
    </motion.div>
  )
}

function Gallery() {
  const [cat, setCat] = useState('All')
  const [sel, setSel] = useState(null)
  const [all, setAll] = useState(false)
  const list = gallery.filter((g) => cat === 'All' || g.c === cat)
  const shown = all ? list : list.slice(0, 9)
  const closeBox = useCallback(() => setSel(null), [])

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-16 md:py-20 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className={EYEBROW}>Gallery</p>
        <h2 className={`${H2} mt-3`}>Real clients, <span className="italic text-rose">real glow</span></h2>
        <p className="mt-4 text-plum/70">Tap any photo to view it full size and book that exact look.</p>
      </Reveal>

      <Reveal className="mt-6 flex flex-wrap justify-center gap-2">
        <LayoutGroup id="gal">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setAll(false) }}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${cat === c ? 'text-white' : 'bg-plum/5 hover:bg-plum/10'}`}
            >
              {cat === c && <motion.span layoutId="gal-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full bg-plum" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </LayoutGroup>
      </Reveal>

      <div className="mt-10 columns-2 gap-3 sm:gap-4 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {shown.map((g, k) => (
            <motion.button
              key={`${cat}-${g.img}`}
              initial={{ opacity: 0, y: 40, clipPath: 'inset(12% 8% 12% 8% round 24px)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
              viewport={{ once: true, margin: '0px 0px -5% 0px' }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.8, ease: EASE, delay: (k % 3) * 0.07 }}
              onClick={() => setSel(k)}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
            >
              <img src={`/images/${g.img}.jpg`} alt={g.t} loading="lazy" className="w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-plum/85 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 translate-y-3 p-3 text-left text-sm font-medium text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                {g.t}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {list.length > 9 && (
        <div className="mt-6 text-center">
          <button onClick={() => setAll(!all)} className="rounded-full border border-plum/30 px-8 py-3 text-sm font-semibold transition hover:bg-plum hover:text-white">
            {all ? 'Show less' : `View all ${list.length} looks`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {sel !== null && shown[sel] && <Lightbox key="lb" list={shown} index={sel} setIndex={setSel} onClose={closeBox} />}
      </AnimatePresence>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   TATTOO SPOTLIGHT  (scroll-scrubbed text + parallax images)
──────────────────────────────────────────────────────────── */
function TattooSpotlight() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 4])
  const points = ['Custom drawings made for you', 'Fine-line, floral and symbolic designs', 'Clean, careful and comfortable sessions']

  return (
    <section id="tattoos" ref={ref} className="overflow-hidden bg-ink py-20 text-white sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className={`${EYEBROW} !text-rose-soft`}>Tattoos &amp; Drawing</p>
            <h2 className={`${H2} mt-3`}>
              Art you'll <span className="italic text-rose-soft">wear</span> forever
            </h2>
          </Reveal>
          <ScrubText
            className="mt-6 max-w-lg text-xl font-medium leading-snug text-white sm:text-2xl"
            text="Bring your idea, a reference or just a feeling. We draw it, perfect it with you, and ink it cleanly - delicate fine-line florals, meaningful scripts and bold pieces."
          />
          <ul className="mt-8 space-y-3">
            {points.map((t, k) => (
              <Reveal as="li" key={t} delay={0.1 + k * 0.1} x={30} y={0} className="flex items-center gap-3 text-white/85">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose/20 text-rose-soft">✦</span>
                {t}
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.35}>
            <Magnetic className="flex justify-center mt-9">
              <a href={wa("Hello Zinny's Beauty Studio, I'd like to book a tattoo.")} target="_blank" rel="noreferrer" className={`${BTN_WA} px-8 py-4`}>
                 Book a Tattoo
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="relative order-1 grid grid-cols-2 gap-4 lg:order-2">
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            className="relative h-[380px] overflow-hidden sm:h-[460px]"
          >
            <motion.img style={{ y: y1 }} src="/images/rose.jpg" alt="Rose tattoo" loading="lazy" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.3, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ y: y2 }}
            className="mt-14 h-[380px] overflow-hidden sm:h-[460px]"
          >
            <img src="/images/fan.jpg" alt="Fan tattoo" loading="lazy" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div style={{ rotate: rot }} className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-2xl bg-cream px-5 py-3 text-plum shadow-2xl sm:flex">
            <img src="/images/lotus.jpg" alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
            <div>
              <p className="font-display text-lg font-bold leading-none">Fine-line</p>
              <p className="text-xs text-plum/70">florals &amp; symbols</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   PROCESS  (timeline that draws itself)
──────────────────────────────────────────────────────────── */
function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <section id="process" className="mx-auto max-w-4xl px-5 py-16 sm:py-32">
      <Reveal className="text-center">
        <p className={EYEBROW}>Booking</p>
        <h2 className={`${H2} mt-3`}>Book in <span className="italic text-rose">3 easy steps</span></h2>
      </Reveal>

      <div ref={ref} className="relative mt-12 md:mt-14">
        <div className="absolute bottom-0 left-6 top-0 w-px bg-plum/15 md:left-1/2">
          <motion.div style={{ height: h }} className="w-full bg-gradient-to-b from-rose to-gold" />
        </div>
        {steps.map(([t, d], k) => (
          <div key={t} className={`relative mb-10 pl-20 last:mb-0 md:w-1/2 md:pl-0 ${k % 2 ? 'md:ml-auto md:pl-14' : 'md:pr-14 md:text-right'}`}>
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -25% 0px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={`absolute top-0 flex h-12 w-12 items-center justify-center rounded-full bg-plum font-display text-xl font-bold text-white ring-8 ring-cream left-0 ${k % 2 ? 'md:-left-6' : 'md:-right-6 md:left-auto'}`}
            >
              {k + 1}
            </motion.span>
            <Reveal x={k % 2 ? 40 : -40} y={0}>
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-plum/10 ring-1 ring-plum/5">
                <h3 className="font-display text-2xl font-semibold">{t}</h3>
                <p className="mt-2 text-plum/70">{d}</p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   WEAR ZINNY  (fashion brand card with staggered parallax columns)
──────────────────────────────────────────────────────────── */
function WearZinny() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const up = useTransform(scrollYProgress, [0, 1], [50, -50])
  const down = useTransform(scrollYProgress, [0, 1], [-30, 50])
  return (
    <section id="wear" ref={ref} className="mx-auto max-w-6xl px-5 pb-16 md:pb-20 sm:pb-32">
      <Reveal y={60}>
        <div className="relative overflow-hidden rounded-[2.2rem] p-7 text-white sm:p-14" style={{ background: 'linear-gradient(135deg,#c9456f 0%,#8f2f55 55%,#c79a68 120%)' }}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.3em] text-white/85">Our fashion brand</p>
              <h2 className="mt-3 font-display text-5xl font-extrabold sm:text-7xl">Wear Zinny</h2>
              <p className="mt-2 font-display text-xl italic text-white/90">Your every fashion plug</p>
              <p className="mt-5 max-w-md text-white/90">Jeans. Fashion. Style. Dresses, denim and sets for women - pickup in Aguda, Surulere, or nationwide delivery.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={wa('Hello Wear Zinny, I would like to see your clothes.', WEAR)} target="_blank" rel="noreferrer" className={`${BTN_WA} px-7 py-3.5`}>
                   Shop Now
                </a>
                <a href={WEAR.tiktok} target="_blank" rel="noreferrer" className={`${BTN_LINE} px-7 py-3.5`}>TikTok {WEAR.handle}</a>
              </div>
              <p className="mt-4 text-sm text-white/80">{WEAR.display}</p>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {wearPics.map(([f, a], k) => (
                <motion.div key={f} style={{ y: k % 2 ? down : up }} whileHover={{ scale: 1.04, zIndex: 5 }} className="relative">
                  <img src={`/images/${f}.jpg`} alt={a} loading="lazy" className="h-60 w-full rounded-2xl object-cover object-top shadow-2xl sm:h-80" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   LOCATION
──────────────────────────────────────────────────────────── */
function Location() {
  return (
    <section id="location" className="bg-blush/60 py-14 md:py-20 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Reveal>
            <p className={EYEBROW}>Find us</p>
            <h2 className={`${H2} mt-3`}>Visit us in <span className="italic text-rose">Surulere</span></h2>
            <p className="mt-4 text-plum/75">Zinny's Beauty Studio is in Surulere, Lagos State. Message us on WhatsApp for the exact address and directions before you come.</p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">📍</span> Surulere, Lagos State, Nigeria</p>
              <p className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">📞</span> {STUDIO.display}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={DIRECTIONS} target="_blank" rel="noreferrer" className={`${BTN_DARK} px-6 py-3 text-sm`}>Get directions</a>
              <a href={wa("Hello Zinny's Beauty Studio, please send me your exact address.")} target="_blank" rel="noreferrer" className={`${BTN_WA} px-6 py-3 text-sm`}>Ask for address</a>
            </div>
          </Reveal>
        </div>
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 32px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          className="overflow-hidden shadow-2xl shadow-plum/20 lg:col-span-3"
        >
          <iframe title="Zinny's Beauty Studio - Surulere, Lagos" src={MAP} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[360px] w-full sm:h-[460px]" style={{ border: 0 }} allowFullScreen />
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   CONTACT
──────────────────────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1])
  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-ink py-16 md:py-20 text-center text-white sm:py-40">
      <motion.img style={{ y, scale }} src="/images/lash1.jpg" alt="" loading="lazy" className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover object-top opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal>
          <p className={`${EYEBROW} !text-rose-soft`}>Let's talk</p>
        </Reveal>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.5rem)] font-extrabold leading-[1]">
          <MaskLines lines={[['Ready for your'], ['new look?', 'italic text-rose-soft']]} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-lg text-white/80">Message Zinny's Beauty Studio now to check availability and book your appointment.</p>
          <div className="relative mt-10 inline-block">
            <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#25d366]" />
            <Magnetic>
              <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} relative px-10 py-5 text-lg`}>
                <WhatsAppIcon /> Chat Us
              </a>
            </Magnetic>
          </div>
          <p className="mt-6 text-sm text-white/70">{STUDIO.display}</p>
          <a href={STUDIO_TIKTOK} target="_blank" rel="noreferrer" className={`${BTN_LINE} mt-5 px-6 py-2.5 text-sm`}>
            Follow us on TikTok @zinnys_beauty_studio
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   FOOTER · WHATSAPP FAB
──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="overflow-hidden bg-plum px-5 pb-8 pt-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-white/80">
          {navLinks.map(([t, id]) => (
            <a key={id} href={`#${id}`} className="transition hover:text-rose-soft">{t}</a>
          ))}
        </nav>
        <div className="flex gap-4 text-sm text-white/80">
          <a href={STUDIO_TIKTOK} target="_blank" rel="noreferrer" className="transition hover:text-rose-soft">TikTok @zinnys_beauty_studio</a>
          <a href={WEAR.tiktok} target="_blank" rel="noreferrer" className="transition hover:text-rose-soft">Fashion {WEAR.handle}</a>
        </div>
        <a href="#home" aria-label="Back to top" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-lg transition hover:bg-rose">↑</a>
      </div>

      {/* Builder Credit */}
        <p className="mt-2 text-xs sm:text-sm opacity-80 flex items-center justify-center gap-2">
          <img
              src="/logos.jpg"
              alt="Elvionweb Logo"
              className="w-8 h-8 object-contain"
          />
          Built by{" "}
          <a
            href="https://www.elvionweb.com"
        target="_blank"
          rel="noopener noreferrer"
        className="font-semibold underline underline-offset-4 hover:opacity-100 transition-opacity"
          >
          Elvionweb
          </a>
          </p>
      <Reveal y={80}>
        <p className="mt-4 select-none text-center font-display text-[17vw] font-extrabold leading-none tracking-tight text-white/[.07]">Zinny's</p>
      </Reveal>
      <p className="-mt-2 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Zinny's Beauty Studio · Surulere, Lagos
      </p>
    </footer>
  )
}

function WhatsAppFab() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > 300)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={wa()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 40 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center pb-[env(safe-area-inset-bottom)]"
        >
          <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#25d366]" />
          <span className={`${BTN_WA} relative h-14 w-14`}>
            <WhatsAppIcon size={28} />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────────────────
   APP
──────────────────────────────────────────────────────────── */
export default function App() {
  const [ready, setReady] = useState(false)
  const [count, setCount] = useState(0)
  useBodyLock(!ready)

  useEffect(() => {
    const t0 = performance.now()
    const DUR = 1700
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / DUR)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setReady(true), 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader show={!ready} count={count} />
      <CursorRing />
      <Navbar ready={ready} />
      <main className="overflow-x-clip">
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <Reel />
        <Gallery />
        <TattooSpotlight />
        <Process />
        <WearZinny />
        <Location />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </MotionConfig>
  )
}
