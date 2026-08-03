"use client";

import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

// Inline LinkedIn icon since Lucide removed brand icons in v1
function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Press", href: "/press" },
        ],
        properties: [
            { label: "Buy", href: "/buy" },
            { label: "Rent", href: "/rent" },
            { label: "Sell", href: "/sell" },
            { label: "New Developments", href: "/new-developments" },
        ],
        support: [
            { label: "Help Center", href: "/help" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Sitemap", href: "/sitemap" },
        ],
    };

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                    {/* Brand & Contact Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Estate<span className="text-blue-400">Hub</span><span className="text-white">.lk</span>
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                            Your trusted partner in finding the perfect property in Sri Lanka.
                            We connect buyers, sellers, and renters with their dream spaces.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                Contact
                            </h3>

                            <a
                                href="mailto:pck.thilakarathna@gmail.com"
                                className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <Mail className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="group-hover:underline underline-offset-2">
                                    pck.thilakarathna@gmail.com
                                </span>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/chalaka-kalanahansa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <LinkedInIcon className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="group-hover:underline underline-offset-2 flex items-center gap-1">
                                    Chalaka Kalanahansa
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                            </a>

                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                </div>
                                <span>Ratnapura, Sri Lanka</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Properties
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.properties.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-slate-400">
                            Get the latest property listings and market insights delivered to your inbox.
                        </p>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            &copy; {currentYear} EstateHub.lk. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookies" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}