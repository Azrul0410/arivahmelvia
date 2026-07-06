import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ChevronLeft, ChevronRight, X, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "loading" | "welcome" | "gate" | "photo" | "timeline" | "gallery" | "letter" | "countdown";

const PAGE_ORDER: Page[] = ["welcome", "gate", "photo", "timeline", "gallery", "letter", "countdown"];

// ─── Data ─────────────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
   {
    id: "together_photo",
    emoji: "❤️",
    title: "Pertama Kali Foto Berdua",
    date: "Awal Cerita",
    photo: "/Foto Kami/Pertama Kali Foto Ber 2/Pertama Foto Ber 2.webp",
    story:
      "Pertama kali kita memberanikan diri untuk berfoto berdua saja. Momen sederhana ini menjadi awal dari kedekatan kita.",
  },
  {
    id: "meet",
    emoji: "📅",
    title: "Akhir Masa Abu"",
    date: "Perpisahan SMA",
    photo: "/Foto Kami/Perpisahan SMA/IMG-20230620-WA0009.jpg",
    story:
      "Awal mula kisah kita saat perpisahan SMA. Masih ingat waktu pertama kali kita berfoto bersama? Rasanya canggung tapi sangat berkesan.",
  },
  {
    id: "date",
    emoji: "🌸",
    title: "Date Pertama Setelah Jadian",
    date: "27 Juli 2024",
    photo: "/Foto Kami/Date Pertama Setelah Jadian/IMG20240727221814.jpg",
    story:
      "Kencan pertama kita yang penuh tawa dan kebahagiaan. Waktu terasa berjalan sangat cepat saat aku bersamamu.",
  },
  {
    id: "holding_hands",
    emoji: "🚗",
    title: "Momen di Mobil",
    date: "Momen Manis",
    photo: "/Foto Kami/Foto Pegangan Tangan Di Mobil/1739187903548.jpg",
    story:
      "Genggaman tangan hangat di dalam mobil, memberikan rasa tenang dan meyakinkan bahwa kita akan melalui segalanya bersama.",
  },
  {
    id: "kkn",
    emoji: "🥺",
    title: "Foto Terakhir Sebelum LDR Again",
    date: "17 Mei 2026",
    photo: "/Foto Kami/Foto Terakhir sebelum kkn/IMG-20260517-WA0029.jpg",
    story:
      "Momen perpisahan sementara untuk pendidikan masing. Sedih rasanya harus berjauhan, tapi aku tahu ini untuk kebaikanmu.",
  },
];

const GALLERY_ITEMS = [
  { id: 1, photo: "/Foto Kami/Date Pertama Setelah Jadian/IMG20240727221814.jpg", caption: "Date pertama setelah jadian ❤️" },
  { id: 2, photo: "/Foto Kami/DB 1 sama isek/IMG-20250201-WA0036.jpg", caption: "Momen seru bareng 🌸" },
  { id: 3, photo: "/Foto Kami/First dia Ke BL/IMG-20240618-WA0010.jpg", caption: "Dia pertama kali ke BL ✨" },
  { id: 4, photo: "/Foto Kami/Foto Terakhir sebelum kkn/IMG-20260517-WA0066.jpg", caption: "Foto terakhir sebelum kamu berangkat KKN 🥺" },
  { id: 5, photo: "/Foto Kami/Main Di Taplau/IMG20250604182704.jpg", caption: "Main di Taplau menikmati sore 🌅" },
  { id: 6, photo: "/Foto Kami/OTW Bukit/IMG20250406185136.jpg", caption: "OTW Bukit seru-seruan bareng ⛰️" },
  { id: 7, photo: "/Foto Kami/Pap kamu Terbaru/IMG-20260706-WA0006.jpg", caption: "Pap terbaru kamu yang paling manis 💕" },
  { id: 8, photo: "/Foto Kami/Pergi Ke Pesta Pernikahan/IMG-20250823-WA0016.jpg", caption: "Pergi kondangan bareng 🤵♂️👰♀️" },
  { id: 9, photo: "/Foto Kami/Saat Membuat Video Pepisahan/20230122_214954.jpg", caption: "Waktu bikin video perpisahan sekolah 🎓" },
  { id: 10, photo: "/Foto Kami/Waktu sama circle kamu/IMG-20250629-WA0006.jpg", caption: "Kumpul seru bareng circle kamu 🌸" },
  { id: 11, photo: "/Foto Kami/Pertama Kali Pergi Jauh/IMG-20250514-WA0152.jpg", caption: "Perjalanan pertama kali kita pergi jauh 🚗" },
  { id: 12, photo: "/Foto Kami/Saat Kamu Ke Alahan Panjang/Picsart_23-07-03_11-30-24-488.jpg", caption: "Saat kamu berlibur ke Alahan Panjang ❄️" },
];

