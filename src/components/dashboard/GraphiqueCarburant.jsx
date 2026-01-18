import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COULEURS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b'];

export function GraphiqueCarburant({ donnees }) {
  return (
    <div className="card bg-card border-border">
      <div className="pb-2 px-6 pt-6">
        <h3 className="text-base font-semibold text-foreground">Répartition par carburant</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donnees} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="type"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--foreground)', opacity: 0.6, fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value) => [`${value} véhicules`, 'Nombre']}
              />
              <Bar dataKey="nombre" radius={[0, 4, 4, 0]} barSize={24}>
                {donnees.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COULEURS[index % COULEURS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
