import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, Mail, Menu, Phone, X } from 'lucide-react';
import larryStage from '@assets/Screenshot_2026-10-15_235811_1792162147756.png';
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, useReducedMotion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const navigation = [
  ['Home', '#home'],
  ['Presentations/Workshops', '#workshops'],
  ['Programs', '#programs'],
  ['Meet Larry', '#meet-larry'],
  ['Our Difference', '#difference'],
  ['Reviews & Results', '#reviews'],
  ['Ask Larry', '#contact'],
  ['Contact', '#contact'],
];
const desktopNavigation = [
  ['Home', '#home'],
  ['Presentations', '#workshops'],
  ['Programs', '#programs'],
  ['Meet Larry', '#meet-larry'],
  ['Reviews & Results', '#reviews'],
];

const states = ['California', 'Tennessee', 'Texas', 'Louisiana', 'Arkansas', 'Oklahoma'];
const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.'),
  school: z.string().trim().min(1, 'Enter your school or district.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().optional(),
  date: z.string().optional(),
  message: z.string().trim().min(1, 'Add a short message.'),
});
type InquiryFormValues = z.infer<typeof inquirySchema>;

function Brand() {
  return (
    <a className="brand-logo" href="#home" aria-label="Larry Bell home">
      <span className="brand-mark"><img src={larryStage} alt="Larry Bell speaking on stage" /></span>
      <span>
        <span className="brand-tag">Somebody Needs You!</span>
        <span className="brand-name">Larry Bell</span>
        <span className="brand-sub">National Presenter · Educational Consultant · Author</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? window.scrollY / available * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  useEffect(() => {
    const targets = desktopNavigation.map(([, href]) => document.querySelector<HTMLElement>(href));
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(`#${visible.target.id}`);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .15, .35] });
    targets.forEach((target) => target && observer.observe(target));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {desktopNavigation.map(([label, href]) => {
            const target = label === 'Presentations' ? '#workshops' : href;
            return <a key={label} className="nav-link" href={target} aria-current={active === target ? 'location' : undefined} data-testid={`desktop-nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{label}</a>;
          })}
          <details className="nav-more">
            <summary className="nav-link" data-testid="desktop-nav-more">More <ChevronDown size={13} aria-hidden="true" /></summary>
            <div className="nav-dropdown">
              {navigation.filter(([label]) => !desktopNavigation.some(([desktopLabel]) => desktopLabel === label) && label !== 'Presentations/Workshops').map(([label, href]) => <a key={label} className="nav-link" href={href}>{label}</a>)}
            </div>
          </details>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:7039690156" aria-label="Call Larry at 703.969.0156"><Phone size={16} aria-hidden="true" /><span>703.969.0156</span></a>
          <a className="header-book btn btn-red btn-shine" href="#contact" data-testid="link-book-larry-header">Book Larry <ArrowRight size={15} /></a>
          <a className="mobile-call" href="tel:7039690156" aria-label="Call Larry"><Phone size={19} /></a>
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" className="mobile-menu-button" data-testid="button-mobile-menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <button className={`drawer-backdrop${open ? ' visible' : ''}`} aria-label="Close menu" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />
      <nav id="mobile-navigation" className={`mobile-drawer${open ? ' open' : ''}`} aria-label="Mobile navigation" aria-hidden={!open}>
        <div className="drawer-top"><span className="eyebrow">Explore</span><button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button></div>
        {navigation.map(([label, href], index) => <a key={label} onClick={() => setOpen(false)} href={href} className="drawer-link" data-testid={`mobile-nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ ['--link-index' as string]: index }}>{label}<ArrowRight size={17} /></a>)}
        <div className="drawer-actions"><a href="#contact" onClick={() => setOpen(false)} className="btn btn-red btn-shine">Book Larry <ArrowRight size={18} /></a><a href="tel:7039690156" className="drawer-call"><Phone size={18} /> Call Larry</a></div>
      </nav>
      <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress / 100})` }} /></div>
    </header>
  );
}

function VideoCard({ title, videoId }: { title: string; videoId: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className="card" style={{ overflow: 'hidden' }} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduceMotion ? 0 : .45 }}>
      <div className="video-surface" style={{ aspectRatio: '16 / 9', minHeight: 0 }}>
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
      <div style={{ padding: '21px 22px 24px' }}>
        <h3 style={{ margin: '0 0 8px', font: '700 1.22rem/1.25 "Playfair Display", Georgia, serif' }}>{title}</h3>
        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer" style={{ color: '#0F86CC', fontWeight: 700, textDecoration: 'none', fontSize: '.87rem' }}>Watch on YouTube <ArrowRight size={15} style={{ verticalAlign: 'middle', marginLeft: 5 }} /></a>
      </div>
    </motion.article>
  );
}

function TestimonialCard({ name, role, videoId }: { name: string; role: string; videoId: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className="card" style={{ overflow: 'hidden', minWidth: 0 }} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduceMotion ? 0 : .45 }}>
      <div className="video-surface" style={{ aspectRatio: '16 / 9', minHeight: 0 }}>
        <iframe
          title={`Testimonial from ${name}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
      <div style={{ padding: '21px 22px 24px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '.96rem', fontWeight: 800 }}>{name}</h3>
        <p style={{ margin: 0, fontSize: '.82rem', lineHeight: 1.5, color: '#30465c' }}>{role}</p>
      </div>
    </motion.article>
  );
}