const LETTER_PARAGRAPHS = [
  "Adek Sayang,",
  "Kalau Adek lagi baca ini, mungkin Adek lagi ngerasa capek banget sama semua rutinitas KKN di sana... Mungkin juga sinyal lagi susah, Adek lagi kangen rumah, kangen keluarga, atau sekadar kangen rebahan tenang di kasur sendiri.",
  "Tapi Abg mau Adek selalu tahu satu hal — dari jauh ini, pikiran Abg nggak pernah absen buat nemenin Adek. Setiap hari, tanpa pernah gagal, Adek selalu ada di kepala Abg.",
  "Abg bangga banget sama Adek. Bangga sama setiap perjuangan kecilmu di sana, sama cara Adek tetap bertahan meski badan udah capek, dan sama senyum Adek yang nggak pernah pudar.",
  "Adek nggak pernah perlu jadi sempurna buat Abg. Cukup jadi diri Adek sendiri — karena bagi Abg, semesta Abg udah lengkap dan lebih dari cukup waktu sama Adek.",
  "Nanti kalau waktu pulang itu udah tiba, siap-siap ya, Abg bakal peluk Adek erat-erat buat ngelepas semua rasa kangen yang udah numpuk ini.",
  "Jaga diri Adek baik-baik ya di sana, Sayang. Jangan sampai telat makan, dan usahain tidur yang cukup. Inget terus — di sini, ada Abg yang selalu setia nungguin Adek pulang. ❤️",
  "Dengan seluruh cinta yang Abg punya, Azrul",
];
const TARGET_DATE = new Date("2026-08-01T00:00:00");

// ─── Hook: Countdown ──────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
}

// ─── Page: Loading ────────────────────────────────────────────────────────────

