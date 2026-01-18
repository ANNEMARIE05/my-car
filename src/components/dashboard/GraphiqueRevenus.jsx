import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function GraphiqueRevenus({ donnees }) {
  return (
    <div className="card bg-card border-border">
      <div className="pb-2 px-6 pt-6">
        <h3 className="text-base font-semibold text-foreground">Évolution des revenus</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donnees} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="mois"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--foreground)', opacity: 0.6, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--foreground)', opacity: 0.6, fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toLocaleString('fr-FR')}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Revenus']}
              />
              <Area
                type="monotone"
                dataKey="revenus"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenus)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
