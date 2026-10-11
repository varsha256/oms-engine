'use client';

import { useEffect, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { 
    Activity, ArrowRight, Bot, Box, CheckCircle, ChevronRight, Cpu, 
    CreditCard, GitCommit, LayoutDashboard, Library, 
    LogOut, MessageSquare, Package, Play, Settings, 
    ShieldCheck, TerminalSquare, User, Zap 
} from 'lucide-react';
import { createClient as createSupabaseClient } from '../lib/supabase/client';

type View = 'landing' | 'login' | 'dashboard';
type PublicView = Exclude<View, 'dashboard'>;
export type Navigate = (view: View) => void;
type OrderStatus = 'ORDER_PLACED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED';
type Order = { id: string; item: string; status: OrderStatus; time: string };
type ChatMessage = { role: 'system' | 'user' | 'agent'; content: string; logs?: string[] };
type Stats = { live: number; completed: number; revenue: number };

// Utility for conditional class joining
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Landing Page Component ---
const LandingPage = ({ onNavigate }: { onNavigate: (view: PublicView) => void }) => {
    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-orange-500/30 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-orange-500">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">QWeave</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <button onClick={() => onNavigate('login')} className="text-zinc-400 hover:text-white transition-colors">Sign In</button>
                        <button onClick={() => onNavigate('login')} className="px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-white rounded-md font-semibold transition-all">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 relative">
                {/* Background effects */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute top-40 right-1/4 w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-teal-400 mb-8">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        QWeave Engine v2.0 is Live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                        The AI-first OMS Engine for <br/>
                        <span className="bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">Quick Commerce</span>
                    </h1>
                    <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Instantly translate business logic into production-ready state machines. QWeave autonomously handles order routing, strict state transitions, and real-time execution.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => onNavigate('login')} className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all">
                            Start Building <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all">
                            View Documentation
                        </button>
                    </div>
                </div>
            </main>

            {}
            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 border-t border-zinc-800/50 bg-[#09090b]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">From Prompt to Production</h2>
                        <p className="text-zinc-400">Four steps to a fully automated enterprise order management system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        <div className="hidden md:block absolute top-12 left-10 right-10 h-px bg-zinc-800"></div>
                        
                        {[
                            { icon: MessageSquare, title: '1. NLP Input', desc: 'Describe your flow in plain English.', color: 'text-zinc-300' },
                            { icon: Bot, title: '2. AI Generation', desc: 'LLM builds the JSON state machine.', color: 'text-blue-400' },
                            { icon: ShieldCheck, title: '3. QA Review', desc: 'Automated DAG checks prevent dead ends.', color: 'text-orange-400', glow: true },
                            { icon: Zap, title: '4. Live Execution', desc: 'Deployed to Vercel & Kafka instantly.', color: 'text-teal-400' }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-xl backdrop-blur-sm">
                                <div className={cn("w-16 h-16 rounded-xl bg-zinc-900 border flex items-center justify-center mb-4", step.glow ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : "border-zinc-800")}>
                                    <step.icon className={cn("w-8 h-8", step.color)} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- Login Page Component ---
const LoginPage = () => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        if (new URLSearchParams(window.location.search).has('error')) {
            setErrorMessage('Google sign-in could not be completed. Please try again.');
        }
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setNotice('');

        try {
            const supabase = createSupabaseClient();
            const result = mode === 'signin'
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { company_name: companyName.trim() },
                        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                    },
                });

            if (result.error) {
                setErrorMessage(result.error.message);
                return;
            }

            if (mode === 'signup' && !result.data.session) {
                setNotice('Check your email for a confirmation link, then sign in.');
                return;
            }

            window.location.assign('/dashboard');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setErrorMessage('');
        setNotice('');

        try {
            const supabase = createSupabaseClient();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            if (!data.url) {
                throw new Error('Supabase did not return a Google sign-in URL.');
            }

            window.location.assign(data.url);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to start Google sign-in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <div className="w-10 h-10 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-orange-500">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    {mode === 'signin' ? 'Welcome to QWeave' : 'Create your QWeave account'}
                </h2>
                <p className="text-sm text-zinc-400 text-center mb-8">
                    {mode === 'signin' ? 'Sign in to your OMS workspace' : 'Start building your OMS workspace'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="company-name" className="block text-xs font-medium text-zinc-400 mb-1.5">Company Name</label>
                            <input id="company-name" type="text" autoComplete="organization" value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={160} placeholder="Your business" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Work Email</label>
                        <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                        <input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" required />
                    </div>
                    {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
                    {notice && <p role="status" className="text-sm text-teal-400">{notice}</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full bg-zinc-100 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed text-zinc-900 font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">
                        {isSubmitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <div className="h-px bg-zinc-800 flex-1"></div>
                    <span className="px-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Or</span>
                    <div className="h-px bg-zinc-800 flex-1"></div>
                </div>

                <button type="button" disabled={isSubmitting} onClick={handleGoogleSignIn} className="mt-6 w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
                <p className="mt-6 text-center text-sm text-zinc-400">
                    {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin');
                            setErrorMessage('');
                            setNotice('');
                        }}
                        className="font-medium text-orange-400 hover:text-orange-300"
                    >
                        {mode === 'signin' ? 'Create one' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- Dashboard Page Component ---
export const DashboardPage = ({
    onNavigate,
    onSignOut,
    userEmail,
    tenantName,
}: {
    onNavigate: Navigate;
    onSignOut: () => void;
    userEmail: string;
    tenantName: string;
}) => {
    // Dynamic State Simulation
    const [stats, setStats] = useState<Stats>({ live: 142, completed: 890, revenue: 45200 });
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'system', content: 'System initialization complete. Awaiting merchant prompt...' }
    ]);
    const [chatInput, setChatInput] = useState('');
    
    // Live Orders State
    const [orders, setOrders] = useState<Order[]>([
        { id: 'ORD-1042', item: '2x Steam Momos', status: 'READY_FOR_PICKUP', time: 'Just now' },
        { id: 'ORD-1041', item: '1x Veg Fried Rice', status: 'PREPARING', time: '2m ago' },
        { id: 'ORD-1040', item: 'Chicken Chilli', status: 'ORDER_PLACED', time: '5m ago' },
        { id: 'ORD-1038', item: '3x Spring Rolls', status: 'PREPARING', time: '8m ago' },
    ]);

    // Live Activity Simulation Hook
    useEffect(() => {
        const interval = setInterval(() => {
            // Update Stats
            setStats(prev => ({
                live: prev.live + Math.floor(Math.random() * 2), // Slowly creeps up
                completed: prev.completed + Math.floor(Math.random() * 3),
                revenue: prev.revenue + (Math.floor(Math.random() * 5) * 120)
            }));

            // Process Order State Transitions
            setOrders(prevOrders => {
                let updatedOrders = prevOrders.map((order): Order => {
                    // Random chance to transition
                    if (Math.random() > 0.6) { 
                        if (order.status === 'ORDER_PLACED') return { ...order, status: 'PREPARING', time: 'Just now' };
                        if (order.status === 'PREPARING') return { ...order, status: 'READY_FOR_PICKUP', time: 'Just now' };
                        if (order.status === 'READY_FOR_PICKUP') return { ...order, status: 'COMPLETED', time: 'Just now' };
                    }
                    return order;
                });

                // Filter out completed orders to keep UI clean, but maybe keep 1 for effect
                updatedOrders = updatedOrders.filter(o => o.status !== 'COMPLETED');

                // Inject a new order randomly
                if (Math.random() > 0.7 && updatedOrders.length < 7) {
                    const idNum = Math.floor(1000 + Math.random() * 9000);
                    const items = ['1x Paneer Momo', '2x Coke', 'Hakka Noodles', 'Chicken Wings'];
                    updatedOrders.unshift({
                        id: `ORD-${idNum}`,
                        item: items[Math.floor(Math.random() * items.length)],
                        status: 'ORDER_PLACED',
                        time: 'Just now'
                    });
                }
                return updatedOrders;
            });
        }, 3000); // Ticks every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleChatSubmit = (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        
        setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
        setChatInput('');
        
        // Mock AI response
        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                role: 'agent', 
                content: 'Parsing domain logic for QuickCommerce. Validating DAG transitions...',
                logs: [
                    'Extracting nodes: [PLACED, PREP...]',
                    'QA Module: Dead-end prevention passed.',
                    'JSON schema generated successfully.'
                ]
            }]);
        }, 1500);
    };

    // Helper for Status UI
    const getStatusUI = (status: OrderStatus) => {
        switch(status) {
            case 'ORDER_PLACED': return { label: 'Placed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' };
            case 'PREPARING': return { label: 'Preparing', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', dot: 'bg-orange-400 animate-pulse' };
            case 'READY_FOR_PICKUP': return { label: 'Ready', color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', dot: 'bg-teal-400' };
            default: return { label: status, color: 'text-zinc-400 bg-zinc-800 border-zinc-700', dot: 'bg-zinc-500' };
        }
    };

    return (
        <div className="h-screen w-screen bg-[#09090b] text-zinc-300 flex overflow-hidden font-sans">
            
            {/* Slim Sidebar */}
            <aside className="w-16 flex-shrink-0 bg-[#09090b] border-r border-zinc-800/80 flex flex-col items-center py-4 justify-between z-20">
                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-orange-500 mb-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                        <Activity className="w-5 h-5" />
                    </div>
                    <nav className="flex flex-col gap-3 w-full px-2">
                        <button className="w-full aspect-square flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                        </button>
                        <button className="w-full aspect-square flex items-center justify-center rounded-lg text-orange-500 bg-orange-500/10 border border-orange-500/20 relative">
                            <TerminalSquare className="w-5 h-5" />
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-orange-500 rounded-r-full"></span>
                        </button>
                        <button className="w-full aspect-square flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors relative">
                            <Package className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                        </button>
                    </nav>
                </div>
                <div className="flex flex-col items-center gap-4 w-full px-2">
                    <button className="w-full aspect-square flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button type="button" title={`Sign out ${userEmail}`} aria-label="Sign out" className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-teal-500 p-[1px] cursor-pointer" onClick={onSignOut}>
                        <span className="w-full h-full rounded-full bg-zinc-900 border-2 border-[#09090b] flex items-center justify-center text-xs text-white">
                            <LogOut className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Split View */}
            <main className="flex-1 flex overflow-hidden">
                
                {/* Left Panel: QWeave AI Architect */}
                <section className="w-[45%] lg:w-[400px] xl:w-[450px] flex-shrink-0 border-r border-zinc-800/80 flex flex-col bg-[#0c0c0e]">
                    <header className="h-14 border-b border-zinc-800/80 flex items-center px-4 justify-between bg-[#09090b]">
                        <div className="flex items-center gap-2 text-zinc-200">
                            <Cpu className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-sm">QWeave Architect</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono">Workspace: {tenantName}</span>
                        </div>
                    </header>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-0 flex flex-col custom-scroll">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={cn("px-4 py-4 border-b border-zinc-800/50", msg.role === 'system' ? "bg-transparent" : msg.role === 'agent' ? "bg-orange-500/5" : "")}>
                                {msg.role === 'system' && (
                                    <p className="text-xs font-mono text-zinc-500">{msg.content}</p>
                                )}
                                {msg.role === 'user' && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                            <User className="w-3.5 h-3.5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-zinc-300 mb-1">Merchant</div>
                                            <p className="text-sm text-zinc-300 leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                                {msg.role === 'agent' && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded bg-orange-500/20 border border-orange-500/50 flex items-center justify-center flex-shrink-0">
                                            <Cpu className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        <div className="w-full">
                                            <div className="text-xs font-medium text-orange-400 mb-1">Engine Output</div>
                                            <p className="text-sm text-zinc-300 leading-relaxed mb-3">{msg.content}</p>
                                            {msg.logs && (
                                                <div className="bg-black/50 rounded border border-zinc-800/80 p-3 font-mono text-[10px] text-zinc-400 space-y-1.5">
                                                    {msg.logs.map((log, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            {log.includes('QA') ? <CheckCircle className="w-3 h-3 text-teal-400"/> : <ChevronRight className="w-3 h-3 text-orange-500"/>}
                                                            <span className={log.includes('QA') ? 'text-teal-400/90' : ''}>{log}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-[#09090b] border-t border-zinc-800/80">
                        <form onSubmit={handleChatSubmit} className="relative bg-zinc-900 border border-zinc-700/80 rounded-lg flex flex-col focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
                            <textarea 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                rows={2}
                                className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none" 
                                placeholder="Describe your state machine or edits..."
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e); } }}
                            />
                            <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-zinc-800/50">
                                <button type="button" className="text-xs font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5">
                                    <Library className="w-3.5 h-3.5" /> Domain Presets
                                </button>
                                <button type="submit" className="flex items-center justify-center px-3 py-1 bg-zinc-200 text-zinc-900 font-medium text-xs rounded hover:bg-white transition-colors gap-1.5 disabled:opacity-50">
                                    Execute <Play className="w-3 h-3" />
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Right Panel: Live Activity Dashboard */}
                <section className="flex-1 bg-[#09090b] flex flex-col relative overflow-hidden">
                    {/* Top Header */}
                    <header className="h-14 border-b border-zinc-800/80 flex items-center px-6 justify-between bg-[#09090b]/80 backdrop-blur-md z-10">
                        <h2 className="text-sm font-semibold text-white">Live Production Environment</h2>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-1 rounded border border-teal-400/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> Streaming Events
                            </span>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {}
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-xl rounded-full translate-x-8 -translate-y-8"></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-orange-500/20 rounded text-orange-400"><Activity className="w-4 h-4" /></div>
                                    <span className="text-xs font-medium text-zinc-400">Live Active Orders</span>
                                </div>
                                <div className="text-3xl font-bold text-white tracking-tight">{stats.live}</div>
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-blue-500/20 rounded text-blue-400"><CheckCircle className="w-4 h-4" /></div>
                                    <span className="text-xs font-medium text-zinc-400">Completed Today</span>
                                </div>
                                <div className="text-3xl font-bold text-white tracking-tight">{stats.completed}</div>
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 blur-xl rounded-full translate-x-8 -translate-y-8"></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-teal-500/20 rounded text-teal-400"><CreditCard className="w-4 h-4" /></div>
                                    <span className="text-xs font-medium text-zinc-400">Revenue Volume</span>
                                </div>
                                <div className="text-3xl font-bold text-white tracking-tight">₹{stats.revenue.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Live Orders List */}
                        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl flex flex-col h-[400px]">
                            <div className="px-5 py-3 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900/50">
                                <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                                    <GitCommit className="w-4 h-4 text-orange-500" /> State Machine Execution Queue
                                </h3>
                                <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">View All</button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
                                {orders.map((order) => {
                                    const ui = getStatusUI(order.status);
                                    return (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800/50 rounded-lg hover:border-zinc-700 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">{order.id}</span>
                                                    <span className="text-sm font-medium text-zinc-200">{order.item}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <span className="text-xs text-zinc-500">{order.time}</span>
                                                
                                                {/* Dynamic State Badge */}
                                                <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium min-w-[120px] justify-center", ui.color)}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full", ui.dot)}></span>
                                                    {ui.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                                        <Box className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-sm">No active orders in queue.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
};

// --- Main App Wrapper ---
export default function App({ initialView = 'landing' }: { initialView?: PublicView }) {
    const [currentView, setCurrentView] = useState<PublicView>(initialView);

    return (
        <div className="w-full h-full bg-[#09090b]">
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
            `}} />
            
            {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
            {currentView === 'login' && <LoginPage />}
        </div>
    );
}