function LoadingPage({ onDone }: { onDone: () => void }) {
  const [loadingText, setLoadingText] = useState("Memuat kenangan...");

  useEffect(() => {
    const textStates = [
      "Mengumpulkan momen indah...",
      "Menyusun galeri foto...",
      "Menulis surat untukmu...",
      "Menghubungkan hati kita...",
      "Selesai! ❤️",
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < textStates.length - 1) {
        step++;
        setLoadingText(textStates[step]);
      }
    }, 700);

    const t = setTimeout(onDone, 3800);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [onDone]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-8 bg-background px-6">
      <motion.div
        animate={{ scale: [1, 1.28, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-16 h-16 text-primary fill-primary filter drop-shadow-[0_0_12px_rgba(201,120,136,0.5)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <h1 className="font-display text-4xl md:text-5xl text-foreground italic tracking-wide">
          A Journey of Us
        </h1>
        <p className="text-muted-foreground text-sm tracking-[0.2em] font-medium min-h-[1.5rem]">
          {loadingText}
        </p>
      </motion.div>

      <div className="w-48 h-1 bg-primary/20 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}

// ─── Page: Welcome ────────────────────────────────────────────────────────────

const BG_HEARTS = [
  { left: "7%", top: "11%", size: 80, delay: 0 },
  { left: "83%", top: "8%", size: 55, delay: 0.6 },
  { left: "17%", top: "79%", size: 100, delay: 1.1 },
  { left: "73%", top: "80%", size: 48, delay: 1.6 },
  { left: "44%", top: "4%", size: 68, delay: 0.3 },
  { left: "91%", top: "48%", size: 42, delay: 0.9 },
  { left: "3%", top: "46%", size: 36, delay: 1.4 },
];

function WelcomePage({ onNext, startMusic }: { onNext: () => void; startMusic: () => void }) {
  const handleEnter = () => {
    startMusic();
    onNext();
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-10 bg-background relative overflow-hidden px-6">
      {BG_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none text-primary"
          style={{ left: h.left, top: h.top, fontSize: h.size, opacity: 0.05 }}
          animate={{ y: [0, -22, 0], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 4.5 + i * 0.5, repeat: Infinity, delay: h.delay, ease: "easeInOut" }}
        >
          ♥
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-center z-10"
      >
        <motion.p
          animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl mb-5"
        >
          ❤️
        </motion.p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground italic mb-4 leading-tight">
          Welcome, Sayang
        </h1>
        <p className="text-muted-foreground text-lg max-w-xs mx-auto leading-relaxed">
          Ada sesuatu yang ingin aku tunjukkan kepadamu...
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        onClick={handleEnter}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="z-10 px-10 py-4 border border-primary text-primary font-display italic text-xl rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(201,120,136,0.15)] cursor-pointer"
      >
        Enter <ChevronRight className="w-5 h-5 not-italic" />
      </motion.button>
    </div>
  );
}

// ─── Page: Gate ───────────────────────────────────────────────────────────────

function GatePage({ onNext }: { onNext: () => void }) {
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);

  const dodgeNoButton = () => {
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 150;
    setNoBtnPos({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  const getNoButtonText = () => {
    if (noCount === 0) return "Nggak siap... 🥺";
    if (noCount === 1) return "Yakin? 😢";
    if (noCount === 2) return "Beneran nih? 😭";
    if (noCount === 3) return "Harus siap! 😡";
    return "Gabisa diklik! 😜";
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-10 bg-background px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.84 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-sm z-10"
      >
        <p className="text-5xl mb-6">🔑</p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground italic mb-4 leading-snug">
          Sebelum lanjut, jawab dulu ya...
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Apakah kamu siap untuk menyelami kenangan indah kita bersama?
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full max-w-xs">
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-primary text-primary-foreground font-medium text-lg rounded-full shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{ boxShadow: "0 10px 40px rgba(201,120,136,0.3)" }}
        >
          Aku siap! ❤️
        </motion.button>

        <motion.button
          animate={{ x: noBtnPos.x, y: noBtnPos.y }}
          onMouseEnter={dodgeNoButton}
          onTouchStart={dodgeNoButton}
          onClick={dodgeNoButton}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full py-4 border border-muted-foreground/30 text-muted-foreground font-medium text-base rounded-full hover:bg-card/40 transition-all"
        >
          {getNoButtonText()}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Page: Photo Moment ───────────────────────────────────────────────────────

function PhotoPage({ onNext }: { onNext: () => void }) {
  const [textVisible, setTextVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 1200);
    const t2 = setTimeout(() => setBtnVisible(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-8 bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, rotate: -6, scale: 0.93 }}
        animate={{ opacity: 1, rotate: -2, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-sm bg-[#faf0ec] p-4 pb-8 shadow-2xl rounded-sm border border-neutral-200 text-[#1a0c10]"
      >
        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-primary/20 backdrop-blur-xs border border-primary/10 rotate-1 shadow-sm opacity-80" />

        <div className="aspect-square w-full overflow-hidden bg-neutral-900 rounded-xs mb-4">
          <img
            src="/Foto Kami/Pertama Kali Foto Ber 2/Pertama Foto Ber 2.webp"
            alt="Momen istimewa kita"
            className="w-full h-full object-cover grayscale-30 contrast-110"
          />
        </div>

        {/* Handwritten text */}
        <div className="text-center font-handwritten text-3xl text-neutral-800 tracking-wide mt-2">
          Momen terindah kita... ✨
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 14 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center mt-4"
      >
        <h2 className="font-display text-3xl text-foreground italic">
          &ldquo;Masih ingat hari ini?&rdquo;
        </h2>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: btnVisible ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 border border-primary/60 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 cursor-pointer shadow-md"
      >
        Iya, aku ingat <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── Page: Timeline ───────────────────────────────────────────────────────────

function TimelinePage({ onNext }: { onNext: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-background px-6 py-16 pb-24 relative">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Perjalanan Kita</span>
          <h2 className="font-display text-4xl text-foreground italic mt-2 mb-2">Linimasa Kenangan</h2>
          <p className="text-muted-foreground text-sm">Ketuk setiap momen untuk membuka kenangan</p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-[27px] top-4 bottom-4 w-0.5"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(201,120,136,0.4) 15%, rgba(201,120,136,0.4) 85%, transparent)",
            }}
          />
          <div className="space-y-4">
            {TIMELINE_EVENTS.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 ${
                    openId === event.id
                      ? "border-primary bg-card/85 shadow-lg shadow-primary/5"
                      : "border-border bg-card/40 hover:bg-card/60"
                  } backdrop-blur-md overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenId(openId === event.id ? null : event.id)}
                    className="w-full text-left pl-16 pr-4 py-5 relative group flex items-center justify-between"
                  >
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-all duration-300 ${
                        openId === event.id
                          ? "border-primary bg-primary text-primary-foreground scale-110"
                          : "border-primary/30 bg-background group-hover:border-primary/60"
                      }`}
                    >
                      {event.emoji}
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium text-base">{event.title}</h3>
                      <p className="text-muted-foreground text-xs mt-0.5">{event.date}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 ${
                        openId === event.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {openId === event.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-primary/10">
                          <div className="rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-primary/10 shadow-inner">
                            <img src={event.photo} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed font-sans">{event.story}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={onNext}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
          >
            Lihat Galeri <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page: Gallery ────────────────────────────────────────────────────────────

function GalleryPage({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem("journey_likes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleLike = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newLikes = { ...likes, [id]: (likes[id] || 0) + 1 };
    setLikes(newLikes);
    localStorage.setItem("journey_likes", JSON.stringify(newLikes));

    confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
  };

  return (
    <div className="min-h-[100dvh] bg-background px-4 py-16 pb-24">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-sans">Momen Indah</span>
          <h2 className="font-display text-4xl text-foreground italic mt-2 mb-2">Galeri Foto</h2>
          <p className="text-muted-foreground text-sm">Ketuk foto untuk memperbesar dan kirim cinta</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-12">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => setSelected(item)}
              className="aspect-square rounded-2xl overflow-hidden relative group border border-border bg-card shadow-sm hover:border-primary/40 active:scale-95 transition-all duration-300"
            >
              <img src={item.photo} alt={item.caption} className="w-full h-full object-cover" />

              {/* Floating like counter */}
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-border shadow-xs">
                <Heart className={`w-3.5 h-3.5 text-primary ${likes[item.id] ? "fill-primary" : ""}`} />
                <span className="text-[10px] font-sans font-medium text-foreground">{likes[item.id] || 0}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-3 pt-6 flex items-end justify-between">
                <p className="text-foreground text-[11px] font-medium text-left truncate max-w-[70%]">{item.caption}</p>
                <button
                  onClick={(e) => handleLike(item.id, e)}
                  className="p-1.5 rounded-full bg-primary/20 backdrop-blur-md hover:bg-primary/40 active:scale-90 transition-all text-primary"
                >
                  <Heart className="w-3.5 h-3.5 fill-primary" />
                </button>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
          >
            Baca Suratku <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full bg-card rounded-2xl overflow-hidden border border-border shadow-2xl"
            >
              <div className="aspect-square relative">
                <img src={selected.photo} alt={selected.caption} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-md text-foreground border border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 flex items-center justify-between gap-4">
                <p className="text-foreground text-sm font-sans leading-relaxed">{selected.caption}</p>
                <button
                  onClick={() => handleLike(selected.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-all text-primary text-sm font-semibold"
                >
                  <Heart className="w-4 h-4 fill-primary" />
                  <span>{likes[selected.id] || 0}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page: Letter ─────────────────────────────────────────────────────────────

function LetterPage({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    if (visibleCount >= LETTER_PARAGRAPHS.length) {
      const t = setTimeout(() => setDone(true), 800);
      return () => clearTimeout(t);
    }
    const delay = visibleCount === 0 ? 500 : 2200;
    const t = setTimeout(() => setVisibleCount((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [opened, visibleCount]);

  return (
    <div className="min-h-[100dvh] bg-background px-6 py-16 pb-28 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            /* Envelope Cover */
            <motion.div
              key="envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={() => setOpened(true)}
              className="w-full aspect-[4/3] bg-card rounded-2xl border border-primary/20 shadow-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 relative overflow-hidden group p-6"
              style={{ background: "linear-gradient(135deg, #1c0d12 0%, #2a1520 100%)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-primary"
              >
                <Heart className="w-16 h-16 text-primary fill-primary/30 group-hover:scale-110 transition-transform duration-300" />
              </motion.div>

              <div className="text-center">
                <h3 className="font-display text-2xl text-foreground italic">Surat Untukmu</h3>
                <p className="text-muted-foreground text-sm mt-1 tracking-wider">Ketuk untuk membuka amplop 💌</p>
              </div>
            </motion.div>
          ) : (
            /* Letter Content */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="w-full flex flex-col"
            >
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-sans">Sepenuh Hati</span>
                <h2 className="font-display text-4xl text-foreground italic mt-2">Surat Dari Aku</h2>
              </div>

              <div
                className="rounded-2xl border border-primary/15 p-6 md:p-8 min-h-64 shadow-xl"
                style={{
                  background: "rgba(28,13,18,0.5)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 20px 60px rgba(201,120,136,0.06)",
                }}
              >
                <div className="space-y-4">
                  {LETTER_PARAGRAPHS.slice(0, visibleCount).map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`leading-relaxed ${
                        i === 0
                          ? "font-display italic text-2xl text-foreground"
                          : i === LETTER_PARAGRAPHS.length - 1
                          ? "font-display italic text-foreground/80 mt-8"
                          : "text-muted-foreground font-sans text-sm md:text-base"
                      }`}
                    >
                      {para}
                    </motion.p>
                  ))}
                  {!done && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-primary align-middle ml-0.5"
                    />
                  )}
                </div>
              </div>

              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex justify-center mt-10"
                >
                  <button
                    onClick={onNext}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                  >
                    Satu lagi untukmu <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Page: Countdown ──────────────────────────────────────────────────────────

function CountdownPage() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  const units = [
    { value: days, label: "Hari" },
    { value: hours, label: "Jam" },
    { value: minutes, label: "Menit" },
    { value: seconds, label: "Detik" },
  ];

  const handleVirtualHug = () => {
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-12 bg-background px-6 py-16 relative">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-sans">Hitung Mundur</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground italic mt-2 mb-2">Tinggal...</h2>
        <p className="text-muted-foreground text-sm">Sampai aku bisa peluk kamu lagi ❤️</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-4 gap-2.5 max-w-sm w-full mx-auto"
      >
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square bg-card/65 border border-primary/25 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-md"
              style={{ boxShadow: "0 0 20px rgba(201,120,136,0.08)" }}
            >
              <span className="font-display text-2xl md:text-3xl text-primary font-medium tabular-nums drop-shadow-[0_0_8px_rgba(201,120,136,0.4)]">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-muted-foreground text-[10px] tracking-wider uppercase font-semibold">{label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-6 max-w-xs z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={handleVirtualHug}
        >
          <Heart className="w-12 h-12 text-primary fill-primary filter drop-shadow-[0_0_15px_rgba(201,120,136,0.6)] mx-auto" />
        </motion.div>

        <p className="text-muted-foreground text-sm leading-relaxed font-sans">
          Nggak sabar banget. Cepat pulang ya, Sayang.
          <br />
          Aku selalu kangen kamu di sini.
        </p>

        <button
          onClick={handleVirtualHug}
          className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-full shadow-lg shadow-primary/20 hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Kirim Pelukan Virtual 💖
        </button>
      </motion.div>
    </div>
  );
}

// ─── Nav Controls ─────────────────────────────────────────────────────────────

interface NavControlsProps {
  current: Page;
  onChangePage: (page: Page) => void;
}

function NavControls({ current, onChangePage }: NavControlsProps) {
  const idx = PAGE_ORDER.indexOf(current);
  if (idx < 0) return null;

  const handlePrev = () => {
    if (idx > 0) {
      onChangePage(PAGE_ORDER[idx - 1]);
    }
  };

  const handleNext = () => {
    if (idx < PAGE_ORDER.length - 1) {
      onChangePage(PAGE_ORDER[idx + 1]);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-card/60 border border-primary/15 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
      <button
        onClick={handlePrev}
        disabled={idx === 0}
        className="text-primary disabled:opacity-30 disabled:pointer-events-none p-1 hover:scale-110 active:scale-90 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {PAGE_ORDER.map((p) => (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              p === current ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/60"
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={idx === PAGE_ORDER.length - 1}
        className="text-primary disabled:opacity-30 disabled:pointer-events-none p-1 hover:scale-110 active:scale-90 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => {
    const a = new Audio("https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3");
    a.loop = true;
    return a;
  });

  const startMusic = () => {
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log("Audio play failed, user interaction needed:", err);
    });
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  const go = (p: Page) => setPage(p);

  return (
    <div className="min-h-[100dvh] bg-background overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Background music toggle button */}
      {page !== "loading" && (
        <button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-card/75 border border-primary/20 backdrop-blur-md text-primary shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <VolumeX className="w-5 h-5 opacity-60" />
          )}
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.42, ease: "easeInOut" }}
          className="min-h-[100dvh]"
        >
          {page === "loading" && <LoadingPage onDone={() => go("welcome")} />}
          {page === "welcome" && <WelcomePage onNext={() => go("gate")} startMusic={startMusic} />}
          {page === "gate" && <GatePage onNext={() => go("photo")} />}
          {page === "photo" && <PhotoPage onNext={() => go("timeline")} />}
          {page === "timeline" && <TimelinePage onNext={() => go("gallery")} />}
          {page === "gallery" && <GalleryPage onNext={() => go("letter")} />}
          {page === "letter" && <LetterPage onNext={() => go("countdown")} />}
          {page === "countdown" && <CountdownPage />}
        </motion.div>
      </AnimatePresence>

      {page !== "loading" && <NavControls current={page} onChangePage={go} />}
    </div>
  );
}

