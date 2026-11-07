export default function Logo({
  size = 'md',
  className = '',
  showWordmark = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showWordmark?: boolean;
}) {
  const dims =
    size === 'xl'
      ? 'w-24 h-24'
      : size === 'lg'
      ? 'w-16 h-16 sm:w-20 sm:h-20'
      : size === 'md'
      ? 'w-12 h-12 sm:w-14 sm:h-14'
      : 'w-8 h-8 sm:w-9 sm:h-9';

  const textSize =
    size === 'xl'
      ? 'text-3xl'
      : size === 'lg'
      ? 'text-2xl'
      : size === 'md'
      ? 'text-xl'
      : 'text-base';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Orange Solid Brand Square */}
      <div
        id="orange-brand-square"
        className={`${dims} bg-[#ff7900] flex items-center justify-center shrink-0 shadow-sm transition-transform`}
        style={{ borderRadius: size === 'sm' ? '4px' : '6px' }}
      >
        <span className="text-white font-black tracking-tighter text-xs sm:text-sm lowercase font-sans select-none">
          orange
        </span>
      </div>

      {showWordmark && (
        <span className={`font-black tracking-tight ${textSize}`}>
          <span className="text-[#ff7900]">Orange</span>{' '}
          <span className="text-black">Loans</span>
        </span>
      )}
    </div>
  );
}
