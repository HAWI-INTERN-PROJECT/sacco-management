import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/auth'
import { Shield, Eye, EyeOff, Mail, Lock, ShieldCheck, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import dashboardMockup from '../assets/finance-animation.json' // Not actually an image, but we can reuse the Lottie or CSS decoration
import LottieModule from 'lottie-react'
const Lottie = (LottieModule as any).default || LottieModule

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const loginSchema = z.object({
    login: z.string().min(1, t('auth.emailRequired')),
    password: z.string().min(1, t('auth.passwordRequired')),
  })

  type LoginForm = z.infer<typeof loginSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-[#0B6B3A] relative overflow-hidden flex-col px-12 xl:px-20 py-12 sticky top-0 h-screen justify-between">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
         
         <div className="relative z-10 text-white flex-1 flex flex-col justify-center max-w-xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-3 mb-12">
               <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                 <Shield className="w-6 h-6 text-emerald-400" />
               </div>
               <h2 className="text-2xl font-bold tracking-tight">SACCO Manager</h2>
            </Link>

            <div className="mb-10">
              <h3 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight tracking-tight">
                Empowering Modern<br/>Financial Cooperatives
              </h3>
              <p className="text-green-100/80 text-lg leading-relaxed">
                The unified platform for Ethiopian SACCOs to manage members, loans, and dividends securely and efficiently.
              </p>
            </div>

            {/* Mockup Area */}
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 mb-10 overflow-hidden relative shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-[#0B6B3A]/40 backdrop-blur-[2px] z-10"></div>
              <Lottie animationData={dashboardMockup} loop={true} className="w-[120%] h-[120%] absolute opacity-60 mix-blend-screen" />
              {/* Inner floating elements mimicking the dashboard screenshot */}
              <div className="relative z-20 bg-white rounded-xl shadow-2xl w-3/4 aspect-[16/10] overflow-hidden border border-white/20 flex flex-col">
                 <div className="h-3 bg-slate-100 flex items-center px-2 gap-1 border-b border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                 </div>
                 <div className="flex-1 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-[#0B6B3A] mx-auto mb-2" />
                      <div className="h-2 w-24 bg-slate-200 rounded-full mx-auto mb-1"></div>
                      <div className="h-1.5 w-16 bg-slate-200 rounded-full mx-auto"></div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                 <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                 <span className="font-medium text-green-50 text-sm">Secure multi-tenant platform</span>
               </div>
               <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                 <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                 <span className="font-medium text-green-50 text-sm">Real-time tracking & analytics</span>
               </div>
               <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                 <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                 <span className="font-medium text-green-50 text-sm">Automated dividends management</span>
               </div>
            </div>
         </div>

         <div className="relative z-10 mt-8 text-green-200/50 text-xs font-medium tracking-wider">
           © 2026 SACCO MANAGER SYSTEM
         </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-[#0B6B3A] p-6 text-white flex items-center gap-3 shadow-md relative z-10">
        <Shield className="w-6 h-6 text-emerald-400" />
        <span className="font-bold text-xl">SACCO Manager</span>
      </div>

      {/* RIGHT PANEL (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-20 bg-white min-h-screen">
         <div className="w-full max-w-[400px]">
            
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-[#1E293B] mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 text-sm leading-relaxed">Sign in to your SACCO account to continue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address or Member ID</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="name@sacco.org"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.login ? 'border-red-500' : 'border-slate-200'} focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors bg-white`}
                    {...register('login')}
                  />
                </div>
                {errors.login && (
                  <p className="text-sm text-red-500 mt-1">{errors.login.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${errors.password ? 'border-red-500' : 'border-slate-200'} focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors bg-white`}
                    {...register('password')}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                 <label className="flex items-center gap-2.5 cursor-pointer group">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0B6B3A] focus:ring-[#0B6B3A] focus:ring-offset-0 transition-all cursor-pointer" />
                   <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                 </label>
                 <Link to="#" className="text-sm font-semibold text-[#0B6B3A] hover:text-[#065F46] transition-colors">
                   Forgot Password?
                 </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#0B6B3A] hover:bg-[#08522c] text-white rounded-full font-bold shadow-md shadow-[#0B6B3A]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? t('common.loading') : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <p className="text-slate-500 text-sm font-medium">
                  Don't have a SACCO?{' '}
                  <Link to="/register" className="font-bold text-[#0B6B3A] hover:text-[#08522c] transition-colors">
                    Register here
                  </Link>
                </p>
              </div>

            </form>

         </div>
      </div>

    </div>
  )
}
