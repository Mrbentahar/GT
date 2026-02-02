// A. إعدادات محاكاة المكتبات (في مشروع حقيقي يتم الاستيراد: import React, { useState, ... } from 'react';)
const { useState, useEffect, useContext, createContext, useRef, useMemo } = React;
const { createRoot } = ReactDOM; // افتراض أن ReactDOM مُعرّف
const { Sun, Moon, PhoneOff, MapPinOff, Clock, Frown, Bot, Settings, Globe, Trash2, ArrowRight } = Lucide; // افتراض أن Lucide مُعرّف

// ----------------------------------------------------
// I. إدارة الحالة واللغة (Context and Language Hook)
// ----------------------------------------------------

const LanguageContext = createContext();

// 1. مزود اللغة (LanguageProvider - Ah)
function LanguageProvider({ children }) {
    // التحقق من localStorage لتفضيلات اللغة
    const initialLang = localStorage.getItem('lang') || 'ar';
    const [lang, setLang] = useState(initialLang);
    const [isDarkMode, setIsDarkMode] = useState(true); // تحديد Dark Mode كافتراضي

    useEffect(() => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    }, [lang]);

    useEffect(() => {
        // إدارة وضع الإضاءة/الظلام
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleLang = () => {
        setLang(prevLang => prevLang === 'ar' ? 'en' : 'ar');
    };

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // المحتوى الحالي والاتجاه
    const content = useMemo(() => _e[lang], [lang]);

    return (
        <LanguageContext.Provider value={{ lang, content, toggleLang, isDarkMode, toggleTheme }}>
            {children}
        </LanguageContext.Provider>
    );
}

// 2. استخدام اللغة (useLanguage - Ft)
const useLanguage = () => useContext(LanguageContext);

// ----------------------------------------------------
// II. المكونات المساعدة (Utility Components)
// ----------------------------------------------------

// مكون الرسوم المتحركة (bl / IntersectionObserver)
// يستخدم Tailwind classes مثل 'fade-up' ضمن className
function AnimatedComponent({ children, className = "", delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(ref.current); // التوقف عن المراقبة بعد الظهور
            }
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        ref.current && observer.observe(ref.current);
        return () => {
             // تنظيف المراقبة عند إزالة المكون
             if(ref.current) observer.unobserve(ref.current);
        };
    }, []);

    const baseClasses = `transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`;

    return (
        <div
            ref={ref}
            className={`${baseClasses} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// 3. مكون المودال (Booking Modal - D1)
function BookingModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    
    // محاكاة لـ Typebot/External Booking Service
    const modalTitle = useLanguage().lang === 'ar' ? "ابدأ طلب الجمع الآلي" : "Start Automated Collection Request";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg h-[90%] md:h-[600px] flex flex-col p-4 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300">{modalTitle}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {/* iframe محاكاة Typebot */}
                <iframe 
                    src="https://typebot-viewer.panel.sotech.space/eco-crm-booking" 
                    className="flex-grow w-full mt-4 rounded-lg border border-gray-300 dark:border-gray-600"
                    title="Automated Waste Collection Bot"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                ></iframe>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// III. مكونات أقسام الصفحة (Page Sections - A1, T1, N1, etc.)
// ----------------------------------------------------

// 4. شريط التنقل (Navigation Bar)
function NavigationBar() {
    const { content, toggleLang, isDarkMode, toggleTheme, lang } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md transition-colors duration-300">
            <div className="container mx-auto px-4 flex items-center justify-between h-20">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 cursor-pointer">
                    <Trash2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <span className="font-extrabold text-2xl text-gray-900 dark:text-white">Eco-CRM</span>
                </a>
                
                {/* Desktop Links */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#hero" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">{content.nav.home}</a>
                    <a href="#solution" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">{content.nav.solution}</a>
                    <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">{content.nav.contact}</a>
                    
                    {/* Theme Toggle Button */}
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-800 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle Theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    {/* Language Toggle Button */}
                    <button onClick={toggleLang} className="text-gray-700 dark:text-gray-300 font-bold px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        {content.nav.langToggle}
                    </button>
                </nav>

                {/* Mobile Menu Button (Hamburger) */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                </button>
            </div>
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <nav className="md:hidden flex flex-col items-center pb-4 bg-white dark:bg-gray-900 shadow-lg">
                    <a href="#hero" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 w-full text-center">{content.nav.home}</a>
                    <a href="#solution" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 w-full text-center">{content.nav.solution}</a>
                    <a href="#contact" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 w-full text-center">{content.nav.contact}</a>
                    <div className="flex gap-4 pt-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-800 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle Theme">
                            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        <button onClick={toggleLang} className="text-gray-700 dark:text-gray-300 font-bold px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            {content.nav.langToggle}
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
}

// 5. قسم البطل (Hero Section - A1)
function HeroSection({ openModal }) {
    const { content } = useLanguage();
    
    return (
        <section id="hero" className="pt-40 pb-24 bg-green-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-4 text-center">
                <AnimatedComponent delay={0}>
                    <Trash2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
                        {content.hero.title}
                    </h1>
                </AnimatedComponent>
                
                <AnimatedComponent delay={200}>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                        {content.hero.subtitle}
                    </p>
                </AnimatedComponent>
                
                <div className="flex justify-center gap-4">
                    <AnimatedComponent delay={400}>
                        {/* Primary CTA to open the Typebot Modal (D1) */}
                        <button onClick={openModal} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg font-bold text-lg transition-all">
                            {content.hero.cta}
                        </button>
                    </AnimatedComponent>
                    <AnimatedComponent delay={600}>
                        {/* Secondary CTA to an internal section or a demo video */}
                        <a href="#solution" className="bg-transparent border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 px-8 py-3 rounded-xl font-bold text-lg transition-all">
                            {content.hero.cta2}
                        </a>
                    </AnimatedComponent>
                </div>
            </div>
        </section>
    );
}

// 6. قسم المشكلة (Pain Section - T1)
function PainSection() {
    const { content } = useLanguage();
    
    // ربط أيقونات Lucide
    const IconMap = { PhoneOff, MapPinOff, Clock, Frown };

    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <AnimatedComponent delay={0}>
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        {content.pain.title}
                    </h2>
                </AnimatedComponent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {content.pain.cards.map((card, index) => {
                        const IconComponent = IconMap[card.icon];
                        return (
                            <AnimatedComponent key={index} delay={index * 150 + 100}>
                                <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-xl border-t-4 border-red-500 shadow-md transform hover:scale-[1.02] transition-all duration-300 h-full">
                                    {IconComponent && <IconComponent className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{card.desc}</p>
                                </div>
                            </AnimatedComponent>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// 7. قسم الحل والخطوات (Solution & Steps - N1 / M1)
function SolutionSection() {
    const { content, lang } = useLanguage();
    
    // ربط أيقونات Lucide للحل
    const IconMap = { Bot, Settings, Globe };

    return (
        <section id="solution" className="py-20 bg-green-900 dark:bg-green-950 text-white transition-colors duration-300">
            <div className="container mx-auto px-4">
                <AnimatedComponent delay={0}>
                    <h2 className="text-3xl font-bold text-center mb-16">
                        {content.solution.title}
                    </h2>
                </AnimatedComponent>
                
                {/* Solution Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    {content.solution.cards.map((card, index) => {
                        const IconComponent = IconMap[card.icon];
                        return (
                            <AnimatedComponent key={index} delay={index * 150 + 100}>
                                <div className="p-8 bg-white/10 rounded-xl border border-white/20 shadow-xl transform hover:bg-white/20 transition-all duration-300 h-full">
                                    {IconComponent && <IconComponent className="w-8 h-8 text-yellow-300 mb-4" />}
                                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                    <p className="text-gray-200">{card.desc}</p>
                                </div>
                            </AnimatedComponent>
                        );
                    })}
                </div>
                
                <AnimatedComponent delay={400}>
                    <h3 className="text-3xl font-bold text-center mb-12 border-t border-white/20 pt-10">
                        {content.steps.title}
                    </h3>
                </AnimatedComponent>

                {/* How It Works Steps */}
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
                    {content.steps.steps.map((step, index) => (
                        <AnimatedComponent key={index} delay={index * 200 + 500} className="flex-1 min-w-[200px]">
                            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg h-full relative">
                                <div className="w-10 h-10 bg-yellow-400 text-gray-900 font-bold text-xl rounded-full flex items-center justify-center absolute top-[-20px] left-1/2 transform -translate-x-1/2 border-4 border-green-900">
                                    {step.num}
                                </div>
                                <h4 className="mt-4 text-xl font-bold mb-2">{step.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                            </div>
                            {/* Arrow between steps - uses CSS for RTL arrow direction */}
                            {index < content.steps.steps.length - 1 && (
                                <div className={`hidden md:block absolute top-[50%] ${lang === 'ar' ? 'right-[-10px]' : 'left-[-10px]'} transform -translate-y-1/2`}>
                                    <ArrowRight className={`w-8 h-8 text-yellow-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </div>
                            )}
                        </AnimatedComponent>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 8. القسم النهائي للدعوة للعمل (Final CTA Section - Ry)