function Home() {
  const [toast, setToast] = useState('');
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = useReducedMotion();
  const inquiryForm = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: '', school: '', email: '', phone: '', date: '', message: '' },
  });
  useEffect(() => {
    document.title = 'Larry Bell | Educational Motivational Speaker & Teacher Professional Development';
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Bring Larry Bell’s Unstoppable! professional development to your school. Practical strategies, renewed purpose, and energy for educators.');
    document.head.appendChild(meta);
    const openGraph = [
      ['og:title', 'Larry Bell | Make Your Teachers Unstoppable!'],
      ['og:description', 'National presenter, educational consultant, and author. Bring Larry Bell’s Unstoppable! professional development to your school.'],
      ['og:type', 'website'],
      ['og:image', new URL(larryStage, window.location.href).toString()],
    ];
    openGraph.forEach(([property, content]) => {
      const tag = document.querySelector(`meta[property="${property}"]`) ?? document.createElement('meta');
      tag.setAttribute('property', property);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    });
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
    const cardTargets = Array.from(document.querySelectorAll<HTMLElement>('main .card, main article:not(.card), main a[aria-label="Read about Larry Bell Schools: The Creswell Experience"]'));
    revealTargets.forEach((section) => section.classList.add('reveal-section'));
    const siblingIndexes = new Map<Element, number>();
    cardTargets.forEach((card) => {
      const parent = card.parentElement;
      const index = parent ? siblingIndexes.get(parent) ?? 0 : 0;
      if (parent) siblingIndexes.set(parent, index + 1);
      card.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 85}ms`);
      card.classList.add('reveal-card');
    });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      revealTargets.forEach((section) => section.classList.add('revealed'));
      cardTargets.forEach((card) => card.classList.add('revealed'));
    } else if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      cardTargets.forEach((card) => cardObserver.observe(card));
    } else {
      cardTargets.forEach((card) => card.classList.add('revealed'));
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      revealTargets.forEach((section) => observer.observe(section));
    } else {
      revealTargets.forEach((section) => section.classList.add('revealed'));
    }
    const onScroll = () => {
      setShowTop(window.scrollY > 650);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelector<HTMLElement>('.hero-image')?.style.setProperty('--portrait-shift', `${Math.min(window.scrollY * 0.035, 20)}px`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSubmit() {
    setToast('Thank you for sharing your details. This preview does not send messages; please call or email Larry to send your inquiry.');
    window.setTimeout(() => setToast(''), 5000);
  }

  return (
    <>
      <Header />
      <main>
        <section id="home" className="hero" style={{ minHeight: '100svh', color: '#fff', background: 'linear-gradient(110deg,#0B0F14 5%,#0B1F3A 52%,#0F86CC 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
          <div className="hero-dots" style={{ position: 'absolute', inset: 0, opacity: .28, pointerEvents: 'none' }} />
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-particles" aria-hidden="true" />
          <div className="container mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', alignItems: 'center', gap: 20 }}>
            <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: 'easeOut' }} style={{ padding: '62px 0 80px', position: 'relative', zIndex: 2 }}>
              <p style={{ color: '#FFC93C', fontWeight: 700, fontSize: '.72rem', letterSpacing: '.17em', textTransform: 'uppercase', margin: '0 0 22px' }}>National Presenter · Educational Consultant · Author</p>
              <h1 className="serif hero-heading" style={{ maxWidth: 640, fontSize: 'clamp(3rem,6.8vw,5.8rem)', lineHeight: .99, letterSpacing: '-.045em', margin: '0 0 23px' }}>Make Your Teachers <span className="gold-shimmer">Unstoppable!</span></h1>
              <p style={{ maxWidth: 555, color: '#d9e5ec', fontSize: 'clamp(1.08rem,1.7vw,1.35rem)', lineHeight: 1.7, margin: '0 0 30px' }}>On your worst day on the job, you are still some child's best hope!</p>
              <div className="hero-ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a className="btn btn-red btn-shine" href="#contact" data-testid="link-book-larry-hero">Book Larry for Your School <ArrowRight size={17} /></a>
                <a className="btn btn-outline" href="#videos">Watch Larry in Action <ArrowDown size={16} /></a>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: 12, marginTop: 42, flexWrap: 'wrap' }}>
                <AnimatedMetric target={20} suffix="+" label="Years Experience" />
                <div><strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFC93C' }}>Thousands</strong><span style={{ fontSize: '.72rem', color: '#c6d3dc' }}>of teachers inspired</span></div>
                <div><strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFC93C' }}>Nationwide</strong><span style={{ fontSize: '.72rem', color: '#c6d3dc' }}>schools &amp; districts</span></div>
              </div>
            </motion.div>
            <div className="hero-image" style={{ minHeight: 600, position: 'relative', alignSelf: 'stretch', display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
              <div className="hero-spotlight" />
              <img className="hero-portrait" src={larryStage} alt="Larry Bell inspiring educators on stage, arms open as he speaks" fetchPriority="high" />
              <div className="hero-badge hero-quote">Somebody Needs You!</div>
              <div className="hero-badge hero-years">20+ <span>Years</span></div>
            </div>
          </div>
          <a href="#nationwide" aria-label="Scroll to discover" className="scroll-indicator" style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#ffffff9c', textDecoration: 'none', fontSize: '.67rem', letterSpacing: '.14em', textTransform: 'uppercase' }}>Discover <ArrowDown size={14} style={{ verticalAlign: 'middle', marginLeft: 7 }} /></a>
        </section>

        <section id="nationwide" className="trust-strip">
          <div className="container trust-inner">
            <div className="trust-label"><p className="eyebrow" style={{ margin: 0 }}>Trusted in communities across the country</p><strong>Serving schools nationwide</strong></div>
            <div className="marquee-window" role="region" tabIndex={0} aria-label={`Serving schools in ${states.join(', ')}`}>
              <div className="state-pills">{[...states, ...states].map((state, index) => <span className="tag" key={`${state}-${index}`} aria-hidden={index >= states.length}>{state}</span>)}</div>
            </div>
          </div>
        </section>

        <section id="difference" className="section-pad" style={{ background: '#F5F7FA' }}>
          <div className="container">
            <div className="difference-intro">
              <div style={{ maxWidth: 820, marginBottom: 38 }}>
              <p className="eyebrow">Larry Bell Presents</p>
              <h2 className="section-title">Unstoppable! <span style={{ color: '#0F86CC' }}>Professional Development</span></h2>
              <p className="section-lede">Larry’s presentations are characterized as ‘Unstoppable!’ for a reason. These presentations have created thousands of ‘Unstoppable!’ teachers over the years. Countless nationwide successes in student achievement and teacher motivation have led to the name for this set of workshops.</p>
              </div>
              <figure className="difference-photo"><img src={larryStage} alt="Larry Bell energizing educators during a keynote presentation" loading="lazy" /><figcaption>“Somebody Needs You!”</figcaption></figure>
            </div>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
              <article className="card" style={{ padding: '32px 34px' }}>
                <p className="eyebrow">Built to move people forward</p><h3 className="serif" style={{ fontSize: '1.75rem', margin: '8px 0 24px' }}>Why it works</h3>
                <ul className="check-list">
                  {['Your teachers must feel ‘Unstoppable!’ during these turbulent and challenging times.', 'Some teachers are becoming discouraged and disillusioned because of national events and outside distractions and are losing sight of their power.', 'An ‘Unstoppable!’ presentation will help your teachers view adversity as an opportunity for growth.'].map((item) => <li key={item}><span className="check"><Check size={14} /></span>{item}</li>)}
                </ul>
              </article>
              <article className="card" style={{ padding: '32px 34px', background: 'linear-gradient(140deg,#0B1F3A,#0F86CC)', color: '#fff', border: 0 }}>
                <p style={{ color: '#FFC93C' }} className="eyebrow">Designed for school communities</p><h3 className="serif" style={{ fontSize: '1.75rem', margin: '8px 0 24px' }}>Excellent for</h3>
                <ul className="check-list">
                  {['An all-day Back-to-School Inservice.', 'A dynamic keynote for both certified and classified personnel.', 'An administrative retreat that informs and empowers.', 'New teacher academies.', 'Summer teacher institutes.'].map((item) => <li key={item} style={{ color: '#F5F7FA' }}><span className="check" style={{ background: '#ffffff1c', color: '#FFC93C' }}><Check size={14} /></span>{item}</li>)}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section style={{ padding: '64px 0', background: 'linear-gradient(105deg,#0B1F3A,#0F86CC)', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ position: 'relative' }}><p className="eyebrow" style={{ color: '#FFC93C' }}>A reminder for every educator</p><p style={{ margin: '0 auto 12px', maxWidth: 760, fontSize: '1.05rem', color: '#e5f2f8' }}>Larry’s goal is to help every teacher develop their ‘Unstoppable!’ power!</p><blockquote className="serif" style={{ maxWidth: 900, margin: '12px auto 0', fontSize: 'clamp(2rem,4.4vw,3.5rem)', lineHeight: 1.14, fontWeight: 600 }}>“Too many teachers are swimming in blessings and drowning in complaints.”</blockquote></div>
        </section>

        <section id="meet-larry" className="section-pad" style={{ background: '#F5F7FA' }}>
          <div className="container mobile-stack" style={{ display: 'grid', gridTemplateColumns: '.95fr 1.05fr', alignItems: 'center', gap: 66 }}>
            <div style={{ position: 'relative', padding: '0 0 24px 22px' }}>
              <div style={{ position: 'absolute', inset: '22px 0 0 0', border: '1px solid #0F86CC55' }} />
              <img src={larryStage} alt="Larry Bell, national presenter and education consultant, engaging a school audience" style={{ position: 'relative', display: 'block', width: '100%', maxHeight: 470, objectFit: 'cover', objectPosition: 'center 24%', boxShadow: '0 20px 45px #0b0f1428' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, background: '#0B1F3A', color: '#fff', padding: '17px 22px', fontWeight: 700 }}>National presenter. Personal purpose.</div>
            </div>
            <div>
              <p className="eyebrow">The person behind the presentation</p>
              <h2 className="section-title">Give Your Staff the Energy and Motivation They Need!</h2>
              <p className="section-lede" style={{ maxWidth: 'none' }}>More than ever before your teachers will need a positive start for the new school year. Larry gets them energized, re-focused, and feeling great by reminding them that a teacher’s greatest strength is the remarkable ability or capacity to adapt and inspire. With his ‘Unstoppable!’ workshops as a basis, thousands of teachers have been able to help students focus on a growth mindset and their resiliency. View Larry’s <a href="https://www.larry-bell.com/workshops/" style={{ color: '#0B1F3A', fontWeight: 700 }}>Presentations/Workshops</a> for suggested topics, or Larry can custom design a presentation around your theme. Contact Larry to see how he can start the school year off in a manner your teachers will appreciate.</p>
              <p style={{ font: 'italic 600 1.16rem/1.5 "Playfair Display",Georgia,serif', color: '#0B1F3A' }}>Larry is available to personally train and inspire your staff in his ‘Unstoppable!’ techniques!</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 23 }}>
                <a className="btn btn-red" href="tel:7039690156"><Phone size={16} /> 703.969.0156</a>
                <a className="btn" href="mailto:Larry@Larry-Bell.com" style={{ border: '1px solid #0B1F3A', color: '#0B1F3A' }}><Mail size={16} /> Larry@Larry-Bell.com</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container">
            <div style={{ maxWidth: 900 }}><h2 className="section-title">Larry Bell is Nationally Recognized as a Leading Educational Motivational Speaker, Consultant &amp; Author</h2><h3 style={{ font: '700 1.55rem/1.2 "Playfair Display",Georgia,serif', margin: '24px 0 0' }}>How Larry Bell can help your school</h3></div>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 13, marginTop: 30 }}>
              {[
                ['01', 'Do your teachers need to be uplifted, motivated and inspired?'],
                ['02', 'Do your teachers need help building relationships and creating an environment that can lead to safer schools?'],
                ['03', 'Do your teachers need strategies proven to increase student achievement while receiving inspiration and affirmation that they can reach every student?'],
                ['04', 'Do your teachers need strategies that are designed to immediately motivate and help your most struggling learners?'],
                ['05', 'Can your administrators benefit from an on-site Administrative Leadership Training Program that provides invaluable and challenging growth opportunities?'],
              ].map(([number, text]) => <article key={number} className="card" style={{ padding: '23px 19px', borderTop: '3px solid #0F86CC' }}><span className="eyebrow">{number}</span><p style={{ margin: '15px 0 0', color: '#40515c', fontSize: '.91rem', lineHeight: 1.6 }}>{text}</p></article>)}
            </div>
            <p style={{ maxWidth: 850, margin: '28px 0 0', color: '#0B1F3A', fontWeight: 700, lineHeight: 1.7 }}>Then you need Larry Bell. He has been working with schools and districts nationwide for 20+ years and the results have been incredible!</p>
          </div>
        </section>

        <section id="videos" className="section-pad" style={{ background: '#F5F7FA' }}>
          <div className="container">
            <p className="eyebrow">Videos</p><h2 className="section-title">Larry Bell</h2>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 23, maxWidth: 950 }}>
              <VideoCard title="Larry Bell; national presenter, educational consultant" videoId="dIdwGA6hQw8" />
              <VideoCard title="About Larry Bell" videoId="_smI8LgZDr8" />
            </div>
            <p style={{ fontSize: '.76rem', color: '#7c878e', marginTop: 14 }}>Video links are available by request.</p>
          </div>
        </section>

        <section id="workshops" className="section-pad" style={{ paddingTop: 78, paddingBottom: 78 }}>
          <div className="container">
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', alignItems: 'center', gap: 36, padding: 'clamp(28px,5vw,56px)', color: '#fff', background: 'linear-gradient(115deg,#0B0F14,#0B1F3A 80%)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'relative', zIndex: 1 }}><p className="eyebrow" style={{ color: '#FFC93C' }}>Bring the work to life</p><h2 className="section-title" style={{ marginTop: 10 }}>Educational Workshops</h2><p style={{ maxWidth: 590, color: '#dce7ec', lineHeight: 1.7 }}>Larry does many onsite workshops. He also does many other types of presentations.</p><a className="btn btn-red" href="https://www.larry-bell.com/workshops/">Read More <ArrowRight size={17} /></a></div>
              <div style={{ minHeight: 215, position: 'relative', display: 'grid', placeItems: 'center' }}><div style={{ position: 'absolute', inset: '5% 4% 0 4%', border: '1px solid #ffffff40', transform: 'rotate(4deg)' }} /><img src={larryStage} alt="Larry Bell presenting an educational workshop to teachers" style={{ position: 'relative', width: '100%', height: 250, objectFit: 'cover', objectPosition: 'center 22%', borderRadius: 4, boxShadow: '0 20px 45px #0005' }} /></div>
            </div>
          </div>
        </section>

        <section style={{ color: '#fff', background: '#0B0F14', padding: '88px 0' }}>
          <div className="container mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr .82fr', alignItems: 'center', gap: 50 }}>
            <div><p className="eyebrow" style={{ color: '#FFC93C' }}>Larry Bell Schools in the News</p><h2 className="section-title">Larry Bell Schools: The Creswell Experience</h2><p style={{ color: '#c8d3da', maxWidth: 650, lineHeight: 1.75 }}>There are many Larry Bell schools around the nation. Check out Creswell Elementary School in Shreveport, LA whose success made the news!</p><a href="https://www.larry-bell.com/the-creswell-experience/" className="btn btn-blue">Read the Creswell Experience <ArrowRight size={16} /></a></div>
            <a href="https://www.larry-bell.com/the-creswell-experience/" aria-label="Read about Larry Bell Schools: The Creswell Experience" style={{ padding: 25, border: '1px solid #ffffff25', background: 'linear-gradient(135deg,#0B1F3A,#0B0F14)', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', textDecoration: 'none' }}><span className="eyebrow" style={{ color: '#FFC93C' }}>Creswell Elementary School · Shreveport, LA</span><span className="serif" style={{ fontSize: '1.6rem', lineHeight: 1.3, margin: '25px 0' }}>The Creswell Experience</span><span style={{ color: '#b7c7d0', fontSize: '.78rem' }}>Read the school feature →</span></a>
          </div>
        </section>

        <section id="reviews" className="section-pad" style={{ background: '#F5F7FA' }}>
          <div className="container"><h2 className="section-title">Hear What Our Clients Have to Say About Larry</h2>
            <div className="testimonial-rail" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              <TestimonialCard name="Jesse Najera" role="Principal — Adelanto Elementary School, Adelanto, CA" videoId="ZZtBkOrB5R0" />
              <TestimonialCard name="Nathan Currie" role="Principal — Isenberg Elementary School, Salisbury, NC" videoId="0WpJIKeXHqY" />
              <TestimonialCard name="Lesa Scillion and Vikki Hayslett" role="School Administrators — Obion County Schools" videoId="t6lsAj2h78c" />
            </div>
          </div>
        </section>

        <section id="programs" className="section-pad" style={{ paddingTop: 82, paddingBottom: 82 }}>
          <div className="container news-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <article style={{ padding: '34px 35px', background: '#0B0F14', color: '#fff', minHeight: 270, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <p className="eyebrow" style={{ color: '#FFC93C' }}>A path for your school</p><h2 className="serif" style={{ fontSize: '1.9rem', lineHeight: 1.15, margin: '7px 0 12px' }}>How to Become a Larry Bell School/District</h2><p style={{ color: '#F5F7FA', lineHeight: 1.65 }}>For schools and districts that want to get maximum benefit from Larry Bell’s philosophy and strategies Larry has developed his Fundamental Strategies Program.</p><a href="https://www.larry-bell.com/becoming-a-larry-bell-school/" className="btn btn-blue" style={{ marginTop: 'auto' }}>Learn more <ArrowRight size={16} /></a>
            </article>
            <article style={{ padding: '34px 35px', background: 'linear-gradient(125deg,#0B1F3A,#0F86CC)', color: '#fff', minHeight: 270, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <p className="eyebrow" style={{ color: '#FFC93C' }}>The latest on Larry</p><h2 className="serif" style={{ fontSize: '1.9rem', lineHeight: 1.15, margin: '7px 0 12px' }}>The Latest on Larry</h2><p style={{ color: '#F5F7FA', lineHeight: 1.65 }}>Larry still has some dates available. Contact us by <a href="mailto:Larry@Larry-Bell.com" style={{ color: '#fff', fontWeight: 700 }}>email</a> or give us a <a href="tel:7039690156" style={{ color: '#fff', fontWeight: 700 }}>call</a> to talk about specifics.</p><a href="mailto:Larry@Larry-Bell.com" className="btn btn-red" style={{ marginTop: 'auto' }}>Email Larry <ArrowRight size={16} /></a>
            </article>
          </div>
        </section>

        <section id="contact" className="section-pad" style={{ background: 'linear-gradient(120deg,#0B0F14,#0B1F3A 70%,#0F86CC)', color: '#fff' }}>
          <div className="container">
            <div style={{ maxWidth: 720, marginBottom: 34 }}><p className="eyebrow" style={{ color: '#FFC93C' }}>Start a conversation</p><h2 className="section-title">Ready to Make Your Teachers Unstoppable?</h2><p style={{ color: '#F5F7FA', lineHeight: 1.7 }}>Tell us a little about your school and what you’re planning. Larry’s team will be glad to hear from you.</p></div>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 38, alignItems: 'start' }}>
              <Form {...inquiryForm}>
              <form noValidate onSubmit={inquiryForm.handleSubmit(handleSubmit)} data-testid="form-contact-inquiry" style={{ background: '#ffffff0c', border: '1px solid #ffffff25', borderRadius: 8, padding: 'clamp(22px,4vw,36px)' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 17 }}>
                  <FormField control={inquiryForm.control} name="name" render={({ field }) => <FormItem style={labelStyle}><FormLabel style={labelStyle}>Name *</FormLabel><FormControl><input {...field} autoComplete="name" placeholder="Your name" style={inputStyle} data-testid="input-inquiry-name" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                  <FormField control={inquiryForm.control} name="school" render={({ field }) => <FormItem style={labelStyle}><FormLabel style={labelStyle}>School / District *</FormLabel><FormControl><input {...field} autoComplete="organization" placeholder="School or district" style={inputStyle} data-testid="input-inquiry-school" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                  <FormField control={inquiryForm.control} name="email" render={({ field }) => <FormItem style={labelStyle}><FormLabel style={labelStyle}>Email *</FormLabel><FormControl><input {...field} type="email" autoComplete="email" placeholder="you@school.org" style={inputStyle} data-testid="input-inquiry-email" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                  <FormField control={inquiryForm.control} name="phone" render={({ field }) => <FormItem style={labelStyle}><FormLabel style={labelStyle}>Phone</FormLabel><FormControl><input {...field} type="tel" autoComplete="tel" placeholder="703.555.0123" style={inputStyle} data-testid="input-inquiry-phone" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                  <FormField control={inquiryForm.control} name="date" render={({ field }) => <FormItem style={labelStyle}><FormLabel style={labelStyle}>Preferred date</FormLabel><FormControl><input {...field} type="date" style={inputStyle} data-testid="input-inquiry-date" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                  <FormField control={inquiryForm.control} name="message" render={({ field }) => <FormItem style={{ ...labelStyle, gridColumn: '1 / -1' }}><FormLabel style={labelStyle}>Message *</FormLabel><FormControl><textarea {...field} rows={4} placeholder="Tell us about your event, audience, or goals." style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }} data-testid="input-inquiry-message" /></FormControl><FormMessage style={formMessageStyle} /></FormItem>} />
                </div>
                <p style={{ fontSize: '.75rem', color: '#c1d2dc', margin: '14px 0 18px' }}>* Required fields</p>
                <button className="btn btn-red btn-shine" type="submit" style={{ border: 0 }} data-testid="button-submit-inquiry">Send an inquiry <ArrowRight size={17} /></button>
              </form>
              </Form>
              <aside style={{ padding: '26px 0' }}>
                <h3 className="serif" style={{ fontSize: '1.6rem', margin: '0 0 18px' }}>Connect with Larry</h3>
                <p style={{ color: '#d4e3eb', lineHeight: 1.6 }}>Call or email to discuss your school’s needs and upcoming dates.</p>
                <a href="tel:7039690156" style={contactLink}><Phone size={19} /><span><small style={contactSmall}>CALL</small><strong>703.969.0156</strong></span></a>
                <a href="mailto:Larry@Larry-Bell.com" style={contactLink}><Mail size={19} /><span><small style={contactSmall}>EMAIL</small><strong>Larry@Larry-Bell.com</strong></span></a>
                <img src={larryStage} alt="Larry Bell on stage, ready to connect with educators" loading="lazy" style={{ width: '100%', height: 190, objectFit: 'cover', objectPosition: 'center 20%', marginTop: 24, border: '1px solid #ffffff50' }} />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <footer style={{ background: '#0B0F14', color: '#fff', padding: '56px 0 23px' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 35, paddingBottom: 38, borderBottom: '1px solid #ffffff1d' }}>
            <div><Brand /><p style={{ color: '#aebbc4', lineHeight: 1.7, fontSize: '.82rem', maxWidth: 285, marginTop: 18 }}>Empowering educators to bring energy, purpose, and hope to the work that matters.</p></div>
            <div><p className="eyebrow" style={{ color: '#FFC93C' }}>Contact</p><address style={{ fontStyle: 'normal', color: '#c2cdd4', lineHeight: 1.8, fontSize: '.82rem' }}>Empowering Presentations Inc.<br />12689 Crossbow Dr.<br />Manassas, VA 20112</address><a href="tel:7039690156" style={footerLink}>Call 703.969.0156</a><span style={footerLink}>Fax 866.590.3767</span><a href="mailto:larry@larry-bell.com" style={footerLink}>larry@larry-bell.com</a><p style={{ color: '#aebbc4', fontSize: '.75rem', lineHeight: 1.6, marginTop: 16 }}>Serving California, Tennessee, Texas, Louisiana, Arkansas, and Oklahoma.</p></div>
             <div><p className="eyebrow" style={{ color: '#FFC93C' }}>Explore</p>{navigation.map(([label, href]) => <a key={label} href={href} style={footerLink} data-testid={`footer-nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{label}</a>)}</div>
             <div><p className="eyebrow" style={{ color: '#FFC93C' }}>Connect with us</p><div className="social-links">
               <a href="https://www.facebook.com/LarryiBell" target="_blank" rel="noreferrer" aria-label="Larry Bell on Facebook"><FaFacebookF /></a>
               <a href="https://www.youtube.com/@larrybelleducation/videos" target="_blank" rel="noreferrer" aria-label="Larry Bell on YouTube"><FaYoutube /></a>
               <a href="https://linkedin.com/in/larrybellspeaker" target="_blank" rel="noreferrer" aria-label="Larry Bell on LinkedIn"><FaLinkedinIn /></a>
               <a href="https://x.com/GoodGuhGaMooGah" target="_blank" rel="noreferrer" aria-label="Larry Bell on X"><FaXTwitter /></a>
             </div><p className="serif" style={{ fontSize: '1.15rem', lineHeight: 1.5, color: '#e8edf0', marginTop: 18 }}>Somebody Needs You!</p><a href="#contact" className="btn btn-red" style={{ minHeight: 43, padding: '0 15px', fontSize: '.8rem' }}>Bring Larry to your school</a></div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, color: '#84919a', fontSize: '.73rem', paddingTop: 20 }}><span>© 2026 Empowering Presentations Inc. All rights reserved.</span><a href="#home" style={{ color: '#b6c3cb', textDecoration: 'none' }}>Back to top ↑</a></div>
        </div>
      </footer>
      <a href="#contact" className="mobile-float-book">Book Larry <ArrowRight size={16} /></a>
      {showTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" style={{ position: 'fixed', zIndex: 40, right: 22, bottom: 22, width: 48, height: 48, background: '#C8302F', color: '#fff', border: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 5px 18px #0004', cursor: 'pointer' }}><ArrowUp size={19} /></button>}
      {toast && <div role="status" aria-live="polite" className="toast">{toast}</div>}
    </>
  );
}

