import type { Config } from 'tailwindcss';

import tailwindAnimate from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}'
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            textColor: {
                foreground: 'var(--foreground)',
                'primary-foreground': 'var(--primary-foreground)',
                'secondary-foreground': 'var(--secondary-foreground)',
                'muted-foreground': 'var(--muted-foreground)',
                'accent-foreground': 'var(--accent-foreground)',
                'destructive-foreground': 'var(--destructive-foreground)',
                'popover-foreground': 'var(--popover-foreground)',
                'card-foreground': 'var(--card-foreground)'
            },
            backgroundColor: {
                background: 'var(--background)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                muted: 'var(--muted)',
                accent: 'var(--accent)',
                destructive: 'var(--destructive)',
                popover: 'var(--popover)',
                card: 'var(--card)'
            },
            borderColor: {
                DEFAULT: 'var(--border)',
                input: 'var(--input)'
            },
            ringColor: {
                DEFAULT: 'var(--ring)'
            },
            colors: {
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)'
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)'
                },
                destructive: {
                    DEFAULT: 'var(--destructive)',
                    foreground: 'var(--destructive-foreground)'
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)'
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)'
                },
                popover: {
                    DEFAULT: 'var(--popover)',
                    foreground: 'var(--popover-foreground)'
                },
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)'
                },
                sidebar: {
                    DEFAULT: 'var(--sidebar-background)',
                    foreground: 'var(--sidebar-foreground)',
                    primary: 'var(--sidebar-primary)',
                    'primary-foreground': 'var(--sidebar-primary-foreground)',
                    accent: 'var(--sidebar-accent)',
                    'accent-foreground': 'var(--sidebar-accent-foreground)',
                    border: 'var(--sidebar-border)',
                    ring: 'var(--sidebar-ring)'
                },
                chart: {
                    1: 'var(--chart-1)',
                    2: 'var(--chart-2)',
                    3: 'var(--chart-3)',
                    4: 'var(--chart-4)',
                    5: 'var(--chart-5)'
                },
                amber: {
                    500: '#f59e0b'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [tailwindAnimate]
} satisfies Config;