function FinalCTASection({ openModal }) {
    const { content } = useLanguage();
    
    return (
        <section id="contact" className="py-20 bg-green-50 dark:bg-gray-950 transition-colors duration-300 text-center">
            <div className="container mx-auto px-4">
                <AnimatedComponent delay={0}>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        {content.finalCTA.title}
                    </h2>
                </AnimatedComponent>
                <AnimatedComponent delay={200}>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        {content.finalCTA.subtitle}
                    </p>
                </AnimatedComponent>
                <AnimatedComponent delay={400}>
                    <button onClick={openModal} className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl shadow-2xl font-bold text-xl transition-all transform hover:scale-[1.05]">
                        {content.finalCTA.cta}
                    </button>
                </AnimatedComponent>
            </div>
        </section>
    );
}

// 9. التذييل (Footer - Yy)
function AppFooter() {
    const { content } = useLanguage();

    return (
        <footer className="bg-gray-900 text-gray-400 pt-10 pb-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm border-t border-gray-800 pt-6">
                    {content.footer.copyright}
                </p>
            </div>
        </footer>
    );
}

// ----------------------------------------------------
// IV. المكون الجذري (Root Component - C1)
// ----------------------------------------------------

function EcoCRMApp() {
    // حالة المودال (Booking Modal - D1)
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // دالة فتح/إغلاق المودال
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // افتراض تهيئة Chatwoot هنا (U1)
    // في مشروع React حقيقي، سيتم وضع هذا في useEffect لتهيئة SDK
    useEffect(() => {
        // محاكاة لتهيئة Chatwoot SDK
        console.log("Chatwoot SDK Initialized based on current language state.");
    }, []); // عند التحميل الأولي

    return (
        <div className="min-h-screen relative bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 antialiased transition-colors duration-300">
            
            {/* 1. شريط التنقل (Navigation Bar) */}
            <NavigationBar />
            
            <main>
                {/* 2. قسم البطل (A1) */}
                <HeroSection openModal={openModal} />
                {/* 3. قسم المشكلة (T1) */}
                <PainSection />
                {/* 4. قسم الحل والخطوات (N1 / M1) */}
                <SolutionSection />
                {/* 5. قسم الدعوة للعمل النهائي (Ry) */}
                <FinalCTASection openModal={openModal} />
            </main>
            
            {/* 6. التذييل (Yy) */}
            <AppFooter />

            {/* 7. مودال الحجز (D1) - يظهر فوق كل شيء */}
            <BookingModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

// ----------------------------------------------------
// V. نقطة الدخول (Entry Point)
// ----------------------------------------------------

// المكون الجذري الذي يغلف التطبيق كله بمزود اللغة (Ah)
function RootAppWrapper() {
    return (
        <LanguageProvider>
            <EcoCRMApp />
        </LanguageProvider>
    );
}

// React Root Rendering
const rootElement = document.getElementById("root");
if (rootElement) {
    // استخدام createRoot هو الطريقة الحديثة (React 18+)
    createRoot(rootElement).render(
        <RootAppWrapper />
    );
}

// --- نهاية الكود ---