const labelStyle = { display: 'grid', gap: 8, color: '#fff', fontSize: '.83rem', fontWeight: 700 } as const;
const formMessageStyle = { color: '#ffd7d7', fontSize: '.75rem' } as const;
const inputStyle = { width: '100%', minHeight: 48, border: '1px solid #ffffff4a', borderRadius: 4, padding: '12px 13px', background: '#0B1F3A', color: '#fff', fontSize: '.9rem', outlineColor: '#FFC93C' } as const;
const contactLink = { display: 'flex', gap: 14, alignItems: 'center', marginTop: 22, color: '#fff', textDecoration: 'none' } as const;
const contactSmall = { display: 'block', color: '#FFC93C', fontSize: '.65rem', letterSpacing: '.13em', marginBottom: 3 } as const;
const footerLink = { display: 'block', color: '#c2cdd4', textDecoration: 'none', fontSize: '.81rem', marginTop: 10 } as const;

function AnimatedMetric({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) {
      setCount(target);
      return;
    }
    const startedAt = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / 800, 1);
      setCount(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, target]);

  return <div><strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFC93C' }}>{count}{suffix}</strong><span style={{ fontSize: '.72rem', color: '#F5F7FA' }}>{label}</span></div>;
}

function App() {
  return <Home />;
}

export default App;
