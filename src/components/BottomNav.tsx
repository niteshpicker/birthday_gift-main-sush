import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageConfig } from '../data/mockData';

interface BottomNavProps {
  pages: PageConfig[];
  currentPage: number; // 1-based index into pages
  onPrev: () => void;
  onNext: () => void;
  onSelectPage: (pageIndex: number) => void;
}

export function BottomNav({
  pages,
  currentPage,
  onPrev,
  onNext,
  onSelectPage,
}: BottomNavProps) {
  const totalContentPages = pages.length;
  const activeConfig = pages[currentPage - 1];
  const isLastPage = currentPage >= totalContentPages;

  return (
    <nav
      aria-label="Birthday pages navigation"
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-40 flex h-[62px] items-center justify-between rounded-full bg-white/95 px-2.5 shadow-[0_10px_30px_rgba(45,25,43,0.12)] backdrop-blur-md"
    >
      {/* Left previous button */}
      <button
        type="button"
        onClick={onPrev}
        aria-label={currentPage === 1 ? 'Back to cover' : 'Previous page'}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3EEF0] text-[#2D192B] transition-all hover:bg-[#EAE1E5] active:scale-95"
      >
        <ChevronLeft className="h-5 w-5 stroke-[2.2]" />
      </button>

      {/* Center section title + dynamic pagination dots */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-2">
        <span className="truncate text-[12px] font-bold tracking-tight text-[#2D192B]">
          {activeConfig?.title ?? ''}
        </span>
        <div className="mt-1.5 flex items-center gap-1.5" role="tablist" aria-label="Page indicators">
          {pages.map((page, idx) => {
            const pageNumber = idx + 1;
            const isActive = pageNumber === currentPage;
            const isVisited = pageNumber < currentPage;

            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${page.title}`}
                onClick={() => onSelectPage(pageNumber)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-5 bg-[#E12D53]'
                    : isVisited
                    ? 'w-2 bg-[#F296AA] hover:bg-[#EA758F]'
                    : 'w-2 border border-[#CABAC2] bg-transparent hover:border-[#9E8793]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Right page counter + next button */}
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="text-[12px] font-semibold tabular-nums text-[#6E5A64]">
          {currentPage}/{totalContentPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          aria-label="Next page"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            isLastPage
              ? 'cursor-default bg-[#F0B4C2] text-white/90 shadow-none'
              : 'bg-[#E12D53] text-white shadow-[0_4px_12px_rgba(225,45,83,0.35)] hover:bg-[#CA2347] active:scale-95'
          }`}
        >
          <ChevronRight className="h-5 w-5 stroke-[2.3]" />
        </button>
      </div>
    </nav>
  );
}
