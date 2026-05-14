type Props = {
  label: string;
};

export default function SectionStrip({ label }: Props) {
  return (
    <div className="bg-bg-1 border-y border-divider">
      <div className="max-w-content mx-auto px-8 sm:px-12 py-6 flex items-center gap-[0.875rem]">
        <span className="flex-1 h-px bg-divider" />
        <span className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-fg-2">
          {label}
        </span>
        <span className="flex-1 h-px bg-divider" />
      </div>
    </div>
  );
}
