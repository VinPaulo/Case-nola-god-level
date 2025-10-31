import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0', '#0288d1', '#7b1fa2'];

const DynamicChart = ({ data, dimensions, metrics, chartType = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        Nenhum dado disponível
      </div>
    );
  }

  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
      }
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '5px 0', color: entry.color }}>
              {`${entry.name}: ${formatValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Para gráficos de barras e linhas, usar primeira dimensão como X
  const xAxisKey = dimensions[0] || 'name';

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis tickFormatter={formatValue} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {metrics.map((metric, index) => (
            <Bar
              key={metric}
              dataKey={metric}
              fill={COLORS[index % COLORS.length]}
              name={metric.replace('_', ' ').toUpperCase()}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tickFormatter={formatValue} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {metrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={metric.replace('_', ' ').toUpperCase()}
              dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'pie') {
    // Para pizza, usar primeira métrica como valor
    const valueKey = metrics[0] || 'value';
    const nameKey = dimensions[0] || 'name';
    const total = data.reduce((acc, entry) => acc + (entry[valueKey] || 0), 0);

    if (data.length === 0 || total === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          Sem dados para exibir no gráfico de pizza
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
        <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={200}
            innerRadius={0}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return <div>Tipo de gráfico não suportado</div>;
};

export default DynamicChart;
