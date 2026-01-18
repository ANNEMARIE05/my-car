import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COULEURS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export function GraphiqueStatuts({ donnees }) {
  return (
    <div className="card bg-card border-border">
      <div className="pb-2 px-6 pt-6">
        <h3 className="text-base font-semibold text-foreground">Répartition par statut</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donnees}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="nombre"
                nameKey="statut"
              >
                {donnees.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COULEURS[index % COULEURS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
