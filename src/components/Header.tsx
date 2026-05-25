import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { dark, toggleTheme } = useTheme();
  const { signOut, session } = useAuth();
  const userInitials = session?.user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <header className="h-[54px] bg-card border-b border-border flex items-center shrink-0 z-[60]">
      <button
        onClick={onToggleSidebar}
        className="w-[54px] h-[54px] flex items-center justify-center cursor-pointer border-r border-border shrink-0 hover:bg-surface transition-colors"
      >
        <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px] stroke-muted-foreground">
          <path d="M2 4.5h14M2 9h14M2 13.5h14" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div className="flex items-center gap-2.5 px-[18px] shrink-0">
        <div className="w-[30px] h-[30px] bg-brand rounded-[7px] flex items-center justify-center">
          <svg viewBox="0 0 16 16" fill="none" className="w-[15px] h-[15px]">
            <path d="M2 8l3.5 4L14 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-[13px] font-bold text-foreground leading-tight">
          XDAS Corporate Data Automation
          <span className="block text-[10px] font-normal text-muted-foreground tracking-[0.04em] uppercase mt-px">
            Enterprise Platform
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2.5 px-[18px]">
        <span className="text-[11px] text-muted-foreground">Live · refreshed 1 min ago</span>
        <span className="text-[13px] cursor-pointer" onClick={toggleTheme}>
          {dark ? '🌙' : '☀️'}
        </span>
        <button
          onClick={toggleTheme}
          className={`w-[34px] h-[18px] rounded-[9px] cursor-pointer relative transition-colors border-none shrink-0 ${dark ? 'bg-brand' : 'bg-gray-300'}`}
        >
          <span
            className={`absolute w-[14px] h-[14px] bg-primary-foreground rounded-full top-[2px] transition-[left] ${dark ? 'left-[18px]' : 'left-[2px]'}`}
          />
        </button>
        <button className="h-[30px] px-3.5 rounded-md border-none bg-brand text-primary-foreground text-[12px] font-semibold cursor-pointer hover:bg-brand-dark transition-colors">
          Export
        </button>
        <button
          onClick={signOut}
          className="h-[30px] px-3.5 rounded-md border border-border bg-card text-foreground text-[12px] font-medium cursor-pointer hover:bg-muted transition-colors"
        >
          Sign Out
        </button>
        <div className="w-[30px] h-[30px] rounded-full bg-brand-light flex items-center justify-center text-[11px] font-bold text-brand cursor-pointer">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
