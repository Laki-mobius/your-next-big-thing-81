import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  activeItem: string;
  onItemClick: (item: string) => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: { value: string | number; variant: 'amber' | 'brand' };
  collapsed: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, active, badge, collapsed, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 py-2 px-3 rounded-md cursor-pointer transition-all relative mb-0.5 whitespace-nowrap overflow-hidden',
        active ? 'bg-brand-light' : 'hover:bg-surface'
      )}
    >
      <div className={cn('w-5 h-5 flex items-center justify-center shrink-0', active ? 'text-brand' : 'text-muted-foreground')}>
        {icon}
      </div>
      <span className={cn(
        'text-[13px] font-medium whitespace-nowrap transition-opacity',
        active ? 'text-brand font-semibold' : 'text-muted-foreground',
        collapsed && 'opacity-0 pointer-events-none'
      )}>
        {label}
      </span>
      {badge && !collapsed && (
        <span className={cn(
          'text-[10px] px-1.5 rounded-[10px] font-bold ml-auto shrink-0 text-primary-foreground',
          badge.variant === 'amber' ? 'bg-status-amber' : 'bg-brand'
        )}>
          {badge.value}
        </span>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, activeItem, onItemClick }: SidebarProps) {
  const [hitlFlyoutOpen, setHitlFlyoutOpen] = useState(false);

  const isHitlActive = activeItem === 'hitl' || activeItem === 'hitl-attribute';

  return (
    <nav
      className={cn(
        'bg-card border-r border-border flex flex-col shrink-0 transition-[width] duration-[220ms] overflow-visible',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
    >
      <div className="p-2 pb-1.5 border-b border-border">
        <div className={cn('text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em] px-2.5 pb-[7px] whitespace-nowrap transition-opacity', collapsed && 'opacity-0 h-0 p-0')}>
          Main
        </div>
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="9" width="3" height="5" rx="1" fill="currentColor" /><rect x="6.5" y="6" width="3" height="8" rx="1" fill="currentColor" opacity=".7" /><rect x="11" y="3" width="3" height="11" rx="1" fill="currentColor" opacity=".5" /></svg>}
          label="Metrics Dashboard"
          active={activeItem === 'metrics'}
          collapsed={collapsed}
          onClick={() => onItemClick('metrics')}
        />
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 5v3.2l2.2 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          label="Job Configuration"
          badge={{ value: 3, variant: 'amber' }}
          active={activeItem === 'jobs'}
          collapsed={collapsed}
          onClick={() => onItemClick('jobs')}
        />

        {/* HITL Review with flyout submenu when collapsed */}
        <div
          className="relative"
          onMouseEnter={() => collapsed && setHitlFlyoutOpen(true)}
        >
          <SidebarItem
            icon={<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.4" /><path d="M3.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
            label="HITL review"
            badge={{ value: 12, variant: 'brand' }}
            collapsed={collapsed}
            active={isHitlActive}
            onClick={() => {
              if (collapsed) {
                setHitlFlyoutOpen(!hitlFlyoutOpen);
              } else {
                onItemClick('hitl-attribute');
              }
            }}
          />

          {/* Flyout popout for collapsed state */}
          {collapsed && hitlFlyoutOpen && (
            <div className="absolute left-[56px] top-0 z-[200] ml-0">
              <div className="bg-card border border-border rounded-md shadow-lg py-1.5 px-1 min-w-[180px]">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em] px-2.5 pb-1 pt-1">
                  HITL Review
                </div>
                <div
                  onClick={() => { onItemClick('hitl-attribute'); setHitlFlyoutOpen(false); }}
                  className={cn(
                    'text-[12px] py-1.5 px-2.5 rounded cursor-pointer transition-colors',
                    activeItem === 'hitl-attribute' ? 'text-brand font-semibold bg-brand-light' : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  )}
                >
                  Attribute Category Wise
                </div>
                <div
                  onClick={() => { onItemClick('hitl'); setHitlFlyoutOpen(false); }}
                  className={cn(
                    'text-[12px] py-1.5 px-2.5 rounded cursor-pointer transition-colors',
                    activeItem === 'hitl' ? 'text-brand font-semibold bg-brand-light' : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  )}
                >
                  Record Wise
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expanded sub-menu */}
        {!collapsed && isHitlActive && (
          <div className="ml-7 flex flex-col">
            <div
              onClick={() => onItemClick('hitl-attribute')}
              className={cn(
                'text-[12px] py-1.5 px-2.5 rounded cursor-pointer transition-colors',
                activeItem === 'hitl-attribute' ? 'text-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Attribute Category Wise
            </div>
            <div
              onClick={() => onItemClick('hitl')}
              className={cn(
                'text-[12px] py-1.5 px-2.5 rounded cursor-pointer transition-colors',
                activeItem === 'hitl' ? 'text-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Record Wise
            </div>
          </div>
        )}

        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="9" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" /></svg>}
          label="Solution Library"
          active={activeItem === 'assets'}
          collapsed={collapsed}
          onClick={() => onItemClick('assets')}
        />
      </div>
      <div className="p-2 pb-1.5 border-b border-border">
        <div className={cn('text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em] px-2.5 pb-[7px] whitespace-nowrap transition-opacity', collapsed && 'opacity-0 h-0 p-0')}>
          Analytics
        </div>
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><path d="M2 12L6 7l3 3 2-2.5L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Reports"
          collapsed={collapsed}
          onClick={() => onItemClick('reports')}
        />
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 8h6M5 5.5h3M5 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          label="Audit logs"
          collapsed={collapsed}
          onClick={() => onItemClick('audit')}
        />
      </div>
      <div className="p-2 pb-1.5 border-b border-border">
        <div className={cn('text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em] px-2.5 pb-[7px] whitespace-nowrap transition-opacity', collapsed && 'opacity-0 h-0 p-0')}>
          System
        </div>
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          label="Settings"
          collapsed={collapsed}
          onClick={() => onItemClick('settings')}
        />
      </div>
      <div className="p-3 border-t border-border mt-auto">
        <SidebarItem
          icon={<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          label="Laki"
          collapsed={collapsed}
          onClick={() => onItemClick('profile')}
        />
      </div>
    </nav>
  );
}
