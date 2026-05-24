import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquareCode, ShieldCheck, Zap } from 'lucide-react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize({
                clientId: '630823825222-48531ief3a67hj84124sl46str5i0klb.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                grantOfflineAccess: true
            });
        }
    }, []);

    const handleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);
        const success = await login(credentialResponse.credential);
        setIsLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError("Authentication failed. Please verify your credentials and try again.");
        }
    };

    const handleError = () => {
        setError("Google authentication was unsuccessful. Please check your account.");
    };

    const handleNativeGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await GoogleAuth.signIn();
            if (user && user.authentication && user.authentication.idToken) {
                const success = await login(user.authentication.idToken);
                if (success) {
                    navigate('/');
                } else {
                    setError("Authentication failed. Please verify your credentials and try again.");
                }
            } else {
                setError("Google authentication did not return a valid credentials response.");
            }
        } catch (err) {
            console.error("Native Google sign-in error", err);
            const detailMsg = err && typeof err === 'object' ? (err.message || err.error || JSON.stringify(err)) : String(err);
            setError(`Google login error: ${detailMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-6">
            {/* Background glowing gradients */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-indigo-600/25 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>

            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md glass-panel-heavy p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col items-center z-10 transition-all duration-300 hover:border-indigo-500/20">
                {/* Brand Logo */}
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-2xl blur-md"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-400/20">
                        <MessageSquareCode className="w-9 h-9 text-white" />
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-2">
                    AIKYAM Connect
                </h1>
                <p className="text-sm text-slate-400 mb-8 max-w-[280px] text-center">
                    Secure real-time group conversations and high-fidelity video meetings.
                </p>

                {/* Features List */}
                <div className="w-full space-y-4 mb-8 text-left">
                    <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5">
                        <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
                        <span className="text-xs text-slate-300">Instant real-time messaging with WebSockets</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5">
                        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                        <span className="text-xs text-slate-300">Google OAuth Single Sign-on integration</span>
                    </div>
                </div>

                {/* Login Button Area */}
                <div className="relative w-full flex flex-col items-center">
                    {isLoading ? (
                        <div className="flex items-center gap-3 text-slate-300 py-3">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Authenticating profile...</span>
                        </div>
                    ) : (
                        <div className="transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            {Capacitor.isNativePlatform() ? (
                                <button
                                    onClick={handleNativeGoogleLogin}
                                    className="w-[320px] h-[44px] flex items-center justify-center bg-slate-900/60 hover:bg-slate-900/80 text-white font-medium px-4 rounded-full shadow-lg border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:border-white/20"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </button>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                    theme="filled_blue"
                                    size="large"
                                    shape="circle"
                                    text="signin_with"
                                    width="320"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mt-6 w-full p-3.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs text-center font-medium animate-shake">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
