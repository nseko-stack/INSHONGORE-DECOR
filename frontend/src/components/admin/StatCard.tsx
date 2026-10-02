
interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="border border-white/10 bg-[#111111] p-6 transition hover:border-[#D4AF37]/40">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
        {title}
      </p>

      <p className="mt-4 text-3xl font-medium tracking-tight text-[#D4AF37]">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/35">
        {description}
      </p>
    </div>
  );
}

